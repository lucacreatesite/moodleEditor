import { setupEditable, setupAutoSave, setupRemoveButtons } from './editable.js';
import { setupAddQuestion } from './questions.js';
import { setupOptionsHandlers } from './options.js';
import { setupXmlImport } from './xmlImport.js';
import { setupXmlExport } from './xmlExport.js';

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    setupAutoSave();
    setupOptionsHandlers();
    setupEditable();
    setupRemoveButtons();
    setupAddQuestion();
    setupXmlImport();
    setupXmlExport();
    
    // Delete-Button
    document.querySelector('.delete-button')?.addEventListener('click', () => {
        if (confirm('Wirklich alle Fragen löschen?')) {
            localStorage.clear();
            location.reload();
        }
    });
    
    // Suchfunktion
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        const search = e.target.value.toLowerCase();
        document.querySelectorAll('.demo-question').forEach(q => {
            const text = q.querySelector('strong')?.textContent.toLowerCase() || '';
            q.style.display = text.includes(search) ? '' : 'none';
        });
    });
    
    // Type-Button Handler
    document.addEventListener('click', e => {
        if (e.target.classList.contains('type-btn')) {
            const qDiv = e.target.closest('.demo-question');
            if (!qDiv) return;
            qDiv.dataset.type = e.target.classList.contains('multi') ? 'multi' : 'single';
        }
    });
});