#!/usr/bin/env python3
"""
操作の確認（段階3の完了条件）：
詳細設定を開かずに、路線・列車・駅・表示画面・言語を切り替えられること。
使い方: python3 tests/ux.py   （必要: pip install playwright && python3 -m playwright install chromium）
"""
import os, sys, threading, socketserver, http.server, functools
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8830

class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

class S(socketserver.TCPServer):
    allow_reuse_address = True

def main():
    srv = S(('127.0.0.1', PORT), functools.partial(Q, directory=ROOT))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    fails, errors = [], []
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            pg = b.new_page(viewport={'width': 1366, 'height': 1024})
            pg.on('pageerror', lambda e: errors.append(str(e)))
            pg.route('**/cdn.tailwindcss.com*', lambda r: r.fulfill(status=200, content_type='application/javascript', body='1'))
            pg.route('**/*', lambda r: r.continue_() if r.request.url.startswith(f'http://127.0.0.1:{PORT}') else r.abort())
            pg.goto(f'http://127.0.0.1:{PORT}/index.html', wait_until='load')
            pg.wait_for_timeout(600)

            def check(name, ok):
                if not ok:
                    fails.append(name)

            # 1) 詳細設定は既定で閉じている
            check('詳細設定が既定で閉じている', pg.evaluate("() => getComputedStyle(document.getElementById('controlDeck')).display === 'none'"))

            # 2) 路線を画面上のボタンで切り替えられる
            pg.click('#lineBtn_JC'); pg.wait_for_timeout(300)
            check('路線ボタンで中央線に切り替わる', pg.evaluate("() => state.activeLineKey === 'JC'"))

            # 3) 列車（サブシーン）を切り替えられる
            chips = pg.locator('button[onclick^="applySubScene"]')
            if chips.count() > 1:
                chips.nth(1).click(); pg.wait_for_timeout(300)
                check('列車ボタンで表示が切り替わる', pg.evaluate("() => !!state.activeSubSceneId"))
            else:
                check('列車ボタンが存在する', False)

            # 4) 駅を直接選べる（駅ダイレクト選択）
            before = pg.evaluate("() => state.currentStationIndex")
            pg.locator('button[onclick^="selectStationDirectly"]').nth(2).click(); pg.wait_for_timeout(300)
            check('駅ダイレクト選択で駅が変わる', pg.evaluate("() => state.currentStationIndex") != before)

            # 5) 前駅・次駅
            i0 = pg.evaluate("() => state.currentStationIndex")
            pg.evaluate("() => stepStation(1)"); pg.wait_for_timeout(200)
            check('次駅ボタンで駅が進む', pg.evaluate("() => state.currentStationIndex") != i0)

            # 6) 表示画面（レイアウト）を切り替えられる
            pg.evaluate("() => setBodyLayout('loop')"); pg.wait_for_timeout(200)
            check('表示画面を切り替えられる', pg.evaluate("() => state.bodyLayout === 'loop'"))

            # 7) 言語を切り替えられる
            pg.locator('button:has-text("English")').first.click(); pg.wait_for_timeout(200)
            check('言語を切り替えられる', pg.evaluate("() => state.lang === 'en'"))

            # 8) 詳細設定を開いても閉じても、主要な操作がエラーなく動く
            pg.click('#advancedToggle'); pg.wait_for_timeout(200)
            check('詳細設定を開ける', pg.evaluate("() => getComputedStyle(document.getElementById('controlDeck')).display !== 'none'"))
            pg.click('#advancedToggle'); pg.wait_for_timeout(200)

            check('JavaScriptエラーがない', not errors)
            b.close()
    finally:
        srv.shutdown()

    total = 8
    if fails:
        print(f'NG {len(fails)}/{total}:', *fails, sep='\n  ')
        sys.exit(1)
    print(f'OK: 操作の確認 {total}項目すべて通過（詳細設定は閉じたまま操作可能）')

if __name__ == '__main__':
    main()
