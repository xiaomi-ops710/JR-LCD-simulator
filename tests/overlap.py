#!/usr/bin/env python3
"""
画面ごとに「表示中の文字」同士の重なりを数える（段階5の確認用）。
使い方: python3 tests/overlap.py [--verbose]
必要: pip install playwright && python3 -m playwright install chromium
      Tailwind の生成CSS: TW_CLI=<tailwindcss/lib/cli.js> で tests/tw.css を作成（layout.py と同じ）
"""
import os, sys, json, re, shutil, tempfile, threading, socketserver, http.server, functools, subprocess
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
CSS = os.path.join(HERE, 'tw.css'); TW_CLI = os.environ.get('TW_CLI', '')
LAYOUTS = ['loop','curve','curve_rtl','straight','platform','notice_info','sobu_rect',
           'chuo_stopping','chuo_platform','chuo_door','chuo_transfer','chuo_train_info']
CASES = [('JY','yamanote_video_tokyo'), ('JC', None), ('JB', None), ('JE', None), ('JK', None)]
LANGS = ['jp', 'en']

COLLECT = """() => {
  const scr = document.getElementById('lcdScreen');
  const sr = scr.getBoundingClientRect();
  // 実際に見えている要素だけ（非表示・透明・切替途中の古い表示は除外）
  const seen = el => { for (let n = el; n && n !== document.body; n = n.parentElement) {
     const cs = getComputedStyle(n);
     if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.9) return false; }
     return true; };
  const els = [...scr.querySelectorAll('*')].filter(el => el.children.length === 0
     && el.textContent.trim().length > 0 && el.clientWidth > 0 && seen(el));
  const boxes = els.map(el => { const r = el.getBoundingClientRect();
     return {t: el.textContent.trim().slice(0,10), l:r.left, r:r.right, tp:r.top, b:r.bottom}; })
     .filter(b => b.r > b.l && b.b > b.tp && b.r > sr.left && b.l < sr.right && b.b > sr.top && b.tp < sr.bottom);
  const out = [];
  for (let i = 0; i < boxes.length; i++) for (let j = i+1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    const ox = Math.min(a.r,b.r) - Math.max(a.l,b.l), oy = Math.min(a.b,b.b) - Math.max(a.tp,b.tp);
    if (ox > 3 && oy > 3 && a.t !== b.t) out.push(a.t + ' × ' + b.t);
  }
  return [...new Set(out)];
}"""

class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
class S(socketserver.TCPServer): allow_reuse_address = True

def main():
    verbose = '--verbose' in sys.argv
    if not os.path.exists(CSS):
        if not TW_CLI: sys.exit('tests/tw.css がありません（TW_CLI を指定）')
        inp = os.path.join(HERE, '_in.css'); open(inp,'w').write('@tailwind base;\n@tailwind components;\n@tailwind utilities;\n')
        subprocess.run(['node', TW_CLI, '-i', inp, '-o', CSS, '--content', f'{ROOT}/index.html,{ROOT}/js/*.js'], check=True); os.remove(inp)
    tmp = tempfile.mkdtemp(prefix='viewcopy_')
    shutil.copytree(ROOT, tmp, dirs_exist_ok=True)
    shutil.copy(CSS, os.path.join(tmp, 'css', 'tw.css'))
    html = open(os.path.join(tmp, 'index.html'), encoding='utf-8').read()
    html = re.sub(r'<script src="https://cdn\.tailwindcss\.com"[^>]*></script>', '<link rel="stylesheet" href="css/tw.css" />', html)
    open(os.path.join(tmp, 'index.html'), 'w', encoding='utf-8').write(html)
    port = 8840
    srv = S(('127.0.0.1', port), functools.partial(Q, directory=tmp)); threading.Thread(target=srv.serve_forever, daemon=True).start()
    report = {}
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(); pg = b.new_page(viewport={'width':1366,'height':1024})
            pg.route('**/*', lambda r: r.continue_() if r.request.url.startswith(f'http://127.0.0.1:{port}') else r.abort())
            pg.goto(f'http://127.0.0.1:{port}/index.html', wait_until='load'); pg.wait_for_timeout(700)
            pg.evaluate("() => { clearInterval(autoLangInterval); clearInterval(autoPageInterval); state.autoLangCycleActive=false; }")
            for ln, sub in CASES:
                for lay in LAYOUTS:
                    for lg in LANGS:
                        pg.evaluate(f"() => {{ selectLine('{ln}'{', '+repr(sub) if sub else ''}); setBodyLayout('{lay}'); state.lang='{lg}'; renderLCD(false); }}")
                        pg.wait_for_timeout(900)
                        res = pg.evaluate(COLLECT)
                        if res: report[f'{ln}/{lay}/{lg}'] = res
            b.close()
    finally:
        srv.shutdown()
    total = len(CASES)*len(LAYOUTS)*len(LANGS)
    print(f'重なりのある画面: {len(report)} / {total}')
    for k, v in report.items():
        print(' ', k, f'({len(v)}件)', ('; '.join(v[:4]) if verbose else ''))

if __name__ == '__main__':
    main()
