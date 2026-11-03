# 開発ガイド

このプロジェクトに機能を追加するときの手順と、コードの約束事をまとめます。

## 1. 全体構成

| ファイル | 役割 | 主な中身 |
|---|---|---|
| `index.html` | 画面の骨組み | マークアップ、データ属性によるイベント定義 |
| `css/style.css` | スタイル | デザイン用の色・フォント、LCDの枠 |
| `js/01-data.js` | データ | 路線カタログ、山手線・中央線の駅データ、プリセット |
| `js/02-state.js` | 状態と描画の中核 | `state`、`renderLCD`（ヘッダー・本体・フェーズ表示） |
| `js/03-views.js` | 本体レイアウトの描画 | 各レイアウト（`render〇〇View`）、路線選択 |
| `js/04-playback.js` | 列車の進行 | 自動再生、停車・接近の切替 |
| `js/05-controls.js` | 操作 | 言語・プリセット・駅編集・時計、イベント委譲 |
| `tests/snapshot.py` | 回帰テスト | 操作の結果を基準値と比較 |
| `tests/baseline.json` | 基準値 | 各操作後の描画結果のハッシュ |

### 読み込みの順番

JSは `index.html` で上から順に読み込まれ、すべて同じ（グローバルな）スコープを共有します。
そのため、**読み込み順を変えないでください**。データ（01）が最初、操作（05）が最後です。

## 2. 約束事

- **状態は `state` だけで管理する。** 描画関数は `state` を読むだけにし、変更は操作の関数（`selectLine` など）で行う。
- **イベントは HTML に直接書かない。** `data-click="関数名"` と `data-click-args='[引数]'` を使う（引数はJSON）。
  - 例：`<button data-click="setLanguage" data-click-args='["en", false]'>`
  - 委譲処理は `js/05-controls.js` 末尾にあります。
- **描画は `renderLCD` から呼ばれる形にする。** 画面の一部だけを書き換える関数は、その中で完結させる。
- **色は CSS の変数か、路線カタログの色を使う。** 新しい色をJSに直書きしない。
- **コメントは日本語で書く。** 既存の区切り線（`/* ===== */`）の形式にそろえる。
- **ビルド工具は使わない。** GitHub Pagesでそのまま動く形を保つ。

## 3. よくある追加作業

### 新しいレイアウト（本体の表示形式）を追加する

1. `index.html` に表示用のコンテナ（`<div id="viewXxx" class="hidden ...">`）を追加する。
2. `js/03-views.js` に `renderXxxView(targetStation, isEn)` を書く。
3. `js/02-state.js` の `renderBodyLayout` の中にある `views` 一覧と `layoutRenderers` に1行ずつ追加する。
   ```js
   xxx: () => renderXxxView(targetStation, mapIsEn),
   ```
4. 切替ボタンを `index.html` に追加する（`data-click="setBodyLayout" data-click-args='["xxx"]'`）。
5. テストを実行し、差異が出るのは新しいレイアウトだけであることを確認する。
6. 基準値を更新する（`python3 tests/snapshot.py --update`）。テストに新しい操作を足すと、その分も基準値に加わります。

### 新しい路線を追加する

1. `js/01-data.js` の `LINE_CATALOG` に路線を追加する（名前・サブシーン）。
2. 駅データを用意する（既存の駅データの形式にそろえる）。
3. `js/01-data.js` の `PRESETS` に、路線の初期状態を追加する。
4. `index.html` の路線ボタンに `data-click="selectLine"` を追加する。

### 新しいプリセットを追加する

1. `js/01-data.js` の `PRESETS` に1件追加する。既存のプリセットをコピーして編集するのが安全です。
2. 駅名・番号が既存の駅と同じ場合は、`docs/preset-conflicts.md` の食い違い一覧に注意する（駅の基本情報は、プリセットごとに違うと表示も変わります）。

### 新しい操作ボタン（関数）を追加する

1. 関数を `js/05-controls.js` などに書く。状態を変えたら `renderLCD()` を呼ぶ。
2. ボタンに `data-click="関数名"` を付ける（引数があれば `data-click-args`）。
3. 委譲処理は自動で対応するので、`onclick` を書く必要はありません。

## 4. テストの実行

```bash
pip install playwright
python3 -m playwright install chromium
python3 tests/snapshot.py
```

- 「OK」と表示されれば、既存の描画は変わっていません。
- 差異が出た場合は、意図した変更かを確認してください。意図した変更なら `--update` で基準値を更新します。意図しない変更なら、そのコードを直します。
- 時刻や言語の自動切替は、テストでは止めています。音声を鳴らす操作は、テストからは除外しています。

## 5. ローカルでの確認

`file://` で直接開くと、テストやスクリプトの読み込みが不安定になるため、ローカルサーバー経由で開いてください。

```bash
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

## 6. 公開について

`tests/` と `docs/` は、GitHub Pages には公開されません（デプロイ時に除外されます）。

## 7. 行先などの文字の自動縮小

行先（地名）のように長さが変わる文字には、`data-fit` 属性を付けてください。
描画の最後に、実際の幅に収まるまで文字を小さくします（最小 9px）。
「はみ出し・重なり」の確認は `python3 tests/layout.py` で行えます。

## 8. 路線とレイアウトの選択

- 路線を選ぶと、その路線の既定（プリセット）が読み込まれます（`applySubSceneCore`）。
- 利用者が選んだレイアウト（`state.pickedLayout`）とヘッダー形式（`state.pickedHeader`）は、路線を変えても保たれます（`applySubScene`）。
- 「路線の既定に戻す」（`resetLayoutPicks`）で、記録した選択を消せます。
- プリセットの読み込みで状態を作り直す箇所では、この2つを必ず引き継いでください。
