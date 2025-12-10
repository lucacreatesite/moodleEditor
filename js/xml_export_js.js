import { escapeXml, downloadTextFile } from './utils.js';

function buildMoodleXmlFromDom() {
    const questions = Array.from(document.querySelectorAll('.demo-question'));

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

        const single = isSingleChoice(options);

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

        const defaultgrade = "1.0000000";
        const penalty = "0.3333333";
        const shuffleanswers = "1";
        const answernumbering = "abc";

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
    <penalty>${penalty}</penalty>
    <hidden>0</hidden>
    <single>${single ? 'true' : 'false'}</single>
    <shuffleanswers>${shuffleanswers}</shuffleanswers>
    <answernumbering>${answernumbering}</answernumbering>
    ${answersXml}
  </question>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
${questionXml}
</quiz>`;
}

export function setupXmlExport() {
    const exportBtn = document.getElementById('btn-export-xml');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const xml = buildMoodleXmlFromDom();
            const firstQuestionTextEl = document.querySelector('.demo-question .question-text, #q1-text');
            let filenameBase = firstQuestionTextEl ? firstQuestionTextEl.textContent.trim() : 'moodle-questions';
            const filename = `${filenameBase || 'moodle-questions'}.xml`;
            downloadTextFile(filename, xml);
            swal("Deine Datei wurde erfolgreich exportiert", `Dateiname: ${filename}`,"success");
        });
    }
}