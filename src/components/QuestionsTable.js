/*
// Tabelle für Fragen mit Checkboxen für Single/Multi-Choice
import store, { QuestionType } from '../store.js';

// Rendert die Fragen-Tabelle in das übergebene Container-Element
// Hängt mit store.state.questions zusammen (liest aktuelle Fragen)
export function renderQuestionsTable(container) {
  container.innerHTML = '';
  const questions = store.state.questions;
  const table = document.createElement('table');
  table.setAttribute('data-testid', 'questions-table');

  // Tabellenkopf mit Spaltenüberschriften
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>#</th>
      <th>Frage</th>
      <th>Typ</th>
      <th>Antwortmöglichkeiten</th>
    </tr>
  `;
  table.appendChild(thead);

  // Tabellenkörper mit allen Fragen und deren Antwortoptionen
  const tbody = document.createElement('tbody');
  questions.forEach((q, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${q.text}</td>
      <td>${q.type === QuestionType.SINGLE ? 'Single' : 'Multi'}</td>
      <td>
        <form>
          ${q.options.map((opt, i) => `
            <label style="display:inline-block;margin-right:1em;">
              <input type="${q.type === QuestionType.SINGLE ? 'radio' : 'checkbox'}" name="q${q.id}" ${opt.correct ? 'checked' : ''} disabled data-testid="option-correct-${i}">
              <span data-testid="option-text-${i}">${opt.text}</span>
            </label>
          `).join('')}
        </form>
      </td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
} */