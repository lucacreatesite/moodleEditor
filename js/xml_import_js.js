import { stripHtml } from './utils.js';
import { createQuestionHtml } from './questions.js';
import { setupOptionsHandlers } from './options.js';
import { setupEditable, setupRemoveButtons } from './editable.js';

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

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const qid = 'q' + (i + 1);
            const rawQText = q.querySelector('questiontext > text')?.textContent || 'Neue Frage';
            const qText = stripHtml(rawQText);

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
                if (exact) sel.value = exact.value;
                else {
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
    swal("Der Import war erfolgreich!","Du kannst dein Frage nun bearbeiten","success");
}

export function setupXmlImport() {
    const dropzone = document.getElementById('xml-dropzone');
    const fileInput = document.getElementById('xml-file-input');
    
    dropzone?.addEventListener('click', () => fileInput.click());
    dropzone?.addEventListener('dragover', e => {
        e.preventDefault();
        dropzone.style.borderColor = '#1a7ad1';
        dropzone.style.background = '#e3eefd';
    });
    dropzone?.addEventListener('dragleave', e => {
        dropzone.style.borderColor = '';
        dropzone.style.background = '';
    });
    dropzone?.addEventListener('drop', e => {
        e.preventDefault();
        dropzone.style.borderColor = '';
        dropzone.style.background = '';
        if (!e.dataTransfer.files.length) return;
        handleXmlFile(e.dataTransfer.files[0]);
    });
    fileInput?.addEventListener('change', e => {
        if (fileInput.files.length) handleXmlFile(fileInput.files[0]);
    });
}