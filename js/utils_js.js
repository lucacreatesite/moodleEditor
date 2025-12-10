export function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

export function escapeXml(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export function downloadTextFile(filename, text) {
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

export function getPercentDropdownHtml() {
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