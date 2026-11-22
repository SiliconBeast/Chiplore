// A textarea with Verilog colouring drawn underneath it. No dependencies.
const KW = /\b(module|endmodule|input|output|inout|always|assign|if|else|begin|end|posedge|negedge|initial|case|endcase|parameter|localparam)\b/;
const TY = /\b(wire|reg|logic|integer)\b/;

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlight(src) {
  const out = [];
  const re = /(\/\/[^\n]*)|(\d+'[bdh][0-9a-fA-F_xz]+|\b\d+\b)|([A-Za-z_][A-Za-z0-9_]*)|([\s\S])/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[1]) out.push(`<span class="cm">${esc(m[1])}</span>`);
    else if (m[2]) out.push(`<span class="num">${esc(m[2])}</span>`);
    else if (m[3]) {
      if (m[3] === 'posedge' || m[3] === 'negedge') out.push(`<span class="num">${m[3]}</span>`);
      else if (KW.test(m[3])) out.push(`<span class="kw">${m[3]}</span>`);
      else if (TY.test(m[3])) out.push(`<span class="ty">${m[3]}</span>`);
      else out.push(esc(m[3]));
    } else out.push(esc(m[4]));
  }
  return out.join('') + '\n';
}

/** Wire up one editor: <div data-editor><pre data-gutter/><div class="ed"><pre data-hl/><textarea/></div></div> */
export function mountEditor(root, onChange) {
  const ta = root.querySelector('textarea');
  const hl = root.querySelector('[data-hl]');
  const gutter = root.querySelector('[data-gutter]');
  const paint = () => {
    hl.innerHTML = highlight(ta.value);
    const lines = ta.value.split('\n').length;
    gutter.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    ta.style.height = `${lines * 24 + 4}px`;
  };
  ta.addEventListener('input', () => { paint(); onChange?.(ta.value); });
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: t } = ta;
      ta.setRangeText('  ', s, t, 'end');
      paint();
    }
  });
  paint();
  return {
    get value() { return ta.value; },
    set value(v) { ta.value = v; paint(); },
    markLine(n) { gutter.innerHTML = gutter.textContent.split('\n').map((x, i) => (i + 1 === n ? '<span style="color:#F0697F">●</span>' : x)).join('\n'); },
  };
}
