
// Macht alle Fragen/Optionen editierbar und speichert Änderungen (DOM-basiert)
// Hängt mit localStorage zusammen (persistiert Änderungen)
function setupEditable() {
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
function setupRemoveButtons() {
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

// Initialisiert Editierbarkeit und Entfernen-Buttons beim Laden
setupEditable();
setupRemoveButtons();

// Fügt neue Frage hinzu (DOM und Handler)
document.getElementById('add-question-btn').addEventListener('click', () => {
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

// Gibt das HTML für das Prozent-Dropdown einer Option zurück
function getPercentDropdownHtml() {
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
function createOptionHtml(qid, optIdx, text = '') {
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
function createQuestionHtml(qid, opts = 4, texts = []) {
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

// Bindet Option-Hinzufügen und Option-Entfernen Buttons für alle Fragen
function setupOptionsHandlers(container = document) {
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
                        alert('Mindestens eine Antwortoption muss bleiben!');
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
                alert('Mindestens eine Antwortoption muss bleiben!');
            }
        };
    });
}



// Drag & Drop und Datei-Upload für XML-Dateien (Import)
const dropzone = document.getElementById('xml-dropzone');
const fileInput = document.getElementById('xml-file-input');
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

function handleXmlFile(file) {
    if (!file.name.toLowerCase().endsWith('.xml')) {
        alert('Nur XML-Dateien sind erlaubt!');
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
            const qText = q.querySelector('questiontext > text')?.textContent || 'Neue Frage';

            // Beispielhaft: Antworten auslesen 
            const options = q.getElementsByTagName('answer');
            let optionTexts = [];
            for (let j = 0; j < options.length; j++) {
                optionTexts.push(options[j].querySelector('text')?.textContent || `Antwort ${j + 1}`);
            }

            //geht nicht!!!

            const questionTexter = q.getElementsByTagName('questiontext');
            let optionQuestion = [];
            for (let i = 0; i < options.length; i++) {
                optionQuestion.push(options[i].querySelector('text')?.textContent || `Antwort ${j + 1}`);
            }


            // Deine bestehende HTML-Erzeugung
            container.innerHTML += createQuestionHtml(qid, optionTexts.length, optionTexts);
            container.innerHTML += createQuestionHtmll(qid, optionTexts.length, optionTexts);
        }
    };

    reader.readAsText(file);
}
