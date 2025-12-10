import { createOptionHtml, setupOptionsHandlers } from './options.js';
import { setupEditable, setupRemoveButtons } from './editable.js';

export function createQuestionHtml(qid, opts = 4, texts = []) {
    let optionsHtml = '';
    for (let i = 1; i <= opts; i++) {
        optionsHtml += createOptionHtml(qid, i, texts[i - 1]);
    }
    return `
        <div class="demo-question" id="${qid}">
          <div class="question-header">
            <strong contenteditable="true" spellcheck="true" id="${qid}-text">Neue Frage</strong>
            <div class="question-type-dnd">
              <span>Typ wählen:</span>
              <div class="type-buttons">
                <button class="type-btn single">Single</button>
                <button class="type-btn multi">Multi</button>
              </div>
            </div>
            <button class="remove-question-btn" title="Frage löschen" data-qid="${qid}">-</button>
          </div>
          <ul class="options-list">
            ${optionsHtml}
          </ul>
          <button class="add-option-btn" title="Option hinzufügen">+ Option hinzufügen</button>
        </div>
      `;
}

export function setupAddQuestion() {
    document.getElementById('add-question-btn')?.addEventListener('click', () => {
        let idx = 3;
        while (document.getElementById('q' + idx + '-text')) idx++;

        const qid = 'q' + idx;
        const container = document.querySelector('.demo-questions');
        const div = document.createElement('div');
        div.innerHTML = createQuestionHtml(qid, 1);
        container.appendChild(div.firstElementChild);
        setupOptionsHandlers(container);
        setTimeout(() => { setupEditable(); setupRemoveButtons(); }, 100);
    });
}