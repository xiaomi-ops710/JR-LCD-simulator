#!/usr/bin/env python3
"""
描画の回帰テスト。ブラウザで画面操作・クリックを順番に実行し、
各時点の描画結果のハッシュを集めます。

使い方:
  python3 tests/snapshot.py              # 基準値(tests/baseline.json)と比較
  python3 tests/snapshot.py --update     # 基準値を現在の状態で更新（意図した変更の後のみ）

必要: pip install playwright && python3 -m playwright install chromium
"""
import sys, os, re, json, hashlib, threading, socketserver, http.server, functools, argparse
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BASELINE = os.path.join(HERE, 'baseline.json')

# 状態を変える操作。順番どおりに実行される。
SCENARIO = [
    "selectLine('JY','yamanote_video_tokyo')",
    "setLanguage('en',false)", "setLanguage('kana',false)", "setLanguage('zh',false)", "setLanguage('ko',false)", "setLanguage('jp',false)",
    "setBodyLayout('loop')", "setBodyLayout('curve')", "setBodyLayout('curve_rtl')", "setBodyLayout('straight')",
    "setBodyLayout('platform')", "setBodyLayout('notice_info')", "setBodyLayout('sobu_rect')",
    "setBodyLayout('chuo_stopping')", "setBodyLayout('chuo_platform')", "setBodyLayout('chuo_door')",
    "setBodyLayout('chuo_transfer')", "setBodyLayout('chuo_train_info')",
    "selectLine('JC')", "selectLine('JB')", "selectLine('JE')", "selectLine('JK')",
    "selectLine('JY','yamanote_video_kanda')",
    "applySubScene('yamanote_sugamo')", "applySubScene('yamanote_otsuka')", "applySubScene('yamanote_shinokubo')",
    "selectStationDirectly(3)", "stepStation(1)", "stepStation(1)", "stepStation(-1)",
    "cycleRunningPhase()", "cycleRunningPhase()", "cycleRunningPhase()",
    "setBodyLayout('loop')", "setLanguage('en',false)", "selectStationDirectly(0)",
    "state.headerStyle='whitebox'; renderLCD(false)", "state.headerStyle='pillar'; renderLCD(false)", "state.headerStyle='polygon'; renderLCD(false)",
    "state.runningPhase='arriving'; renderLCD(false)", "state.runningPhase='stopped'; renderLCD(false)", "state.runningPhase='next'; renderLCD(false)",
    "state.lang='ko'; renderLCD(false)", "state.lang='zh'; renderLCD(false)", "state.lang='kana'; renderLCD(false)",
    "state.headerStyle='whitebox'; state.lineKey='JC'; state.lang='en'; renderLCD(false)",
    "state.headerStyle='pillar'; state.lang='jp'; renderLCD(false)",
]

# 時間で動く・音が鳴る操作は、結果が毎回変わるため除外する
SKIP_CLICKS = ['toggleVideoSequenceDemo', 'toggleAutoSimulation', 'toggleAutoPageCycle',
               'toggleAutoLangCycle', 'playAnnouncement', 'triggerEmergencyStop', 'triggerTrainInfoScreen']


def normalize(s):
    """ハンドラ属性の書き方（onclick / data-click）の違いを無視する"""
    s = re.sub(r'\s(data-(click|input|change)(-args)?)="[^"]*"', '', s)
    s = re.sub(r"\s(data-(click|input|change)-args)='[^']*'", '', s)
    s = re.sub(r'\s(on(click|input|change))="[^"]*"', '', s)
    return re.sub(r'\d\d:\d\d', 'HH:MM', s)  # 実時刻の表示を固定


def h(text):
    return hashlib.sha256(normalize(text).encode('utf-8')).hexdigest()[:16]


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def run(port):
    handler = functools.partial(Quiet, directory=ROOT)

    class S(socketserver.TCPServer):
        allow_reuse_address = True
    srv = S(('127.0.0.1', port), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    out, errors = {}, []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            pg = browser.new_page(viewport={'width': 1280, 'height': 800})
            pg.on('pageerror', lambda e: errors.append(str(e)))
            pg.route('**/*', lambda r: r.continue_() if r.request.url.startswith(f'http://127.0.0.1:{port}') else r.abort())
            pg.goto(f'http://127.0.0.1:{port}/index.html', wait_until='load', timeout=60000)
            pg.wait_for_timeout(800)
            # 言語の自動切替は時間で変わるので止める
            pg.evaluate("() => { clearInterval(autoLangInterval); clearInterval(autoPageInterval); state.autoLangCycleActive = false; }")

            def lcd():
                return pg.evaluate("() => document.getElementById('lcdScreen')?.innerHTML ?? ''")

            out['init'] = h(lcd())
            for i, step in enumerate(SCENARIO):
                try:
                    pg.evaluate(f"() => {{ {step}; }}")
                except Exception as ex:
                    errors.append(f'{step}: {str(ex)[:120]}')
                pg.wait_for_timeout(900)
                out[f'{i:02d} {step}'] = h(lcd())

            n = pg.evaluate("() => document.querySelectorAll('[onclick],[data-click]').length")
            for i in range(n):
                name = pg.evaluate('''(i) => { const el=[...document.querySelectorAll('[onclick],[data-click]')][i];
                    return (el.getAttribute('onclick')||el.dataset.click||'').split('(')[0]; }''', i)
                if name in SKIP_CLICKS:
                    continue
                pg.evaluate('(i) => [...document.querySelectorAll("[onclick],[data-click]")][i].click()', i)
                pg.wait_for_timeout(150)
                out[f'click{i:03d} {name}'] = h(pg.evaluate("() => JSON.stringify(state)") + lcd())
            browser.close()
    finally:
        srv.shutdown()
    return out, errors


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--update', action='store_true', help='基準値を現在の結果で上書きする')
    ap.add_argument('--port', type=int, default=8790)
    args = ap.parse_args()

    result, errors = run(args.port)
    if errors:
        print('JSエラー:', *errors[:5], sep='\n  ')
        sys.exit(1)

    if args.update or not os.path.exists(BASELINE):
        json.dump(result, open(BASELINE, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'基準値を保存しました: {len(result)}件')
        return

    base = json.load(open(BASELINE, encoding='utf-8'))
    diffs = [k for k in base if base.get(k) != result.get(k)]
    added = [k for k in result if k not in base]
    if not diffs and not added:
        print(f'OK: {len(result)}件すべて基準値と一致')
        return
    print(f'差異: {len(diffs)}件 / 新規: {len(added)}件')
    for k in diffs[:10]:
        print('  変更:', k)
    for k in added[:5]:
        print('  新規:', k)
    print('意図した変更なら: python3 tests/snapshot.py --update')
    sys.exit(1)


if __name__ == '__main__':
    main()
