import { stripHtml } from './utils.js';
import { createQuestionHtml } from './templates.js';
import { setupEditable, setupRemoveButtons, setupOptionsHandlers } from './interactions.js';

// XML-Datei einlesen und Frage einfpügen
function handleXmlFile(file) {
    if (!file.name.toLowerCase().endsWith('.xml')) {
        swal('Nur XML-Dateien sind erlaubt!', "Bitte füge eine XML Datei ein" ,"error");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (evt) {
        const xmlContent = evt.target.result;

        // XML-Parser erstellen
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
        const questions = xmlDoc.getElementsByTagName('question');
        const container = document.querySelector('.demo-questions');
        container.innerHTML = ''; // Alte Fragen löschen

        // Fragen aus XML extrahieren und ins DOM einfügen
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const qid = 'q' + (i + 1);
            const rawQText = q.querySelector('questiontext > text')?.textContent || 'Neue Frage';
            const qText = stripHtml(rawQText); //HTML-Tags in der Frage sind so nicht mehr sichtbar.


            // Antworten auslesen 
            const options = q.getElementsByTagName('answer');

            const optionTexts = [];
            const optionFractions = [];
            for (let j = 0; j < options.length; j++) {
                const ans = options[j];
                optionTexts.push(ans.querySelector('text')?.textContent || `Antwort ${j + 1}`);
                const fracRaw = ans.getAttribute('fraction'); // z.B. "100", "50", "-33.33333"
                optionFractions.push(fracRaw ?? "0");
            }
            // Frage erzeugen (richtig)
            const markup = createQuestionHtml(qid, optionTexts.length, optionTexts);
            const wrapper = document.createElement('div');
            wrapper.innerHTML = markup;
            const questionEl = wrapper.firstElementChild;
            container.appendChild(questionEl);

            // Setup (wie bei neuen Fragen)
            setupOptionsHandlers(questionEl);
            setTimeout(() => { setupEditable(); setupRemoveButtons(); }, 0);

            // Fragetext aus XML einsetzen
            const textEl = questionEl.querySelector(`#${qid}-text`);
            if (textEl) textEl.textContent = qText;

            // Fraction-Werte (Bewertung der Antworten) einsetzen
            const optionLis = questionEl.querySelectorAll('ul.options-list > li');
            optionLis.forEach((li, idx) => {
                const sel = li.querySelector('select.option-percent');
                if (!sel) return;
                const raw = optionFractions[idx] ?? "0";
                const exact = Array.from(sel.options).find(o => o.value === raw);
                if (exact) sel.value = exact.value;
                else {
                    // nächstliegender Wert falls Rundung
                    let best = sel.options[0].value, bestDiff = Infinity, target = parseFloat(raw);
                    for (let o of sel.options) {
                        const diff = Math.abs(parseFloat(o.value) - target);
                        if (diff < bestDiff) { bestDiff = diff; best = o.value; }
                    }
                    sel.value = best;
                }
            });
        }
    };

    reader.readAsText(file);
    swal("Der Import war erfolgreich!","Du kannst dein Frage nun bearbeiten","success")
}

// Drag & Drop und Datei-Upload für XML-Dateien (Import)
export function initImport() {
    const dropzone = document.getElementById('xml-dropzone');
    const fileInput = document.getElementById('xml-file-input');
    
    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', e => {
            e.preventDefault();
            dropzone.style.borderColor = '#1a7ad1';
            dropzone.style.background = '#e3eefd';
        });
        dropzone.addEventListener('dragleave', e => {
            dropzone.style.borderColor = '';
            dropzone.style.background = '';
        });
        dropzone.addEventListener('drop', e => {
            e.preventDefault();
            dropzone.style.borderColor = '';
            dropzone.style.background = '';
            if (!e.dataTransfer.files.length) return;
            handleXmlFile(e.dataTransfer.files[0]);
        });
        fileInput.addEventListener('change', e => {
            if (fileInput.files.length) handleXmlFile(fileInput.files[0]);
        });
    }
}