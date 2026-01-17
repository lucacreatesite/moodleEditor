import { createQuestionHtml } from './modules/templates.js';
import { setupEditable, setupRemoveButtons, setupOptionsHandlers } from './modules/interactions.js';
import { setupAutoSave } from './modules/storage.js';
import { initImport } from './modules/import.js';
import { initExport } from './modules/export.js';

// Initialisiert Editierbarkeit und Entfernen-Buttons beim Laden
// Fügt neue Frage hinzu (DOM und Handler)
document.getElementById('add-question-btn').addEventListener('click', () => {
    let idx = 3;
    while (document.getElementById('q' + idx + '-text')) idx++;


    const qid = 'q' + idx; //hier ändern



    const container = document.querySelector('.demo-questions');
    const div = document.createElement('div');
    div.innerHTML = createQuestionHtml(qid, 1);
    container.appendChild(div.firstElementChild);
    setupOptionsHandlers(container);
    setTimeout(() => { setupEditable(); setupRemoveButtons(); }, 100);
});

// Für die Umschaltung zwischen Single/Multi pro Frage
document.addEventListener('click', e => {
    if (e.target.classList.contains('type-btn')) {
        const qDiv = e.target.closest('.demo-question');
        if (!qDiv) return;
        qDiv.dataset.type = e.target.classList.contains('multi') ? 'multi' : 'single';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    setupAutoSave();

    setupOptionsHandlers();
    setupEditable();
    setupRemoveButtons();

    // Initialisiere Module
    initImport();
    initExport();
});

document.querySelector('.delete-button')?.addEventListener('click', () => {
    swal({
        title: "Wirklich alle Fragen löschen?",
        icon: "warning",
        buttons: ["Abbrechen", "Löschen"],
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            localStorage.clear();
            location.reload();
        }
    });
});

document.getElementById('search-input')?.addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    document.querySelectorAll('.demo-question').forEach(q => {
        const text = q.querySelector('strong')?.textContent.toLowerCase() || '';
        q.style.display = text.includes(search) ? '' : 'none';
    });
});