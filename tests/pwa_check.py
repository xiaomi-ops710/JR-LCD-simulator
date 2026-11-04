#!/usr/bin/env python3
"""
PWAの確認：
1) sw.js の APP_SHELL に書かれたファイルが、すべて存在するか
2) アプリの中身が変わったのに VERSION を上げていないと失敗する（古いキャッシュを防ぐ）
使い方:
  python3 tests/pwa_check.py            # 確認
  python3 tests/pwa_check.py --update   # 内容を記録（VERSION を上げた後に実行）
"""
import os, re, sys, json, hashlib, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REC = os.path.join(ROOT, 'tests', 'pwa_record.json')

def read(p):
    return open(os.path.join(ROOT, p), encoding='utf-8').read()

sw = read('sw.js')
version = re.search(r"const VERSION = '([^']+)'", sw).group(1)
shell = re.findall(r"'\./([^']*)'", sw.split('const APP_SHELL')[1].split('];')[0])
shell = [('index.html' if p in ('', 'index.html') else p) for p in shell]

missing = [p for p in shell if not os.path.exists(os.path.join(ROOT, p))]
# 変更を検出する対象：アプリ本体（HTML・CSS・JS・マニフェスト・アイコン）
targets = sorted(set(shell) | {os.path.relpath(f, ROOT) for f in glob.glob(os.path.join(ROOT, 'js', '*.js'))})
targets = [t for t in targets if not t.startswith('tests/') and os.path.exists(os.path.join(ROOT, t))]
digest = {t: hashlib.sha256(open(os.path.join(ROOT, t), 'rb').read()).hexdigest()[:16] for t in targets}

if '--update' in sys.argv:
    json.dump({'version': version, 'files': digest}, open(REC, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'記録しました: VERSION={version}, {len(digest)}ファイル')
    sys.exit(0)

problems = []
if missing:
    problems.append('APP_SHELL にあるが存在しないファイル: ' + ', '.join(missing))
if not os.path.exists(REC):
    problems.append('記録がありません。VERSION を上げてから `python3 tests/pwa_check.py --update` を実行してください。')
else:
    rec = json.load(open(REC, encoding='utf-8'))
    changed = [f for f in digest if rec['files'].get(f) != digest[f]]
    if changed and version == rec['version']:
        problems.append('ファイルが変わったのに VERSION が上がっていません（sw.js の VERSION を上げてください）: ' + ', '.join(changed))

if problems:
    print('NG'); [print(' -', p) for p in problems]; sys.exit(1)
print(f'OK: VERSION={version}, APP_SHELL {len(shell)}件すべて存在、変更は VERSION に反映済み')
