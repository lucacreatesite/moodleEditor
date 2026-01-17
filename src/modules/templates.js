// Gibt das HTML für das Prozent-Dropdown einer Option zurück
export function getPercentDropdownHtml() {
  // Gibt das HTML für das Prozent-Dropdown zurück
  return `
        <select class="option-percent">
          <option value="100">100%</option>
          <option value="90">90%</option>
          <option value="88.333">88,333%</option>
          <option value="80">80%</option>
          <option value="75">75%</option>
          <option value="70">70%</option>
          <option value="66.6667">66,6667%</option>
          <option value="60">60%</option>
          <option value="50">50%</option>
          <option value="40">40%</option>
          <option value="33.33333">33,33333%</option>
          <option value="30">30%</option>
          <option value="25">25%</option>
          <option value="16.66667">16,66667%</option>
          <option value="14.28571">14,28571%</option>
          <option value="12.5">12,5%</option>
          <option value="11.11111">11,11111%</option>
          <option value="10">10%</option>
          <option value="5">5%</option>
          <option value="0">0%</option>
          <option value="-5">-5%</option>
          <option value="-10">-10%</option>
          <option value="-11.11111">-11,11111%</option>
          <option value="-12.5">-12,5%</option>
          <option value="-14.28571">-14,28571%</option>
          <option value="-16.66667">-16,66667%</option>
          <option value="-25">-25%</option>
          <option value="-30">-30%</option>
          <option value="-33.33333">-33,33333%</option>
          <option value="-40">-40%</option>
          <option value="-50">-50%</option>
          <option value="-60">-60%</option>
          <option value="-66.6667">-66,6667%</option>
          <option value="-70">-70%</option>
          <option value="-75">-75%</option>
          <option value="-80">-80%</option>
          <option value="-88.333">-88,333%</option>
          <option value="-90">-90%</option>
          <option value="-100">-100%</option>
        </select>
      `;
}

// Gibt das HTML für eine einzelne Antwortoption zurück
export function createOptionHtml(qid, optIdx, text = '') {
  // Jede Option besteht aus einem editierbaren Label, Prozent-Dropdown und Löschbutton
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

// Gibt das HTML für eine komplette Frage inkl. Optionen zurück
export function createQuestionHtml(qid, opts = 4, texts = []) {
  let optionsHtml = '';
  for (let i = 1; i <= opts; i++) {
    optionsHtml += createOptionHtml(qid, i, texts[i - 1]);
  }
  // Frage besteht aus Header, Optionen und Button zum Hinzufügen weiterer Optionen
  return `
        <div class="demo-question" id="${qid}">
          <div class="question-header">
            <strong contenteditable="true" spellcheck="true" id="${qid}-text">Neue Frage</strong>
            <div class="question-type-dnd">
              <span>Punkte wählen:</span>
              <div class="point-select">
                <select class="option-pointing">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
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