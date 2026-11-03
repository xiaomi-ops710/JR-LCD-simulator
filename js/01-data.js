// 路線・駅・プリセットのデータ
    /* ==========================================================
       1. FULL 30-STATION YAMANOTE LOOP DATA
          Supports both Outer Loop (IMG_4439 新大久保) & Inner Loop (Video 00:19 神田)
       ========================================================== */
    const YAMANOTE_LOOP_TOP = [
      { nameJp: '新大久保', nameEn: 'Shin-Ōkubo', mins: 0, innerMins: 29 },
      { nameJp: '高田馬場', nameEn: 'Takadanobaba', mins: 2, innerMins: 27 },
      { nameJp: '目白', nameEn: 'Mejiro', mins: 4, innerMins: 25 },
      { nameJp: '池袋', nameEn: 'Ikebukuro', mins: 6, innerMins: 22 },
      { nameJp: '大塚', nameEn: 'Ōtsuka', mins: 9, innerMins: 20 },
      { nameJp: '巣鴨', nameEn: 'Sugamo', mins: 11, innerMins: 18 },
      { nameJp: '駒込', nameEn: 'Komagome', mins: 13, innerMins: 16 },
      { nameJp: '田端', nameEn: 'Tabata', mins: 15, innerMins: 14 },
      { nameJp: '西日暮里', nameEn: 'Nishi-Nippori', mins: 17, innerMins: 12 },
      { nameJp: '日暮里', nameEn: 'Nippori', mins: 19, innerMins: 10 },
      { nameJp: '鶯谷', nameEn: 'Uguisudani', mins: 21, innerMins: 8 },
      { nameJp: '上野', nameEn: 'Ueno', mins: 23, innerMins: 6 },
      { nameJp: '御徒町', nameEn: 'Okachimachi', mins: 25, innerMins: 4 },
      { nameJp: '秋葉原', nameEn: 'Akihabara', mins: 27, innerMins: 2 },
      { nameJp: '神田', nameEn: 'Kanda', mins: 29, innerMins: 2 }
    ];

    const YAMANOTE_LOOP_BOTTOM = [
      { nameJp: '新宿', nameEn: 'Shinjuku' },
      { nameJp: '代々木', nameEn: 'Yoyogi' },
      { nameJp: '原宿', nameEn: 'Harajuku' },
      { nameJp: '渋谷', nameEn: 'Shibuya' },
      { nameJp: '恵比寿', nameEn: 'Ebisu' },
      { nameJp: '目黒', nameEn: 'Meguro' },
      { nameJp: '五反田', nameEn: 'Gotanda' },
      { nameJp: '大崎', nameEn: 'Ōsaki' },
      { nameJp: '品川', nameEn: 'Shinagawa' },
      { nameJp: '高輪|ゲートウェイ', nameEn: 'Takanawa Gateway' },
      { nameJp: '田町', nameEn: 'Tamachi' },
      { nameJp: '浜松町', nameEn: 'Hamamatsuchō' },
      { nameJp: '新橋', nameEn: 'Shimbashi' },
      { nameJp: '有楽町', nameEn: 'Yūrakuchō' },
      { nameJp: '東京', nameEn: 'Tōkyō' }
    ];

    /* ==========================================================
       2. CHUO LINE 6-TRAIN-TYPE STOPPING PATTERN DATA (IMG_4442.jpg)
       ========================================================== */
    const CHUO_LOWER_STATIONS = [
      { name: '東京', stops: [1, 1, 1, 1, 1, 0] },
      { name: '神田', stops: [1, 1, 1, 1, 1, 0] },
      { name: '御茶ノ水', stops: [1, 1, 1, 1, 1, 1] },
      { name: '水道橋', stops: [0, 0, 0, 0, 0, 1] },
      { name: '飯田橋', stops: [0, 0, 0, 0, 0, 1] },
      { name: '市ケ谷', stops: [0, 0, 0, 0, 0, 1] },
      { name: '四ツ谷', stops: [1, 1, 1, 1, 1, 1] },
      { name: '信濃町', stops: [0, 0, 0, 0, 0, 1] },
      { name: '千駄ケ谷', stops: [0, 0, 0, 0, 0, 1] },
      { name: '代々木', stops: [0, 0, 0, 0, 0, 1] },
      { name: '新宿', stops: [1, 1, 1, 1, 1, 1] },
      { name: '大久保', stops: [0, 0, 0, 0, 0, 1] },
      { name: '東中野', stops: [0, 0, 0, 0, 0, 1] },
      { name: '中野', stops: [0, 1, 1, 1, 1, 1] },
      { name: '高円寺', stops: [0, 0, 0, 0, 1, 1] }
    ];

    const CHUO_UPPER_STATIONS = [
      { name: '阿佐ケ谷', stops: [0, 0, 0, 0, 1, 1] },
      { name: '荻窪', stops: [0, 0, 0, 1, 1, 1] },
      { name: '西荻窪', stops: [0, 0, 0, 0, 1, 1] },
      { name: '吉祥寺', stops: [0, 0, 0, 1, 1, 1] },
      { name: '三鷹', stops: [0, 1, 1, 1, 1, 1] },
      { name: '武蔵境', stops: [0, 0, 0, 0, 1, 0] },
      { name: '東小金井', stops: [0, 0, 0, 0, 1, 0] },
      { name: '武蔵小金井', stops: [0, 0, 0, 0, 1, 0] },
      { name: '国分寺', stops: [1, 1, 1, 1, 1, 0] },
      { name: '西国分寺', stops: [0, 0, 0, 0, 1, 0] },
      { name: '国立', stops: [0, 0, 0, 0, 1, 0] },
      { name: '立川', isTachikawa: true, stops: [1, 1, 1, 1, 1, 0] },
      { name: '日野', stops: [0, 0, 1, 1, 1, 0] },
      { name: '豊田', stops: [0, 0, 1, 1, 1, 0] },
      { name: '八王子', stops: [1, 0, 1, 1, 1, 0] },
      { name: '西八王子', stops: [0, 0, 1, 1, 1, 0] },
      { name: '高尾', stops: [1, 0, 1, 1, 1, 0] }
    ];

    /* ==========================================================
       3. LINE CATALOG & SUB-SCENES (路線別データ定義)
       ========================================================== */
    const LINE_CATALOG = {
      JY: {
        name: '山手線',
        subScenes: [
          { id: 'yamanote_video_tokyo', label: '内回り 東京 TYO (動画00:00 右→左カーブ)' },
          { id: 'yamanote_video_kanda', label: '内回り 次は神田 KND (動画00:07〜00:44)' },
          { id: 'yamanote_sugamo',      label: '外回り 次は巣鴨 JY11 (実写IMG_4438 左→右カーブ)' },
          { id: 'yamanote_shinokubo',   label: '外回り 新大久保 JY16 (実写IMG_4439 環状図)' },
          { id: 'yamanote_otsuka',      label: '外回り まもなく大塚 JY12 (実写IMG_4437 停止位置)' }
        ]
      },
      JC: {
        name: '中央線快速',
        subScenes: [
          { id: 'chuo_comm_takao',     label: '通勤特快 ただいま高尾 JC24 (IMG_4442 6種別路線図)' },
          { id: 'chuo_comm_hachioji_info', label: '通勤特快 次は八王子 JC22 (IMG_4445 運行情報)' },
          { id: 'chuo_comm_hachioji_plat', label: '通勤特快 まもなく八王子 JC22 (IMG_4446 12両ホーム・乗換)' },
          { id: 'chuo_comm_hachioji_door', label: 'Commuter Special Rapid Hachiōji (IMG_4448 ドア開画面)' },
          { id: 'chuo_comm_yotsuya',   label: '通勤特快 次はよつや JC04 (IMG_4449 のりかえ専用)' },
          { id: 'chuo_rapid',          label: '中央特快 高尾ゆき (E233ポリゴン型ヘッダー)' }
        ]
      },
      JB: {
        name: '中央・総武線各駅停車',
        subScenes: [
          { id: 'sobu_akihabara',      label: '各駅停車 三鷹行 次は秋葉原 AKB JB19 (IMG_4441 完全再現)' },
          { id: 'sobu_ochanomizu',     label: '各駅停車 三鷹行 次は御茶ノ水 JB18 (のりかえ画面)' }
        ]
      },
      JE: {
        name: '京葉線',
        subScenes: [
          { id: 'keiyo_photo',         label: '各駅停車 東京ゆき 次は幕張豊砂 JE13 (実写1枚目完全再現)' }
        ]
      },
      JK: {
        name: '京浜東北・根岸線',
        subScenes: [
          { id: 'keihin_tohoku',       label: '各駅停車 大宮ゆき 品川〜神田 (E233直線バー)' }
        ]
      }
    };

    const PRESETS = {
      // Video 00:00 - 00:06: Yamanote Inner Loop Stopped at Tokyo (TYO JY01)
      yamanote_video_tokyo: {
        lineKey: 'JY',
        lineName: '山手線',
        linePrefix: 'JY',
        lineColor: '#77c043',
        headerStyle: 'pillar',
        bodyLayout: 'curve_rtl',
        loopMode: 'inner',
        totalCars: 11,
        trainTypeJp: '山手線',
        trainTypeKana: 'やまのてせん',
        trainTypeEn: 'Yamanote Line',
        trainTypeColor: '#4d8c18',
        destinationJp: '上野・池袋',
        destinationKana: 'うえの・いけぶくろ',
        destinationEn: 'Ueno&\nIkebukuro',
        destinationZh: '上野・池袋',
        destinationKo: '우에노·이케부쿠로',
        destSuffixJp: '方面',
        direction: 'rtl',
        carNumber: 11,
        doorSide: 'this',
        clockMode: 'fixed',
        manualClock: '00:00',
        currentStationIndex: 0,
        runningPhase: 'stopped',
        trainProgress: 0,
        stations: [
          {
            nameJp: '東京', nameKana: 'とうきょう', nameEn: 'Tōkyō', nameZh: '东京', nameKo: '도쿄',
            threeLetter: 'TYO', num: '01', mins: 0, stop: true, doorSide: 'this',
            exitJp: '丸の内口・八重洲口・日本橋口・新幹線乗換', exitEn: 'Marunouchi · Yaesu · Shinkansen Transfer',
            facilities: [{ car: 3, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 9, type: 'stairs' }],
            transfers: [
              { badge: 'SHINKANSEN_E', badgeColor: '#008c45', textJp: '東北・山形・秋田・北海道・|上越・北陸新幹線', textEn: 'Tohoku / Joetsu / Hokuriku Shinkansen', fullWidth: true },
              { badge: 'SHINKANSEN_W', badgeColor: '#005bac', textJp: '東海道・山陽新幹線', textEn: 'Tokaido / Sanyo Shinkansen', fullWidth: true },
              { badge: 'JC', badgeColor: '#eb5c01', textJp: '中央線', textEn: 'Chūō Line' },
              { badge: 'JT', badgeColor: '#f68b1e', textJp: '東海道線', textEn: 'Tōkaidō Line' },
              { badge: 'JU', badge2: 'JT', badgeColor: '#f68b1e', badge2Color: '#00b261', textJp: '上野東京ライン', textEn: 'Ueno-Tōkyō Line' },
              { badge: 'JO', badgeColor: '#0068b7', textJp: '横須賀線', textEn: 'Yokosuka Line' },
              { badge: 'JO', badgeColor: '#0068b7', textJp: '総武線快速', textEn: 'Sōbu Line (Rapid)' },
              { badge: 'JE', badgeColor: '#c9242b', textJp: '京葉線', textEn: 'Keiyō Line' },
              { badge: 'M', badgeShape: 'circle', badgeColor: '#f62e36', textJp: '丸ノ内線', textEn: 'Marunouchi Line' }
            ]
          },
          {
            nameJp: '神田', nameKana: 'かんだ', nameEn: 'Kanda', nameZh: '神田', nameKo: '간다',
            threeLetter: 'KND', num: '02', mins: 2, stop: true, doorSide: 'this',
            exitJp: '北口・南口・東口・西口', exitEn: 'North · South · East · West Exit',
            facilities: [{ car: 3, type: 'stairs' }, { car: 6, type: 'elevator' }, { car: 8, type: 'escalator' }],
            transfers: [
              { badge: 'JC', badgeColor: '#eb5c01', textJp: '中央線', textEn: 'Chūō Line', fullWidth: true },
              { badge: 'G', badgeShape: 'circle', badgeColor: '#ff9500', textJp: '銀座線', textEn: 'Ginza Line', fullWidth: true }
            ]
          },
          {
            nameJp: '秋葉原', nameKana: 'あきはばら', nameEn: 'Akihabara', nameZh: '秋叶原', nameKo: '아키하바라',
            threeLetter: 'AKB', num: '03', mins: 4, stop: true, doorSide: 'this',
            exitJp: '電気街口・中央改札口・昭和通り口', exitEn: 'Electric Town · Central · Shōwa-dōri Exit',
            facilities: [{ car: 4, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 8, type: 'stairs' }],
            transfers: [
              { badge: 'JB', badgeColor: '#ffd400', textJp: '総武線各駅停車', textEn: 'Sōbu Line (Local)' },
              { badge: 'TX', badgeColor: '#002b80', textJp: 'つくばエクスプレス', textEn: 'Tsukuba Express' },
              { badge: 'H', badgeShape: 'circle', badgeColor: '#b5b5ac', textJp: '日比谷線', textEn: 'Hibiya Line' }
            ]
          },
          {
            nameJp: '御徒町', nameKana: 'おかちまち', nameEn: 'Okachimachi', nameZh: '御徒町', nameKo: '오카치마치',
            num: '04', mins: 6, stop: true, doorSide: 'this',
            exitJp: '北口・南口 (アメ横方面)', exitEn: 'North · South Exit',
            facilities: [{ car: 3, type: 'stairs' }, { car: 7, type: 'elevator' }],
            transfers: [{ badge: 'E', badgeShape: 'circle', badgeColor: '#ce0058', textJp: '都営大江戸線', textEn: 'Toei Ōedo Line' }]
          },
          {
            nameJp: '上野', nameKana: 'うえの', nameEn: 'Ueno', nameZh: '上野', nameKo: '우에노',
            threeLetter: 'UEN', num: '05', mins: 8, stop: true, doorSide: 'this',
            exitJp: '中央改札・公園口・不忍口・新幹線乗換', exitEn: 'Central · Park · Shinobazu Exit',
            facilities: [{ car: 2, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 8, type: 'stairs' }],
            transfers: [
              { badge: 'SHINKANSEN_E', badgeColor: '#008c45', textJp: '東北・山形・秋田・北海道・|上越・北陸新幹線', textEn: 'Tohoku / Joetsu / Hokuriku Shinkansen', fullWidth: true },
              { badge: 'JK', badgeColor: '#00a7e3', textJp: '京浜東北線', textEn: 'Keihin-Tōhoku Line' },
              { badge: 'JJ', badgeColor: '#00b261', textJp: '常磐線', textEn: 'Jōban Line' },
              { badge: 'JU', badgeColor: '#f68b1e', textJp: '宇都宮・高崎線', textEn: 'Utsunomiya / Takasaki Line' },
              { badge: 'G', badgeShape: 'circle', badgeColor: '#ff9500', textJp: '銀座線', textEn: 'Ginza Line' },
              { badge: 'H', badgeShape: 'circle', badgeColor: '#b5b5ac', textJp: '日比谷線', textEn: 'Hibiya Line' }
            ]
          },
          {
            nameJp: '鶯谷', nameKana: 'うぐいすだに', nameEn: 'Uguisudani', nameZh: '莺谷', nameKo: '우구이스다니',
            num: '06', mins: 10, stop: true, doorSide: 'this',
            exitJp: '北口・南口', exitEn: 'North · South Exit',
            facilities: [{ car: 2, type: 'stairs' }, { car: 7, type: 'elevator' }],
            transfers: []
          },
          {
            nameJp: '日暮里', nameKana: 'にっぽり', nameEn: 'Nippori', nameZh: '日暮里', nameKo: '닛포리',
            threeLetter: 'NPR', num: '07', mins: 12, stop: true, doorSide: 'this',
            exitJp: '北改札口・南改札口 (京成線・日暮里・舎人ライナー)', exitEn: 'North · South Gate',
            facilities: [{ car: 2, type: 'stairs' }, { car: 5, type: 'elevator' }, { car: 8, type: 'escalator' }],
            transfers: [
              { badge: 'JJ', badgeColor: '#00b261', textJp: '常磐線', textEn: 'Jōban Line' },
              { badge: 'KS', badgeColor: '#005aaa', textJp: '京成線', textEn: 'Keisei Line' },
              { badge: 'NT', badgeColor: '#ff6699', textJp: '日暮里・舎人ライナー', textEn: 'Nippori-Toneri Liner' }
            ]
          }
        ]
      },

      // Video 00:07 - 00:44: Yamanote Inner Loop Next Kanda (KND JY02)
      yamanote_video_kanda: {
        lineKey: 'JY',
        lineName: '山手線',
        linePrefix: 'JY',
        lineColor: '#77c043',
        headerStyle: 'pillar',
        bodyLayout: 'curve_rtl',
        loopMode: 'inner',
        totalCars: 11,
        trainTypeJp: '山手線',
        trainTypeKana: 'やまのてせん',
        trainTypeEn: 'Yamanote Line',
        trainTypeColor: '#4d8c18',
        destinationJp: '上野・池袋',
        destinationKana: 'うえの・いけぶくろ',
        destinationEn: 'Ueno&\nIkebukuro',
        destinationZh: '上野・池袋',
        destinationKo: '우에노·이케부쿠로',
        destSuffixJp: '方面',
        direction: 'rtl',
        carNumber: 11,
        doorSide: 'this',
        clockMode: 'fixed',
        manualClock: '00:00',
        currentStationIndex: 0,
        runningPhase: 'next',
        trainProgress: 18,
        stations: [] // Populated from yamanote_video_tokyo on init
      },

      // IMG_4441.jpg: Chuo-Sobu Line Local for Mitaka (Next AKB JB 19 Akihabara)
      sobu_akihabara: {
        lineKey: 'JB',
        lineName: '中央・総武線各駅停車',
        linePrefix: 'JB',
        lineColor: '#ffd400',
        headerStyle: 'whitebox',
        bodyLayout: 'sobu_rect',
        totalCars: 10,
        trainTypeJp: '各駅停車',
        trainTypeKana: 'かくえきていしゃ',
        trainTypeEn: 'Local',
        trainTypeZh: '各站停车',
        trainTypeKo: '각역정차',
        trainTypeOutline: 'yellow',
        trainTypeColor: '#ffe600',
        destinationJp: '三鷹',
        destinationKana: 'みたか',
        destinationEn: 'Mitaka',
        destinationZh: '三鹰',
        destinationKo: '미타카',
        destSuffixJp: '行',
        direction: 'ltr',
        carNumber: 10,
        doorSide: 'this',
        clockMode: 'fixed',
        manualClock: '0:09',
        showClockLabelInWb: true,
        currentStationIndex: 0,
        runningPhase: 'next',
        trainProgress: 20,
        stations: [
          {
            nameJp: '浅草橋', nameKana: 'あさくさばし', nameEn: 'Asakusabashi', num: '20', mins: 0, stop: true, doorSide: 'this',
            exitJp: '東口・西口', exitEn: 'East · West Exit',
            transfers: [{ badge: 'A', badgeShape: 'circle', badgeColor: '#e85298', textJp: '都営浅草線', textEn: 'Toei Asakusa Line' }]
          },
          {
            nameJp: '秋葉原', nameKana: 'あきはばら', nameEn: 'Akihabara', threeLetter: 'AKB', num: '19', mins: 2, stop: true, doorSide: 'this',
            exitJp: '電気街口・中央改札・昭和通り口', exitEn: 'Electric Town · Central · Shōwa-dōri Exit',
            facilities: [{ car: 3, type: 'stairs' }, { car: 6, type: 'elevator' }, { car: 8, type: 'escalator' }],
            transfers: [
              { badge: 'JY', badgeColor: '#77c043', textJp: '山手線', textEn: 'Yamanote Line' },
              { badge: 'JK', badgeColor: '#00a7e3', textJp: '京浜東北線', textEn: 'Keihin-Tōhoku Line' },
              { badge: 'TX', badgeColor: '#1d2088', textJp: 'つくば|エクスプレス線', textEn: 'Tsukuba Express' },
              { badge: 'H', badgeShape: 'circle', badgeColor: '#b5b5ac', textJp: '日比谷線', textEn: 'Hibiya Line' }
            ]
          },
          {
            nameJp: '御茶ノ水', nameKana: 'おちゃのみず', nameEn: 'Ochanomizu', num: '18', mins: 4, stop: true, doorSide: 'opposite',
            exitJp: '御茶ノ水橋口・聖橋口', exitEn: 'Ochanomizubashi · Hijiribashi Exit',
            transfers: [
              { badge: 'JC', badgeColor: '#eb5c01', textJp: '中央線', textEn: 'Chūō Line' },
              { badge: 'M', badgeShape: 'circle', badgeColor: '#f62e36', textJp: '丸ノ内線', textEn: 'Marunouchi Line' },
              { badge: 'C', badgeShape: 'circle', badgeColor: '#00bb85', textJp: '千代田線', textEn: 'Chiyoda Line' }
            ]
          },
          {
            nameJp: '水道橋', nameKana: 'すいどうばし', nameEn: 'Suidōbashi', num: '17', mins: 6, stop: true, doorSide: 'this',
            exitJp: '東口・西口 (東京ドーム方面)', exitEn: 'East · West Exit (Tokyo Dome)',
            transfers: [{ badge: 'I', badgeShape: 'circle', badgeColor: '#006cb6', textJp: '都営三田線', textEn: 'Toei Mita Line' }]
          },
          {
            nameJp: '飯田橋', nameKana: 'いいだばし', nameEn: 'Iidabashi', num: '16', mins: 8, stop: true, doorSide: 'this',
            exitJp: '東口・西口', exitEn: 'East · West Exit',
            transfers: [
              { badge: 'T', badgeShape: 'circle', badgeColor: '#009bbf', textJp: '東西線', textEn: 'Tōzai Line' },
              { badge: 'Y', badgeShape: 'circle', badgeColor: '#c1a470', textJp: '有楽町線', textEn: 'Yūrakuchō Line' },
              { badge: 'N', badgeShape: 'circle', badgeColor: '#00ac9b', textJp: '南北線', textEn: 'Namboku Line' },
              { badge: 'E', badgeShape: 'circle', badgeColor: '#ce0058', textJp: '都営大江戸線', textEn: 'Toei Ōedo Line' }
            ]
          },
          {
            nameJp: '市ケ谷', nameKana: 'いちがや', nameEn: 'Ichigaya', num: '15', mins: 10, stop: true, doorSide: 'this',
            exitJp: '改札口', exitEn: 'Exit',
            transfers: [
              { badge: 'Y', badgeShape: 'circle', badgeColor: '#c1a470', textJp: '有楽町線', textEn: 'Yūrakuchō Line' },
              { badge: 'N', badgeShape: 'circle', badgeColor: '#00ac9b', textJp: '南北線', textEn: 'Namboku Line' },
              { badge: 'S', badgeShape: 'circle', badgeColor: '#b0bf1e', textJp: '都営新宿線', textEn: 'Toei Shinjuku Line' }
            ]
          },
          {
            nameJp: '四ツ谷', nameKana: 'よつや', nameEn: 'Yotsuya', num: '14', mins: 12, stop: true, doorSide: 'this',
            exitJp: '赤坂口・四ツ谷口', exitEn: 'Akasaka · Yotsuya Exit',
            transfers: [
              { badge: 'JC', badgeColor: '#eb5c01', textJp: '中央線(快速)', textEn: 'Chūō Line (Rapid)' },
              { badge: 'M', badgeShape: 'circle', badgeColor: '#f62e36', textJp: '丸ノ内線', textEn: 'Marunouchi Line' },
              { badge: 'N', badgeShape: 'circle', badgeColor: '#00ac9b', textJp: '南北線', textEn: 'Namboku Line' }
            ]
          },
          {
            nameJp: '信濃町', nameKana: 'しなのまち', nameEn: 'Shinanomachi', num: '13', mins: 14, stop: true, doorSide: 'this',
            exitJp: '改札口 (明治神宮外苑方面)', exitEn: 'Main Exit',
            transfers: []
          },
          {
            nameJp: '千駄ケ谷', nameKana: 'せんだがや', nameEn: 'Sendagaya', num: '12', mins: 16, stop: true, doorSide: 'this',
            exitJp: '改札口 (国立競技場・東京体育館方面)', exitEn: 'Main Exit (National Stadium)',
            transfers: [
              { badge: 'E', badgeShape: 'circle', badgeColor: '#ce0058', textJp: '都営大江戸線', textEn: 'Toei Ōedo Line' }
            ]
          },
          {
            nameJp: '代々木', nameKana: 'よよぎ', nameEn: 'Yoyogi', num: '11', mins: 18, stop: true, doorSide: 'this',
            exitJp: '西口・東口・北口', exitEn: 'West · East · North Exit',
            transfers: [
              { badge: 'JY', badgeColor: '#77c043', textJp: '山手線', textEn: 'Yamanote Line' },
              { badge: 'E', badgeShape: 'circle', badgeColor: '#ce0058', textJp: '都営大江戸線', textEn: 'Toei Ōedo Line' }
            ]
          },
          {
            nameJp: '新宿', nameKana: 'しんじゅく', nameEn: 'Shinjuku', threeLetter: 'SJK', num: '10', mins: 20, stop: true, doorSide: 'this',
            exitJp: '東口・西口・南口・バスタ新宿', exitEn: 'East · West · South Exit',
            transfers: [
              { badge: 'JY', badgeColor: '#77c043', textJp: '山手線', textEn: 'Yamanote Line' },
              { badge: 'JC', badgeColor: '#eb5c01', textJp: '中央線(快速)', textEn: 'Chūō Line (Rapid)' },
              { badge: 'JA', badgeColor: '#00ac9a', textJp: '埼京線・湘南新宿ライン', textEn: 'Saikyō / Shōnan-Shinjuku Line' },
              { badge: 'M', badgeShape: 'circle', badgeColor: '#f62e36', textJp: '丸ノ内線', textEn: 'Marunouchi Line' },
              { badge: 'S', badgeShape: 'circle', badgeColor: '#b0bf1e', textJp: '都営新宿線', textEn: 'Toei Shinjuku Line' },
              { badge: 'E', badgeShape: 'circle', badgeColor: '#ce0058', textJp: '都営大江戸線', textEn: 'Toei Ōedo Line' }
            ]
          }
        ]
      },

      // IMG_4442 - IMG_4449: Chuo Line Commuter Special Rapid for Tokyo (12 Cars with Green Cars 4 & 5)
      chuo_comm_takao: {
        lineKey: 'JC',
        lineName: '中央線快速',
        linePrefix: 'JC',
        lineColor: '#e85513',
        headerStyle: 'whitebox',
        bodyLayout: 'chuo_stopping',
        totalCars: 12,
        trainTypeJp: '通勤特快',
        trainTypeKana: 'つうきんとっかい',
        trainTypeEn: 'Commuter\nSpecial Rapid',
        trainTypeZh: '通勤特快',
        trainTypeKo: '통근특쾌',
        trainTypeOutline: 'red',
        trainTypeColor: '#dc1414',
        destinationJp: '東京',
        destinationKana: 'とうきょう',
        destinationEn: 'Tōkyō',
        destinationZh: '东京',
        destinationKo: '도쿄',
        destSuffixJp: '行',
        direction: 'ltr',
        carNumber: 10,
        doorSide: 'this',
        clockMode: 'fixed',
        manualClock: '8:36',
        showClockLabelInWb: false,
        currentStationIndex: 0,
        runningPhase: 'stopped',
        trainProgress: 0,
        stations: [
          {
            nameJp: '高尾', nameKana: 'たかお', nameEn: 'Takao', num: '24', mins: 0, stop: true, doorSide: 'this',
            exitJp: '北口・南口 (京王高尾線乗換)', exitEn: 'North · South Exit',
            facilities: [{ car: 3, type: 'stairs' }, { car: 9, type: 'elevator' }],
            transfers: [{ badge: 'KO', badgeColor: '#dd0077', textJp: '京王高尾線', textEn: 'Keiō Takao Line' }]
          },
          {
            nameJp: '八王子', nameKana: 'はちおうじ', nameEn: 'Hachiōji', num: '22', mins: 7, stop: true, doorSide: 'this',
            exitJp: '北口・南口', exitEn: 'North Exit · South Exit',
            facilities: [{ car: 3, type: 'stairs', exitLabel: '北口' }, { car: 10, type: 'elevator', exitLabel: '南口' }, { car: 10, type: 'stairs' }],
            transfers: [
              { badge: 'JH', badgeColor: '#77c043', textJp: '横浜線', textEn: 'Yokohama Line' },
              { badge: 'SOLID_GREY', badgeColor: '#7d7d7d', textJp: '八高線', textEn: 'Hachikō Line' }
            ]
          },
          {
            nameJp: '立川', nameKana: 'たちかわ', nameEn: 'Tachikawa', num: '19', mins: 17, stop: true, doorSide: 'this',
            exitJp: '北口・南口 (グランデュオ・エキュート)', exitEn: 'North · South Exit',
            facilities: [{ car: 4, type: 'stairs', exitLabel: '北口' }, { car: 9, type: 'elevator', exitLabel: '南口' }],
            transfers: [
              { badge: 'JC', badgeColor: '#eb5c01', textJp: '青梅線・五日市線', textEn: 'Ōme / Itsukaichi Line' },
              { badge: 'JN', badgeColor: '#ffd400', textJp: '南武線', textEn: 'Nambu Line' }
            ]
          },
          {
            nameJp: '国分寺', nameKana: 'こくぶんじ', nameEn: 'Kokubunji', num: '16', mins: 24, stop: true, doorSide: 'this',
            exitJp: '北口・南口', exitEn: 'North · South Exit',
            facilities: [{ car: 5, type: 'stairs', exitLabel: '北口' }, { car: 8, type: 'elevator', exitLabel: '南口' }],
            transfers: [{ badge: 'SK', badgeColor: '#0068b7', textJp: '西武国分寺線・多摩湖線', textEn: 'Seibu Lines' }]
          },
          {
            nameJp: '新宿', nameKana: 'しんじゅく', nameEn: 'Shinjuku', threeLetter: 'SJK', num: '05', mins: 46, stop: true, doorSide: 'this',
            exitJp: '東口・西口・南口・バスタ新宿', exitEn: 'East · West · South Exit',
            facilities: [{ car: 3, type: 'stairs', exitLabel: '東口・西口' }, { car: 9, type: 'elevator', exitLabel: '南口' }],
            transfers: [
              { badge: 'JY', badgeColor: '#77c043', textJp: '山手線', textEn: 'Yamanote Line' },
              { badge: 'JB', badgeColor: '#ffd400', textJp: '中央・総武線各駅停車', textEn: 'Chūō-Sōbu Line (Local)' },
              { badge: 'JA', badgeColor: '#00ac9a', textJp: '埼京線', textEn: 'Saikyō Line' },
              { badge: 'JS', badgeColor: '#e21f26', textJp: '湘南新宿ライン', textEn: 'Shōnan-Shinjuku Line' },
              { badge: 'OH', badgeColor: '#0080cc', textJp: '小田急線', textEn: 'Odakyū Line' },
              { badge: 'KO', badgeColor: '#dd0077', textJp: '京王線', textEn: 'Keiō Line' },
              { badge: 'M', badgeShape: 'circle', badgeColor: '#f62e36', textJp: '丸ノ内線', textEn: 'Marunouchi Line' },
              { badge: 'S', badgeShape: 'circle', badgeColor: '#b0bf1e', textJp: '都営新宿線', textEn: 'Toei Shinjuku Line' },
              { badge: 'E', badgeShape: 'circle', badgeColor: '#ce0058', textJp: '都営大江戸線', textEn: 'Toei Ōedo Line' }
            ]
          },
          {
            nameJp: '四ツ谷', nameKana: 'よつや', nameEn: 'Yotsuya', num: '04', mins: 51, stop: true, doorSide: 'this',
            exitJp: '赤坂口・四ツ谷口', exitEn: 'Akasaka · Yotsuya Exit',
            facilities: [{ car: 3, type: 'stairs', exitLabel: '赤坂口' }, { car: 9, type: 'elevator', exitLabel: '四ツ谷口' }],
            transfers: [
              { badge: 'JB', badgeColor: '#ffd400', textJp: '中央線各駅停車', textEn: 'Chūō Line ( Local )' },
              { badge: 'M', badgeShape: 'circle', badgeColor: '#f62e36', textJp: '丸ノ内線', textEn: 'Marunouchi Line' },
              { badge: 'N', badgeShape: 'circle', badgeColor: '#00ac9b', textJp: '南北線', textEn: 'Namboku Line' }
            ]
          },
          {
            nameJp: '御茶ノ水', nameKana: 'おちゃのみず', nameEn: 'Ochanomizu', num: '03', mins: 56, stop: true, doorSide: 'this',
            exitJp: '御茶ノ水橋口・聖橋口', exitEn: 'Ochanomizubashi · Hijiribashi Exit',
            transfers: [
              { badge: 'JB', badgeColor: '#ffd400', textJp: '中央線各駅停車', textEn: 'Chūō Line ( Local )' },
              { badge: 'M', badgeShape: 'circle', badgeColor: '#f62e36', textJp: '丸ノ内線', textEn: 'Marunouchi Line' },
              { badge: 'C', badgeShape: 'circle', badgeColor: '#00bb85', textJp: '千代田線', textEn: 'Chiyoda Line' }
            ]
          },
          {
            nameJp: '神田', nameKana: 'かんだ', nameEn: 'Kanda', threeLetter: 'KND', num: '02', mins: 59, stop: true, doorSide: 'this',
            exitJp: '北口・南口・東口・西口', exitEn: 'North · South · East · West Exit',
            transfers: [
              { badge: 'JY', badgeColor: '#77c043', textJp: '山手線', textEn: 'Yamanote Line' },
              { badge: 'JK', badgeColor: '#00a7e3', textJp: '京浜東北線', textEn: 'Keihin-Tōhoku Line' },
              { badge: 'G', badgeShape: 'circle', badgeColor: '#ff9500', textJp: '銀座線', textEn: 'Ginza Line' }
            ]
          },
          {
            nameJp: '東京', nameKana: 'とうきょう', nameEn: 'Tōkyō', threeLetter: 'TYO', num: '01', mins: 62, stop: true, doorSide: 'this',
            exitJp: '丸の内口・八重洲口・新幹線乗換', exitEn: 'Marunouchi · Yaesu · Shinkansen',
            transfers: [
              { badge: 'SHINKANSEN_E', badgeColor: '#008c45', textJp: '東北・山形・秋田・北海道・上越・北陸新幹線', textEn: 'Tohoku / Joetsu / Hokuriku Shinkansen' },
              { badge: 'SHINKANSEN_W', badgeColor: '#005bac', textJp: '東海道・山陽新幹線', textEn: 'Tokaido / Sanyo Shinkansen' },
              { badge: 'JY', badgeColor: '#77c043', textJp: '山手線', textEn: 'Yamanote Line' },
              { badge: 'JK', badgeColor: '#00a7e3', textJp: '京浜東北線', textEn: 'Keihin-Tōhoku Line' },
              { badge: 'JT', badgeColor: '#f68b1e', textJp: '東海道線・上野東京ライン', textEn: 'Tōkaidō / Ueno-Tōkyō Line' },
              { badge: 'JO', badgeColor: '#0068b7', textJp: '横須賀・総武快速線', textEn: 'Yokosuka / Sōbu Line (Rapid)' },
              { badge: 'JE', badgeColor: '#c9242b', textJp: '京葉線', textEn: 'Keiyō Line' },
              { badge: 'M', badgeShape: 'circle', badgeColor: '#f62e36', textJp: '丸ノ内線', textEn: 'Marunouchi Line' }
            ]
          }
        ]
      },

      // Photo 1: Keiyo Line (各駅停車 東京ゆき 次は JE13 幕張豊砂)
      keiyo_photo: {
        lineName: '京葉線',
        linePrefix: 'JE',
        lineColor: '#9b1d20',
        headerStyle: 'polygon',
        bodyLayout: 'straight',
        totalCars: 10,
        trainTypeJp: '各駅停車',
        trainTypeKana: 'かくえきていしゃ',
        trainTypeEn: 'Local',
        trainTypeZh: '各站停车',
        trainTypeKo: '각역정차',
        trainTypeColor: '#0871a4',
        destinationJp: '東京',
        destinationKana: 'とうきょう',
        destinationEn: 'Tōkyō',
        destinationZh: '东京',
        destinationKo: '도쿄',
        destSuffixJp: 'ゆき',
        direction: 'rtl',
        carNumber: 1,
        doorSide: 'this',
        clockMode: 'fixed',
        manualClock: '14:06',
        currentStationIndex: 0,
        runningPhase: 'next',
        trainProgress: 18,
        stations: [
          { nameJp: '海浜幕張', nameKana: 'かいひんまくはり', nameEn: 'Kaihimmakuhari', nameZh: '海滨幕张', nameKo: '가이힌마쿠하리', num: '14', mins: 0, stop: true, doorSide: 'this', exitJp: '北口・南口 (幕張メッセ方面)', exitEn: 'North · South Exit (Makuhari Messe)', facilities: [{ car: 4, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 7, type: 'stairs' }], transfers: [] },
          { nameJp: '幕張豊砂', nameKana: 'まくはりとよすな', nameEn: 'Makuharitoyosuna', nameZh: '幕张丰砂', nameKo: '마쿠하리토요스나', num: '13', mins: 2, stop: true, doorSide: 'this', exitJp: '改札口 (イオンモール幕張新都心方面)', exitEn: 'Exit (AEON MALL Makuhari New City)', facilities: [{ car: 5, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 8, type: 'stairs' }], transfers: [] },
          { nameJp: '新習志野', nameKana: 'しんならしの', nameEn: 'Shin-Narashino', nameZh: '新习志野', nameKo: '신나라시노', num: '12', mins: 5, stop: true, doorSide: 'this', exitJp: '北口・南口', exitEn: 'North Exit · South Exit', facilities: [{ car: 4, type: 'stairs' }, { car: 5, type: 'elevator' }], transfers: [] },
          { nameJp: '南船橋', nameKana: 'みなみふなばし', nameEn: 'Minami-Funabashi', nameZh: '南船桥', nameKo: '미나미후나바시', num: '11', mins: 8, stop: true, doorSide: 'this', exitJp: '北口・南口 (ららぽーと・ららアリーナ方面)', exitEn: 'North · South Exit (LaLaport)', facilities: [{ car: 3, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 7, type: 'stairs' }], transfers: [{ badge: 'JM', badgeColor: '#e05316', textJp: '武蔵野線', textEn: 'Musashino Line' }] },
          { nameJp: '二俣新町', nameKana: 'ふたまたしんまち', nameEn: 'Futamatashimmachi', nameZh: '二俣新町', nameKo: '후타마타신마치', num: '10', mins: 12, stop: true, doorSide: 'opposite', exitJp: '改札口', exitEn: 'Main Exit', facilities: [{ car: 5, type: 'stairs' }, { car: 6, type: 'elevator' }], transfers: [] },
          { nameJp: '市川塩浜', nameKana: 'いちかわしおはま', nameEn: 'Ichikawashiohama', nameZh: '市川盐滨', nameKo: '이치카와시오하마', num: '09', mins: 16, stop: true, doorSide: 'this', exitJp: '改札口', exitEn: 'Main Exit', facilities: [{ car: 4, type: 'stairs' }, { car: 6, type: 'elevator' }], transfers: [{ badge: 'JM', badgeColor: '#e05316', textJp: '武蔵野線', textEn: 'Musashino Line' }] },
          { nameJp: '新浦安', nameKana: 'しんうらやす', nameEn: 'Shin-Urayasu', nameZh: '新浦安', nameKo: '신우라야스', num: '08', mins: 19, stop: true, doorSide: 'this', exitJp: '北口・南口 (アトレ新浦安)', exitEn: 'North · South Exit', facilities: [{ car: 3, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 7, type: 'stairs' }], transfers: [] },
          { nameJp: '舞浜', nameKana: 'まいはま', nameEn: 'Maihama', nameZh: '舞滨', nameKo: '마이하마', num: '07', mins: 23, stop: true, doorSide: 'opposite', exitJp: '南口 (東京ディズニーリゾート・イクスピアリ)', exitEn: 'South Exit (Tokyo Disney Resort)', facilities: [{ car: 3, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 8, type: 'stairs' }], transfers: [{ badge: 'RAIL', textJp: 'ディズニー|リゾートライン', textEn: 'Disney Resort Line' }] },
          { nameJp: '葛西臨海公園', nameKana: 'かさいりんかいこうえん', nameEn: 'Kasai-Rinkai Park', nameZh: '葛西临海公园', nameKo: '가사이린카이공원', num: '06', mins: 26, stop: true, doorSide: 'opposite', exitJp: '改札口 (水族園・観覧車方面)', exitEn: 'Park Exit (Aquarium)', facilities: [{ car: 5, type: 'escalator' }, { car: 6, type: 'elevator' }], transfers: [] },
          { nameJp: '新木場', nameKana: 'しんきば', nameEn: 'Shin-Kiba', nameZh: '新木场', nameKo: '신키바', num: '05', mins: 30, stop: true, doorSide: 'opposite', exitJp: '改札口 (りんかい線・有楽町線乗換)', exitEn: 'Transfer Gate (Rinkai / Yurakucho Line)', facilities: [{ car: 3, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 7, type: 'stairs' }], transfers: [{ badge: 'RAIL', textJp: 'りんかい線|有楽町線', textEn: 'Rinkai / Yurakucho' }] }
        ]
      },

      // Photo 2: IMG_4439.jpeg (Yamanote Loop - ただいま JY16 新大久保 15:00 3号車)
      yamanote_shinokubo: {
        lineKey: 'JY',
        lineName: '山手線',
        linePrefix: 'JY',
        lineColor: '#77c043',
        headerStyle: 'pillar',
        bodyLayout: 'loop',
        loopMode: 'outer',
        totalCars: 11,
        trainTypeJp: '山手線',
        trainTypeKana: 'やまのてせん',
        trainTypeEn: 'Yamanote Line',
        trainTypeZh: '山手线',
        trainTypeKo: '야마노테선',
        trainTypeColor: '#4d8c18',
        destinationJp: '池袋・上野',
        destinationKana: 'いけぶくろ・うえの',
        destinationEn: 'Ikebukuro&\nUeno',
        destinationZh: '池袋・上野',
        destinationKo: '이케부쿠로·우에노',
        destSuffixJp: '方面',
        direction: 'ltr',
        carNumber: 3,
        doorSide: 'this',
        clockMode: 'fixed',
        manualClock: '15:00',
        currentStationIndex: 0,
        runningPhase: 'stopped',
        trainProgress: 0,
        stations: [
          { nameJp: '新大久保', nameKana: 'しんおおくぼ', nameEn: 'Shin-Ōkubo', nameZh: '新大久保', nameKo: '신오쿠보', num: '16', mins: 0, stop: true, doorSide: 'opposite', exitJp: '出口 (大久保通り方面)', exitEn: 'Exit (Ōkubo-dōri)', facilities: [{ car: 2, type: 'stairs' }, { car: 3, type: 'elevator' }, { car: 4, type: 'escalator' }], transfers: [] },
          { nameJp: '高田馬場', nameKana: 'たかだのばば', nameEn: 'Takadanobaba', nameZh: '高田马场', nameKo: '다카다노바바', num: '15', mins: 2, stop: true, doorSide: 'opposite', exitJp: '早稲田口・戸山口 (東西線・西武新宿線)', exitEn: 'Waseda · Toyama Exit', facilities: [{ car: 3, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 9, type: 'stairs' }], transfers: [{ badge: 'T', badgeShape: 'circle', badgeColor: '#009bbf', textJp: '東西線・西武新宿線', textEn: 'Tozai / Seibu Line' }] },
          { nameJp: '目白', nameKana: 'めじろ', nameEn: 'Mejiro', nameZh: '目白', nameKo: '메지로', num: '14', mins: 4, stop: true, doorSide: 'opposite', exitJp: '改札口 (学習院大学方面)', exitEn: 'Main Exit', facilities: [{ car: 2, type: 'stairs' }, { car: 3, type: 'escalator' }, { car: 4, type: 'elevator' }], transfers: [] },
          { nameJp: '池袋', nameKana: 'いけぶくろ', nameEn: 'Ikebukuro', nameZh: '池袋', nameKo: '이케부쿠로', num: '13', mins: 6, stop: true, doorSide: 'this', exitJp: '東口・西口・中央改札・メトロポリタン口', exitEn: 'East · West · Central · Metropolitan Exit', facilities: [{ car: 2, type: 'stairs' }, { car: 5, type: 'escalator' }, { car: 7, type: 'elevator' }, { car: 10, type: 'stairs' }], transfers: [{ badge: 'JA', badgeColor: '#00ac9a', textJp: '埼京線・湘南新宿ライン', textEn: 'Saikyo / Shonan-Shinjuku' }] },
          { nameJp: '大塚', nameKana: 'おおつか', nameEn: 'Ōtsuka', nameZh: '大塚', nameKo: '오쓰카', num: '12', mins: 9, stop: true, doorSide: 'opposite', exitJp: '北口・南口', exitEn: 'North Exit · South Exit', facilities: [{ car: 3, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 6, type: 'stairs' }], transfers: [{ badge: 'SA', badgeColor: '#ec6800', textJp: '都電荒川線', textEn: 'Toden Arakawa' }] },
          { nameJp: '巣鴨', nameKana: 'すがも', nameEn: 'Sugamo', nameZh: '巢鸭', nameKo: '스가모', num: '11', mins: 11, stop: true, doorSide: 'this', exitJp: '正面口・都営三田線乗換', exitEn: 'Main Exit (Toei Mita Line)', facilities: [{ car: 3, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 8, type: 'stairs' }], transfers: [{ badge: 'I', badgeShape: 'circle', badgeColor: '#006cb6', textJp: '都営三田線', textEn: 'Toei Mita Line' }] }
        ]
      },

      // Photo 3: IMG_4438_2.jpeg (Yamanote Curve - Next JY11 Sugamo 21:08 Car No. 5)
      yamanote_sugamo: {
        lineKey: 'JY',
        lineName: '山手線',
        linePrefix: 'JY',
        lineColor: '#77c043',
        headerStyle: 'pillar',
        bodyLayout: 'curve',
        loopMode: 'outer',
        totalCars: 11,
        trainTypeJp: '山手線',
        trainTypeKana: 'やまのてせん',
        trainTypeEn: 'Yamanote Line',
        trainTypeZh: '山手线',
        trainTypeKo: '야마노테선',
        trainTypeColor: '#4d8c18',
        destinationJp: '上野・東京',
        destinationKana: 'うえの・とうきょう',
        destinationEn: 'Ueno&Tōkyō',
        destinationZh: '上野・东京',
        destinationKo: '우에노·도쿄',
        destSuffixJp: '方面',
        direction: 'ltr',
        carNumber: 5,
        doorSide: 'this',
        clockMode: 'fixed',
        manualClock: '21:08',
        currentStationIndex: 0,
        runningPhase: 'next',
        trainProgress: 16,
        stations: [
          {
            nameJp: '大塚', nameKana: 'おおつか', nameEn: 'Ōtsuka', nameZh: '大塚', nameKo: '오쓰카', num: '12', mins: 0, stop: true,
            doorSide: 'opposite', exitJp: '北口・南口', exitEn: 'North Exit · South Exit',
            facilities: [{ car: 3, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 6, type: 'stairs' }],
            transfers: [{ badge: 'SA', badgeColor: '#ec6800', textJp: '都電荒川線', textEn: 'Toden Arakawa Line' }]
          },
          {
            nameJp: '巣鴨', nameKana: 'すがも', nameEn: 'Sugamo', nameZh: '巢鸭', nameKo: '스가모', num: '11', mins: 2, stop: true,
            doorSide: 'this', exitJp: '正面口・北口 (とげぬき地蔵・都営三田線)', exitEn: 'Main Exit · North Exit (Toei Mita Line)',
            facilities: [{ car: 3, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 8, type: 'stairs' }],
            transfers: [{ badge: 'I', badgeShape: 'circle', badgeColor: '#006cb6', textJp: '都営三田線', textEn: 'Toei Mita Line' }]
          },
          {
            nameJp: '駒込', nameKana: 'こまごめ', nameEn: 'Komagome', nameZh: '驹込', nameKo: '고마고메', num: '10', mins: 4, stop: true,
            doorSide: 'opposite', exitJp: '北口・南口・東口 (六義園・南北線)', exitEn: 'North · South · East Exit (Namboku Line)',
            facilities: [{ car: 2, type: 'stairs' }, { car: 4, type: 'escalator' }, { car: 5, type: 'elevator' }],
            transfers: [{ badge: 'N', badgeShape: 'circle', badgeColor: '#00ac9b', textJp: '東京メトロ南北線', textEn: 'Tokyo Metro Namboku Line' }]
          },
          {
            nameJp: '田端', nameKana: 'たばた', nameEn: 'Tabata', nameZh: '田端', nameKo: '다바타', num: '09', mins: 6, stop: true,
            doorSide: 'this', exitJp: '北口・南口', exitEn: 'North Exit · South Exit',
            facilities: [{ car: 3, type: 'stairs' }, { car: 6, type: 'elevator' }, { car: 8, type: 'escalator' }],
            transfers: [{ badge: 'JK', badgeColor: '#00a7e3', textJp: '京浜東北線', textEn: 'Keihin-Tōhoku Line' }]
          },
          {
            nameJp: '西日暮里', nameKana: 'にしにっぽり', nameEn: 'Nishi-Nippori', nameZh: '西日暮里', nameKo: '니시닛포리', num: '08', mins: 8, stop: true,
            doorSide: 'this', exitJp: '改札口 (千代田線・日暮里・舎人ライナー乗換)', exitEn: 'Exit (Chiyoda Line / Nippori-Toneri Liner)',
            facilities: [{ car: 4, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 9, type: 'stairs' }],
            transfers: [{ badge: 'C', badgeShape: 'circle', badgeColor: '#00bb85', textJp: '千代田線・舎人ライナー', textEn: 'Chiyoda Line' }]
          },
          {
            nameJp: '日暮里', nameKana: 'にっぽり', nameEn: 'Nippori', nameZh: '日暮里', nameKo: '닛포리', num: '07', mins: 10, stop: true,
            doorSide: 'this', exitJp: '北改札口・南改札口 (京成線乗換)', exitEn: 'North Gate · South Gate (Keisei Line)',
            facilities: [{ car: 2, type: 'stairs' }, { car: 5, type: 'elevator' }, { car: 8, type: 'escalator' }],
            transfers: [{ badge: 'JJ', badgeColor: '#00b261', textJp: '常磐線・京成線', textEn: 'Jōban Line / Keisei Line' }]
          }
        ]
      },

      // Photo 4: IMG_4437.jpeg (Yamanote Platform Stop - Arriving at JY12 Ōtsuka 08:54 Car No. 9 + All Major Stations)
      yamanote_otsuka: {
        lineName: '山手線',
        linePrefix: 'JY',
        lineColor: '#77c043',
        headerStyle: 'pillar',
        bodyLayout: 'platform',
        totalCars: 11,
        trainTypeJp: '山手線',
        trainTypeKana: 'やまのてせん',
        trainTypeEn: 'Yamanote Line',
        trainTypeZh: '山手线',
        trainTypeKo: '야마노테선',
        trainTypeColor: '#4d8c18',
        destinationJp: '池袋・新宿',
        destinationKana: 'いけぶくろ・しんじゅく',
        destinationEn: 'Ikebukuro&\nShinjuku',
        destinationZh: '池袋・新宿',
        destinationKo: '이케부쿠로·신주쿠',
        destSuffixJp: '方面',
        direction: 'ltr',
        carNumber: 9,
        doorSide: 'opposite',
        clockMode: 'fixed',
        manualClock: '08:54',
        currentStationIndex: 0,
        runningPhase: 'arriving',
        trainProgress: 85,
        stations: [
          {
            nameJp: '巣鴨', nameKana: 'すがも', nameEn: 'Sugamo', nameZh: '巢鸭', nameKo: '스가모', num: '11', mins: 0, stop: true,
            doorSide: 'this', exitJp: '正面口・北口 (都営三田線)', exitEn: 'Main Exit · North Exit (Toei Mita Line)',
            facilities: [{ car: 3, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 8, type: 'stairs' }],
            transfers: [{ badge: 'I', badgeShape: 'circle', badgeColor: '#006cb6', textJp: '都営三田線', textEn: 'Toei Mita Line' }]
          },
          {
            nameJp: '大塚', nameKana: 'おおつか', nameEn: 'Ōtsuka', nameZh: '大塚', nameKo: '오쓰카', num: '12', mins: 2, stop: true,
            doorSide: 'opposite', exitJp: '北口・南口', exitEn: 'North Exit · South Exit',
            facilities: [{ car: 3, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 6, type: 'stairs' }],
            transfers: [{ badge: 'SA', badgeColor: '#ec6800', textJp: '都電荒川線', textEn: 'Toden Arakawa Line' }]
          },
          {
            nameJp: '池袋', nameKana: 'いけぶくろ', nameEn: 'Ikebukuro', nameZh: '池袋', nameKo: '이케부쿠로', num: '13', mins: 5, stop: true,
            doorSide: 'this', exitJp: '東口・西口・中央1/2改札・メトロポリタン口', exitEn: 'East · West · Central · Metropolitan Exit',
            facilities: [{ car: 2, type: 'stairs' }, { car: 4, type: 'escalator' }, { car: 7, type: 'elevator' }, { car: 10, type: 'escalator' }],
            transfers: [{ badge: 'JA', badgeColor: '#00ac9a', textJp: '埼京線・湘南新宿ライン・東武・西武', textEn: 'JR / Tobu / Seibu / Metro' }]
          },
          {
            nameJp: '目白', nameKana: 'めじろ', nameEn: 'Mejiro', nameZh: '目白', nameKo: '메지로', num: '14', mins: 7, stop: true,
            doorSide: 'opposite', exitJp: '改札口 (目白通り・学習院前)', exitEn: 'Main Exit (Mejiro-dōri)',
            facilities: [{ car: 2, type: 'stairs' }, { car: 3, type: 'escalator' }, { car: 4, type: 'elevator' }],
            transfers: []
          },
          {
            nameJp: '高田馬場', nameKana: 'たかだのばば', nameEn: 'Takadanobaba', nameZh: '高田马场', nameKo: '다카다노바바', num: '15', mins: 9, stop: true,
            doorSide: 'opposite', exitJp: '早稲田口・戸山口 (東西線・西武新宿線)', exitEn: 'Waseda · Toyama Exit (Tozai / Seibu Line)',
            facilities: [{ car: 3, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 9, type: 'stairs' }],
            transfers: [{ badge: 'T', badgeShape: 'circle', badgeColor: '#009bbf', textJp: '東京メトロ東西線', textEn: 'Tokyo Metro Tozai Line' }]
          },
          {
            nameJp: '新大久保', nameKana: 'しんおおくぼ', nameEn: 'Shin-Ōkubo', nameZh: '新大久保', nameKo: '신오쿠보', num: '16', mins: 11, stop: true,
            doorSide: 'opposite', exitJp: '改札口 (大久保通り)', exitEn: 'Main Exit (Ōkubo-dōri)',
            facilities: [{ car: 2, type: 'stairs' }, { car: 3, type: 'elevator' }, { car: 4, type: 'escalator' }],
            transfers: []
          },
          {
            nameJp: '新宿', nameKana: 'しんじゅく', nameEn: 'Shinjuku', nameZh: '新宿', nameKo: '신주쿠', num: '17', mins: 14, stop: true,
            doorSide: 'this', exitJp: '東口・西口・南口・バスタ新宿・中央線乗換', exitEn: 'East · West · South Exit · Busta Shinjuku',
            facilities: [{ car: 2, type: 'escalator' }, { car: 5, type: 'stairs' }, { car: 7, type: 'elevator' }, { car: 9, type: 'escalator' }],
            transfers: [{ badge: 'JC', badgeColor: '#eb5c01', textJp: '中央線・総武線・小田急・京王', textEn: 'Chūō / Odakyū / Keiō Lines' }]
          },
          {
            nameJp: '渋谷', nameKana: 'しぶや', nameEn: 'Shibuya', nameZh: '涩谷', nameKo: '시부야', num: '20', mins: 21, stop: true,
            doorSide: 'this', exitJp: 'ハチ公改札・中央改札・南改札・スクランブルスクエア', exitEn: 'Hachikō · Central · South Gate',
            facilities: [{ car: 3, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 8, type: 'stairs' }, { car: 10, type: 'escalator' }],
            transfers: [{ badge: 'G', badgeShape: 'circle', badgeColor: '#ff9500', textJp: '銀座線・半蔵門線・東急・京王井の頭線', textEn: 'Metro / Tokyu / Keio' }]
          }
        ]
      },

      chuo_rapid: {
        lineName: '中央線快速',
        linePrefix: 'JC',
        lineColor: '#e85513',
        headerStyle: 'polygon',
        bodyLayout: 'straight',
        totalCars: 10,
        trainTypeJp: '中央特快',
        trainTypeKana: 'ちゅうおうとっかい',
        trainTypeEn: 'Chūō Special Rapid',
        trainTypeZh: '中央特快',
        trainTypeKo: '주오특쾌',
        trainTypeColor: '#1d4ed8',
        destinationJp: '高尾',
        destinationKana: 'たかお',
        destinationEn: 'Takao',
        destinationZh: '高尾',
        destinationKo: '다카오',
        destSuffixJp: 'ゆき',
        direction: 'rtl',
        carNumber: 1,
        doorSide: 'this',
        clockMode: 'fixed',
        manualClock: '14:06',
        currentStationIndex: 0,
        runningPhase: 'next',
        trainProgress: 25,
        stations: [
          { nameJp: '新宿', nameKana: 'しんじゅく', nameEn: 'Shinjuku', nameZh: '新宿', nameKo: '신주쿠', num: '05', mins: 0, stop: true, doorSide: 'this', exitJp: '東口・西口・南口', exitEn: 'East · West · South Exit', facilities: [{ car: 3, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 8, type: 'stairs' }], transfers: [{ badge: 'JY', badgeColor: '#77c043', textJp: '山手線', textEn: 'Yamanote Line' }, { badge: 'JA', badgeColor: '#00ac9a', textJp: '埼京線・湘南新宿ライン', textEn: 'Saikyō / Shōnan-Shinjuku Line' }] },
          { nameJp: '中野', nameKana: 'なかの', nameEn: 'Nakano', nameZh: '中野', nameKo: '나카노', num: '06', mins: 4, stop: true, doorSide: 'this', exitJp: '北口・南口 (中野ブロードウェイ方面)', exitEn: 'North · South Exit', facilities: [{ car: 2, type: 'stairs' }, { car: 5, type: 'elevator' }, { car: 7, type: 'escalator' }], transfers: [{ badge: 'T', badgeShape: 'circle', badgeColor: '#009bbf', textJp: '東西線', textEn: 'Tozai Line' }] },
          { nameJp: '高円寺', nameKana: 'こうえんじ', nameEn: 'Kōenji', nameZh: '高圆寺', nameKo: '고엔지', num: '07', mins: 6, stop: false, doorSide: 'this', exitJp: '北口・南口', exitEn: 'North · South Exit', facilities: [], transfers: [] },
          { nameJp: '阿佐ケ谷', nameKana: 'あさがや', nameEn: 'Asagaya', nameZh: '阿佐谷', nameKo: '아사가야', num: '08', mins: 8, stop: false, doorSide: 'this', exitJp: '北口・南口', exitEn: 'North · South Exit', facilities: [], transfers: [] },
          { nameJp: '荻窪', nameKana: 'おぎくぼ', nameEn: 'Ogikubo', nameZh: '荻洼', nameKo: '오기쿠보', num: '09', mins: 10, stop: false, doorSide: 'this', exitJp: '北口・南口', exitEn: 'North · South Exit', facilities: [], transfers: [{ badge: 'M', badgeShape: 'circle', badgeColor: '#f62e36', textJp: '丸ノ内線', textEn: 'Marunouchi Line' }] },
          { nameJp: '西荻窪', nameKana: 'にしおぎくぼ', nameEn: 'Nishi-Ogikubo', nameZh: '西荻洼', nameKo: '니시오기쿠보', num: '10', mins: 12, stop: false, doorSide: 'this', exitJp: '北口・南口', exitEn: 'North · South Exit', facilities: [], transfers: [] },
          { nameJp: '吉祥寺', nameKana: 'きちじょうじ', nameEn: 'Kichijōji', nameZh: '吉祥寺', nameKo: '기치조지', num: '11', mins: 14, stop: false, doorSide: 'this', exitJp: '北口・南口(公園口)', exitEn: 'North · Park Exit', facilities: [], transfers: [{ badge: 'IN', badgeColor: '#003b83', textJp: '京王井の頭線', textEn: 'Keiō Inokashira Line' }] },
          { nameJp: '三鷹', nameKana: 'みたか', nameEn: 'Mitaka', nameZh: '三鹰', nameKo: '미타카', num: '12', mins: 13, stop: true, doorSide: 'opposite', exitJp: '北口・南口 (ジブリ美術館方面)', exitEn: 'North · South Exit', facilities: [{ car: 4, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 8, type: 'stairs' }], transfers: [{ badge: 'JB', badgeColor: '#ffd400', textJp: '中央・総武線各駅停車', textEn: 'Chūō-Sōbu Local' }] }
        ]
      },

      keihin_tohoku: {
        lineKey: 'JK',
        lineName: '京浜東北線',
        linePrefix: 'JK',
        lineColor: '#0097d8',
        headerStyle: 'polygon',
        bodyLayout: 'straight',
        totalCars: 10,
        trainTypeJp: '各駅停車',
        trainTypeKana: 'かくえきていしゃ',
        trainTypeEn: 'Local',
        trainTypeZh: '各站停车',
        trainTypeKo: '각역정차',
        trainTypeColor: '#0097d8',
        destinationJp: '大宮',
        destinationKana: 'おおみや',
        destinationEn: 'Ōmiya',
        destinationZh: '大宫',
        destinationKo: '오미야',
        destSuffixJp: 'ゆき',
        direction: 'rtl',
        carNumber: 1,
        doorSide: 'this',
        clockMode: 'fixed',
        manualClock: '14:06',
        currentStationIndex: 0,
        runningPhase: 'next',
        trainProgress: 20,
        stations: [
          { nameJp: '品川', nameKana: 'しながわ', nameEn: 'Shinagawa', nameZh: '品川', nameKo: '시나가와', threeLetter: 'SGW', num: '20', mins: 0, stop: true, doorSide: 'this', exitJp: '中央改札・港南口・高輪口', exitEn: 'Central · Kōnan · Takanawa Exit', facilities: [{ car: 3, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 8, type: 'stairs' }], transfers: [{ badge: 'SHINKANSEN_W', badgeColor: '#005bac', textJp: '東海道・山陽新幹線', textEn: 'Tokaido / Sanyo Shinkansen' }, { badge: 'JY', badgeColor: '#77c043', textJp: '山手線', textEn: 'Yamanote Line' }, { badge: 'JT', badgeColor: '#f68b1e', textJp: '東海道線', textEn: 'Tōkaidō Line' }, { badge: 'JO', badgeColor: '#0068b7', textJp: '横須賀線', textEn: 'Yokosuka Line' }, { badge: 'KK', badgeColor: '#e5171f', textJp: '京急線', textEn: 'Keikyū Line' }] },
          { nameJp: '高輪ゲートウェイ', nameKana: 'たかなわげーとうぇい', nameEn: 'Takanawa Gateway', nameZh: '高轮Gateway', nameKo: '다카나와게이트웨이', threeLetter: 'TGW', num: '21', mins: 2, stop: true, doorSide: 'this', exitJp: '改札口', exitEn: 'Main Exit', facilities: [{ car: 4, type: 'escalator' }, { car: 6, type: 'elevator' }], transfers: [{ badge: 'A', badgeShape: 'circle', badgeColor: '#e85298', textJp: '都営浅草線(泉岳寺)', textEn: 'Toei Asakusa Line' }] },
          { nameJp: '田町', nameKana: 'たまち', nameEn: 'Tamachi', nameZh: '田町', nameKo: '다마치', num: '22', mins: 4, stop: true, doorSide: 'this', exitJp: '三田口(西口)・芝浦口(東口)', exitEn: 'Mita · Shibaura Exit', facilities: [{ car: 3, type: 'stairs' }, { car: 6, type: 'elevator' }], transfers: [{ badge: 'A', badgeShape: 'circle', badgeColor: '#e85298', textJp: '都営浅草線', textEn: 'Toei Asakusa Line' }, { badge: 'I', badgeShape: 'circle', badgeColor: '#006cb6', textJp: '都営三田線', textEn: 'Toei Mita Line' }] },
          { nameJp: '浜松町', nameKana: 'はままつちょう', nameEn: 'Hamamatsuchō', nameZh: '滨松町', nameKo: '하마마쓰초', threeLetter: 'HMC', num: '23', mins: 6, stop: true, doorSide: 'this', exitJp: '北口・南口 (東京モノレール乗換)', exitEn: 'North · South Exit (Tokyo Monorail)', facilities: [{ car: 3, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 8, type: 'stairs' }], transfers: [{ badge: 'MO', badgeColor: '#003894', textJp: '東京モノレール', textEn: 'Tokyo Monorail' }, { badge: 'E', badgeShape: 'circle', badgeColor: '#ce0058', textJp: '都営大江戸線', textEn: 'Toei Ōedo Line' }] },
          { nameJp: '新橋', nameKana: 'しんばし', nameEn: 'Shimbashi', nameZh: '新桥', nameKo: '심바시', threeLetter: 'SMB', num: '24', mins: 8, stop: true, doorSide: 'this', exitJp: '日比谷口・銀座口・烏森口・汐留口', exitEn: 'Hibiya · Ginza · Karasumori Exit', facilities: [{ car: 2, type: 'stairs' }, { car: 5, type: 'elevator' }, { car: 8, type: 'escalator' }], transfers: [{ badge: 'JT', badgeColor: '#f68b1e', textJp: '東海道線', textEn: 'Tōkaidō Line' }, { badge: 'JO', badgeColor: '#0068b7', textJp: '横須賀線', textEn: 'Yokosuka Line' }, { badge: 'G', badgeShape: 'circle', badgeColor: '#ff9500', textJp: '銀座線', textEn: 'Ginza Line' }, { badge: 'A', badgeShape: 'circle', badgeColor: '#e85298', textJp: '都営浅草線', textEn: 'Toei Asakusa Line' }, { badge: 'U', badgeShape: 'circle', badgeColor: '#00a0de', textJp: 'ゆりかもめ', textEn: 'Yurikamome' }] },
          { nameJp: '有楽町', nameKana: 'ゆうらくちょう', nameEn: 'Yūrakuchō', nameZh: '有乐町', nameKo: '유라쿠초', num: '25', mins: 10, stop: true, doorSide: 'this', exitJp: '国際フォーラム口・中央口・日比谷口', exitEn: 'Int\'l Forum · Central · Hibiya Exit', facilities: [{ car: 3, type: 'escalator' }, { car: 6, type: 'elevator' }], transfers: [{ badge: 'Y', badgeShape: 'circle', badgeColor: '#c1a470', textJp: '有楽町線', textEn: 'Yūrakuchō Line' }, { badge: 'H', badgeShape: 'circle', badgeColor: '#b5b5ac', textJp: '日比谷線', textEn: 'Hibiya Line' }, { badge: 'C', badgeShape: 'circle', badgeColor: '#00bb85', textJp: '千代田線', textEn: 'Chiyoda Line' }, { badge: 'I', badgeShape: 'circle', badgeColor: '#006cb6', textJp: '都営三田線', textEn: 'Toei Mita Line' }] },
          { nameJp: '東京', nameKana: 'とうきょう', nameEn: 'Tōkyō', nameZh: '东京', nameKo: '도쿄', threeLetter: 'TYO', num: '26', mins: 12, stop: true, doorSide: 'this', exitJp: '丸の内口・八重洲口・新幹線乗換', exitEn: 'Marunouchi · Yaesu · Shinkansen', facilities: [{ car: 2, type: 'escalator' }, { car: 5, type: 'elevator' }, { car: 9, type: 'stairs' }], transfers: [{ badge: 'JC', badgeColor: '#eb5c01', textJp: '中央線', textEn: 'Chūō Line' }, { badge: 'JE', badgeColor: '#c9242b', textJp: '京葉線', textEn: 'Keiyō Line' }, { badge: 'M', badgeShape: 'circle', badgeColor: '#f62e36', textJp: '丸ノ内線', textEn: 'Marunouchi Line' }] },
          { nameJp: '神田', nameKana: 'かんだ', nameEn: 'Kanda', nameZh: '神田', nameKo: '간다', threeLetter: 'KND', num: '27', mins: 14, stop: true, doorSide: 'this', exitJp: '北口・南口・東口・西口', exitEn: 'North · South · East · West Exit', facilities: [{ car: 3, type: 'stairs' }, { car: 6, type: 'elevator' }], transfers: [{ badge: 'JC', badgeColor: '#eb5c01', textJp: '中央線', textEn: 'Chūō Line' }, { badge: 'G', badgeShape: 'circle', badgeColor: '#ff9500', textJp: '銀座線', textEn: 'Ginza Line' }] }
        ]
      }
    };

    // Populate shared station arrays for Yamanote Inner Loop Kanda preset
    PRESETS.yamanote_video_kanda.stations = JSON.parse(JSON.stringify(PRESETS.yamanote_video_tokyo.stations));
    PRESETS.yamanote_sugamo.lineKey = 'JY';
    PRESETS.yamanote_shinokubo.lineKey = 'JY';
    PRESETS.yamanote_otsuka.lineKey = 'JY';
    PRESETS.keiyo_photo.lineKey = 'JE';
    PRESETS.chuo_rapid.lineKey = 'JC';
    PRESETS.keihin_tohoku.lineKey = 'JK';

