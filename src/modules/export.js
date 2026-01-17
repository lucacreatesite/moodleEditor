import { escapeXml } from './utils.js';

// Diese Funktion erstellt das Moodle-XML inklusive des Kategorie-Blocks am Anfang
function buildMoodleXmlFromDom(categoryName) {
    const questions = Array.from(document.querySelectorAll('.demo-question'));

    // Der Kategorie-Block definiert den Zielordner in der Moodle-Fragensammlung
    const categoryXml = `
  <question type="category">
    <category>
      <text>$course$/top/${escapeXml(categoryName)}</text>
    </category>
    <info format="html">
      <text></text>
    </info>
    <idnumber></idnumber>
  </question>`;

    // Hilfsfunktion zur Bestimmung des Fragentyps (Single- oder Multiple-Choice)
    function isSingleChoice(opts) {
        const positives = opts.filter(o => o.fraction > 0);
        return positives.length === 1 && Math.abs(positives[0].fraction - 100) < 1e-6;
    }

    const questionXml = questions.map((qDiv, idx) => {
        const qid = qDiv.id || `q${idx + 1}`;
        const qtextEl = qDiv.querySelector(`#${qid}-text`);
        const qtext = qtextEl ? qtextEl.textContent.trim() : `Frage ${idx + 1}`;

        const options = Array.from(qDiv.querySelectorAll('ul.options-list > li')).map((li, i) => {
            const label = li.querySelector('label');
            const select = li.querySelector('select.option-percent');
            const text = (label?.textContent ?? `Antwort ${i + 1}`).trim();
            const fraction = select ? parseFloat(select.value) : 0;
            return { text, fraction };
        });
        //Überprüfung auf mind. 2 Antwortemöglichkeiten, sonst keine Download!
        if (options.length < 2) {
            swal('Zu wenige Antworten!', `Frage ${idx + 1} benötigt mindestens zwei Antwortmöglichkeiten.`, "error");
            throw new Error(`Validierung fehlgeschlagen: Zu wenige Antworten bei Frage ${idx + 1}`);
        }

        const single = isSingleChoice(options);

        // Überprüfung auf leere Texte, um Importfehler in Moodle zu vermeiden
        if (!qtext) {
            swal('Fragentext darf nicht leer sein', "", "error");
            throw new Error(`Fragentext fehlt bei Frage ${idx + 1}`);
        }

        options.forEach((opt, i) => {
            if (!opt.text) {
                swal('Antwortetext darf nicht leer sein', "", "error");
                throw new Error(`Antworttext fehlt bei Frage ${idx + 1}, Antwort ${i + 1}`);
            }
        });

        const pointSelect = qDiv.querySelector('.option-pointing');
        let pointsVal = 1;
        if (pointSelect && pointSelect.value) {
            pointsVal = parseFloat(pointSelect.value);
        }
        const defaultgrade = isNaN(pointsVal) ? "1.0000000" : pointsVal.toFixed(7);

        const answersXml = options.map(opt => {
            const fracStr = Number.isFinite(opt.fraction) ? String(opt.fraction) : "0";
            return `
      <answer fraction="${escapeXml(fracStr)}">
        <text>${escapeXml(opt.text)}</text>
        <feedback format="html"><text></text></feedback>
      </answer>`;
        }).join('');

        return `
  <question type="multichoice">
    <name><text>${escapeXml(qtext)}</text></name>
    <questiontext format="html">
      <text>${escapeXml(qtext)}</text>
    </questiontext>
    <generalfeedback format="html"><text></text></generalfeedback>
    <defaultgrade>${defaultgrade}</defaultgrade>
    <penalty>0.3333333</penalty>
    <hidden>0</hidden>
    <single>${single ? 'true' : 'false'}</single>
    <shuffleanswers>1</shuffleanswers>
    <answernumbering>abc</answernumbering>
    ${answersXml}
  </question>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
${categoryXml}
${questionXml}
</quiz>`;
}

// Startet den Download der generierten XML-Datei im Browser
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

// Initialisiert den Export-Button und verarbeitet die Namenslogik
export function initExport() {
    const exportBtn = document.getElementById('btn-export-xml');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {

            if (document.querySelectorAll('.demo-question').length === 0) {
                swal("Keine Fragen vorhanden!", "", "error");
                return;
            }

            try {
                const categoryInput = document.getElementById('category-input');
                const userSpecifiedName = categoryInput ? categoryInput.value.trim() : '';
                let finalCategoryName;

                if (userSpecifiedName) {
                    // Wenn der User einen Namen eingibt, wird dieser direkt ohne Versionierung genutzt
                    finalCategoryName = userSpecifiedName;
                } else {
                    // Falls kein Name angegeben wurde, greift die automatische Versionierung
                    const firstQuestionTextEl = document.querySelector('.demo-question strong[id$="-text"]');
                    let baseName = firstQuestionTextEl ? firstQuestionTextEl.textContent.trim() : 'moodle-questions';
                    if (!baseName) baseName = 'moodle-questions';

                    let version = parseInt(localStorage.getItem('moodle_export_version') || '1');
                    finalCategoryName = `${baseName}_v${version}`;

                    // Nur wenn die Versionierung genutzt wurde, erhöhen wir den Zähler für das nächste Mal
                    localStorage.setItem('moodle_export_version', (version + 1).toString());
                }

                const xml = buildMoodleXmlFromDom(finalCategoryName);
                const filename = `${finalCategoryName}.xml`;

                downloadTextFile(filename, xml);
                swal("Export abgeschlossen", `Kategorie: ${finalCategoryName}`, "success");

            } catch (e) {
                console.error("Exportfehler:", e);
            }
        });
    }
}