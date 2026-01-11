import { stripHtml } from './utils.js';
import { createQuestionHtml } from './templates.js';
import { setupEditable, setupRemoveButtons, setupOptionsHandlers } from './interactions.js';

function syncSelectAttribute(selectElement) {
    if (!selectElement) return;
    Array.from(selectElement.options).forEach(opt => {
        if (opt.value === selectElement.value) {
            opt.setAttribute('selected', 'selected');
        } else {
            opt.removeAttribute('selected');
        }
    });
}

function handleXmlFile(file) {
    if (!file.name.toLowerCase().endsWith('.xml')) {
        swal('Nur XML-Dateien sind erlaubt!', "Bitte füge eine XML Datei ein" ,"error");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (evt) {
        const xmlContent = evt.target.result;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
        const questions = xmlDoc.getElementsByTagName('question');
        const container = document.querySelector('.demo-questions');
        container.innerHTML = ''; 

        // Kategoriefeld und Speicher zu Beginn des Imports leeren
        const catInput = document.getElementById('category-input');
        if (catInput) {
            catInput.value = '';
            localStorage.removeItem('autoSavedCategory');
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            
            // Falls der Block eine Kategorie definiert, wird der Name extrahiert
            if (q.getAttribute('type') === 'category') {
                const catText = q.querySelector('category > text')?.textContent || '';
                // Entfernt den Moodle-Standardpfad, um nur den reinen Namen anzuzeigen
                const cleanCat = catText.replace(/^\$course\$\/top\//, '');
                
                // Den gefundenen Namen im Feld und im LocalStorage speichern
                if (catInput) {
                    catInput.value = cleanCat;
                    localStorage.setItem('autoSavedCategory', cleanCat);
                }
                continue;
            }

            const qid = 'q' + (i + 1);
            const rawQText = q.querySelector('questiontext > text')?.textContent || 'Neue Frage';
            const qText = stripHtml(rawQText); 

            const rawGrade = q.querySelector('defaultgrade')?.textContent || '1'; 
            const defaultGrade = Math.round(parseFloat(rawGrade));

            const options = q.getElementsByTagName('answer');
            const optionTexts = [];
            const optionFractions = [];

            for (let j = 0; j < options.length; j++) {
                const ans = options[j];
                optionTexts.push(ans.querySelector('text')?.textContent || `Antwort ${j + 1}`);
                const fracRaw = ans.getAttribute('fraction'); 
                optionFractions.push(fracRaw ?? "0");
            }
            
            const markup = createQuestionHtml(qid, optionTexts.length, optionTexts);
            const wrapper = document.createElement('div');
            wrapper.innerHTML = markup;
            const questionEl = wrapper.firstElementChild;
            container.appendChild(questionEl);

            const gradeSelect = questionEl.querySelector('.option-pointing');
            if (gradeSelect) {
                if (defaultGrade >= 1 && defaultGrade <= 10) {
                    gradeSelect.value = defaultGrade.toString();
                } else {
                    gradeSelect.value = "1"; 
                }
                syncSelectAttribute(gradeSelect);
            }

            setupOptionsHandlers(questionEl);
            setTimeout(() => { setupEditable(); setupRemoveButtons(); }, 0);

            const textEl = questionEl.querySelector(`#${qid}-text`);
            if (textEl) textEl.textContent = qText;

            const optionLis = questionEl.querySelectorAll('ul.options-list > li');
            optionLis.forEach((li, idx) => {
                const sel = li.querySelector('select.option-percent');
                if (!sel) return;
                const raw = optionFractions[idx] ?? "0";
                
                const exact = Array.from(sel.options).find(o => o.value === raw);
                if (exact) {
                    sel.value = exact.value;
                } else {
                    let best = sel.options[0].value, bestDiff = Infinity, target = parseFloat(raw);
                    for (let o of sel.options) {
                        const diff = Math.abs(parseFloat(o.value) - target);
                        if (diff < bestDiff) { bestDiff = diff; best = o.value; }
                    }
                    sel.value = best;
                }
                syncSelectAttribute(sel);
            });
        }
    };

    reader.readAsText(file);
    swal("Der Import war erfolgreich!","Du kannst deine Fragen nun bearbeiten","success");
}

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