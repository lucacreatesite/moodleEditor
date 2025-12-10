import { getPercentDropdownHtml } from './utils.js';
import { setupEditable } from './editable.js';

export function createOptionHtml(qid, optIdx, text = '') {
    return `
        <li>
          <div class="option-wrapper">
            <label contenteditable="true" id="${qid}-opt${optIdx}">${text || 'Antwort ' + optIdx}</label>
            ${getPercentDropdownHtml()}
            <button class="remove-option-btn" title="Option löschen">-</button>
          </div>
        </li>
      `;
}

export function setupOptionsHandlers(container = document) {
    container.querySelectorAll('.add-option-btn').forEach(btn => {
        btn.onclick = function () {
            const questionDiv = btn.closest('.demo-question');
            const qid = questionDiv.id;
            const optionsList = questionDiv.querySelector('.options-list');
            const newOptIndex = optionsList.children.length + 1;
            optionsList.insertAdjacentHTML('beforeend', createOptionHtml(qid, newOptIndex));

            const newLi = optionsList.lastElementChild;
            const rmBtn = newLi.querySelector('.remove-option-btn');
            if (rmBtn) {
                rmBtn.onclick = function () {
                    const optionItem = rmBtn.closest('li');
                    const list = optionItem.parentElement;
                    if (list.children.length > 1) {
                        optionItem.remove();
                    } else {
                        swal('Mindestens eine Antwortoption muss bleiben!',"","warning"); 
                    }
                };
            }

            setupEditable();
        };
    });

    container.querySelectorAll('.remove-option-btn').forEach(btn => {
        btn.onclick = function () {
            const optionItem = btn.closest('li');
            const optionsList = optionItem.parentElement;
            if (optionsList.children.length > 1) {
                optionItem.remove();
            } else {
                swal('Mindestens eine Antwortoption muss bleiben!',"","warning");
            }
        };
    });
}