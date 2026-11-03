#!/usr/bin/env python3
"""
レイアウトの検査（文字のはみ出し・重なり）。
長い地名を含む行先で、ヘッダー形式・言語を切り替えて測定する。
写真との見た目比較はできないので、「隠れない・重ならない」だけを数値で確認する。

使い方: python3 tests/layout.py
必要: pip install playwright && python3 -m playwright install chromium
      Tailwind の生成CSS（tests/tw.css）が無い場合は自動で作る（Node.js と tailwindcss が必要）
"""
import os, sys, json, threading, socketserver, http.server, functools, subprocess
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CSS = os.path.join(HERE, 'tw.css')
TW_CLI = os.environ.get('TW_CLI', '')  # tailwindcss の cli.js へのパス

DESTS = {
    'jp': ['上野・池袋', '新宿・高尾', '池袋・上野方面・長い地名テスト'],
    'kana': ['うえの・いけぶくろ', 'しんじゅく', 'いけぶくろ・うえの・ながいちめいてすと'],
    'en': ['Ueno & Ikebukuro', 'Shinjuku', 'Ikebukuro & Ueno Extended'],
    'zh': ['上野・池袋', '新宿', '池袋·上野 长名称测试'],
    'ko': ['우에노·이케부쿠로', '신주쿠', '이케부쿠로·우에노 긴 이름 테스트'],
}
STYLES = ['whitebox', 'pillar', 'polygon']

CHECK_JS = """() => {
  // 検査対象: 行先の文字と、その付随語（方面・ゆき・행・方向）だけ。
  // 画面の切替で一時的に重なる要素は対象外にする（ノイズになるため）。
  const scr = document.getElementById('lcdScreen');
  const dest = state.destinationJp, kana = state.destinationKana, en = state.destinationEn, zh = state.destinationZh, ko = state.destinationKo;
  const names = [dest, kana, en, zh, ko].filter(Boolean);
  const suffixes = ['方面', 'ゆき', '행', '方向', 'Bound for'];
  const nodes = [...scr.querySelectorAll('div,span')].filter(el => el.children.length === 0 && el.offsetParent !== null && el.textContent.trim());
  const isDest = el => names.some(n => el.textContent.trim() === n.trim());
  const isSuffix = el => suffixes.includes(el.textContent.trim());
  const out = [];
  nodes.filter(isDest).forEach(el => {
    if (el.scrollWidth > el.clientWidth + 2) out.push('はみ出し: ' + el.textContent.trim().slice(0, 16));
    const a = el.getBoundingClientRect();
    nodes.filter(isSuffix).forEach(s => {
      const b = s.getBoundingClientRect();
      if (b.width === 0 || a.width === 0) return;
      const ov = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const ovy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ov > 4 && ovy > 4) out.push('重なり: ' + el.textContent.trim().slice(0, 12) + ' と ' + s.textContent.trim());
    });
  });
  return [...new Set(out)];
}"""


def ensure_css():
    if os.path.exists(CSS):
        return
    if not TW_CLI:
        sys.exit('tests/tw.css がありません。TW_CLI に tailwindcss の cli.js を指定して作成してください。')
    inp = os.path.join(HERE, '_in.css')
    open(inp, 'w').write('@tailwind base;\n@tailwind components;\n@tailwind utilities;\n')
    subprocess.run(['node', TW_CLI, '-i', inp, '-o', CSS, '--content', f'{ROOT}/index.html,{ROOT}/js/*.js'], check=True)
    os.remove(inp)


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def main():
    ensure_css()
    css = open(CSS, encoding='utf-8').read()
    stub = "(function(){var s=document.createElement('style');s.textContent=%s;document.head.appendChild(s);})();" % json.dumps(css)
    port = 8799
    class S(socketserver.TCPServer):
        allow_reuse_address = True
    srv = S(('127.0.0.1', port), functools.partial(Q, directory=ROOT))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    problems = {}
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1280, 'height': 900})
            pg.route('**/cdn.tailwindcss.com*', lambda r: r.fulfill(status=200, content_type='application/javascript', body=stub))
            pg.route('**/*', lambda r: r.continue_() if r.request.url.startswith(f'http://127.0.0.1:{port}') else r.abort())
            pg.goto(f'http://127.0.0.1:{port}/index.html', wait_until='load'); pg.wait_for_timeout(700)
            pg.evaluate("() => { clearInterval(autoLangInterval); clearInterval(autoPageInterval); state.autoLangCycleActive=false; }")
            for style in STYLES:
                for lang, names in DESTS.items():
                    for name in names:
                        key = f'{style}/{lang}/{name}'
                        field = {'jp': 'destinationJp', 'kana': 'destinationKana', 'en': 'destinationEn', 'zh': 'destinationZh', 'ko': 'destinationKo'}[lang]
                        pg.evaluate(f"""() => {{ selectLine('JY','yamanote_video_tokyo'); state.headerStyle='{style}';
                            state.lang='{lang}'; state['{field}']={json.dumps(name)}; renderLCD(false); }}""")
                        pg.wait_for_timeout(700)
                        res = pg.evaluate(CHECK_JS)
                        if res:
                            problems[key] = res
            b.close()
    finally:
        srv.shutdown()
    total = len(STYLES) * sum(len(v) for v in DESTS.values())
    if not problems:
        print(f'OK: {total}通りの組み合わせで、はみ出し・重なりはありません')
        return
    print(f'問題あり: {len(problems)} / {total}')
    for k, v in list(problems.items())[:20]:
        print(' ', k, '=>', '; '.join(v[:4]))
    sys.exit(1)


if __name__ == '__main__':
    main()
