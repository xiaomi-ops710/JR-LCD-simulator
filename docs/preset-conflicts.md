# プリセット間のデータ食い違い一覧

同じ駅（駅名＋番号が同じ）なのに、プリセットごとに値が違う項目です。どちらが正しいかを決めていただくと、1か所にまとめられます。

## 1. 駅の基本情報の食い違い（表示に影響する可能性があります）

- **東京 (01)** / `nameZh`
  - yamanote_video_tokyo, yamanote_video_kanda: "东京"
  - chuo_comm_takao: undefined
- **東京 (01)** / `nameKo`
  - yamanote_video_tokyo, yamanote_video_kanda: "도쿄"
  - chuo_comm_takao: undefined
- **東京 (01)** / `exitJp`
  - yamanote_video_tokyo, yamanote_video_kanda: "丸の内口・八重洲口・日本橋口・新幹線乗換"
  - chuo_comm_takao: "丸の内口・八重洲口・新幹線乗換"
- **東京 (01)** / `exitEn`
  - yamanote_video_tokyo, yamanote_video_kanda: "Marunouchi · Yaesu · Shinkansen Transfer"
  - chuo_comm_takao: "Marunouchi · Yaesu · Shinkansen"
- **東京 (01)** / `facilities`
  - yamanote_video_tokyo, yamanote_video_kanda: [{"car":3,"type":"escalator"},{"car":6,"type":"elevator"},{"car":9,"type":"stairs"}]
  - chuo_comm_takao: undefined
- **東京 (01)** / `transfers`
  - yamanote_video_tokyo, yamanote_video_kanda: [{"badge":"SHINKANSEN_E","badgeColor":"#008c45","textJp":"東北・山形・秋田・北海道・|上越・北陸新幹線","textEn"…
  - chuo_comm_takao: [{"badge":"SHINKANSEN_E","badgeColor":"#008c45","textJp":"東北・山形・秋田・北海道・上越・北陸新幹線","textEn":…
- **神田 (02)** / `nameZh`
  - yamanote_video_tokyo, yamanote_video_kanda: "神田"
  - chuo_comm_takao: undefined
- **神田 (02)** / `nameKo`
  - yamanote_video_tokyo, yamanote_video_kanda: "간다"
  - chuo_comm_takao: undefined
- **神田 (02)** / `facilities`
  - yamanote_video_tokyo, yamanote_video_kanda: [{"car":3,"type":"stairs"},{"car":6,"type":"elevator"},{"car":8,"type":"escalator"}]
  - chuo_comm_takao: undefined
- **神田 (02)** / `transfers`
  - yamanote_video_tokyo, yamanote_video_kanda: [{"badge":"JC","badgeColor":"#eb5c01","textJp":"中央線","textEn":"Chūō Line","fullWidth":true…
  - chuo_comm_takao: [{"badge":"JY","badgeColor":"#77c043","textJp":"山手線","textEn":"Yamanote Line"},{"badge":"J…
- **日暮里 (07)** / `exitJp`
  - yamanote_video_tokyo, yamanote_video_kanda: "北改札口・南改札口 (京成線・日暮里・舎人ライナー)"
  - yamanote_sugamo: "北改札口・南改札口 (京成線乗換)"
- **日暮里 (07)** / `exitEn`
  - yamanote_video_tokyo, yamanote_video_kanda: "North · South Gate"
  - yamanote_sugamo: "North Gate · South Gate (Keisei Line)"
- **日暮里 (07)** / `transfers`
  - yamanote_video_tokyo, yamanote_video_kanda: [{"badge":"JJ","badgeColor":"#00b261","textJp":"常磐線","textEn":"Jōban Line"},{"badge":"KS",…
  - yamanote_sugamo: [{"badge":"JJ","badgeColor":"#00b261","textJp":"常磐線・京成線","textEn":"Jōban Line / Keisei Lin…
- **日暮里 (07)** / `threeLetter`
  - yamanote_video_tokyo, yamanote_video_kanda: "NPR"
  - yamanote_sugamo: undefined
- **新宿 (05)** / `nameZh`
  - chuo_comm_takao: undefined
  - chuo_rapid: "新宿"
- **新宿 (05)** / `nameKo`
  - chuo_comm_takao: undefined
  - chuo_rapid: "신주쿠"
- **新宿 (05)** / `exitJp`
  - chuo_comm_takao: "東口・西口・南口・バスタ新宿"
  - chuo_rapid: "東口・西口・南口"
- **新宿 (05)** / `facilities`
  - chuo_comm_takao: [{"car":3,"type":"stairs","exitLabel":"東口・西口"},{"car":9,"type":"elevator","exitLabel":"南口"…
  - chuo_rapid: [{"car":3,"type":"escalator"},{"car":6,"type":"elevator"},{"car":8,"type":"stairs"}]
- **新宿 (05)** / `transfers`
  - chuo_comm_takao: [{"badge":"JY","badgeColor":"#77c043","textJp":"山手線","textEn":"Yamanote Line"},{"badge":"J…
  - chuo_rapid: [{"badge":"JY","badgeColor":"#77c043","textJp":"山手線","textEn":"Yamanote Line"},{"badge":"J…
- **新宿 (05)** / `threeLetter`
  - chuo_comm_takao: "SJK"
  - chuo_rapid: undefined
- **新大久保 (16)** / `exitJp`
  - yamanote_shinokubo: "出口 (大久保通り方面)"
  - yamanote_otsuka: "改札口 (大久保通り)"
- **新大久保 (16)** / `exitEn`
  - yamanote_shinokubo: "Exit (Ōkubo-dōri)"
  - yamanote_otsuka: "Main Exit (Ōkubo-dōri)"
- **高田馬場 (15)** / `exitEn`
  - yamanote_shinokubo: "Waseda · Toyama Exit"
  - yamanote_otsuka: "Waseda · Toyama Exit (Tozai / Seibu Line)"
- **高田馬場 (15)** / `transfers`
  - yamanote_shinokubo: [{"badge":"T","badgeShape":"circle","badgeColor":"#009bbf","textJp":"東西線・西武新宿線","textEn":"…
  - yamanote_otsuka: [{"badge":"T","badgeShape":"circle","badgeColor":"#009bbf","textJp":"東京メトロ東西線","textEn":"T…
- **目白 (14)** / `exitJp`
  - yamanote_shinokubo: "改札口 (学習院大学方面)"
  - yamanote_otsuka: "改札口 (目白通り・学習院前)"
- **目白 (14)** / `exitEn`
  - yamanote_shinokubo: "Main Exit"
  - yamanote_otsuka: "Main Exit (Mejiro-dōri)"
- **池袋 (13)** / `exitJp`
  - yamanote_shinokubo: "東口・西口・中央改札・メトロポリタン口"
  - yamanote_otsuka: "東口・西口・中央1/2改札・メトロポリタン口"
- **池袋 (13)** / `facilities`
  - yamanote_shinokubo: [{"car":2,"type":"stairs"},{"car":5,"type":"escalator"},{"car":7,"type":"elevator"},{"car"…
  - yamanote_otsuka: [{"car":2,"type":"stairs"},{"car":4,"type":"escalator"},{"car":7,"type":"elevator"},{"car"…
- **池袋 (13)** / `transfers`
  - yamanote_shinokubo: [{"badge":"JA","badgeColor":"#00ac9a","textJp":"埼京線・湘南新宿ライン","textEn":"Saikyo / Shonan-Shi…
  - yamanote_otsuka: [{"badge":"JA","badgeColor":"#00ac9a","textJp":"埼京線・湘南新宿ライン・東武・西武","textEn":"JR / Tobu / S…
- **大塚 (12)** / `transfers`
  - yamanote_shinokubo: [{"badge":"SA","badgeColor":"#ec6800","textJp":"都電荒川線","textEn":"Toden Arakawa"}]
  - yamanote_sugamo, yamanote_otsuka: [{"badge":"SA","badgeColor":"#ec6800","textJp":"都電荒川線","textEn":"Toden Arakawa Line"}]
- **巣鴨 (11)** / `exitJp`
  - yamanote_shinokubo: "正面口・都営三田線乗換"
  - yamanote_sugamo: "正面口・北口 (とげぬき地蔵・都営三田線)"
  - yamanote_otsuka: "正面口・北口 (都営三田線)"
- **巣鴨 (11)** / `exitEn`
  - yamanote_shinokubo: "Main Exit (Toei Mita Line)"
  - yamanote_sugamo, yamanote_otsuka: "Main Exit · North Exit (Toei Mita Line)"

合計 32 件

## 2. 発車時刻・停車の違い（プリセットごとに違うのが正常と思われるもの）

- 東京 (01): yamanote_video_tokyo → mins/stop/doorSide=[0,true,"this"] ／ yamanote_video_kanda → mins/stop/doorSide=[0,true,"this"] ／ chuo_comm_takao → mins/stop/doorSide=[62,true,"this"]
- 神田 (02): yamanote_video_tokyo → mins/stop/doorSide=[2,true,"this"] ／ yamanote_video_kanda → mins/stop/doorSide=[2,true,"this"] ／ chuo_comm_takao → mins/stop/doorSide=[59,true,"this"]
- 日暮里 (07): yamanote_video_tokyo → mins/stop/doorSide=[12,true,"this"] ／ yamanote_video_kanda → mins/stop/doorSide=[12,true,"this"] ／ yamanote_sugamo → mins/stop/doorSide=[10,true,"this"]
- 新宿 (05): chuo_comm_takao → mins/stop/doorSide=[46,true,"this"] ／ chuo_rapid → mins/stop/doorSide=[0,true,"this"]
- 新大久保 (16): yamanote_shinokubo → mins/stop/doorSide=[0,true,"opposite"] ／ yamanote_otsuka → mins/stop/doorSide=[11,true,"opposite"]
- 高田馬場 (15): yamanote_shinokubo → mins/stop/doorSide=[2,true,"opposite"] ／ yamanote_otsuka → mins/stop/doorSide=[9,true,"opposite"]
- 目白 (14): yamanote_shinokubo → mins/stop/doorSide=[4,true,"opposite"] ／ yamanote_otsuka → mins/stop/doorSide=[7,true,"opposite"]
- 池袋 (13): yamanote_shinokubo → mins/stop/doorSide=[6,true,"this"] ／ yamanote_otsuka → mins/stop/doorSide=[5,true,"this"]
- 大塚 (12): yamanote_shinokubo → mins/stop/doorSide=[9,true,"opposite"] ／ yamanote_sugamo → mins/stop/doorSide=[0,true,"opposite"] ／ yamanote_otsuka → mins/stop/doorSide=[2,true,"opposite"]
- 巣鴨 (11): yamanote_shinokubo → mins/stop/doorSide=[11,true,"this"] ／ yamanote_sugamo → mins/stop/doorSide=[2,true,"this"] ／ yamanote_otsuka → mins/stop/doorSide=[0,true,"this"]

合計 10 件

## 3. 路線情報の不一致

- keihin_tohoku: プリセットは「京浜東北線」、路線カタログは「京浜東北・根岸線」
