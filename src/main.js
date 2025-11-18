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


    const qid = 'q' + idx; //hier ändern


    
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


// Hilfsfunktion zum Entfernen aller HTML-Tags

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

//XML-Datei einlesen und Frage einfpügen

function handleXmlFile(file) {
    if (!file.name.toLowerCase().endsWith('.xml')) {
        swal('Nur XML-Dateien sind erlaubt!', "Bitte füge eine XML Datei ein" ,"error");
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
            const rawQText = q.querySelector('questiontext > text')?.textContent || 'Neue Frage';
            const qText = stripHtml(rawQText); //HTML-Tags in der Frage sind so nicht mehr sichtbar.


            // Antworten auslesen 
            const options = q.getElementsByTagName('answer');

            const optionTexts = [];
            const optionFractions = [];
            for (let j = 0; j < options.length; j++) {
                const ans = options[j];
                optionTexts.push(ans.querySelector('text')?.textContent || `Antwort ${j + 1}`);
                const fracRaw = ans.getAttribute('fraction'); // z.B. "100", "50", "-33.33333"
                optionFractions.push(fracRaw ?? "0");
            }
            // Frage erzeugen (richtig)
            const markup = createQuestionHtml(qid, optionTexts.length, optionTexts);
            const wrapper = document.createElement('div');
            wrapper.innerHTML = markup;
            const questionEl = wrapper.firstElementChild;
            container.appendChild(questionEl);

            // Setup (wie bei neuen Fragen)
            setupOptionsHandlers(questionEl);
            setTimeout(() => { setupEditable(); setupRemoveButtons(); }, 0);

            // Fragetext aus XML einsetzen
            const textEl = questionEl.querySelector(`#${qid}-text`);
            if (textEl) textEl.textContent = qText;

            // Fraction-Werte (Bewertung der Antworten) einsetzen
            const optionLis = questionEl.querySelectorAll('ul.options-list > li');
            optionLis.forEach((li, idx) => {
                const sel = li.querySelector('select.option-percent');
                if (!sel) return;
                const raw = optionFractions[idx] ?? "0";
                const exact = Array.from(sel.options).find(o => o.value === raw);
                if (exact) sel.value = exact.value;
                else {
                    // nächstliegender Wert falls Rundung
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
    swal("Der Import war erfolgreich!","Du kannst dein Frage nun bearbeiten","success")
}


// Export als Moodle XML Block
// Hilfsfunktion: XML-Entities escapen
function escapeXml(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

// Aus aktuellem DOM (demo-question) Moodle-XML erzeugen
function buildMoodleXmlFromDom() {
    const questions = Array.from(document.querySelectorAll('.demo-question'));

    // Hilfsfunktion: "single" ermitteln
    // Heuristik: Single = genau eine Option mit positiver Punktzahl (>0) und diese ist 100%.
    function isSingleChoice(opts) {
        const positives = opts.filter(o => o.fraction > 0);
        return positives.length === 1 && Math.abs(positives[0].fraction - 100) < 1e-6;
    }

    const questionXml = questions.map((qDiv, idx) => {
        const qid = qDiv.id || `q${idx + 1}`;
        const qtextEl = qDiv.querySelector(`#${qid}-text`);
        const qtext = qtextEl ? qtextEl.textContent.trim() : `Frage ${idx + 1}`;

        // Optionen einsammeln
        const options = Array.from(qDiv.querySelectorAll('ul.options-list > li')).map((li, i) => {
            const label = li.querySelector('label');
            const select = li.querySelector('select.option-percent');
            const text = (label?.textContent ?? `Antwort ${i + 1}`).trim();
            const fraction = select ? parseFloat(select.value) : 0;
            return { text, fraction };
        });

        const single = isSingleChoice(options);

        // Optional: Standardwerte
        const defaultgrade = "1.0000000";
        const penalty = "0.3333333";
        const shuffleanswers = "1";
        const answernumbering = "abc";

        // Antwort-XML
        const answersXml = options.map(opt => {
            // Moodle erwartet Prozent (auch Dezimal erlaubt)
            const fracStr = Number.isFinite(opt.fraction) ? String(opt.fraction) : "0";
            return `
      <answer fraction="${escapeXml(fracStr)}">
        <text>${escapeXml(opt.text)}</text>
        <feedback format="html"><text></text></feedback>
      </answer>`;
        }).join('');

        // Komplette Frage als multichoice
        return `


        
  <question type="multichoice">


    <name><text>${escapeXml(qtext)}</text></name>
    <questiontext format="html">
      <text>${escapeXml(qtext)}</text>
    </questiontext>
    <generalfeedback format="html"><text></text></generalfeedback>
    <defaultgrade>${defaultgrade}</defaultgrade>
    <penalty>${penalty}</penalty>
    <hidden>0</hidden>
    <single>${single ? 'true' : 'false'}</single>
    <shuffleanswers>${shuffleanswers}</shuffleanswers>
    <answernumbering>${answernumbering}</answernumbering>
    ${answersXml}
  </question>`;
    }).join('\n');

    // Gesamtes Quiz
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
${questionXml}
</quiz>`;

    return xml;
}

// Datei-Download anstoßen
function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

//In XML exportieren
const exportBtn = document.getElementById('btn-export-xml');
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        const xml = buildMoodleXmlFromDom();

        // Fragetext aus dem DOM holen
        const firstQuestionTextEl = document.querySelector('.demo-question .question-text, #q1-text');

        // Basis für Dateinamen bestimmen
        let filenameBase = firstQuestionTextEl ? firstQuestionTextEl.textContent.trim() : 'moodle-questions';

        //Dateinamen zusammensetzen
        const filename = `${filenameBase || 'moodle-questions'}.xml`;

       
        downloadTextFile(filename, xml);

        
        swal("Deine Datei wurde erfolgreich exportiert", `Dateiname: ${filename}`,"success");
    });
}

// Für die Umschaltung zwischen Single/Multi pro Frage
document.addEventListener('click', e => {
  if (e.target.classList.contains('type-btn')) {
    const qDiv = e.target.closest('.demo-question');
    if (!qDiv) return;
    qDiv.dataset.type = e.target.classList.contains('multi') ? 'multi' : 'single';
  }
});

// Noch einfacher: Automatisch alle DOM-Änderungen überwachen
function setupAutoSave() {
    const questionsContainer = document.querySelector('.demo-questions');
    if (!questionsContainer) return;
    
    // Beim Laden gespeicherte Fragen laden
    const saved = localStorage.getItem('autoSavedQuestions');
    if (saved) {
        questionsContainer.innerHTML = saved;
    }
    
    // Observer für alle Änderungen im Container
    const observer = new MutationObserver(() => {
        localStorage.setItem('autoSavedQuestions', questionsContainer.innerHTML);
    });
    
    // Alle Arten von Änderungen überwachen
    observer.observe(questionsContainer, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
    });
}
document.addEventListener('DOMContentLoaded', function() {
    setupAutoSave();
    
    setupOptionsHandlers();
    setupEditable();
    setupRemoveButtons();
});