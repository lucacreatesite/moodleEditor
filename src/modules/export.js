import { escapeXml } from './utils.js';

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

        // Validierung, das Fragentext nicht leer ist
        if (!qtext) {
        swal('Fragentext darf nicht leer sein',"","error");
        throw new Error(`Fragentext darf nicht leer sein (Frage ${idx + 1})`);
        }

        options.forEach((opt, i) => {
        if (!opt.text) {
            swal('Antwortetext darf nicht leer sein',"","error");
            throw new Error(`Antworttext darf nicht leer sein (Frage ${idx + 1}, Antwort ${i + 1})`);
        }
        });


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
export function initExport() {
    const exportBtn = document.getElementById('btn-export-xml');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {

            // Prüfung ob überhaupt Fragen da sind 
            if (document.querySelectorAll('.demo-question').length === 0) {
                swal("Keine Fragen vorhanden, erstelle mindestens eine zum Exportieren!","","error");
                return; 
            }

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
}