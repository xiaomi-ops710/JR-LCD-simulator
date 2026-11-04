// PWA：サービスワーカーの登録（公開されたページ＝https でのみ登録する）
// 検査用のローカル環境（http://127.0.0.1 など）では登録しない。
(function () {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'https:') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('サービスワーカーの登録に失敗しました:', err);
    });
  });
})();
