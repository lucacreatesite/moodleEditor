import { createOptionHtml } from './templates.js';

// Macht alle Fragen/Optionen editierbar und speichert Änderungen (DOM-basiert)
// Hängt mit localStorage zusammen (persistiert Änderungen)
export function setupEditable() {
    document.querySelectorAll('[contenteditable][id]').forEach(el => {
        const key = 'demo_' + el.id;
        const saved = localStorage.getItem(key);
        if (saved) el.textContent = saved;
        if (!el._boundEditable) {
            el.addEventListener('input', () => {
                localStorage.setItem(key, el.textContent);
            });
            el._boundEditable = true;
        }
    });
}

// Bindet Entfernen-Buttons für Fragen (löscht DOM und localStorage)
export function setupRemoveButtons() {
    document.querySelectorAll('.remove-question-btn').forEach(btn => {
        btn.onclick = function () {
            const qid = btn.getAttribute('data-qid');
            const qDiv = document.getElementById(qid);
            if (qDiv) qDiv.remove();
            localStorage.removeItem('demo_' + qid + '-text');
            for (let i = 1; i <= 4; i++) localStorage.removeItem('demo_' + qid + '-opt' + i);
        };
    });
}

// Bindet Option-Hinzufügen und Option-Entfernen Buttons für alle Fragen
export function setupOptionsHandlers(container = document) {
    // Handler für "Option hinzufügen"-Button
    container.querySelectorAll('.add-option-btn').forEach(btn => {
        btn.onclick = function () {
            const questionDiv = btn.closest('.demo-question');
            const qid = questionDiv.id;
            const optionsList = questionDiv.querySelector('.options-list');
            const newOptIndex = optionsList.children.length + 1;
            // Neue Option wird dynamisch hinzugefügt
            optionsList.insertAdjacentHTML('beforeend', createOptionHtml(qid, newOptIndex));

            // Direkt den Remove-Handler für die neu hinzugefügte Option binden
            const newLi = optionsList.lastElementChild;
            const rmBtn = newLi.querySelector('.remove-option-btn');
            if (rmBtn) {
                rmBtn.onclick = function () {
                    const optionItem = rmBtn.closest('li');
                    const list = optionItem.parentElement;
                    if (list.children.length > 1) {
                        optionItem.remove();
                    } else {
                        //"swal" dient als unser Alert Ersatz und wurde in index.html mit einer Libary eingefügt.
                        swal('Mindestens eine Antwortoption muss bleiben!',"","warning"); 
                    }
                };
            }

            // Editierbarkeit für neues Label aktivieren und speichern
            setupEditable();
        };
    });

    // Handler für "Option löschen"-Button
    container.querySelectorAll('.remove-option-btn').forEach(btn => {
        btn.onclick = function () {
            const optionItem = btn.closest('li');
            const optionsList = optionItem.parentElement;
            // Mindestens eine Option muss immer vorhanden sein
            if (optionsList.children.length > 1) {
                optionItem.remove();
            } else {
                swal('Mindestens eine Antwortoption muss bleiben!',"","warning");
            }
        };
    });
}