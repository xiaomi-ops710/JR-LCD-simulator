// 本体ビュー群と路線ナビゲーション
    /* ==========================================================
       5. BODY VIEW 1: STRAIGHT 8-STATION ROUTE MAP (Photo 1)
       ========================================================== */
    /* 接近中（arriving）の山形矢印を点滅させるクラス */
    function getChevronBlinkClass() {
      return state.runningPhase === 'arriving' ? 'chevron-blinking' : '';
    }

    function renderStraightRouteView(nextStopIdx, isEn) {
      const maxStart = Math.max(0, state.stations.length - 8);
      const windowStart = Math.min(state.currentStationIndex, maxStart);
      const visibleStations = state.stations.slice(windowStart, windowStart + 8);
      const baseMins = state.stations[state.currentStationIndex] ? state.stations[state.currentStationIndex].mins : 0;

      const orderedStations = state.direction === 'rtl'
        ? [...visibleStations].reverse()
        : [...visibleStations];

      const container = document.getElementById('routeColumnsContainer');
      container.innerHTML = '';

      orderedStations.forEach((st, colIdx) => {
        const globalIdx = state.stations.indexOf(st);
        const isDeparted = globalIdx <= state.currentStationIndex && state.runningPhase !== 'stopped';
        const isCurrentStopped = globalIdx === state.currentStationIndex && state.runningPhase === 'stopped';
        const isNextTarget = globalIdx === nextStopIdx && state.runningPhase !== 'stopped';
        const isSkipped = !st.stop;
        const relMins = Math.max(1, st.mins - baseMins);

        const isTerminalEndOfBar = (state.direction === 'rtl' && colIdx === 0) ||
                                   (state.direction === 'ltr' && colIdx === orderedStations.length - 1);

        const colEl = document.createElement('div');
        colEl.className = 'station-col cursor-pointer hover:opacity-85 transition-opacity';
        colEl.title = `${st.nameJp}駅へ移動`;
        colEl.onclick = () => selectStationDirectly(globalIdx);

        let stationNameHtml = '';
        if (isEn) {
          stationNameHtml = `
            <div class="english-station-name-box">
              <span class="english-station-name ${isSkipped ? 'text-slate-400' : ''}">${escapeHtml(st.nameEn)}</span>
            </div>
          `;
        } else {
          const displayStr = state.lang === 'kana' && !document.getElementById('chkCurveKanjiLock')?.checked
            ? (st.nameKana || st.nameJp)
            : st.nameJp;
          const chars = Array.from(displayStr);
          const charsHtml = chars.map(ch => {
            const isDash = ch === 'ー' || ch === '－' || ch === '-';
            return `<span class="vertical-char ${isDash ? 'rotate-dash' : ''}">${escapeHtml(ch)}</span>`;
          }).join('');
          const fontSizeStyle = chars.length >= 6 ? 'font-size: 2.35cqw;' : (chars.length === 5 ? 'font-size: 2.95cqw;' : '');
          stationNameHtml = `
            <div class="vertical-station-name ${isSkipped ? 'skipped-station' : (isDeparted ? 'passed-station' : '')}" style="${fontSizeStyle}">
              ${charsHtml}
            </div>
          `;
        }

        let circleHtml = '';
        if (isCurrentStopped) {
          circleHtml = `<div class="minute-circle next-active animate-car-highlight">●</div>`;
        } else if (isDeparted) {
          circleHtml = `<div class="departed-dot"></div>`;
        } else if (isSkipped) {
          circleHtml = ``;
        } else {
          const unitHtml = isTerminalEndOfBar
            ? `<span class="minute-unit-label">${isEn ? '(min)' : '(分)'}</span>`
            : '';
          circleHtml = `
            <div class="minute-circle ${isNextTarget ? 'next-active' : ''}">
              ${relMins}
            </div>
            ${unitHtml}
          `;
        }

        let transfersHtml = '';
        if (st.transfers && st.transfers.length > 0 && !isSkipped) {
          const items = st.transfers.map(tr => {
            const lines = (isEn ? (tr.textEn || tr.textJp) : tr.textJp).split('|');
            const textBlock = lines.map(l => `<div>${escapeHtml(l)}</div>`).join('');
            let badgeEl = '';
            if (tr.badge === 'SHINKANSEN_E' || tr.badge === 'SHINKANSEN_W') {
              badgeEl = `<span class="inline-flex items-center justify-center w-[1.7cqw] h-[2.6cqh] rounded-[0.2cqw] text-white text-[0.95cqw] flex-shrink-0 mt-[0.1cqh]" style="background:${tr.badgeColor || '#008c45'};">🚄</span>`;
            } else if (tr.badgeShape === 'circle') {
              badgeEl = `<span class="inline-flex items-center justify-center w-[1.65cqw] h-[2.6cqh] rounded-full border-[0.22cqw] bg-white font-['Roboto'] font-black text-[0.85cqw] leading-none flex-shrink-0 mt-[0.1cqh]" style="border-color:${tr.badgeColor || '#006cb6'}; color:#111827;">${escapeHtml(tr.badge)}</span>`;
            } else if (tr.badge === 'RAIL') {
              badgeEl = `<span class="transfer-badge-rail">🚆</span>`;
            } else {
              badgeEl = `<span class="transfer-badge-jm" style="border-color: ${tr.badgeColor || '#e05316'}">${escapeHtml(tr.badge || 'JR')}</span>`;
            }
            return `<div class="transfer-item">${badgeEl}<div class="text-left leading-tight">${textBlock}</div></div>`;
          }).join('');
          transfersHtml = `<div class="transfer-list">${items}</div>`;
        }

        colEl.innerHTML = `
          ${stationNameHtml}
          <div class="minute-circle-slot">${circleHtml}</div>
          <div class="below-bar-slot">
            <div class="station-num-mini" style="border-color: ${isSkipped ? '#94a3b8' : state.lineColor}; opacity: ${isSkipped ? '0.65' : '1'};">
              <span class="station-num-mini-prefix">${escapeHtml(state.linePrefix)}</span>
              <span class="station-num-mini-digits">${escapeHtml(st.num)}</span>
            </div>
            ${transfersHtml}
          </div>
        `;
        container.appendChild(colEl);
      });

      renderStraightRouteBarSvg();
    }

    function renderStraightRouteBarSvg() {
      const svg = document.getElementById('routeBarSvg');
      const lineColor = state.lineColor;
      const blinkClass = getChevronBlinkClass();
      const progRatio = state.runningPhase === 'stopped' ? 0 : (state.trainProgress / 100);

      if (state.direction === 'rtl') {
        const gx = Math.round(786 - progRatio * 54);
        svg.innerHTML = `
          <polygon points="22,0 ${gx - 6},0 ${gx - 28},49 ${gx - 6},98 22,98 0,49" fill="${lineColor}" />
          <polygon class="${blinkClass}" points="${gx + 2},0 ${gx + 34},0 ${gx + 12},49 ${gx + 34},98 ${gx + 2},98 ${gx - 20},49" fill="#064e32" />
          <polygon points="${gx + 42},0 896,0 896,98 ${gx + 42},98 ${gx + 20},49" fill="#666a6e" />
        `;
      } else {
        const gx = Math.round(114 + progRatio * 54);
        svg.innerHTML = `
          <polygon points="4,0 ${gx - 42},0 ${gx - 20},49 ${gx - 42},98 4,98" fill="#666a6e" />
          <polygon class="${blinkClass}" points="${gx - 34},0 ${gx - 2},0 ${gx + 20},49 ${gx - 2},98 ${gx - 34},98 ${gx - 12},49" fill="#064e32" />
          <polygon points="${gx + 6},0 878,0 900,49 878,98 ${gx + 6},98 ${gx + 28},49" fill="${lineColor}" />
        `;
      }
    }

    /* ==========================================================
       6. BODY VIEW 2: YAMANOTE FULL LOOP ROUTE MAP
          Updated to support:
          - Outer Loop (IMG_4439 新大久保 on left)
          - Inner Loop (Video 00:19 神田 2 on right with maroon chevron)
          - English Slanted Station Names (Video 00:43)
       ========================================================== */
    function renderYamanoteLoopView(targetStation, isEn) {
      const container = document.getElementById('yamanoteLoopContainer');
      const isInner = state.loopMode === 'inner';
      const discEl = document.getElementById('bottomDisclaimerLoop');
      if (discEl) {
        discEl.textContent = isEn
          ? 'Transfer and waiting times are not included. Times may differ by train.'
          : 'のりかえ、待ち合せ時間は含まれません。電車により多少時間が異なります。';
      }

      const topStationsHtml = YAMANOTE_LOOP_TOP.map((st, idx) => {
        let labelHtml = '';
        if (isEn) {
          labelHtml = `
            <div class="h-[19cqh] w-full relative flex items-end justify-center pb-[0.8cqh]">
              <span class="absolute bottom-[1.0cqh] left-[45%] origin-bottom-left -rotate-[54deg] font-['Roboto'] font-bold text-[#181c20] text-[1.95cqw] whitespace-nowrap">${escapeHtml(st.nameEn)}</span>
            </div>
          `;
        } else {
          const chars = Array.from(st.nameJp);
          const vChars = chars.map(c => `<span class="block leading-[1.03]">${escapeHtml(c)}</span>`).join('');
          labelHtml = `
            <div class="h-[19cqh] flex flex-col justify-between items-center text-[#181c20] font-bold text-[2.35cqw] pb-[0.8cqh]">
              ${vChars}
            </div>
          `;
        }

        let markerHtml = '';
        if (!isInner) {
          // Outer Loop (IMG_4439: Shin-Okubo at idx 0 is red pentagon)
          const isCurrent = idx === 0;
          if (isCurrent) {
            markerHtml = `
              <div class="relative flex items-center justify-center w-[4.4cqw] h-[4.4cqh]">
                <svg viewBox="0 0 56 44" class="w-full h-full overflow-visible">
                  <polygon points="0,0 44,0 54,22 44,44 0,44" fill="#b92b46" stroke="#ffffff" stroke-width="2.5"/>
                  <circle cx="22" cy="22" r="7.5" fill="#ffffff"/>
                </svg>
              </div>
            `;
          } else {
            const isLast = idx === YAMANOTE_LOOP_TOP.length - 1;
            markerHtml = `
              <div class="relative flex items-center justify-center">
                <div class="w-[3.1cqw] h-[5.2cqh] rounded-full bg-[#eef3f7] text-[#1e2226] font-['Roboto'] font-black text-[2.0cqw] flex items-center justify-center shadow-sm">
                  ${st.mins}
                </div>
                ${isLast ? `<span class="absolute -right-[2.3cqw] bottom-0 text-[1.15cqw] font-bold text-[#1e2226]">(分)</span>` : ''}
              </div>
            `;
          }
        } else {
          // Inner Loop (Video 00:19 & 00:43: Kanda at idx 14 is orange circle 2 + maroon left chevron!)
          const isKandaNext = idx === 14;
          markerHtml = `
            <div class="relative flex items-center justify-center">
              <div class="w-[3.25cqw] h-[5.4cqh] rounded-full ${isKandaNext ? 'bg-[#f59e0b] border-[0.22cqw] border-white' : 'bg-[#eef3f7]'} text-[#181c20] font-['Roboto'] font-black text-[2.05cqw] flex items-center justify-center shadow-sm z-20">
                ${st.innerMins}
              </div>
              ${isKandaNext ? `
                <svg viewBox="0 0 36 44" class="absolute -right-[2.35cqw] w-[2.4cqw] h-[5.2cqh] overflow-visible z-30">
                  <polygon points="34,2 14,2 2,22 14,42 34,42 22,22" fill="#8c1d24" stroke="#ffffff" stroke-width="2.5"/>
                </svg>
              ` : ''}
            </div>
          `;
        }

        return `
          <div class="flex flex-col items-center justify-end h-full">
            ${labelHtml}
            <div class="h-[6.4cqh] flex items-center justify-center z-20">
              ${markerHtml}
            </div>
          </div>
        `;
      }).join('');

      const bottomStationsHtml = YAMANOTE_LOOP_BOTTOM.map((st) => {
        let nameColHtml = '';
        if (isEn) {
          nameColHtml = `
            <div class="h-[19.5cqh] w-full relative flex items-start justify-center pt-[0.8cqh]">
              <span class="absolute top-[1.5cqh] right-[42%] origin-top-right -rotate-[54deg] font-['Roboto'] font-bold text-[#181c20] text-[1.9cqw] whitespace-nowrap">${escapeHtml(st.nameEn)}</span>
            </div>
          `;
        } else if (st.nameJp.includes('|')) {
          const parts = st.nameJp.split('|');
          const colRight = Array.from(parts[0]).map(c => `<span class="block leading-[1.02]">${escapeHtml(c)}</span>`).join('');
          const colLeft = Array.from(parts[1]).map(c => {
            const isDash = c === 'ー';
            return `<span class="block leading-[0.95] text-[1.5cqw] ${isDash ? 'rotate-90' : ''}">${escapeHtml(c)}</span>`;
          }).join('');
          nameColHtml = `
            <div class="h-[19.5cqh] flex flex-row-reverse items-start justify-center gap-[0.15cqw] pt-[0.6cqh] text-[#181c20] font-bold">
              <div class="flex flex-col items-center text-[2.1cqw]">${colRight}</div>
              <div class="flex flex-col justify-between items-center h-full">${colLeft}</div>
            </div>
          `;
        } else {
          const chars = Array.from(st.nameJp);
          const vChars = chars.map(c => `<span class="block leading-[1.03]">${escapeHtml(c)}</span>`).join('');
          nameColHtml = `
            <div class="h-[17cqh] flex flex-col justify-between items-center text-[#181c20] font-bold text-[2.35cqw] pt-[0.8cqh]">
              ${vChars}
            </div>
          `;
        }

        return `
          <div class="flex flex-col items-center justify-start h-full">
            <div class="h-[5.8cqh] flex items-center justify-center z-20">
              <div class="w-[1.25cqw] h-[2.2cqh] rounded-full bg-[#eef3f7]"></div>
            </div>
            ${nameColHtml}
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <svg viewBox="0 0 1000 390" preserveAspectRatio="none" class="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <rect x="78" y="138" width="844" height="92" rx="46" ry="46"
                fill="none" stroke="#68b832" stroke-width="34" />
          ${isInner ? `
            <polyline points="66,176 78,192 90,176" fill="none" stroke="#e2e8f0" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="910,192 922,176 934,192" fill="none" stroke="#e2e8f0" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
          ` : `
            <polyline points="66,192 78,176 90,192" fill="none" stroke="#e2e8f0" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="910,176 922,192 934,176" fill="none" stroke="#e2e8f0" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
          `}
        </svg>

        <div class="absolute top-[1.2cqh] left-[11.5cqw] right-[11.5cqw] h-[26.2cqh] grid z-20" style="grid-grid-template-columns: repeat(15, minmax(0, 1fr)); grid-template-columns: repeat(15, minmax(0, 1fr));">
          ${topStationsHtml}
        </div>

        <div class="absolute top-[32.8cqh] left-[11.5cqw] right-[11.5cqw] h-[26.5cqh] grid z-20" style="grid-template-columns: repeat(15, minmax(0, 1fr));">
          ${bottomStationsHtml}
        </div>
      `;
    }

    /* ==========================================================
       7. BODY VIEW 3: YAMANOTE CURVED ARC ROUTE MAP (IMG_4438_2.jpeg)
       PIXEL-ACCURATE REBUILD OF IMG_4438_2!
       Let's match the exact geometry, perspective tapering,
       station label typography, JY badges, minute circles,
       maroon chevron arrow, and right-side transfer block.
       ========================================================== */
    function renderYamanoteCurveView(nextStopIdx, isEn) {
      const container = document.getElementById('yamanoteCurveContainer');

      // Gather 5 upcoming stations starting from nextStopIdx
      const upcoming = [];
      for (let i = 0; i < 5; i++) {
        const st = state.stations[(nextStopIdx + i) % state.stations.length];
        if (st) upcoming.push(st);
      }
      const baseMins = state.stations[state.currentStationIndex]?.mins || 0;

      /*
       * Exact SVG & Percentage Coordinates calibrated to IMG_4438_2.jpeg:
       * SVG viewBox: 1000 x 400
       * Outer (left-top) curve edge starts at (248, 400) and sweeps to (755, 0)
       * Inner (right-bottom) curve edge starts at (398, 400) and sweeps to (972, 0)
       * The 5 minute circles sit cleanly along the centerline of this tapered band!
       */
      const curveNodes = [
        {
          // Row 1 (Bottom: 巣　鴨 JY11, Circle 2)
          badgeRight: '66.6%', rowCenterY: '75.5%',
          nameFontSize: '5.35cqw', nameWidth: '16.5cqw', badgeScale: 1.16,
          circleX: '36.6%', circleY: '76.5%', circleW: '6.3cqw', circleH: '10.6cqh', numSize: '4.1cqw',
          isNext: true
        },
        {
          // Row 2 (駒　込 JY10, Circle 4)
          badgeRight: '59.8%', rowCenterY: '56.2%',
          nameFontSize: '4.75cqw', nameWidth: '14.6cqw', badgeScale: 1.05,
          circleX: '43.4%', circleY: '58.0%', circleW: '5.3cqw', circleH: '8.9cqh', numSize: '3.45cqw',
          isNext: false
        },
        {
          // Row 3 (田　端 JY09, Circle 6)
          badgeRight: '51.8%', rowCenterY: '38.2%',
          nameFontSize: '4.25cqw', nameWidth: '13.2cqw', badgeScale: 0.94,
          circleX: '51.2%', circleY: '42.0%', circleW: '4.7cqw', circleH: '7.9cqh', numSize: '3.05cqw',
          isNext: false
        },
        {
          // Row 4 (西日暮里 JY08, Circle 8)
          badgeRight: '42.8%', rowCenterY: '21.8%',
          nameFontSize: '3.35cqw', nameWidth: '13.8cqw', badgeScale: 0.82,
          circleX: '59.8%', circleY: '27.8%', circleW: '4.15cqw', circleH: '7.0cqh', numSize: '2.65cqw',
          isNext: false
        },
        {
          // Row 5 (Top: 日暮里 JY07, Circle 10 + (分))
          badgeRight: '33.6%', rowCenterY: '8.2%',
          nameFontSize: '2.85cqw', nameWidth: '9.5cqw', badgeScale: 0.72,
          circleX: '68.6%', circleY: '16.2%', circleW: '3.85cqw', circleH: '6.5cqh', numSize: '2.35cqw',
          isNext: false
        }
      ];

      const nodesHtml = upcoming.map((st, idx) => {
        const pos = curveNodes[idx];
        const mins = Math.max((idx + 1) * 2, st.mins - baseMins);

        // Station name formatting:
        // In IMG_4438_2.jpeg, 2-character Kanji names ("巣 鴨", "駒 込", "田 端") are justified across a wide block!
        let stationLabelHtml = '';
        if (isEn) {
          stationLabelHtml = `
            <span class="font-bold font-['Roboto'] text-[#1a2233] tracking-tight whitespace-nowrap leading-none text-right"
                  style="font-size: calc(${pos.nameFontSize} * 0.72);">
              ${escapeHtml(st.nameEn)}
            </span>
          `;
        } else {
          const chars = Array.from(st.nameJp);
          if (chars.length === 2) {
            // Wide justified 2-Kanji layout matching "巣　鴨", "駒　込", "田　端" in IMG_4438_2!
            stationLabelHtml = `
              <div class="flex items-center justify-between font-bold text-[#1a2233] leading-none"
                   style="width: ${pos.nameWidth}; font-size: ${pos.nameFontSize};">
                <span>${escapeHtml(chars[0])}</span>
                <span>${escapeHtml(chars[1])}</span>
              </div>
            `;
          } else {
            stationLabelHtml = `
              <div class="font-bold text-[#1a2233] tracking-tight whitespace-nowrap leading-none text-right"
                   style="font-size: ${pos.nameFontSize};">
                ${escapeHtml(st.nameJp)}
              </div>
            `;
          }
        }

        return `
          <!-- Station Name + Square JY Number Badge aligned to left edge of the green curve -->
          <div class="absolute -translate-y-1/2 flex items-center justify-end gap-[0.95cqw] z-20"
               style="right: ${pos.badgeRight}; top: ${pos.rowCenterY};">
            ${stationLabelHtml}
            <div class="station-num-mini"
                 style="border-color: ${state.lineColor}; transform: scale(${pos.badgeScale}); transform-origin: center;">
              <span class="station-num-mini-prefix">${escapeHtml(state.linePrefix)}</span>
              <span class="station-num-mini-digits">${escapeHtml(st.num)}</span>
            </div>
          </div>

          <!-- Minute Circle Inside the Green Curve -->
          <div class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-['Roboto'] font-black z-20 ${
            pos.isNext
              ? 'bg-[#f4cf42] text-[#181c22] border-[0.3cqw] border-white shadow-md'
              : 'bg-[#f8fafc] text-[#1a2233] shadow-sm'
          }"
               style="left: ${pos.circleX}; top: ${pos.circleY}; width: ${pos.circleW}; height: ${pos.circleH}; font-size: ${pos.numSize};">
            <span class="tracking-tighter leading-none">${mins}</span>
            ${idx === 4 ? `<span class="absolute -right-[2.55cqw] bottom-[0.1cqh] text-[1.4cqw] font-bold text-[#1a2233] whitespace-nowrap">${isEn ? '(min)' : '(分)'}</span>` : ''}
          </div>
        `;
      }).join('');

      // Right-Side Transfer Guide for the Next Station (Exact match to "巣鴨駅 / 乗換えのご案内 / 都営三田線" in IMG_4438_2)
      const nextSt = upcoming[0] || state.stations[0];
      const trList = nextSt.transfers || [];

      let transferRightBlockHtml = '';
      if (trList.length > 0) {
        const trItemsHtml = trList.map(tr => {
          const isCircle = tr.badgeShape === 'circle';
          const badgeColor = tr.badgeColor || '#006cb6';
          const badgeHtml = isCircle
            ? `<span class="inline-flex items-center justify-center w-[2.3cqw] h-[3.9cqh] rounded-full border-[0.38cqw] bg-white font-['Roboto'] font-black text-[1.15cqw] leading-none shadow-sm" style="border-color:${badgeColor}; color:${badgeColor};">${escapeHtml(tr.badge || 'I')}</span>`
            : `<span class="inline-flex items-center justify-center px-[0.35cqw] h-[3.6cqh] rounded-[0.3cqw] border-[0.26cqw] bg-white font-['Roboto'] font-black text-[1.1cqw] leading-none shadow-sm" style="border-color:${badgeColor}; color:#181b20;">${escapeHtml(tr.badge || 'JR')}</span>`;

          return `
            <div class="flex items-center justify-end gap-[0.55cqw] mt-[1.0cqh]">
              ${badgeHtml}
              <span class="font-bold text-[2.55cqw] text-[#1a2233] tracking-tight">${escapeHtml(isEn ? (tr.textEn || tr.textJp) : tr.textJp)}</span>
            </div>
          `;
        }).join('');

        transferRightBlockHtml = `
          <div class="absolute right-[4.8cqw] top-[31.5cqh] text-right z-20">
            <div class="font-bold text-[2.25cqw] text-[#1a2233] leading-tight">
              ${escapeHtml(isEn ? nextSt.nameEn + ' Sta.' : nextSt.nameJp + '駅')}
            </div>
            <div class="font-bold text-[2.2cqw] text-[#64707d] leading-tight mt-[0.25cqh]">
              ${isEn ? 'Transfer Guide' : '乗換えのご案内'}
            </div>
            ${trItemsHtml}
          </div>
        `;
      }

      // Maroon/Red Chevron Arrow at bottom of the green curve (IMG_4438_2)
      // Interpolate smoothly along the bottom curve segment according to trainProgress
      const prog = state.runningPhase === 'arriving' ? 0.45 : (state.trainProgress / 100) * 0.42;
      const chevX = 335 + prog * 24;
      const chevY = 362 - prog * 30;
      const blinkClass = getChevronBlinkClass();

      container.innerHTML = `
        <!-- Pixel-Calibrated Sweeping Green Curve SVG (IMG_4438_2.jpeg) -->
        <svg viewBox="0 0 1000 400" preserveAspectRatio="none" class="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <defs>
            <!-- Authentic Yamanote Curve Gradient: rich green at bottom-left fading to soft pastel green at top-right -->
            <linearGradient id="yamanoteCurveFill" x1="25%" y1="100%" x2="92%" y2="0%">
              <stop offset="0%"   stop-color="#58b32b" />
              <stop offset="48%"  stop-color="#6ec03c" />
              <stop offset="82%"  stop-color="#87cd58" />
              <stop offset="100%" stop-color="#b5e292" />
            </linearGradient>
          </defs>

          <!-- Main Tapered Green Arc Band -->
          <path d="M 248 400 C 338 232, 540 58, 755 0 L 972 0 C 665 44, 480 218, 398 400 Z"
                fill="url(#yamanoteCurveFill)" />

          <!-- Subtle Outer (Left/Top) Olive Edge Line -->
          <path d="M 248 400 C 338 232, 540 58, 755 0"
                fill="none" stroke="#4d9e22" stroke-width="2" />

          <!-- Subtle White Inner Bevel Highlight along Right Curve Edge -->
          <path d="M 394 400 C 476 218, 661 46, 966 2"
                fill="none" stroke="#d9f2c4" stroke-width="2.5" opacity="0.7" />

          <!-- Crisp Dark Charcoal Inner Curve Border Line (Signature feature of IMG_4438_2!) -->
          <path d="M 398 400 C 480 218, 665 44, 972 0"
                fill="none" stroke="#1b2228" stroke-width="3.8" />

          <!-- Maroon/Red 3D Chevron Arrow inside Bottom of Green Curve (IMG_4438_2) -->
          <g transform="translate(${chevX}, ${chevY}) rotate(25)" class="${blinkClass}">
            <polygon points="-37,16 0,-12 37,16 26,30 0,10 -26,30"
                     fill="#8c2230" stroke="#ffffff" stroke-width="3.2" stroke-linejoin="round" />
          </g>
        </svg>

        ${nodesHtml}
        ${transferRightBlockHtml}
      `;
    }

    /* ==========================================================
       7B. BODY VIEW 4: YAMANOTE RIGHT-TO-LEFT CURVED ARC (Video 00:00-00:06 & 00:31-00:42)
       Exact reproduction of the uploaded video's Tokyo & Kanda curve map!
       ========================================================== */
    function renderYamanoteCurveRtlView(nextStopIdx, isEn) {
      const container = document.getElementById('yamanoteCurveRtlContainer');
      const isStopped = state.runningPhase === 'stopped';
      const startIdx = isStopped ? state.currentStationIndex : nextStopIdx;

      const upcoming = [];
      for (let i = 0; i < 5; i++) {
        const st = state.stations[(startIdx + i) % state.stations.length];
        if (st) upcoming.push(st);
      }

      // Calibrated to Video 00:00 (Stopped at Tokyo) & 00:31 (Next Kanda)
      const rtlNodes = [
        {
          // Row 1 (Bottom-Right: JY01 東　京 or JY02 神　田)
          badgeLeft: '71.2%', rowCenterY: '78.5%',
          nameFontSize: '5.5cqw', nameWidth: '17.2cqw', badgeScale: 1.18,
          circleX: '62.0%', circleY: '79.0%', circleW: '6.3cqw', circleH: '10.6cqh', numSize: '4.1cqw'
        },
        {
          // Row 2 (JY02 神　田 or JY03 秋葉原)
          badgeLeft: '62.8%', rowCenterY: '58.0%',
          nameFontSize: '4.85cqw', nameWidth: '15.2cqw', badgeScale: 1.06,
          circleX: '54.8%', circleY: '59.2%', circleW: '5.3cqw', circleH: '8.9cqh', numSize: '3.45cqw'
        },
        {
          // Row 3 (JY03 秋葉原 or JY04 御徒町)
          badgeLeft: '54.4%', rowCenterY: '39.2%',
          nameFontSize: '4.3cqw', nameWidth: '13.5cqw', badgeScale: 0.95,
          circleX: '47.2%', circleY: '42.8%', circleW: '4.7cqw', circleH: '7.9cqh', numSize: '3.05cqw'
        },
        {
          // Row 4 (JY04 御徒町 or JY05 上　野)
          badgeLeft: '44.6%', rowCenterY: '22.2%',
          nameFontSize: '3.6cqw', nameWidth: '11.4cqw', badgeScale: 0.84,
          circleX: '39.4%', circleY: '27.8%', circleW: '4.15cqw', circleH: '7.0cqh', numSize: '2.65cqw'
        },
        {
          // Row 5 (Top-Left: JY05 上　野 or JY06 鶯　谷)
          badgeLeft: '35.2%', rowCenterY: '8.0%',
          nameFontSize: '3.0cqw', nameWidth: '9.6cqw', badgeScale: 0.74,
          circleX: '31.4%', circleY: '15.5%', circleW: '3.85cqw', circleH: '6.5cqh', numSize: '2.35cqw'
        }
      ];

      const nodesHtml = upcoming.map((st, idx) => {
        const pos = rtlNodes[idx];
        const mins = isStopped ? (idx * 2) : ((idx + 1) * 2);

        let stationLabelHtml = '';
        if (isEn) {
          stationLabelHtml = `
            <span class="font-bold font-['Roboto'] text-[#181c22] tracking-tight whitespace-nowrap leading-none text-left"
                  style="font-size: calc(${pos.nameFontSize} * 0.72);">
              ${escapeHtml(st.nameEn)}
            </span>
          `;
        } else {
          const chars = Array.from(st.nameJp);
          if (chars.length === 2) {
            stationLabelHtml = `
              <div class="flex items-center justify-between font-bold text-[#181c22] leading-none"
                   style="width: ${pos.nameWidth}; font-size: ${pos.nameFontSize};">
                <span>${escapeHtml(chars[0])}</span>
                <span>${escapeHtml(chars[1])}</span>
              </div>
            `;
          } else {
            stationLabelHtml = `
              <div class="font-bold text-[#181c22] tracking-tight whitespace-nowrap leading-none text-left"
                   style="font-size: ${pos.nameFontSize};">
                ${escapeHtml(st.nameJp)}
              </div>
            `;
          }
        }

        // In stopped mode (Video 00:00), idx 0 has the maroon pentagon with white dot instead of a minute circle
        let circleMarkerHtml = '';
        if (isStopped && idx === 0) {
          circleMarkerHtml = '';
        } else {
          const isHighlight = !isStopped && idx === 0;
          const isTopLast = idx === 4;
          circleMarkerHtml = `
            <div class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-['Roboto'] font-black z-20 ${
              isHighlight
                ? 'bg-[#eab308] text-[#181c22] border-[0.28cqw] border-white shadow-md'
                : 'bg-[#f8fafc] text-[#181c22] shadow-sm'
            }"
                 style="left: ${pos.circleX}; top: ${pos.circleY}; width: ${pos.circleW}; height: ${pos.circleH}; font-size: ${pos.numSize};">
              <span class="tracking-tighter leading-none">${mins}</span>
              ${isTopLast ? `<span class="absolute -right-[2.6cqw] bottom-[0.05cqh] text-[1.45cqw] font-bold text-[#181c22] whitespace-nowrap">(分)</span>` : ''}
            </div>
          `;
        }

        return `
          <div class="absolute -translate-y-1/2 flex items-center justify-start gap-[0.95cqw] z-20"
               style="left: ${pos.badgeLeft}; top: ${pos.rowCenterY};">
            <div class="station-num-mini"
                 style="border-color: ${state.lineColor}; transform: scale(${pos.badgeScale}); transform-origin: center;">
              <span class="station-num-mini-prefix">${escapeHtml(state.linePrefix)}</span>
              <span class="station-num-mini-digits">${escapeHtml(st.num)}</span>
            </div>
            ${stationLabelHtml}
          </div>
          ${circleMarkerHtml}
        `;
      }).join('');

      // Left-side Transfer Guide (Video 00:00 Tokyo Station 2-column transfers or 00:31 Kanda transfers)
      const activeSt = upcoming[0] || state.stations[0];
      const trList = activeSt.transfers || [];
      let transferLeftHtml = '';

      if (trList.length > 0) {
        const fullWidthItems = trList.filter(t => t.fullWidth);
        const gridItems = trList.filter(t => !t.fullWidth);

        const renderTrItem = (tr) => {
          let badgeHtml = '';
          if (tr.badge === 'SHINKANSEN_E' || tr.badge === 'SHINKANSEN_W') {
            badgeHtml = `
              <span class="inline-flex items-center justify-center w-[2.2cqw] h-[3.6cqh] rounded-[0.3cqw] text-white text-[1.3cqw] font-black flex-shrink-0 shadow-sm" style="background-color: ${tr.badgeColor};">🚄</span>
            `;
          } else if (tr.badgeShape === 'circle') {
            badgeHtml = `
              <span class="inline-flex items-center justify-center w-[2.2cqw] h-[3.7cqh] rounded-full border-[0.36cqw] bg-white font-['Roboto'] font-black text-[1.1cqw] leading-none flex-shrink-0" style="border-color:${tr.badgeColor}; color:#111827;">${escapeHtml(tr.badge)}</span>
            `;
          } else if (tr.badge2) {
            badgeHtml = `
              <span class="inline-flex items-center gap-[0.2cqw] flex-shrink-0">
                <span class="inline-flex items-center justify-center px-[0.3cqw] h-[3.4cqh] rounded-[0.28cqw] border-[0.25cqw] bg-white font-['Roboto'] font-black text-[1.05cqw] leading-none" style="border-color:${tr.badgeColor}; color:#111827;">${escapeHtml(tr.badge)}</span>
                <span class="inline-flex items-center justify-center px-[0.3cqw] h-[3.4cqh] rounded-[0.28cqw] border-[0.25cqw] bg-white font-['Roboto'] font-black text-[1.05cqw] leading-none" style="border-color:${tr.badge2Color}; color:#111827;">${escapeHtml(tr.badge2)}</span>
              </span>
            `;
          } else {
            badgeHtml = `
              <span class="inline-flex items-center justify-center px-[0.35cqw] h-[3.5cqh] rounded-[0.28cqw] border-[0.26cqw] bg-white font-['Roboto'] font-black text-[1.1cqw] leading-none flex-shrink-0" style="border-color:${tr.badgeColor}; color:#111827;">${escapeHtml(tr.badge)}</span>
            `;
          }

          const lines = (tr.textJp || '').split('|').map(l => `<div>${escapeHtml(l)}</div>`).join('');
          return `
            <div class="flex items-start gap-[0.45cqw]">
              ${badgeHtml}
              <div class="font-bold text-[1.95cqw] text-[#181c22] leading-[1.15]">${lines}</div>
            </div>
          `;
        };

        transferLeftHtml = `
          <div class="absolute left-[1.4cqw] top-[19.5cqh] z-20 max-w-[44cqw]">
            <div class="font-bold text-[2.25cqw] text-[#181c22] leading-tight">${escapeHtml(activeSt.nameJp)}駅</div>
            <div class="font-bold text-[2.15cqw] text-[#4b5563] leading-tight mb-[0.8cqh]">乗換えのご案内</div>
            <div class="space-y-[0.55cqh]">
              ${fullWidthItems.map(renderTrItem).join('')}
            </div>
            ${gridItems.length > 0 ? `
              <div class="grid grid-cols-2 gap-x-[1.6cqw] gap-y-[0.55cqh] mt-[0.55cqh]">
                ${gridItems.map(renderTrItem).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }

      const blinkClass = getChevronBlinkClass();

      container.innerHTML = `
        <svg viewBox="0 0 1000 400" preserveAspectRatio="none" class="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <defs>
            <linearGradient id="yamanoteCurveRtlFill" x1="75%" y1="100%" x2="8%" y2="0%">
              <stop offset="0%"   stop-color="#58b32b" />
              <stop offset="50%"  stop-color="#6ec03c" />
              <stop offset="85%"  stop-color="#8fd162" />
              <stop offset="100%" stop-color="#c3e8a7" />
            </linearGradient>
          </defs>

          <!-- Tapered Green Arc Sweeping from Bottom-Right (602..752, 400) to Top-Left (28..245, 0) -->
          <path d="M 752 400 C 662 232, 460 58, 245 0 L 28 0 C 335 44, 520 218, 602 400 Z"
                fill="url(#yamanoteCurveRtlFill)" />

          <!-- Crisp Dark Charcoal Inner Curve Border on the Left Edge -->
          <path d="M 602 400 C 520 218, 335 44, 28 0"
                fill="none" stroke="#1b2228" stroke-width="3.8" />

          ${isStopped ? `
            <!-- Video 00:00 Stopped Marker: Maroon Pentagon with White Dot inside at Tokyo -->
            <g transform="translate(625, 326) rotate(-26)">
              <polygon points="-38,-32 38,-32 38,14 0,40 -38,14"
                       fill="#8c1d24" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round" />
              <circle cx="0" cy="-4" r="12.5" fill="#ffffff" />
            </g>
          ` : `
            <!-- Video 00:31 Running Marker: Maroon Chevron Arrow at Bottom-Right -->
            <g transform="translate(658, 366) rotate(-25)" class="${blinkClass}">
              <polygon points="-37,16 0,-12 37,16 26,30 0,10 -26,30"
                       fill="#8c1d24" stroke="#ffffff" stroke-width="3.2" stroke-linejoin="round" />
            </g>
          `}
        </svg>

        ${nodesHtml}
        ${transferLeftHtml}
      `;
    }

    /* ==========================================================
       7C. BODY VIEW 5: YAMANOTE NOTICE INFORMATION SCREEN (Video 00:07〜00:18)
       ========================================================== */
    function renderNoticeInfoView() {
      const container = document.getElementById('noticeInfoContainer');
      const lines = (state.customNoticeBody || '').split('\n');

      container.innerHTML = `
        <div class="w-full h-full flex flex-col justify-between">
          <!-- Sub-header Bar: お知らせ Information -->
          <div>
            <div class="h-[7.2cqh] bg-gradient-to-b from-[#d5dce3] to-[#c6cfd8] border-b-[0.45cqh] border-[#1e293b] flex items-center justify-center gap-[2.2cqw]">
              <span class="font-bold text-[#111827] text-[3.35cqw] tracking-wide">お知らせ</span>
              <span class="font-['Roboto'] font-bold text-[#1e293b] text-[2.95cqw]">Information</span>
            </div>

            <div class="px-[4.5cqw] pt-[3.6cqh] space-y-[1.2cqh]">
              <div class="font-bold text-[#111827] text-[3.2cqw] leading-[1.42]">
                ${lines.map(l => `<div>${escapeHtml(l)}</div>`).join('')}
              </div>
            </div>
          </div>

          <div class="px-[2.5cqw] pb-[1.8cqh] flex items-end justify-end">
            <div class="bg-[#cfd6df] border border-[#94a3b8] px-[1.4cqw] py-[0.3cqh] font-['Roboto'] font-bold text-[#111827] text-[2.2cqw] leading-none shadow-inner">
              1/1
            </div>
          </div>
        </div>
      `;
    }

    /* ==========================================================
       7D. BODY VIEW 7: SOBU LINE RECTANGULAR BLOCK ROUTE MAP (IMG_4441.jpg)
       Pixel-accurate recreation of JB-20 Asakusabashi -> JB-13 Shinanomachi!
       Supports dynamic station progression along the route!
       ========================================================== */
    function renderSobuRectView(nextStopIdx, isEn) {
      const container = document.getElementById('sobuRectContainer');
      const maxStart = Math.max(0, state.stations.length - 8);
      const windowStart = Math.min(state.currentStationIndex, maxStart);
      const visibleStations = state.stations.slice(windowStart, windowStart + 8);

      const colsHtml = visibleStations.map((st, idx) => {
        const globalIdx = windowStart + idx;
        const isPassed = globalIdx <= state.currentStationIndex && state.runningPhase !== 'stopped';
        const chars = Array.from(st.nameJp);
        const vChars = chars.map(c => `<span class="block leading-[1.03]">${escapeHtml(c)}</span>`).join('');

        const transfersHtml = (st.transfers || []).map(tr => {
          const isCircle = tr.badgeShape === 'circle';
          const badgeEl = isCircle
            ? `<span class="inline-flex items-center justify-center w-[1.65cqw] h-[2.7cqh] rounded-full border-[0.25cqw] bg-white font-['Roboto'] font-black text-[0.9cqw] leading-none flex-shrink-0 mt-[0.15cqh]" style="border-color:${tr.badgeColor}; color:#111827;">${escapeHtml(tr.badge)}</span>`
            : `<span class="inline-flex items-center justify-center px-[0.22cqw] h-[2.6cqh] rounded-[0.2cqw] border-[0.2cqw] bg-white font-['Roboto'] font-black text-[0.85cqw] leading-none flex-shrink-0 mt-[0.15cqh]" style="border-color:${tr.badgeColor}; color:${tr.badge === 'TX' ? '#ffffff' : '#111827'}; background-color:${tr.badge === 'TX' ? tr.badgeColor : '#ffffff'};">${escapeHtml(tr.badge)}</span>`;
          const textLines = (isEn ? (tr.textEn || tr.textJp) : (tr.textJp || '')).split('|').map(l => `<div>${escapeHtml(l)}</div>`).join('');
          return `
            <div class="flex items-start gap-[0.25cqw] text-[1.45cqw] font-bold text-[#111827] leading-[1.12] whitespace-nowrap">
              ${badgeEl}
              <div>${textLines}</div>
            </div>
          `;
        }).join('');

        return `
          <div onclick="selectStationDirectly(${globalIdx})" title="${escapeHtml(st.nameJp)}駅へ移動" class="flex flex-col items-center h-full relative cursor-pointer hover:opacity-85 transition-opacity">
            <!-- Vertical Station Name -->
            <div class="h-[25.5cqh] flex flex-col justify-between items-center font-bold text-[3.8cqw] ${isPassed ? 'text-[#9ca3af]' : 'text-[#111827]'}">
              ${vChars}
            </div>

            <!-- Hyphenated Station Number (JB-19) ABOVE the yellow bar (Exact IMG_4441 detail!) -->
            <div class="h-[4.6cqh] flex items-center justify-center font-['Roboto'] font-bold text-[2.1cqw] ${isPassed ? 'text-[#9ca3af]' : 'text-[#111827]'}">
              ${escapeHtml(state.linePrefix)}-${escapeHtml(st.num)}
            </div>

            <!-- White or Grey Rectangular Block inside the Yellow Bar -->
            <div class="h-[9.8cqh] flex items-center justify-center z-20">
              <div class="w-[5.5cqw] h-[6.8cqh] ${isPassed ? 'bg-[#d1d5db]' : 'bg-white'} shadow-sm"></div>
            </div>

            <!-- Transfers List Below the Yellow Bar -->
            <div class="mt-[0.8cqh] flex flex-col items-start gap-[0.35cqh] w-[11.2cqw] pl-[0.5cqw]">
              ${transfersHtml}
            </div>
          </div>
        `;
      }).join('');

      // Position the green 3D arrow dynamically between the departed station and next station!
      const activeLocalIdx = Math.max(0, Math.min(6, state.currentStationIndex - windowStart));
      const arrowBaseX = 145 + activeLocalIdx * 111;

      container.innerHTML = `
        <!-- Bright Sobu Yellow Horizontal Arrow Bar -->
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" class="absolute left-0 right-0 top-[31.2cqh] w-full h-[9.8cqh] z-10 pointer-events-none">
          <polygon points="0,0 968,0 996,50 968,100 0,100" fill="${state.lineColor || '#f5cf1b'}" />
          <!-- 3D Glossy Green Pentagon Chevron Arrow -->
          <defs>
            <linearGradient id="sobuGreenArrow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#6ee755" />
              <stop offset="50%" stop-color="#1db91d" />
              <stop offset="100%" stop-color="#0f7a0f" />
            </linearGradient>
          </defs>
          <g transform="translate(${arrowBaseX - 145}, 0)">
            <polygon points="145,8 186,8 200,50 186,92 145,92"
                     fill="url(#sobuGreenArrow)" stroke="#ffffff" stroke-width="3" />
            <polygon points="144,6 187,6 202,50 187,94 144,94"
                     fill="none" stroke="#1e293b" stroke-width="2" />
          </g>
        </svg>

        <div class="absolute top-[1.2cqh] left-[5.5cqw] right-[5.5cqw] bottom-[1.0cqh] grid grid-cols-8 z-20">
          ${colsHtml}
        </div>
      `;
    }

    /* ==========================================================
       7E. BODY VIEW 8: CHUO LINE 6-SERVICE STOPPING PATTERN MAP (IMG_4442.jpg)
       Exact reproduction of the 2-tier Chuo Line stopping map!
       ========================================================== */
    function renderChuoStoppingView(targetStation) {
      const container = document.getElementById('chuoStoppingContainer');

      const serviceTypes = [
        { name: '通勤特快', color: '#a61018', thick: true },
        { name: '青梅特快', color: '#156933', thick: false },
        { name: '中央特快', color: '#1856a3', thick: false },
        { name: '通勤快速', color: '#21296b', thick: false },
        { name: '快　　速', color: '#e05a1b', thick: false },
        { name: '各駅停車', color: '#ecc30b', thick: false }
      ];

      // Build Upper Tier Stations (Asagaya -> Takao, with Tachikawa capsule)
      const upperColsHtml = CHUO_UPPER_STATIONS.map((st) => {
        if (st.isTachikawa) {
          return `
            <div class="flex flex-col items-center justify-end h-full relative">
              <div class="w-[2.4cqw] h-[15.2cqh] rounded-full bg-[#737373] text-white font-bold text-[1.9cqw] flex flex-col items-center justify-center leading-[1.1] z-30 translate-y-[6.5cqh] shadow">
                <span>立</span>
                <span>川</span>
              </div>
              <div class="h-[10.8cqh] w-full"></div>
            </div>
          `;
        }
        const chars = Array.from(st.name).map(c => `<span class="block leading-[1.02]">${escapeHtml(c)}</span>`).join('');
        const dotsHtml = st.stops.slice(0, 6).map((stopsHere, sIdx) => {
          const yPct = 10 + sIdx * 17;
          return stopsHere ? `
            <div class="absolute left-1/2 -translate-x-1/2 w-[0.75cqw] h-[0.95cqh] bg-white border border-[#374151] z-20" style="top: ${yPct}%;"></div>
          ` : '';
        }).join('');

        return `
          <div class="flex flex-col items-center justify-end h-full">
            <div class="flex flex-col items-center justify-end text-[#7c8593] font-bold text-[1.82cqw] pb-[0.5cqh]">
              ${chars}
            </div>
            <div class="relative w-full h-[10.8cqh]">
              ${dotsHtml}
            </div>
          </div>
        `;
      }).join('');

      // Build Lower Tier Stations (Tokyo -> Koenji)
      const lowerColsHtml = CHUO_LOWER_STATIONS.map((st) => {
        const isCommStop = st.stops[0] === 1;
        const chars = Array.from(st.name).map(c => `<span class="block leading-[1.02]">${escapeHtml(c)}</span>`).join('');
        const dotsHtml = st.stops.map((stopsHere, sIdx) => {
          const yPct = 8 + sIdx * 16.5;
          return stopsHere ? `
            <div class="absolute left-1/2 -translate-x-1/2 w-[0.75cqw] h-[0.95cqh] bg-white border border-[#374151] z-20" style="top: ${yPct}%;"></div>
          ` : '';
        }).join('');

        return `
          <div class="flex flex-col items-center justify-end h-full">
            <div class="flex flex-col items-center justify-end ${isCommStop ? 'text-[#111827]' : 'text-[#7c8593]'} font-bold text-[1.95cqw] pb-[0.5cqh]">
              ${chars}
            </div>
            <div class="relative w-full h-[11.2cqh]">
              ${dotsHtml}
            </div>
          </div>
        `;
      }).join('');

      const legendHtml = serviceTypes.map((sv, idx) => `
        <div class="flex items-center gap-[0.3cqw] h-[3.2cqh]">
          <span class="w-[0.7cqw] h-full" style="background-color: ${sv.color};"></span>
          <span class="w-[8.5cqw] h-[2.8cqh] flex items-center justify-center font-bold text-[1.65cqw] ${idx === 0 ? 'bg-[#a61018] text-white' : 'bg-white/80 text-[#111827]'} tracking-wider shadow-sm">
            ${escapeHtml(sv.name)}
          </span>
        </div>
      `).join('');

      container.innerHTML = `
        <!-- Parallel Service Lines SVG -->
        <svg viewBox="0 0 1000 400" preserveAspectRatio="none" class="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <!-- UPPER TIER 6 PARALLEL LINES (x: 165 to 825) -->
          <line x1="165" y1="126" x2="825" y2="126" stroke="#a61018" stroke-width="5.5" />
          <line x1="165" y1="137" x2="612" y2="137" stroke="#156933" stroke-width="2.5" />
          <line x1="165" y1="148" x2="825" y2="148" stroke="#1856a3" stroke-width="2.5" />
          <line x1="165" y1="159" x2="825" y2="159" stroke="#21296b" stroke-width="2.5" />
          <line x1="165" y1="170" x2="825" y2="170" stroke="#e05a1b" stroke-width="2.5" />
          <line x1="165" y1="181" x2="346" y2="181" stroke="#ecc30b" stroke-width="2.5" />

          <!-- Ome / Itsukaichi Branch at Tachikawa (x ~ 612) -->
          <polyline points="614,126 632,196 655,196" fill="none" stroke="#a61018" stroke-width="2.5" />
          <polyline points="611,137 629,200 655,200" fill="none" stroke="#156933" stroke-width="2.5" />
          <polyline points="608,148 626,204 655,204" fill="none" stroke="#1856a3" stroke-width="2.5" />
          <polyline points="605,159 623,208 655,208" fill="none" stroke="#21296b" stroke-width="2.5" />
          <polyline points="602,170 620,212 655,212" fill="none" stroke="#e05a1b" stroke-width="2.5" />

          <!-- LOWER TIER 6 PARALLEL LINES WITH DIAGONAL CONNECTOR FROM LEGEND -->
          <polyline points="130,224 222,224 235,310 825,310" fill="none" stroke="#a61018" stroke-width="5.5" />
          <polyline points="130,246 218,246 231,321 825,321" fill="none" stroke="#156933" stroke-width="2.5" />
          <polyline points="130,268 214,268 227,332 825,332" fill="none" stroke="#1856a3" stroke-width="2.5" />
          <polyline points="130,290 210,290 223,343 825,343" fill="none" stroke="#21296b" stroke-width="2.5" />
          <polyline points="130,312 206,312 219,354 825,354" fill="none" stroke="#e05a1b" stroke-width="2.5" />
          <polyline points="130,334 202,334 215,376 312,376 322,365 825,365" fill="none" stroke="#ecc30b" stroke-width="2.5" />
        </svg>

        <!-- Upper Tier Grid -->
        <div class="absolute top-[2.2cqh] left-[16.2cqw] right-[17.2cqw] h-[27.5cqh] grid z-20" style="grid-template-columns: repeat(17, minmax(0, 1fr));">
          ${upperColsHtml}
        </div>
        <div class="absolute left-[65.8cqw] top-[30.4cqh] font-bold text-[#111827] text-[1.45cqw] z-20">
          青梅・武蔵五日市・高麗川 方面
        </div>

        <!-- Lower Left 6-Type Legend -->
        <div class="absolute left-[13.0cqw] bottom-[5.8cqh] flex flex-col gap-[0.4cqh] z-20">
          ${legendHtml}
        </div>

        <!-- Lower Tier Grid -->
        <div class="absolute bottom-[2.8cqh] left-[24.2cqw] right-[17.2cqw] h-[27.5cqh] grid z-20" style="grid-template-columns: repeat(15, minmax(0, 1fr));">
          ${lowerColsHtml}
        </div>
        <div class="absolute left-[24.2cqw] bottom-[0.6cqh] font-bold text-[#111827] text-[1.45cqw] z-20">
          千葉方面
        </div>
      `;
    }

    /* ==========================================================
       7F. BODY VIEW 9: CHUO LINE 12-CAR GREEN CAR PLATFORM & TRANSFER (IMG_4446.jpg)
       Features 12-car formation with Green Car clovers on Cars 4 & 5,
       orange highlighted Car 10 "乗車位置", and glossy blue Transfer pill!
       ========================================================== */
    function renderChuoPlatformView(targetStation) {
      const container = document.getElementById('chuoPlatformContainer');
      const totalCars = Number(state.totalCars) || 12;
      const currentCar = Math.min(totalCars, Math.max(1, Number(state.carNumber) || 10));

      // Build 12 Cars on railway tracks (with Green Car clover on Cars 4 & 5)
      let carsHtml = '';
      for (let c = 1; c <= totalCars; c++) {
        const isCurrent = c === currentCar;
        const isGreenCar = (c === 4 || c === 5) && totalCars >= 12;

        carsHtml += `
          <div class="relative flex flex-col items-center">
            <div class="w-[5.9cqw] h-[6.8cqh] ${
              isCurrent ? 'bg-[#d9531e] text-[#111827]' : 'bg-[#e5ebf3] text-[#111827]'
            } border-[0.22cqw] border-[#374151] border-b-[0.7cqh] border-b-[#4b5563] flex items-center justify-center gap-[0.15cqw] shadow-sm">
              <span class="font-['Roboto'] font-black text-[3.1cqw] leading-none">${c}</span>
              ${isGreenCar ? `
                <span class="inline-flex items-center justify-center w-[2.1cqw] h-[3.4cqh] bg-[#86efac]/40 border border-[#16a34a] rounded-[0.2cqw] text-[#15803d] text-[1.5cqw] leading-none">🍀</span>
              ` : ''}
            </div>
            ${isCurrent ? `
              <span class="absolute -bottom-[2.8cqh] font-bold text-[#111827] text-[1.65cqw] whitespace-nowrap">乗車位置</span>
            ` : ''}
          </div>
        `;
      }

      // Build Transfer Badges at Bottom (e.g. [JH] 横浜線 & [■] 八高線)
      const trList = (targetStation.transfers && targetStation.transfers.length > 0)
        ? targetStation.transfers
        : [
            { badge: 'JH', badgeColor: '#77c043', textJp: '横浜線', textEn: 'Yokohama Line' },
            { badge: 'SOLID_GREY', badgeColor: '#7d7d7d', textJp: '八高線', textEn: 'Hachikō Line' }
          ];

      const trHtml = trList.slice(0, 3).map(tr => {
        let iconHtml = '';
        if (tr.badge === 'SOLID_GREY') {
          iconHtml = `<div class="w-[6.0cqw] h-[8.8cqh] bg-[#7d7d7d]"></div>`;
        } else if (tr.badgeShape === 'circle') {
          iconHtml = `
            <div class="w-[6.0cqw] h-[9.4cqh] rounded-full border-[0.75cqw] bg-white flex items-center justify-center font-['Roboto'] font-black text-[2.9cqw] text-[#111827]" style="border-color: ${tr.badgeColor};">
              ${escapeHtml(tr.badge)}
            </div>
          `;
        } else {
          iconHtml = `
            <div class="w-[6.2cqw] h-[9.2cqh] rounded-[0.8cqw] border-[0.65cqw] bg-white flex items-center justify-center font-['Roboto'] font-black text-[3.0cqw] text-[#111827]" style="border-color: ${tr.badgeColor};">
              ${escapeHtml(tr.badge)}
            </div>
          `;
        }
        return `
          <div class="flex items-center gap-[1.2cqw]">
            ${iconHtml}
            <div class="flex flex-col">
              <span class="font-bold text-[#111827] text-[3.8cqw] leading-none">${escapeHtml(tr.textJp)}</span>
              <span class="font-['Roboto'] font-bold text-[#1e293b] text-[2.1cqw] leading-tight mt-[0.3cqh]">${escapeHtml(tr.textEn || '')}</span>
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <div class="w-full h-full flex flex-col justify-between pt-[1.8cqh] pb-[1.2cqh] px-[3.2cqw]">
          <!-- 1. Overhead Grey Platform Diagram with Exits & Pictograms -->
          <div class="relative pt-[3.6cqh]">
            <!-- North Exit Tab (above Car 3) -->
            <div class="absolute left-[20.5cqw] top-0 flex flex-col items-center">
              <span class="font-bold text-[#111827] text-[2.15cqw] leading-none mb-[0.3cqh]">北口</span>
              <div class="w-[6.2cqw] h-[1.4cqh] border-t-[0.3cqh] border-x-[0.25cqw] border-[#1e293b]"></div>
            </div>
            <!-- South Exit Tab (above Car 10) -->
            <div class="absolute left-[71.5cqw] top-0 flex flex-col items-center">
              <span class="font-bold text-[#111827] text-[2.15cqw] leading-none mb-[0.3cqh]">南口</span>
              <div class="w-[6.2cqw] h-[1.4cqh] border-t-[0.3cqh] border-x-[0.25cqw] border-[#1e293b]"></div>
            </div>

            <!-- Platform Box -->
            <div class="w-full h-[16.2cqh] bg-[#ced6df] border-[0.28cqw] border-[#1e293b] relative flex items-center">
              <!-- Stairs Pictogram at Car 3 -->
              <div class="absolute left-[20.8cqw] w-[5.4cqw] h-[7.6cqh] bg-white border-[0.2cqw] border-[#1e293b] flex items-center justify-center p-[0.3cqw]">
                <svg viewBox="0 0 40 40" class="w-full h-full">
                  <path d="M4 34 L12 34 L12 26 L20 26 L20 18 L28 18 L28 10 L36 10" fill="none" stroke="#111827" stroke-width="3.5"/>
                  <circle cx="15" cy="12" r="3" fill="#111827"/>
                  <circle cx="25" cy="6" r="3" fill="#111827"/>
                </svg>
              </div>

              <!-- Elevator + Stairs Stacked Pictograms at Car 10 -->
              <div class="absolute left-[71.8cqw] flex flex-col gap-[0.4cqh]">
                <div class="w-[4.8cqw] h-[6.2cqh] bg-white border-[0.2cqw] border-[#1e293b] flex flex-col items-center justify-center">
                  <span class="text-[1.0cqw] font-black leading-none">↓↑</span>
                  <span class="text-[1.4cqw] font-bold leading-none border border-black px-[0.2cqw]">三人</span>
                </div>
                <div class="w-[4.8cqw] h-[6.2cqh] bg-white border-[0.2cqw] border-[#1e293b] flex items-center justify-center p-[0.2cqw]">
                  <svg viewBox="0 0 40 40" class="w-full h-full">
                    <path d="M4 10 L12 10 L12 18 L20 18 L20 26 L28 26 L28 34 L36 34" fill="none" stroke="#111827" stroke-width="3.5"/>
                  </svg>
                </div>
              </div>

              <!-- Yellow Tactile Line Along Bottom Edge of Platform -->
              <div class="absolute bottom-[0.6cqh] left-[1.2cqw] right-[1.2cqw] border-b-[0.55cqh] border-dashed border-[#eab308]"></div>
            </div>
          </div>

          <!-- 2. 12-Car Train Formation on Tracks with Red Left Arrow -->
          <div class="relative h-[10.5cqh] flex items-center justify-center my-[0.4cqh]">
            <!-- Railway Track Sleepers Background -->
            <div class="absolute inset-x-0 h-[5.2cqh] border-y-[0.3cqh] border-[#64748b]"
                 style="background-image: repeating-linear-gradient(90deg, transparent, transparent 1.2cqw, #64748b 1.2cqw, #64748b 1.65cqw);"></div>

            <div class="relative z-10 flex items-center gap-[0.65cqw]">
              <!-- Red Left Direction Arrow -->
              <svg viewBox="0 0 44 44" class="w-[3.8cqw] h-[6.4cqh] flex-shrink-0 drop-shadow">
                <polygon points="4,22 24,4 24,13 40,13 40,31 24,31 24,40" fill="#e60012" stroke="#ffffff" stroke-width="2.5"/>
              </svg>
              ${carsHtml}
            </div>
          </div>

          <!-- 3. Glossy Blue Capsule "のりかえ / Transfer" & Line Badges -->
          <div class="flex flex-col items-center pt-[1.2cqh]">
            <div class="w-[39.5cqw] h-[5.6cqh] rounded-full border border-[#3b4f9c] flex items-center justify-center shadow-md"
                 style="background: linear-gradient(180deg, #4b6cb7 0%, #8ca6db 48%, #3b5998 100%);">
              <span class="font-bold text-[#111827] text-[2.65cqw] tracking-wide">のりかえ / Transfer</span>
            </div>

            <div class="mt-[2.2cqh] flex items-center justify-center gap-[9.5cqw]">
              ${trHtml}
            </div>
          </div>

          <div class="absolute right-[1.8cqw] bottom-[0.8cqh] font-bold text-[#111827] text-[1.75cqw]">
            2025年8月現在
          </div>
        </div>
      `;
    }

    /* ==========================================================
       7G. BODY VIEW 10: CHUO LINE LARGE DOOR ILLUSTRATION (IMG_4448.jpeg)
       ========================================================== */
    function renderChuoDoorView(targetStation) {
      const container = document.getElementById('chuoDoorContainer');
      const doorSide = targetStation.doorSide || state.doorSide || 'this';
      const isOpposite = doorSide === 'opposite';

      const topJp = isOpposite ? '反対側のドアが開きます' : 'こちら側のドアが開きます';
      const botEn = isOpposite ? 'Doors on the opposite side will open.' : 'Doors on this side will open.';

      container.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-between py-[2.2cqh]">
          <div class="font-bold text-[#c81010] text-[4.8cqw] leading-none tracking-wide">
            ${escapeHtml(topJp)}
          </div>

          <!-- Large Rounded Grey Door Frame Box -->
          <div class="w-[68.5cqw] h-[44.2cqh] bg-[#9ea6b5] rounded-[2.6cqw] relative flex items-center justify-center px-[3.5cqw]">
            <!-- Top & Bottom White Horizontal Door Rails -->
            <div class="absolute top-[2.8cqh] left-[3.6cqw] right-[3.6cqw] h-[1.8cqh] bg-white rounded-full"></div>
            <div class="absolute bottom-[2.4cqh] left-[2.8cqw] right-[2.8cqw] h-[1.8cqh] bg-white rounded-full"></div>

            <!-- Left Red Outward Arrow -->
            <div class="mr-[5.5cqw] ${isOpposite ? 'opacity-25' : 'arrow-pulse-left'}">
              <svg viewBox="0 0 100 90" class="w-[9.2cqw] h-[13.5cqh]">
                <polygon points="5,45 62,6 62,26 95,26 95,64 62,64 62,84" fill="#e60012" stroke="#991b1b" stroke-width="2"/>
              </svg>
            </div>

            <!-- Twin Metallic Train Doors -->
            <div class="flex items-center gap-[0.3cqw] z-10">
              <div class="w-[14.2cqw] h-[39.5cqh] bg-[#cbd5df] border-[0.55cqw] border-[#4b5563] rounded-[1.4cqw] flex justify-center pt-[2.8cqh]">
                <div class="w-[9.8cqw] h-[19.2cqh] bg-white border-[0.5cqw] border-[#4b5563] rounded-[0.9cqw]"></div>
              </div>
              <div class="w-[14.2cqw] h-[39.5cqh] bg-[#cbd5df] border-[0.55cqw] border-[#4b5563] rounded-[1.4cqw] flex justify-center pt-[2.8cqh]">
                <div class="w-[9.8cqw] h-[19.2cqh] bg-white border-[0.5cqw] border-[#4b5563] rounded-[0.9cqw]"></div>
              </div>
            </div>

            <!-- Right Red Outward Arrow -->
            <div class="ml-[5.5cqw] ${isOpposite ? 'opacity-25' : 'arrow-pulse-right'}">
              <svg viewBox="0 0 100 90" class="w-[9.2cqw] h-[13.5cqh]">
                <polygon points="95,45 38,6 38,26 5,26 5,64 38,64 38,84" fill="#e60012" stroke="#991b1b" stroke-width="2"/>
              </svg>
            </div>
          </div>

          <div class="font-['Roboto'] font-bold text-[#c81010] text-[4.55cqw] leading-none tracking-wide">
            ${escapeHtml(botEn)}
          </div>
        </div>
      `;
    }

    /* ==========================================================
       7H. BODY VIEW 11: CHUO LINE DEDICATED TRANSFER SCREEN (IMG_4449.jpeg)
       Dynamically renders actual transfers of the current/next station!
       ========================================================== */
    function renderChuoTransferView(targetStation) {
      const container = document.getElementById('chuoTransferContainer');
      const trList = (targetStation.transfers && targetStation.transfers.length > 0)
        ? targetStation.transfers
        : [];

      if (trList.length === 0) {
        container.innerHTML = `
          <div class="w-full h-full flex flex-col items-center pt-[4.5cqh] px-[14cqw]">
            <div class="w-[39.5cqw] h-[5.6cqh] rounded-full border border-[#3b4f9c] flex items-center justify-center shadow-md mb-[8.2cqh]"
                 style="background: linear-gradient(180deg, #4b6cb7 0%, #8ca6db 48%, #3b5998 100%);">
              <span class="font-bold text-[#111827] text-[2.65cqw] tracking-wide">のりかえ / Transfer</span>
            </div>
            <div class="font-bold text-[#475569] text-[3.4cqw]">この駅での接続路線はありません</div>
          </div>
        `;
        return;
      }

      const isCompact = trList.length > 4;
      const itemsHtml = trList.slice(0, 8).map(tr => {
        let badgeHtml = '';
        if (tr.badge === 'SHINKANSEN_E' || tr.badge === 'SHINKANSEN_W') {
          badgeHtml = `
            <div class="${isCompact ? 'w-[5.2cqw] h-[8.5cqh] text-[2.6cqw]' : 'w-[7.2cqw] h-[11.8cqh] text-[3.5cqw]'} rounded-[1.0cqw] text-white flex items-center justify-center flex-shrink-0 shadow" style="background-color: ${tr.badgeColor || '#008c45'};">
              🚄
            </div>
          `;
        } else if (tr.badgeShape === 'circle') {
          badgeHtml = `
            <div class="${isCompact ? 'w-[5.2cqw] h-[8.6cqh] border-[0.7cqw] text-[2.5cqw]' : 'w-[7.2cqw] h-[11.8cqh] border-[0.95cqw] text-[3.4cqw]'} rounded-full bg-white flex items-center justify-center font-['Roboto'] font-black text-[#111827] flex-shrink-0" style="border-color: ${tr.badgeColor};">
              ${escapeHtml(tr.badge)}
            </div>
          `;
        } else {
          badgeHtml = `
            <div class="${isCompact ? 'w-[5.5cqw] h-[8.8cqh] border-[0.6cqw] text-[2.7cqw]' : 'w-[7.6cqw] h-[12.2cqh] border-[0.8cqw] text-[3.8cqw]'} rounded-[1.1cqw] bg-white flex items-center justify-center font-['Roboto'] font-black text-[#111827] flex-shrink-0" style="border-color: ${tr.badgeColor};">
              ${escapeHtml(tr.badge)}
            </div>
          `;
        }
        return `
          <div class="flex items-center gap-[1.5cqw]">
            ${badgeHtml}
            <div class="flex flex-col min-w-0">
              <span class="font-bold text-[#111827] ${isCompact ? 'text-[2.95cqw]' : 'text-[4.15cqw]'} leading-tight truncate">${escapeHtml(tr.textJp.replace('|', ''))}</span>
              <span class="font-['Roboto'] font-bold text-[#1e293b] ${isCompact ? 'text-[1.75cqw]' : 'text-[2.35cqw]'} leading-tight mt-[0.25cqh] truncate">${escapeHtml(tr.textEn || '')}</span>
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = `
        <div class="w-full h-full flex flex-col items-center pt-[3.8cqh] px-[10cqw]">
          <!-- Glossy Blue Capsule Header -->
          <div class="w-[39.5cqw] h-[5.6cqh] rounded-full border border-[#3b4f9c] flex items-center justify-center shadow-md ${isCompact ? 'mb-[3.2cqh]' : 'mb-[5.8cqh]'}"
               style="background: linear-gradient(180deg, #4b6cb7 0%, #8ca6db 48%, #3b5998 100%);">
            <span class="font-bold text-[#111827] text-[2.65cqw] tracking-wide">のりかえ / Transfer</span>
          </div>

          <div class="w-full grid grid-cols-2 ${isCompact ? 'gap-x-[4cqw] gap-y-[2.4cqh]' : 'gap-x-[6cqw] gap-y-[5.0cqh]'}">
            ${itemsHtml}
          </div>
        </div>
      `;
    }

    /* ==========================================================
       7I. BODY VIEW 12: CHUO LINE PINK CAPSULE TRAIN INFO (IMG_4445.jpeg)
       ========================================================== */
    function renderChuoTrainInfoView() {
      const container = document.getElementById('chuoTrainInfoContainer');

      container.innerHTML = `
        <div class="w-full h-full flex flex-col items-center pt-[3.2cqh] px-[4.8cqw]">
          <!-- Glossy 3D Pink/Magenta Capsule Header -->
          <div class="w-[56.5cqw] h-[5.8cqh] rounded-full border border-[#be185d] flex items-center justify-center gap-[5.2cqw] shadow-md mb-[5.8cqh]"
               style="background: linear-gradient(180deg, #db2777 0%, #fbcfe8 48%, #db2777 100%);">
            <span class="font-bold text-[#111827] text-[2.75cqw]">運行情報</span>
            <span class="font-['Roboto'] font-bold text-[#111827] text-[2.75cqw]">Train Information</span>
          </div>

          <div class="w-full text-left space-y-[2.6cqh]">
            <div class="font-bold text-[#111827] text-[4.55cqw] leading-tight pl-[3.5cqw]">
              ${escapeHtml(state.customDelayTitle)}
            </div>
            <div class="font-bold text-[#111827] text-[4.45cqw] leading-[1.45]">
              ${escapeHtml(state.customDelayBody)}
            </div>
          </div>
        </div>
      `;
    }

    /* ==========================================================
       8. BODY VIEW 6: PLATFORM STOPPING POSITION & DOOR GUIDE (IMG_4437.jpeg)
       Supports ANY station in the route with station-specific
       facilities (escalator/elevator/stairs), exit banner, and door side!
       ========================================================== */
    function renderPlatformStopView(targetStation, isEn) {
      const container = document.getElementById('platformStopContainer');
      const totalCars = Number(state.totalCars) || 11;
      const currentCar = Math.min(totalCars, Math.max(1, Number(state.carNumber) || 9));
      const doorSide = targetStation.doorSide || state.doorSide || 'opposite';

      let carsHtml = '';
      for (let c = 1; c <= totalCars; c++) {
        const isCurrent = c === currentCar;
        carsHtml += `
          <div class="relative flex-1 h-[6.0cqh] flex items-center justify-center border-r border-slate-400/70 ${
            isCurrent
              ? 'bg-[#d62828] text-white z-20 shadow-sm animate-car-highlight'
              : 'bg-gradient-to-b from-[#eef3f8] to-[#cfd8e2] text-[#1f242a]'
          } ${c === 1 ? 'rounded-l-[1.2cqw]' : ''}">
            <span class="font-['Roboto'] font-bold italic text-[3.1cqw] leading-none">${c}</span>
            ${isCurrent ? `
              <svg viewBox="0 0 24 12" class="absolute -bottom-[2.1cqh] left-1/2 -translate-x-1/2 w-[3.0cqw] h-[2.0cqh]">
                <polygon points="0,0 24,0 12,12" fill="#d62828" />
              </svg>
            ` : ''}
          </div>
        `;
      }

      const defaultFacilities = [
        { car: 3, type: 'escalator' },
        { car: 5, type: 'elevator' },
        { car: 6, type: 'stairs' }
      ];
      const facilities = (targetStation.facilities && targetStation.facilities.length > 0)
        ? targetStation.facilities
        : defaultFacilities;

      const facItemsHtml = facilities.map(fac => {
        const leftPct = Math.min(88, Math.max(12, ((fac.car - 0.5) / totalCars) * 86 + 6));
        let iconSvg = '';
        if (fac.type === 'escalator') {
          iconSvg = `
            <div class="w-[4.2cqw] h-[8.5cqh] bg-white border-[0.2cqw] border-slate-600 rounded-[0.25cqw] shadow flex items-center justify-center p-[0.25cqw]">
              <svg viewBox="0 0 48 48" class="w-full h-full">
                <circle cx="17" cy="13" r="4" fill="#1e293b"/>
                <path d="M13 24 L21 18 L25 26" stroke="#1e293b" stroke-width="3.5" fill="none"/>
                <path d="M6 38 L18 38 L36 20 L44 20" stroke="#1e293b" stroke-width="4.5" fill="none"/>
                <path d="M6 43 L20 43 L38 25 L44 25" stroke="#64748b" stroke-width="2.5" fill="none"/>
              </svg>
            </div>
          `;
        } else if (fac.type === 'elevator') {
          iconSvg = `
            <div class="w-[3.7cqw] h-[8.8cqh] bg-white border-[0.2cqw] border-slate-600 rounded-[0.25cqw] shadow flex flex-col items-center justify-between p-[0.25cqw]">
              <div class="text-[1.0cqw] font-black text-slate-800 leading-none">▲▼</div>
              <div class="w-full flex-1 border border-slate-700 mt-[0.2cqh] flex items-center justify-center bg-slate-100">
                <span class="text-[1.45cqw] font-bold text-slate-800">🛗</span>
              </div>
            </div>
          `;
        } else {
          iconSvg = `
            <div class="w-[4.1cqw] h-[5.4cqh] bg-white border-[0.2cqw] border-slate-600 rounded-[0.25cqw] shadow flex items-center justify-center p-[0.2cqw]">
              <svg viewBox="0 0 48 36" class="w-full h-full">
                <path d="M4 32 L14 32 L14 24 L24 24 L24 16 L34 16 L34 8 L44 8 L44 32 Z" fill="#334155"/>
              </svg>
            </div>
          `;
        }

        return `
          <div class="absolute bottom-0 -translate-x-1/2 flex flex-col items-center" style="left: ${leftPct}%;">
            ${iconSvg}
            <div class="w-[0.7cqw] h-[4.5cqh] bg-gradient-to-r from-slate-400 to-slate-500 border-x border-slate-600"></div>
          </div>
        `;
      }).join('');

      const exitJp = targetStation.exitJp || '北口・南口';
      const exitEn = targetStation.exitEn || 'North Exit · South Exit';

      let doorFooterHtml = '';
      if (doorSide === 'opposite') {
        doorFooterHtml = `
          <div class="relative w-[13.5cqw] h-[18.8cqh] flex flex-col items-center justify-end mr-[6cqw]">
            <div class="w-[10.8cqw] h-[17.2cqh] bg-gradient-to-b from-[#e2e8f0] to-[#94a3b8] border-[0.28cqw] border-[#475569] rounded-t-[0.3cqw] flex p-[0.3cqw] gap-[0.22cqw] relative shadow-md">
              <div class="flex-1 h-full bg-gradient-to-b from-[#cbd5e1] to-[#94a3b8] border border-slate-500 flex justify-center pt-[1.2cqh]">
                <div class="w-[72%] h-[42%] bg-[#475569] rounded-[0.2cqw] border border-slate-300"></div>
              </div>
              <div class="flex-1 h-full bg-gradient-to-b from-[#cbd5e1] to-[#94a3b8] border border-slate-500 flex justify-center pt-[1.2cqh]">
                <div class="w-[72%] h-[42%] bg-[#475569] rounded-[0.2cqw] border border-slate-300"></div>
              </div>
              <div class="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[5.4cqw] h-[9.0cqh] rounded-full bg-[#dc2626] border-[0.3cqw] border-white shadow-lg flex items-center justify-center">
                <div class="w-[3.3cqw] h-[1.25cqh] bg-white rounded-[0.1cqw]"></div>
              </div>
            </div>
            <div class="w-[13.2cqw] h-[1.4cqh] bg-[#eab308] transform skew-x-12 shadow"></div>
          </div>
          <div class="flex flex-col justify-center">
            <div class="text-white font-bold text-[4.1cqw] leading-tight tracking-wide">
              反対側のドアが開きます
            </div>
            <div class="text-slate-100 font-bold font-['Roboto'] text-[2.45cqw] leading-tight mt-[0.3cqh]">
              Doors on the opposite side will open.
            </div>
          </div>
        `;
      } else {
        doorFooterHtml = `
          <div class="relative w-[14.5cqw] h-[18.8cqh] flex flex-col items-center justify-end mr-[6cqw]">
            <div class="w-[11.6cqw] h-[17.2cqh] bg-[#1e293b] border-[0.28cqw] border-[#64748b] rounded-t-[0.3cqw] flex p-[0.25cqw] relative overflow-hidden shadow-md">
              <div class="door-leaf-left opening w-1/2 h-full bg-gradient-to-b from-[#e2e8f0] to-[#94a3b8] border-r border-slate-600 flex justify-center pt-[1.2cqh]">
                <div class="w-[72%] h-[42%] bg-[#334155] rounded-[0.2cqw] border border-slate-300"></div>
              </div>
              <div class="door-leaf-right opening w-1/2 h-full bg-gradient-to-b from-[#e2e8f0] to-[#94a3b8] border-l border-slate-600 flex justify-center pt-[1.2cqh]">
                <div class="w-[72%] h-[42%] bg-[#334155] rounded-[0.2cqw] border border-slate-300"></div>
              </div>
              <div class="absolute inset-x-0 bottom-[2.2cqh] flex justify-between px-[1.0cqw] pointer-events-none">
                <span class="text-amber-400 font-black text-[2.2cqw] drop-shadow">◀</span>
                <span class="text-amber-400 font-black text-[2.2cqw] drop-shadow">▶</span>
              </div>
            </div>
            <div class="w-[13.8cqw] h-[1.4cqh] bg-[#eab308] shadow"></div>
          </div>
          <div class="flex flex-col justify-center">
            <div class="text-[#fde047] font-bold text-[4.1cqw] leading-tight tracking-wide">
              こちら側のドアが開きます
            </div>
            <div class="text-white font-bold font-['Roboto'] text-[2.45cqw] leading-tight mt-[0.3cqh]">
              Doors on this side will open.
            </div>
          </div>
        `;
      }

      container.innerHTML = `
        <div class="h-[9.2cqh] bg-[#d6dde5] px-[4.2cqw] flex items-center justify-center border-b border-slate-400">
          <div class="w-full flex items-center animate-train-stop shadow-sm">
            ${carsHtml}
            <div class="w-[3.5cqw] h-[6.0cqh] bg-gradient-to-b from-[#eef3f8] to-[#cfd8e2] rounded-r-[1.5cqw] flex items-center justify-center border-l border-slate-400">
              <svg viewBox="0 0 20 20" class="w-[1.8cqw] h-[3.0cqh]">
                <polygon points="3,2 17,10 3,18" fill="#1e2329" />
              </svg>
            </div>
          </div>
        </div>

        <div class="flex-1 relative bg-gradient-to-b from-[#d8dfe8] via-[#eef2f6] to-[#dce3ec] flex flex-col justify-between overflow-hidden">
          <div class="mt-[1.4cqh] mx-[1.2cqw] h-[20.5cqh] bg-gradient-to-b from-[#9aa1a9] to-[#878e96] border-y-[0.3cqh] border-[#687078] relative shadow-inner">
            <div class="absolute bottom-[1.1cqh] left-0 right-0 border-b-[0.45cqh] border-dashed border-slate-300/75"></div>
            ${facItemsHtml}
          </div>

          <div class="h-[10.8cqh] flex items-center justify-center relative">
            <div class="min-w-[34cqw] max-w-[68cqw] px-[2.5cqw] h-[7.6cqh] bg-[#e3e842] border border-[#b5ba25] shadow-sm flex flex-col items-center justify-center leading-none">
              <div class="font-bold text-[2.25cqw] text-[#1e2329] tracking-wide truncate max-w-full">${escapeHtml(exitJp)}</div>
              <div class="font-bold font-['Roboto'] text-[1.22cqw] text-[#2c323a] mt-[0.35cqh] truncate max-w-full">${escapeHtml(exitEn)}</div>
            </div>
          </div>
        </div>

        <div class="h-[22.2cqh] bg-gradient-to-b from-[#3b4046] to-[#262a2e] border-t-[0.4cqh] border-[#525860] flex items-center justify-center px-[6cqw]">
          ${doorFooterHtml}
        </div>
      `;
    }

    /* ==========================================================
       9. LINE-FIRST NAVIGATION & SCENE SWITCHER (路線を選んで切替)
       ========================================================== */
    function selectLine(lineKey, subSceneId = null) {
      closeEmergencyStop();
      closeTrainInfoScreen();
      state.activeLineKey = lineKey;

      ['JY', 'JC', 'JB', 'JE', 'JK'].forEach(k => {
        const btn = document.getElementById(`lineBtn_${k}`);
        if (btn) btn.className = k === lineKey ? 'line-card-btn active' : 'line-card-btn';
      });

      const cat = LINE_CATALOG[lineKey];
      if (!cat) return;

      const targetSubId = subSceneId || cat.subScenes[0].id;
      state.activeSubSceneId = targetSubId;

      renderSubSceneChips();
      applySubScene(targetSubId);
    }

    function renderSubSceneChips() {
      const wrap = document.getElementById('lineSubSceneChips');
      if (!wrap) return;
      const cat = LINE_CATALOG[state.activeLineKey];
      if (!cat) return;

      wrap.innerHTML = cat.subScenes.map(sc => `
        <button onclick="applySubScene('${sc.id}')" class="m3-chip ${sc.id === state.activeSubSceneId ? 'active' : ''}">
          ${escapeHtml(sc.label)}
        </button>
      `).join('');
    }

    function applySubScene(subId) {
      closeEmergencyStop();
      closeTrainInfoScreen();
      state.activeSubSceneId = subId;
      renderSubSceneChips();

      if (subId === 'yamanote_video_tokyo') {
        loadPreset('yamanote_video_tokyo');
        setLanguage('jp', false);
      } else if (subId === 'yamanote_video_kanda') {
        loadPreset('yamanote_video_kanda');
        setLanguage('jp', false);
      } else if (subId === 'yamanote_sugamo') {
        loadPreset('yamanote_sugamo');
        setLanguage('en', false);
      } else if (subId === 'yamanote_shinokubo') {
        loadPreset('yamanote_shinokubo');
        setLanguage('jp', false);
      } else if (subId === 'yamanote_otsuka') {
        loadPreset('yamanote_otsuka');
        setLanguage('en', false);
      } else if (subId === 'chuo_comm_takao') {
        loadPreset('chuo_comm_takao');
        state.currentStationIndex = 0; // Takao JC24
        state.runningPhase = 'stopped';
        state.manualClock = '8:36';
        state.bodyLayout = 'chuo_stopping';
        setLanguage('jp', false);
      } else if (subId === 'chuo_comm_hachioji_info') {
        loadPreset('chuo_comm_takao');
        state.currentStationIndex = 0; // Next is Hachioji JC22
        state.runningPhase = 'next';
        state.manualClock = '8:37';
        state.bodyLayout = 'chuo_train_info';
        setLanguage('jp', false);
      } else if (subId === 'chuo_comm_hachioji_plat') {
        loadPreset('chuo_comm_takao');
        state.currentStationIndex = 0; // Arriving at Hachioji JC22
        state.runningPhase = 'arriving';
        state.manualClock = '8:41';
        state.bodyLayout = 'chuo_platform';
        setLanguage('jp', false);
      } else if (subId === 'chuo_comm_hachioji_door') {
        loadPreset('chuo_comm_takao');
        state.currentStationIndex = 0; // Arriving at Hachioji JC22
        state.runningPhase = 'arriving';
        state.manualClock = '8:42';
        state.bodyLayout = 'chuo_door';
        setLanguage('en', false);
      } else if (subId === 'chuo_comm_yotsuya') {
        loadPreset('chuo_comm_takao');
        state.currentStationIndex = 4; // Next is Yotsuya JC04
        state.runningPhase = 'next';
        state.manualClock = '9:26';
        state.bodyLayout = 'chuo_transfer';
        setLanguage('kana', false);
      } else if (subId === 'chuo_rapid') {
        loadPreset('chuo_rapid');
        setLanguage('jp', false);
      } else if (subId === 'sobu_akihabara') {
        loadPreset('sobu_akihabara');
        setLanguage('jp', false);
      } else if (subId === 'sobu_ochanomizu') {
        loadPreset('sobu_akihabara');
        state.currentStationIndex = 1; // Next Ochanomizu JB18
        state.bodyLayout = 'chuo_transfer';
        setLanguage('jp', false);
      } else if (subId === 'keiyo_photo') {
        loadPreset('keiyo_photo');
        setLanguage('jp', false);
      } else if (subId === 'keihin_tohoku') {
        loadPreset('keihin_tohoku');
        setLanguage('jp', false);
      }

      syncPlatformEditorFields();
      renderLCD(true);
    }

    /* ==========================================================
       9B. VIDEO & REAL-TRAIN SEQUENCE AUTO-PLAYER
       Reproduces the exact 44-second video sequence (or Chuo Line sequence)!
       ========================================================== */
    function toggleVideoSequenceDemo() {
      state.videoDemoActive = !state.videoDemoActive;
      const btn = document.getElementById('btnVideoDemo');
      const txt = document.getElementById('videoDemoText');

      if (state.videoDemoActive) {
        btn.className = 'm3-btn-filled bg-rose-500 hover:bg-rose-400 text-white shadow';
        txt.textContent = '実車シーケンス再生: ON';

        let step = 0;
        const runStep = () => {
          if (state.activeLineKey === 'JC') {
            // Chuo Line IMG_4442 -> 4445 -> 4446 -> 4448 -> 4449 sequence
            const chuoSteps = [
              'chuo_comm_takao',
              'chuo_comm_hachioji_info',
              'chuo_comm_hachioji_plat',
              'chuo_comm_hachioji_door',
              'chuo_comm_yotsuya'
            ];
            applySubScene(chuoSteps[step % chuoSteps.length]);
            if (step % chuoSteps.length === 2) playAnnouncement();
          } else {
            // Yamanote Video 00:00 -> 00:44 Exact Sequence
            const phase = step % 5;
            if (phase === 0) {
              // 00:00 - 00:06: Stopped at Tokyo TYO JY01 (Right-to-Left Curve)
              applySubScene('yamanote_video_tokyo');
              document.getElementById('chkCurveKanjiLock').checked = true;
            } else if (phase === 1) {
              // 00:07 - 00:18: Next Kanda KND JY02 + Notice Information + Announcement
              applySubScene('yamanote_video_kanda');
              state.bodyLayout = 'notice_info';
              renderLCD(true);
              playAnnouncement();
            } else if (phase === 2) {
              // 00:19 - 00:30: Inner Loop Map (Kanji)
              state.bodyLayout = 'loop';
              document.getElementById('chkCurveKanjiLock').checked = true;
              renderLCD(true);
            } else if (phase === 3) {
              // 00:31 - 00:42: Right-to-Left Curve (Next Kanda 2)
              state.bodyLayout = 'curve_rtl';
              renderLCD(true);
            } else if (phase === 4) {
              // 00:43 - 00:44: Inner Loop Map with Slanted English Station Names!
              state.bodyLayout = 'loop';
              document.getElementById('chkCurveKanjiLock').checked = false;
              setLanguage('en', true);
            }
          }
          step++;
        };

        runStep();
        videoDemoInterval = setInterval(runStep, 5200);
      } else {
        btn.className = 'm3-btn-filled bg-amber-500 hover:bg-amber-400 text-slate-950 shadow';
        txt.textContent = '実車シーケンス再生: OFF';
        clearInterval(videoDemoInterval);
      }
    }

    function triggerTrainInfoScreen() {
      closeEmergencyStop();
      document.getElementById('trainInfoClock').textContent = getDisplayClockString();
      const el = document.getElementById('viewTrainInfoFull');
      el.classList.remove('hidden');
      el.classList.add('flex');
    }

    function closeTrainInfoScreen() {
      const el = document.getElementById('viewTrainInfoFull');
      el.classList.add('hidden');
      el.classList.remove('flex');
    }

    async function triggerEmergencyStop() {
      closeTrainInfoScreen();
      const el = document.getElementById('viewEmergencyFull');
      el.classList.remove('hidden');
      el.classList.add('flex');

      try {
        await Tone.start();
        const synth = new Tone.Synth({
          oscillator: { type: 'square' },
          envelope: { attack: 0.01, decay: 0.15, sustain: 0.6, release: 0.2 }
        }).toDestination();
        synth.volume.value = -10;
        const now = Tone.now();
        synth.triggerAttackRelease('A5', '16n', now);
        synth.triggerAttackRelease('E5', '16n', now + 0.18);
        synth.triggerAttackRelease('A5', '16n', now + 0.36);
        synth.triggerAttackRelease('E5', '8n', now + 0.54);
      } catch (e) {}
    }

    function closeEmergencyStop() {
      const el = document.getElementById('viewEmergencyFull');
      el.classList.add('hidden');
      el.classList.remove('flex');
    }

