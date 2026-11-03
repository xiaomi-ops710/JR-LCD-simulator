// 状態管理と描画の中核（renderLCD）
    /* ==========================================================
       3. APPLICATION STATE & AUTHENTIC VIS ANIMATION ENGINE
       ========================================================== */
    let state = JSON.parse(JSON.stringify(PRESETS.yamanote_video_tokyo));
    state.lang = 'jp';
    state.animStyle = 'wipe'; // Matches uploaded video transitions
    state.autoRunActive = false;
    state.autoLangCycleActive = true;
    state.autoPageCycleActive = false;
    state.videoDemoActive = false;
    state.isFullscreen = false;
    state.activeLineKey = 'JY';
    state.activeSubSceneId = 'yamanote_video_tokyo';
    state.customDelayTitle = '【東海道新幹線　遅延】';
    state.customDelayBody = '東海道新幹線は、雪の影響、で遅れがでています。';
    state.customNoticeBody = '【この画面に関するご案内】\n路線ボタン（山手線・中央線・総武線・京葉線・京浜東北線）を選ぶと、その路線固有のLCD画面・種別停車駅図・ホーム図を忠実に再現します。';

    let autoRunInterval = null;
    let autoLangInterval = null;
    let autoPageInterval = null;
    let videoDemoInterval = null;
    let clockInterval = null;

    const rollMemory = {};

    /**
     * Authentic JR East VIS Mechanical Drum-Scroll or Wipe Transition
     * Zero opacity blur; sharp vertical clipping inside each header slot.
     */
    function updateRollStage(stageId, newHtml, animate = true) {
      const stage = document.getElementById(stageId);
      if (!stage) return;

      const prevHtml = rollMemory[stageId];
      if (prevHtml === newHtml) return;
      rollMemory[stageId] = newHtml;

      if (!animate || !prevHtml || state.animStyle === 'instant') {
        stage.innerHTML = `<div class="roll-item">${newHtml}</div>`;
        return;
      }

      const outClass = state.animStyle === 'wipe' ? 'vis-wipe-out' : 'vis-scroll-out';
      const inClass  = state.animStyle === 'wipe' ? 'vis-wipe-in'  : 'vis-scroll-in';

      stage.innerHTML = `
        <div class="roll-item ${outClass}">${prevHtml}</div>
        <div class="roll-item ${inClass}">${newHtml}</div>
      `;
    }

    function updateAnimStyle(style) {
      state.animStyle = style;
    }

    function updateCustomInfoTexts() {
      state.customDelayTitle = document.getElementById('inputDelayTitle').value || '【東海道新幹線　遅延】';
      state.customDelayBody = document.getElementById('inputDelayBody').value || '';
      state.customNoticeBody = document.getElementById('inputNoticeBody').value || '';
      renderLCD(false);
    }

    /* ==========================================================
       4. CORE RENDERING ENGINE (3 HEADER STYLES + 12 BODY LAYOUTS)
       ========================================================== */
    /* 描画の共通情報（言語フラグ・次停車駅）を作成 */
    function createRenderContext(animateRoll) {
      const lang = state.lang;
      const isEn = lang === 'en';
      const isKana = lang === 'kana';
      const isZh = lang === 'zh';
      const isKo = lang === 'ko';

      const targetIdx = state.runningPhase === 'stopped'
        ? state.currentStationIndex
        : findNextStopIndex(state.currentStationIndex);
      const targetStation = state.stations[targetIdx] || state.stations[state.stations.length - 1];

      return { animateRoll, lang, isEn, isKana, isZh, isKo, targetIdx, targetStation };
    }

    /* 上部のアプリバーのバッジ（路線記号・駅番号） */
    function renderTopBadge(ctx) {
      const { targetStation } = ctx;
      const topBadge = document.getElementById('topBadgeIcon');
      if (topBadge) {
        topBadge.style.backgroundColor = state.lineColor;
        const darkTextLines = ['JY', 'JB'];
        topBadge.style.color = darkTextLines.includes(state.linePrefix) ? '#0f172a' : '#ffffff';
        topBadge.innerHTML = `
          <span class="text-[9px] leading-none">${escapeHtml(state.linePrefix)}</span>
          <span class="text-sm leading-none">${escapeHtml(targetStation.num)}</span>
        `;
      }

    }

    /* ヘッダー（ポリゴン・ピラー・ホワイトボックスの3形式） */
    /* ヘッダー（白箱形式）の描画 */
    function renderWhiteboxHeader(ctx, h) {
      const { lang, isEn, isKana, isZh, isKo, targetIdx, targetStation, animateRoll } = ctx;
      const { statusText, mainStText, darkHeaderWrap, wbHeaderWrap } = h;
        // ========================================================
        // STYLE C: WHITE-BOX HEADER (IMG_4441, 4442, 4445, 4446, 4448, 4449)
        // Fixed flex layout & authentic Kanji destination/status behavior!
        // ========================================================
        darkHeaderWrap.classList.add('hidden');
        wbHeaderWrap.classList.remove('hidden');

        // 1. Outlined 2-Line Train Type (Top-Left)
        // Note: In IMG_4449 (よつや), even when the station name is Hiragana,
        // the train type (`通勤特快`), status (`次は`), and destination (`東京 行`) remain in Kanji!
        const wbTypeSlot = document.getElementById('wbTrainTypeSlot');
        const outlineClass = state.trainTypeOutline === 'yellow'
          ? 'outlined-type-yellow'
          : (state.trainTypeOutline === 'blue' ? 'outlined-type-blue' : 'outlined-type-red');

        if (isEn) {
          const enLines = (state.trainTypeEn || 'Local').split('\n');
          wbTypeSlot.innerHTML = `
            <div class="flex flex-col justify-center leading-[1.02] pt-[0.4cqh]">
              ${enLines.map(l => `<div class="${outlineClass} font-['Roboto'] font-black italic text-[3.55cqw] tracking-tighter whitespace-nowrap" style="-webkit-text-stroke: 0.22cqw #ffffff;">${escapeHtml(l)}</div>`).join('')}
            </div>
          `;
        } else {
          const rawType = state.trainTypeJp || '各駅停車';
          if (rawType.length === 4) {
            const row1 = `${rawType[0]}${rawType[1]}`;
            const row2 = `${rawType[2]}${rawType[3]}`;
            wbTypeSlot.innerHTML = `
              <div class="flex flex-col leading-[1.02] font-black text-[5.75cqw] tracking-wider ${outlineClass}">
                <div>${escapeHtml(row1)}</div>
                <div>${escapeHtml(row2)}</div>
              </div>
            `;
          } else {
            wbTypeSlot.innerHTML = `
              <div class="font-black text-[4.4cqw] leading-tight ${outlineClass}">${escapeHtml(rawType)}</div>
            `;
          }
        }

        // 2. Bottom-Left Status ("次は" / "ただいま" / "まもなく" / "Arriving at")
        // In Whitebox style (IMG_4449), Japanese & Hiragana modes both show Kanji "次は" / "ただいま" / "まもなく"
        let wbStatusText = '次は';
        if (state.runningPhase === 'next') {
          wbStatusText = isEn ? 'Next' : (isZh ? '下一站' : (isKo ? '다음은' : '次は'));
        } else if (state.runningPhase === 'arriving') {
          wbStatusText = isEn ? 'Arriving at' : (isZh ? '即将到达' : (isKo ? '잠시 후' : 'まもなく'));
        } else {
          wbStatusText = isEn ? 'Now stopping at' : (isZh ? '本站是' : (isKo ? '이번 역은' : 'ただいま'));
        }
        const statusFontClass = isEn ? "font-['Roboto'] text-[3.1cqw] tracking-tighter" : 'text-[4.15cqw]';
        updateRollStage(
          'rollWbNextStatus',
          `<span class="text-[#111827] font-bold leading-none whitespace-nowrap ${statusFontClass}">${escapeHtml(wbStatusText)}</span>`,
          animateRoll
        );

        // 3. Top-Center Destination ("東京 行" / "三鷹 行" / "for Tōkyō")
        // Positioned cleanly above the white box, aligned with IMG_4441 & IMG_4442!
        let wbDestHtml = '';
        if (isEn) {
          wbDestHtml = `<span class="text-[#111827] font-['Roboto'] font-bold text-[4.15cqw] leading-none whitespace-nowrap">for ${escapeHtml((state.destinationEn || 'Tōkyō').replace('\n', ' '))}</span>`;
        } else {
          const dKanji = isZh ? (state.destinationZh || state.destinationJp) : (isKo ? (state.destinationKo || state.destinationJp) : state.destinationJp);
          wbDestHtml = `<span class="text-[#111827] font-bold text-[4.05cqw] leading-none tracking-wide whitespace-nowrap">${escapeHtml(dKanji)} ${escapeHtml(state.destSuffixJp || '行')}</span>`;
        }
        updateRollStage('rollWbDest', wbDestHtml, animateRoll);

        // 4. White Box Station Badge (Supports 3-Letter Code AKB JB 19 in IMG_4441 or Orange JC 22 in IMG_4442-4449)
        const wbBadgeSlot = document.getElementById('wbStationBadgeSlot');
        if (targetStation.threeLetter && state.linePrefix === 'JB') {
          wbBadgeSlot.innerHTML = `
            <div class="w-[10.0cqw] h-[21.4cqh] bg-[#181b20] rounded-[1.15cqw] p-[0.36cqw] flex flex-col items-center justify-between shadow">
              <div class="text-white font-['Roboto'] font-bold text-[2.35cqw] leading-none pt-[0.2cqh] tracking-wide">${escapeHtml(targetStation.threeLetter)}</div>
              <div class="w-full h-[15.0cqh] bg-white rounded-[0.75cqw] border-[0.62cqw] flex flex-col items-center justify-center leading-[0.92]" style="border-color: ${state.lineColor};">
                <span class="font-['Roboto'] font-bold text-[#111827] text-[2.45cqw]">${escapeHtml(state.linePrefix)}</span>
                <span class="font-['Roboto'] font-black text-[#111827] text-[4.2cqw]">${escapeHtml(targetStation.num)}</span>
              </div>
            </div>
          `;
        } else {
          wbBadgeSlot.innerHTML = `
            <div class="w-[9.6cqw] h-[16.6cqh] bg-white rounded-[1.05cqw] border-[0.70cqw] flex flex-col items-center justify-center leading-[0.92] shadow-sm" style="border-color: ${state.lineColor};">
              <span class="font-['Roboto'] font-bold text-[#111827] text-[2.6cqw]">${escapeHtml(state.linePrefix)}</span>
              <span class="font-['Roboto'] font-black text-[#111827] text-[4.45cqw]">${escapeHtml(targetStation.num)}</span>
            </div>
          `;
        }

        // 5. Huge Green Station Name inside White Box (#007810)
        // Adaptive font-size + horizontal scaleX condensation so long Hiragana/English names NEVER overflow or hide!
        let wbStName = targetStation.nameJp;
        if (isEn) wbStName = targetStation.nameEn;
        else if (isKana) wbStName = targetStation.nameKana || targetStation.nameJp;
        else if (isZh) wbStName = targetStation.nameZh || targetStation.nameJp;
        else if (isKo) wbStName = targetStation.nameKo || targetStation.nameJp;

        const wbCharLen = wbStName.length;
        let wbFontSize = '11.2cqw';
        let wbLetterSpacing = '0.02em';
        let wbScaleX = 1.0;

        if (isEn) {
          if (wbCharLen > 14) { wbFontSize = '5.8cqw'; wbScaleX = 0.88; }
          else if (wbCharLen > 11) { wbFontSize = '7.2cqw'; wbScaleX = 0.92; }
          else if (wbCharLen > 8) { wbFontSize = '9.0cqw'; }
          else { wbFontSize = '11.2cqw'; }
        } else {
          if (wbCharLen === 2) { wbFontSize = '11.6cqw'; wbLetterSpacing = '0.18em'; }
          else if (wbCharLen === 3) { wbFontSize = '11.0cqw'; wbLetterSpacing = '0.05em'; }
          else if (wbCharLen === 4) { wbFontSize = '9.4cqw'; wbLetterSpacing = '0.01em'; }
          else if (wbCharLen === 5) { wbFontSize = '7.8cqw'; wbLetterSpacing = '-0.02em'; }
          else if (wbCharLen === 6) { wbFontSize = '6.6cqw'; wbLetterSpacing = '-0.03em'; wbScaleX = 0.94; }
          else if (wbCharLen <= 8) { wbFontSize = '5.4cqw'; wbLetterSpacing = '-0.04em'; wbScaleX = 0.90; }
          else { wbFontSize = '4.4cqw'; wbLetterSpacing = '-0.04em'; wbScaleX = 0.85; }
        }

        updateRollStage(
          'rollWbMainStation',
          `<span class="font-bold leading-none whitespace-nowrap inline-block ${isEn ? "font-['Roboto']" : ''}" style="color: #007810; font-size: ${wbFontSize}; letter-spacing: ${wbLetterSpacing}; transform: scaleX(${wbScaleX}); transform-origin: center;">${escapeHtml(wbStName)}</span>`,
          animateRoll
        );

        // 6. Right Side Car Number & Clock
        const wbCarArea = document.getElementById('wbCarBoxArea');
        if (isEn) {
          wbCarArea.innerHTML = `
            <div class="flex items-start gap-[0.6cqw]">
              <span class="font-['Roboto'] font-bold text-[#111827] text-[2.45cqw] mt-[0.5cqh]">Car No.</span>
              <div class="w-[6.8cqw] h-[11.2cqh] bg-white rounded-[1.0cqw] flex items-center justify-center shadow-sm">
                <span class="font-['Roboto'] font-black text-[#111827] text-[4.8cqw] leading-none">${state.carNumber}</span>
              </div>
            </div>
          `;
        } else {
          wbCarArea.innerHTML = `
            <div class="flex flex-col items-center">
              <div class="w-[6.8cqw] h-[11.2cqh] bg-white rounded-[1.0cqw] flex items-center justify-center shadow-sm">
                <span class="font-['Roboto'] font-black text-[#111827] text-[4.8cqw] leading-none">${state.carNumber}</span>
              </div>
              <span class="text-[#111827] font-bold text-[2.35cqw] leading-none mt-[0.6cqh]">号車</span>
            </div>
          `;
        }

        const wbClockLbl = document.getElementById('wbClockLabel');
        if (state.showClockLabelInWb && !isEn) {
          wbClockLbl.classList.remove('hidden');
        } else {
          wbClockLbl.classList.add('hidden');
        }
        document.getElementById('wbClockValue').textContent = getDisplayClockString();
    }

    /* ヘッダー（ポリゴン・ピラー形式）の描画 */
    function renderDarkHeader(ctx, h) {
      const { lang, isEn, isKana, isZh, isKo, targetIdx, targetStation, animateRoll } = ctx;
      const { statusText, mainStText, darkHeaderWrap, wbHeaderWrap } = h;
        // ========================================================
        // STYLE A (POLYGON) & STYLE B (PILLAR) DARK HEADER
        // ========================================================
        darkHeaderWrap.classList.remove('hidden');
        wbHeaderWrap.classList.add('hidden');

        const polyEl = document.getElementById('headerLeftPolygon');
        const pillarEl = document.getElementById('headerLeftPillar');
        const clockGroup = document.getElementById('clockGroup');
        const clockLabel = document.getElementById('clockLabel');
        const clockValue = document.getElementById('clockValue');
        const carE233 = document.getElementById('carBadgeE233');
        const carPillar = document.getElementById('carBadgePillar');

        if (state.headerStyle === 'pillar') {
          polyEl.classList.add('hidden');
          pillarEl.classList.remove('hidden');
          document.getElementById('pillarColorBar').style.backgroundColor = state.lineColor;

          let pillarDestHtml = '';
          if (isEn) {
            const lines = (state.destinationEn || 'Ueno&\nIkebukuro').split('\n');
            const linesHtml = lines.map(l =>
              `<div class="text-white font-bold font-['Roboto'] text-[3.35cqw] leading-[1.06] tracking-tight whitespace-nowrap">${escapeHtml(l)}</div>`
            ).join('');
            pillarDestHtml = `
              <div class="w-full flex flex-col items-start justify-end">
                <div class="text-slate-100 font-bold font-['Roboto'] text-[2.05cqw] leading-tight mb-[0.25cqh]">Bound for</div>
                ${linesHtml}
              </div>
            `;
          } else {
            const destStr = isKana ? (state.destinationKana || state.destinationJp)
                          : (isZh ? (state.destinationZh || state.destinationJp)
                          : (isKo ? (state.destinationKo || state.destinationJp) : state.destinationJp));
            const suffixStr = isKo ? '방면' : (state.destSuffixJp || '方面');
            // 長い地名は文字を小さくして、「方面」と重ならないように同じ行に並べる
            const destFont = destStr.length > 9 ? 'text-[2.7cqw]' : (destStr.length > 6 ? 'text-[3.1cqw]' : 'text-[3.55cqw]');
            pillarDestHtml = `
              <div class="w-full flex items-end justify-between gap-[0.6cqw] pb-[2.8cqh] min-w-0">
                <div class="${destFont} text-white font-bold leading-none tracking-tight whitespace-nowrap overflow-hidden min-w-0">${escapeHtml(destStr)}</div>
                <div class="shrink-0 text-slate-200 font-bold text-[2.0cqw] leading-none pb-[0.2cqh]">${escapeHtml(suffixStr)}</div>
              </div>
            `;
          }
          updateRollStage('rollDestPillar', pillarDestHtml, animateRoll);

          clockLabel.classList.add('hidden');
          clockValue.className = 'clock-box-pillar';
          clockValue.textContent = getDisplayClockString();
          clockGroup.style.left = '43.5cqw';

          carE233.classList.add('hidden');
          carPillar.classList.remove('hidden');
          if (isEn) {
            carPillar.innerHTML = `
              <span class="text-[1.4cqw] font-bold font-['Roboto'] text-slate-200 mt-[0.2cqh]">Car No.</span>
              <span class="text-[4.35cqw] font-bold italic font-['Roboto'] leading-none">${state.carNumber}</span>
            `;
          } else {
            carPillar.innerHTML = `
              <div class="flex flex-col items-center leading-none">
                <span class="text-[3.85cqw] font-bold italic font-['Roboto'] text-slate-200">${state.carNumber}</span>
                <span class="text-[1.6cqw] font-bold text-slate-300 mt-[0.3cqh]">${isKo ? '호차' : '号車'}</span>
              </div>
            `;
          }
        } else {
          polyEl.classList.remove('hidden');
          pillarEl.classList.add('hidden');
          polyEl.style.background = `linear-gradient(180deg, ${adjustBrightness(state.lineColor, 10)} 0%, ${adjustBrightness(state.lineColor, -12)} 100%)`;

          let typeStr = state.trainTypeJp;
          if (isEn) typeStr = (state.trainTypeEn || 'Local').replace('\n', ' ');
          else if (isKana) typeStr = state.trainTypeKana || state.trainTypeJp;
          else if (isZh) typeStr = state.trainTypeZh || state.trainTypeJp;
          else if (isKo) typeStr = state.trainTypeKo || state.trainTypeJp;

          const typeSize = typeStr.length > 8 ? '2.8cqw' : (typeStr.length > 4 ? '3.7cqw' : '5.05cqw');
          const typeHtml = `<span class="train-type-text" style="color: ${state.trainTypeColor}; font-size: ${typeSize};">${escapeHtml(typeStr)}</span>`;
          updateRollStage('rollTrainType', typeHtml, animateRoll);

          let polyDestHtml = '';
          if (isEn) {
            const dEn = (state.destinationEn || 'Tōkyō').replace('\n', ' ');
            const fSize = dEn.length > 9 ? '2.6cqw' : '3.6cqw';
            polyDestHtml = `
              <div class="w-full h-full flex flex-col justify-center items-center relative">
                <span class="text-[1.9cqw] font-bold text-slate-200 leading-none mb-[0.4cqh]">For</span>
                <span class="text-white font-bold font-['Roboto'] leading-none whitespace-nowrap" style="font-size:${fSize};">${escapeHtml(dEn)}</span>
              </div>
            `;
          } else {
            const rawDest = isKana ? (state.destinationKana || state.destinationJp)
                          : (isZh ? (state.destinationZh || state.destinationJp)
                          : (isKo ? (state.destinationKo || state.destinationJp) : state.destinationJp));
            const formattedDest = (lang === 'jp' && rawDest.length === 2) ? `${rawDest[0]}　${rawDest[1]}` : rawDest;
            // 長い地名ほど文字を小さくし、付随語（方面など）と同じ行に収める
            const fSize = rawDest.length >= 13 ? '2.0cqw' : (rawDest.length >= 9 ? '2.5cqw' : (rawDest.length >= 6 ? '2.9cqw' : (rawDest.length >= 4 ? '3.35cqw' : '4.55cqw')));
            const yukiText = isKo ? '행' : (isZh ? '方向' : (state.destSuffixJp || 'ゆき'));
            polyDestHtml = `
              <div class="w-full h-full flex items-center justify-center gap-[1cqw] px-[1cqw] min-w-0">
                <span class="text-white font-bold leading-none whitespace-nowrap overflow-hidden min-w-0" style="font-size:${fSize};">${escapeHtml(formattedDest)}</span>
                <span class="shrink-0 text-slate-100 font-bold text-[2.25cqw] leading-none">${escapeHtml(yukiText)}</span>
              </div>
            `;
          }
          updateRollStage('rollDestPolygon', polyDestHtml, animateRoll);

          clockLabel.classList.remove('hidden');
          clockLabel.textContent = isEn ? 'Time' : (isKo ? '현재시각' : '現在時刻');
          clockValue.className = 'clock-box-e233';
          clockValue.textContent = getDisplayClockString();
          clockGroup.style.left = '30.2cqw';

          carE233.classList.remove('hidden');
          carPillar.classList.add('hidden');
          document.getElementById('carNumberBox').textContent = state.carNumber;
          document.getElementById('carNumberLabel').textContent = isEn ? 'Car No.' : (isKo ? '호차' : '号車');
        }

        updateRollStage('rollNextStatus', `<span class="next-label ${isEn ? "font-['Roboto']" : ''}">${escapeHtml(statusText)}</span>`, animateRoll);

        // Main Station Badge: Supports 3-Letter Code (TYO / KND / AKB) as seen in Video 00:00-00:44!
        const badgeOuter = document.getElementById('mainStationBadgeOuter');
        if (targetStation.threeLetter) {
          badgeOuter.style.height = '19.8cqh';
          badgeOuter.style.width = '8.6cqw';
          badgeOuter.innerHTML = `
            <div class="w-full h-full flex flex-col items-center justify-between">
              <div class="text-white font-['Roboto'] font-bold text-[2.2cqw] leading-none pt-[0.15cqh] tracking-wider">${escapeHtml(targetStation.threeLetter)}</div>
              <div class="w-full h-[14.2cqh] border-[0.65cqw] rounded-[0.65cqw] bg-[#f4f8fb] flex flex-col items-center justify-center leading-[0.92]" style="border-color: ${state.lineColor};">
                <span class="station-num-large-prefix">${escapeHtml(state.linePrefix)}</span>
                <span class="station-num-large-digits">${escapeHtml(targetStation.num)}</span>
              </div>
            </div>
          `;
        } else {
          badgeOuter.style.height = '15.2cqh';
          badgeOuter.style.width = '8.5cqw';
          badgeOuter.innerHTML = `
            <div class="station-num-large-border" style="border-color: ${state.lineColor};">
              <span class="station-num-large-prefix">${escapeHtml(state.linePrefix)}</span>
              <span class="station-num-large-digits">${escapeHtml(targetStation.num)}</span>
            </div>
          `;
        }

        let mainStSize = '10.6cqw';
        let mainScaleX = 1.0;
        if (isEn) {
          const len = mainStText.length;
          if (len > 15) { mainStSize = '5.2cqw'; mainScaleX = 0.9; }
          else if (len > 12) { mainStSize = '6.4cqw'; mainScaleX = 0.94; }
          else if (len > 9) { mainStSize = '8.0cqw'; }
          else { mainStSize = '10.4cqw'; }
        } else if (isKana) {
          const len = mainStText.length;
          if (len > 8) { mainStSize = '5.4cqw'; mainScaleX = 0.9; }
          else if (len > 6) { mainStSize = '6.8cqw'; mainScaleX = 0.95; }
          else if (len > 4) { mainStSize = '8.4cqw'; }
          else { mainStSize = '10.2cqw'; }
        } else {
          const len = mainStText.length;
          if (len > 7) { mainStSize = '6.0cqw'; mainScaleX = 0.92; }
          else if (len > 5) { mainStSize = '7.4cqw'; }
          else if (len === 4) { mainStSize = '9.2cqw'; }
          else { mainStSize = '10.6cqw'; }
        }

        updateRollStage(
          'rollMainStation',
          `<span class="main-station-name inline-block ${isEn ? 'en-font' : ''}" style="font-size: ${mainStSize}; transform: scaleX(${mainScaleX});">${escapeHtml(mainStText)}</span>`,
          animateRoll
        );
    }

    function renderLCDHeader(ctx) {
      const { lang, isEn, isKana, isZh, isKo, targetIdx, targetStation, animateRoll } = ctx;
      // ----------------------------------------------------------
      // A. HEADER RENDERING (Style A: Polygon, Style B: Pillar, Style C: Whitebox)
      // ----------------------------------------------------------
      const darkHeaderWrap = document.getElementById('headerDarkContainer');
      const wbHeaderWrap = document.getElementById('headerWhiteboxContainer');

      let statusText = '次は';
      if (state.runningPhase === 'next') {
        statusText = isEn ? 'Next' : (isKana ? 'つぎは' : (isZh ? '下一站' : (isKo ? '다음은' : '次は')));
      } else if (state.runningPhase === 'arriving') {
        statusText = isEn ? 'Arriving at' : (isKana ? 'まもなく' : (isZh ? '即将到达' : (isKo ? '잠시 후' : 'まもなく')));
      } else {
        statusText = isEn ? 'Now stopping at' : (isKana ? 'ただいま' : (isZh ? '本站是' : (isKo ? '이번 역은' : 'ただいま')));
      }

      // Format station name with authentic 2-char wide spacing ("東　京", "神　田", "高　尾")
      let mainStText = targetStation.nameJp;
      if (isEn) {
        mainStText = targetStation.nameEn;
      } else if (isKana) {
        mainStText = targetStation.nameKana || targetStation.nameJp;
      } else if (isZh) {
        mainStText = targetStation.nameZh || targetStation.nameJp;
      } else if (isKo) {
        mainStText = targetStation.nameKo || targetStation.nameJp;
      } else if (mainStText.length === 2 && state.headerStyle === 'pillar') {
        mainStText = `${mainStText[0]}　${mainStText[1]}`;
      }

      const h = { statusText, mainStText, darkHeaderWrap, wbHeaderWrap };
      if (state.headerStyle === 'whitebox') {
        renderWhiteboxHeader(ctx, h);
      } else {
        renderDarkHeader(ctx, h);
      }
    }

    /* 本体レイアウトの切替と描画（12種類） */
    function renderBodyLayout(ctx) {
      const { isEn, targetIdx, targetStation } = ctx;
      // ----------------------------------------------------------
      // D. LOWER BODY LAYOUT SWITCHING (All 12 Authentic Layouts)
      // ----------------------------------------------------------
      const views = {
        straight: document.getElementById('viewStraightRoute'),
        loop: document.getElementById('viewYamanoteLoop'),
        curve: document.getElementById('viewYamanoteCurve'),
        curve_rtl: document.getElementById('viewYamanoteCurveRtl'),
        notice_info: document.getElementById('viewNoticeInfo'),
        platform: document.getElementById('viewPlatformStop'),
        sobu_rect: document.getElementById('viewSobuRect'),
        chuo_stopping: document.getElementById('viewChuoStopping'),
        chuo_platform: document.getElementById('viewChuoPlatform'),
        chuo_door: document.getElementById('viewChuoDoor'),
        chuo_transfer: document.getElementById('viewChuoTransfer'),
        chuo_train_info: document.getElementById('viewChuoTrainInfo')
      };

      Object.keys(views).forEach(k => {
        if (!views[k]) return;
        if (k === state.bodyLayout) {
          views[k].classList.remove('hidden');
          if (k === 'platform') views[k].classList.add('flex');
        } else {
          views[k].classList.add('hidden');
          if (k === 'platform') views[k].classList.remove('flex');
        }
        const btn = document.getElementById(`layoutBtn_${k}`);
        if (btn) {
          btn.className = k === state.bodyLayout
            ? 'm3-seg-btn active !px-2.5 !py-1 text-[11px]'
            : 'm3-seg-btn !px-2.5 !py-1 text-[11px]';
        }
      });

      const lockKanjiOnMap = document.getElementById('chkCurveKanjiLock')?.checked;
      const mapIsEn = isEn && !lockKanjiOnMap;

      const layoutRenderers = {
        straight: () => renderStraightRouteView(targetIdx, mapIsEn),
        loop: () => renderYamanoteLoopView(targetStation, mapIsEn),
        curve: () => renderYamanoteCurveView(targetIdx, mapIsEn),
        curve_rtl: () => renderYamanoteCurveRtlView(targetIdx, mapIsEn),
        notice_info: () => renderNoticeInfoView(),
        platform: () => renderPlatformStopView(targetStation, isEn),
        sobu_rect: () => renderSobuRectView(targetIdx, mapIsEn),
        chuo_stopping: () => renderChuoStoppingView(targetStation),
        chuo_platform: () => renderChuoPlatformView(targetStation),
        chuo_door: () => renderChuoDoorView(targetStation),
        chuo_transfer: () => renderChuoTransferView(targetStation),
        chuo_train_info: () => renderChuoTrainInfoView(),
      };
      const drawLayout = layoutRenderers[state.bodyLayout];
      if (drawLayout) drawLayout();
    }

    /* 下部のフェーズボタン表示 */
    function renderPhaseLabel() {
      const phaseLabels = {
        next: '状態: 次は (走行中)',
        arriving: '状態: まもなく (接近点滅)',
        stopped: '状態: ただいま (停車中)'
      };
      document.getElementById('phaseBtnLabel').textContent = phaseLabels[state.runningPhase];
    }

    function renderLCD(animateRoll = true) {
      const ctx = createRenderContext(animateRoll);
      renderTopBadge(ctx);
      renderLCDHeader(ctx);
      renderQuickStationPills(ctx.targetIdx);
      renderBodyLayout(ctx);
      renderPhaseLabel();
    }

