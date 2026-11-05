// 言語・プリセット・駅編集・時計・イベント登録
    /* ==========================================================
       11. LANGUAGE ROLL & LAYOUT CONTROLS
       ========================================================== */
    function setLanguage(lang, animate = true) {
      state.lang = lang;
      ['jp', 'kana', 'en', 'zh', 'ko'].forEach(l => {
        const btn = document.getElementById(`langBtn_${l}`);
        if (btn) {
          btn.className = l === lang ? 'm3-seg-btn active' : 'm3-seg-btn';
        }
      });
      renderLCD(animate);
    }

    function setBodyLayout(layout) {
      state.bodyLayout = layout;
      state.pickedLayout = layout; // 路線を変えても、このレイアウトを保つ
      renderLCD(false);
    }

    /* 詳細設定の開閉（通常は閉じておく） */
    function toggleAdvancedPanel() {
      const deck = document.getElementById('controlDeck');
      const btn = document.getElementById('advancedToggle');
      const open = deck.style.display === 'none';
      deck.style.display = open ? '' : 'none';
      btn.textContent = open ? '詳細設定を閉じる' : '詳細設定を開く（ホーム・駅一覧・時計など）';
    }



    /* 設定の保存（この端末の中に保存する。路線ごとの駅の設定・動作速度・走行音） */
    const SETTINGS_KEY = 'visSimSettings.v1';
    function loadSettings() {
      try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { stops: {} }; }
      catch (e) { return { stops: {} }; }
    }
    function saveSettings(obj) {
      try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj)); } catch (e) { /* 保存できない環境では何もしない */ }
    }
    function saveStopSettings() {
      const cfg = loadSettings();
      const key = state.activeLineKey || state.lineKey || 'JY';
      cfg.stops = cfg.stops || {};
      cfg.stops[key] = state.stations.map(st => ({ screen: st.screen || null, dwell: typeof st.dwell === 'number' ? st.dwell : null }));
      saveSettings(cfg);
    }
    // 保存された駅の設定を、路線の表示に当てはめる
    function applySavedStops() {
      const cfg = loadSettings();
      const key = state.activeLineKey || state.lineKey || 'JY';
      const saved = cfg.stops && cfg.stops[key];
      if (!saved) return;
      state.stations.forEach((st, i) => {
        const v = saved[i];
        if (!v) return;
        st.screen = v.screen || undefined;
        st.dwell = typeof v.dwell === 'number' ? v.dwell : undefined;
      });
    }
    function setSimSpeedSaved(v) {
      setSimSpeed(v);
      const cfg = loadSettings(); cfg.speed = SIM.speed; saveSettings(cfg);
    }
    function resetSavedSettings() {
      try { localStorage.removeItem(SETTINGS_KEY); } catch (e) { /* 何もしない */ }
      location.reload();
    }

    /* 駅ごとの設定：表示する画面（到着時）と停車時間（秒）を画面上で変える */
    const STOP_SCREENS = [
      ['', '（自動：路線の順番）'], ['loop', '環状ループ'], ['curve_rtl', 'カーブ（右→左）'], ['curve', 'カーブ（左→右）'],
      ['straight', '直線バー'], ['platform', '停止位置'], ['notice_info', 'お知らせ'], ['sobu_rect', '総武線ブロック'],
      ['chuo_stopping', '中央線種別図'], ['chuo_platform', '12両ホーム'], ['chuo_door', '大型ドア案内'],
      ['chuo_transfer', 'のりかえ専用'], ['chuo_train_info', '運行情報']
    ];
    function setStationScreen(i, v) {
      if (!state.stations[i]) return;
      state.stations[i].screen = v || undefined;
      saveStopSettings();
    }
    function setStationDwell(i, v) {
      if (!state.stations[i]) return;
      const n = Number(v);
      state.stations[i].dwell = Number.isFinite(n) && v !== '' ? Math.max(0, Math.min(60, n)) : undefined;
      saveStopSettings();
    }
    function renderStopEditor() {
      const box = document.getElementById('stopEditor');
      if (!box) return;
      box.innerHTML = state.stations.map((st, i) => {
        const screenOpts = STOP_SCREENS.map(([val, label]) =>
          `<option value="${val}" ${(st.screen || '') === val ? 'selected' : ''}>${label}</option>`).join('');
        const dwellVal = typeof st.dwell === 'number' ? st.dwell : '';
        return `<div class="flex items-center gap-2 py-1 border-b border-slate-800/70 text-[12px]">
          <span class="w-28 font-bold text-slate-200 truncate">${escapeHtml(st.nameJp)}</span>
          <select class="m3-input !py-1 flex-1 min-w-0" onchange="setStationScreen(${i}, this.value)">${screenOpts}</select>
          <label class="flex items-center gap-1 text-slate-300">停車
            <input type="number" min="0" max="60" step="1" value="${dwellVal}" placeholder="自動" class="m3-input !py-1 w-20"
              onchange="setStationDwell(${i}, this.value)" />秒
          </label>
        </div>`;
      }).join('');
    }
    /* 記録した選択を消して、路線の既定の表示に戻す */
    function resetLayoutPicks() {
      state.pickedLayout = null;
      state.pickedHeader = null;
      applySubSceneCore(state.activeSubSceneId);
      renderLCD(false);
    }

    function startAutoLangInterval() {
      clearInterval(autoLangInterval);
      // Matches video language cycle: 漢字 -> English -> ひらがな (plus optional zh/ko)
      const cycleOrder = ['jp', 'en', 'kana'];
      autoLangInterval = setInterval(() => {
        const idx = cycleOrder.indexOf(state.lang);
        const nextLang = cycleOrder[(idx + 1) % cycleOrder.length];
        setLanguage(nextLang, true);
      }, 3000);
    }

    function toggleAutoLangCycle() {
      state.autoLangCycleActive = !state.autoLangCycleActive;
      const btn = document.getElementById('btnAutoLang');
      const txt = document.getElementById('autoLangText');
      if (state.autoLangCycleActive) {
        btn.className = 'm3-chip active';
        txt.textContent = '多言語自動切替: ON (3.0秒)';
        startAutoLangInterval();
      } else {
        btn.className = 'm3-chip';
        txt.textContent = '多言語自動切替: OFF';
        clearInterval(autoLangInterval);
      }
    }

    /* ==========================================================
       12. PRESETS & FORM HANDLERS
       ========================================================== */
    function loadPreset(presetKey) {
      const preset = PRESETS[presetKey];
      if (!preset) return;
      const keepLang = state.lang;
      const keepAutoLang = state.autoLangCycleActive;
      const keepAnimStyle = state.animStyle;
      const keepActiveLine = state.activeLineKey;
      const keepActiveSub = state.activeSubSceneId;
      const keepDelayTitle = state.customDelayTitle;
      const keepDelayBody = state.customDelayBody;
      const keepNoticeBody = state.customNoticeBody;
      const keepPickedLayout = state.pickedLayout;
      const keepPickedHeader = state.pickedHeader;

      state = JSON.parse(JSON.stringify(preset));
      state.lang = keepLang;
      state.pickedLayout = keepPickedLayout; // 利用者が選んだレイアウト・ヘッダーは路線を変えても保つ
      state.pickedHeader = keepPickedHeader;
      state.autoLangCycleActive = keepAutoLang;
      state.animStyle = keepAnimStyle;
      state.activeLineKey = preset.lineKey || keepActiveLine;
      state.activeSubSceneId = keepActiveSub;
      state.customDelayTitle = keepDelayTitle;
      state.customDelayBody = keepDelayBody;
      state.customNoticeBody = keepNoticeBody;

      document.getElementById('selectHeaderStyle').value = state.headerStyle;
      document.getElementById('inputTrainType').value = state.trainTypeJp;
      document.getElementById('inputTrainTypeColor').value = state.trainTypeColor;
      document.getElementById('inputDestination').value = state.destinationJp;
      document.getElementById('inputLineColor').value = state.lineColor;
      document.getElementById('inputLinePrefix').value = state.linePrefix;
      document.getElementById('selectDirection').value = state.direction;
      document.getElementById('inputCarNumber').value = state.carNumber;
      document.getElementById('selectTotalCars').value = state.totalCars || 11;
      document.getElementById('inputManualClock').value = state.manualClock;
      document.getElementById('sliderTrainProgress').value = state.trainProgress || 0;
      document.getElementById('labelTrainProgress').textContent = `${state.trainProgress || 0}%`;

      syncPlatformEditorFields();
      renderStationEditorTable();
      renderLCD(true);
    }

    function updateHeaderStyleFromSelect() {
      state.headerStyle = document.getElementById('selectHeaderStyle').value;
      state.pickedHeader = state.headerStyle; // 路線を変えても、このヘッダー形式を保つ
      renderLCD(true);
    }

    function updateHeaderFromInputs() {
      state.trainTypeJp = document.getElementById('inputTrainType').value || '各駅停車';
      state.trainTypeColor = document.getElementById('inputTrainTypeColor').value;
      state.destinationJp = document.getElementById('inputDestination').value || '東京';
      state.lineColor = document.getElementById('inputLineColor').value;
      state.linePrefix = (document.getElementById('inputLinePrefix').value || 'JY').toUpperCase();
      renderLCD(true);
    }

    function updateDirectionFromSelect() {
      state.direction = document.getElementById('selectDirection').value;
      renderLCD(false);
    }

    function renderStationEditorTable() {
      const tbody = document.getElementById('stationEditorTableBody');
      tbody.innerHTML = '';

      state.stations.forEach((st, idx) => {
        const trString = (st.transfers || []).map(t => t.textJp.replace('|', '')).join(', ');
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-800/40';
        row.innerHTML = `
          <td class="py-1.5 px-2 font-mono text-slate-400">
            <button onclick="selectStationDirectly(${idx})" class="hover:text-emerald-400 underline">#${idx + 1}</button>
          </td>
          <td class="py-1.5 px-2">
            <input type="text" value="${escapeHtml(st.nameJp)}" oninput="updateStationField(${idx}, 'nameJp', this.value)"
              class="m3-input w-24 !py-1" />
          </td>
          <td class="py-1.5 px-2">
            <input type="text" value="${escapeHtml(st.nameKana || '')}" oninput="updateStationField(${idx}, 'nameKana', this.value)"
              class="m3-input w-24 !py-1" />
          </td>
          <td class="py-1.5 px-2">
            <input type="text" value="${escapeHtml(st.nameEn)}" oninput="updateStationField(${idx}, 'nameEn', this.value)"
              class="m3-input w-28 !py-1" />
          </td>
          <td class="py-1.5 px-2">
            <input type="text" maxlength="3" placeholder="AKB" value="${escapeHtml(st.threeLetter || '')}" oninput="updateStationField(${idx}, 'threeLetter', this.value.toUpperCase())"
              class="m3-input w-14 !py-1 text-center font-mono uppercase" />
          </td>
          <td class="py-1.5 px-2">
            <input type="text" value="${escapeHtml(st.num)}" oninput="updateStationField(${idx}, 'num', this.value)"
              class="m3-input w-12 !py-1 text-center font-mono" />
          </td>
          <td class="py-1.5 px-2">
            <input type="number" min="0" max="180" value="${st.mins}" oninput="updateStationField(${idx}, 'mins', Number(this.value))"
              class="m3-input w-14 !py-1 text-center font-mono text-amber-300" />
          </td>
          <td class="py-1.5 px-2">
            <input type="text" value="${escapeHtml(st.exitJp || '北口・南口')}" oninput="updateStationField(${idx}, 'exitJp', this.value)"
              class="m3-input w-32 !py-1" />
          </td>
          <td class="py-1.5 px-2">
            <select onchange="updateStationField(${idx}, 'doorSide', this.value)" class="m3-input !py-1">
              <option value="this" ${(st.doorSide || 'this') === 'this' ? 'selected' : ''}>こちら側</option>
              <option value="opposite" ${st.doorSide === 'opposite' ? 'selected' : ''}>反対側</option>
            </select>
          </td>
          <td class="py-1.5 px-2">
            <input type="text" value="${escapeHtml(trString)}" placeholder="例: 山手線, 丸ノ内線, 日比谷線"
              oninput="updateStationTransfer(${idx}, this.value)"
              class="m3-input w-48 !py-1" />
          </td>
        `;
        tbody.appendChild(row);
      });
    }

    function updateStationField(idx, field, value) {
      if (!state.stations[idx]) return;
      state.stations[idx][field] = value;
      syncPlatformEditorFields();
      renderLCD(false);
    }

    // Smart Railway Line Parser: Automatically detects real JR / Metro / Toei / Private lines and assigns authentic badges & colors!
    const LINE_BADGE_DICT = [
      { key: '山手線', badge: 'JY', shape: 'square', color: '#77c043', en: 'Yamanote Line' },
      { key: '中央線各駅停車', badge: 'JB', shape: 'square', color: '#ffd400', en: 'Chūō Line ( Local )' },
      { key: '総武線各駅停車', badge: 'JB', shape: 'square', color: '#ffd400', en: 'Sōbu Line ( Local )' },
      { key: '中央・総武線', badge: 'JB', shape: 'square', color: '#ffd400', en: 'Chūō-Sōbu Line' },
      { key: '中央線', badge: 'JC', shape: 'square', color: '#eb5c01', en: 'Chūō Line' },
      { key: '京浜東北線', badge: 'JK', shape: 'square', color: '#00a7e3', en: 'Keihin-Tōhoku Line' },
      { key: '埼京線', badge: 'JA', shape: 'square', color: '#00ac9a', en: 'Saikyō Line' },
      { key: '京葉線', badge: 'JE', shape: 'square', color: '#c9242b', en: 'Keiyō Line' },
      { key: '武蔵野線', badge: 'JM', shape: 'square', color: '#e05316', en: 'Musashino Line' },
      { key: '横浜線', badge: 'JH', shape: 'square', color: '#77c043', en: 'Yokohama Line' },
      { key: '南武線', badge: 'JN', shape: 'square', color: '#ffd400', en: 'Nambu Line' },
      { key: '東海道線', badge: 'JT', shape: 'square', color: '#f68b1e', en: 'Tōkaidō Line' },
      { key: '横須賀線', badge: 'JO', shape: 'square', color: '#0068b7', en: 'Yokosuka Line' },
      { key: '総武線快速', badge: 'JO', shape: 'square', color: '#0068b7', en: 'Sōbu Line (Rapid)' },
      { key: '常磐線', badge: 'JJ', shape: 'square', color: '#00b261', en: 'Jōban Line' },
      { key: '八高線', badge: 'SOLID_GREY', shape: 'square', color: '#7d7d7d', en: 'Hachikō Line' },
      { key: 'つくば', badge: 'TX', shape: 'square', color: '#1d2088', en: 'Tsukuba Express' },
      { key: '銀座線', badge: 'G', shape: 'circle', color: '#ff9500', en: 'Ginza Line' },
      { key: '丸ノ内線', badge: 'M', shape: 'circle', color: '#f62e36', en: 'Marunouchi Line' },
      { key: '日比谷線', badge: 'H', shape: 'circle', color: '#b5b5ac', en: 'Hibiya Line' },
      { key: '東西線', badge: 'T', shape: 'circle', color: '#009bbf', en: 'Tōzai Line' },
      { key: '千代田線', badge: 'C', shape: 'circle', color: '#00bb85', en: 'Chiyoda Line' },
      { key: '有楽町線', badge: 'Y', shape: 'circle', color: '#c1a470', en: 'Yūrakuchō Line' },
      { key: '半蔵門線', badge: 'Z', shape: 'circle', color: '#8f76d6', en: 'Hanzōmon Line' },
      { key: '南北線', badge: 'N', shape: 'circle', color: '#00ac9b', en: 'Namboku Line' },
      { key: '副都心線', badge: 'F', shape: 'circle', color: '#9c5e31', en: 'Fukutoshin Line' },
      { key: '浅草線', badge: 'A', shape: 'circle', color: '#e85298', en: 'Toei Asakusa Line' },
      { key: '三田線', badge: 'I', shape: 'circle', color: '#006cb6', en: 'Toei Mita Line' },
      { key: '新宿線', badge: 'S', shape: 'circle', color: '#b0bf1e', en: 'Toei Shinjuku Line' },
      { key: '大江戸線', badge: 'E', shape: 'circle', color: '#ce0058', en: 'Toei Ōedo Line' }
    ];

    function updateStationTransfer(idx, rawValue) {
      if (!state.stations[idx]) return;
      const parts = rawValue.split(/[,、\/]/).map(s => s.trim()).filter(Boolean);
      state.stations[idx].transfers = parts.map(part => {
        const match = LINE_BADGE_DICT.find(d => part.includes(d.key));
        if (match) {
          return {
            badge: match.badge,
            badgeShape: match.shape,
            badgeColor: match.color,
            textJp: part,
            textEn: match.en
          };
        }
        return {
          badge: 'JR',
          badgeShape: 'square',
          badgeColor: '#334155',
          textJp: part,
          textEn: part
        };
      });
      renderLCD(false);
    }

    function appendTransferToCurrentStation(badge, badgeColor, badgeShape, textJp, textEn) {
      const targetIdx = state.runningPhase === 'stopped'
        ? state.currentStationIndex
        : findNextStopIndex(state.currentStationIndex);
      const st = state.stations[targetIdx];
      if (!st) return;
      if (!st.transfers) st.transfers = [];
      st.transfers.push({ badge, badgeColor, badgeShape, textJp, textEn });
      renderStationEditorTable();
      renderLCD(false);
    }

    function clearCurrentStationTransfers() {
      const targetIdx = state.runningPhase === 'stopped'
        ? state.currentStationIndex
        : findNextStopIndex(state.currentStationIndex);
      const st = state.stations[targetIdx];
      if (!st) return;
      st.transfers = [];
      renderStationEditorTable();
      renderLCD(false);
    }

    async function exportRouteJson() {
      const dataStr = JSON.stringify(state, null, 2);
      try {
        await navigator.clipboard.writeText(dataStr);
        showToastMessage('路線データをクリップボードにコピーしました');
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        showToastMessage('コピーに失敗しました');
      }
    }

    function showToastMessage(msg) {
      let el = document.getElementById('toastMessage');
      if (!el) {
        el = document.createElement('div');
        el.id = 'toastMessage';
        el.setAttribute('role', 'status');
        el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#0f172a;color:#e2e8f0;padding:8px 16px;border-radius:9999px;font-size:12px;font-weight:700;z-index:100;box-shadow:0 8px 24px rgba(0,0,0,.4);transition:opacity .25s;opacity:0;pointer-events:none;';
        document.body.appendChild(el);
      }
      el.textContent = msg;
      el.style.opacity = '1';
      clearTimeout(showToastMessage._t);
      showToastMessage._t = setTimeout(() => { el.style.opacity = '0'; }, 1800);
    }

    function addStationToRoute() {
      const last = state.stations[state.stations.length - 1];
      const nextNum = String(Math.max(1, Number(last.num) - 1)).padStart(2, '0');
      state.stations.push({
        nameJp: '新駅',
        nameKana: 'しんえき',
        nameEn: 'Shin-Eki',
        nameZh: '新站',
        nameKo: '신역',
        num: nextNum,
        mins: (last ? last.mins : 20) + 2,
        stop: true,
        doorSide: 'this',
        exitJp: '北口・南口',
        exitEn: 'North Exit · South Exit',
        facilities: [{ car: 3, type: 'escalator' }, { car: 6, type: 'elevator' }, { car: 8, type: 'stairs' }],
        transfers: []
      });
      syncPlatformEditorFields();
      renderStationEditorTable();
      renderLCD(false);
    }

    /* ==========================================================
       13. CLOCK, CAR NUMBER, THEME & VISUAL FILTER HANDLERS
       ========================================================== */
    function getDisplayClockString() {
      if (state.clockMode === 'realtime') {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
      }
      return state.manualClock || '21:08';
    }

    function setClockMode(mode) {
      state.clockMode = mode;
      const btnFixed = document.getElementById('btnClockFixed');
      const btnReal = document.getElementById('btnClockRealtime');
      if (mode === 'fixed') {
        btnFixed.className = 'm3-btn-filled bg-emerald-500 text-slate-950 flex-1';
        btnReal.className = 'm3-btn-tonal flex-1';
      } else {
        btnReal.className = 'm3-btn-filled bg-emerald-500 text-slate-950 flex-1';
        btnFixed.className = 'm3-btn-tonal flex-1';
      }
      renderLCD(false);
    }

    function updateManualClock() {
      state.manualClock = document.getElementById('inputManualClock').value || '21:08';
      setClockMode('fixed');
    }

    function updateCarNumber() {
      const maxCars = Number(state.totalCars) || 15;
      state.carNumber = Math.max(1, Math.min(maxCars, Number(document.getElementById('inputCarNumber').value) || 1));
      renderLCD(false);
    }

    function updateDoorSide() {
      const val = document.getElementById('selectDoorSide').value;
      state.doorSide = val;
      const targetIdx = state.runningPhase === 'stopped'
        ? state.currentStationIndex
        : findNextStopIndex(state.currentStationIndex);
      if (state.stations[targetIdx]) {
        state.stations[targetIdx].doorSide = val;
      }
      renderStationEditorTable();
      renderLCD(false);
    }

    function updateVisualEffects() {
      const showBezel = document.getElementById('chkShowBezel').checked;
      const showGlare = document.getElementById('chkShowGlare').checked;
      const showSubpixel = document.getElementById('chkShowSubpixel').checked;

      const bezelWrapper = document.getElementById('bezelWrapper');
      bezelWrapper.className = showBezel ? 'lcd-bezel-wrapper w-full' : 'w-full';

      document.getElementById('lcdGlareLayer').style.display = showGlare ? 'block' : 'none';
      document.getElementById('lcdSubpixelLayer').style.display = showSubpixel ? 'block' : 'none';
    }

    function toggleThemeMode() {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      document.getElementById('themeIcon').textContent = isLight ? 'dark_mode' : 'light_mode';
    }

    function toggleFullscreenDisplay() {
      state.isFullscreen = !state.isFullscreen;
      const toolbar = document.getElementById('appToolbar');
      const quickStrip = document.getElementById('quickControlStrip');
      const deck = document.getElementById('controlDeck');
      const exitBtn = document.getElementById('exitFullscreenBtn');

      if (state.isFullscreen) {
        toolbar.classList.add('hidden');
        quickStrip.classList.add('hidden');
        deck.classList.add('hidden');
        exitBtn.classList.remove('hidden');
      } else {
        toolbar.classList.remove('hidden');
        quickStrip.classList.remove('hidden');
        deck.classList.remove('hidden');
        exitBtn.classList.add('hidden');
      }
    }

    function switchTab(tabKey) {
      ['presets', 'platform', 'stations', 'visual'].forEach(k => {
        const panel = document.getElementById(`tabPanel_${k}`);
        const btn = document.getElementById(`tabBtn_${k}`);
        if (k === tabKey) {
          panel.classList.remove('hidden');
          btn.className = 'px-4 py-3 text-xs sm:text-sm font-bold border-b-2 border-emerald-400 text-emerald-300 flex items-center gap-1.5 whitespace-nowrap';
        } else {
          panel.classList.add('hidden');
          btn.className = 'px-4 py-3 text-xs sm:text-sm font-bold border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1.5 whitespace-nowrap';
        }
      });
    }

    function adjustBrightness(hex, percent) {
      const num = parseInt(hex.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.max(0, Math.min(255, (num >> 16) + amt));
      const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
      const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
      return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    }

    function escapeHtml(str) {
      return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        stepStation(state.direction === 'rtl' ? 1 : -1);
      } else if (e.key === 'ArrowRight') {
        stepStation(state.direction === 'rtl' ? -1 : 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        cycleRunningPhase();
      }
    });

    window.onload = function () {
      selectLine('JY', 'yamanote_video_tokyo');
      startAutoLangInterval();
      clockInterval = setInterval(() => {
        if (state.clockMode === 'realtime') renderLCD(false);
      }, 10000);
    };

/* ==========================================================
   イベント委譲: data-click / data-input / data-change
   HTMLに直書きせず、data属性で関数名と引数（JSON）を指定する。
   元のインラインハンドラと同じく、内側から外側へ順に実行する。
   ========================================================== */
['click', 'input', 'change'].forEach((evName) => {
  document.addEventListener(evName, (e) => {
    const key = `data-${evName}`;
    const argsKey = `${key}-args`;
    let node = e.target instanceof Element ? e.target : null;
    while (node) {
      const fnName = node.getAttribute(key);
      if (fnName) {
        const fn = window[fnName];
        if (typeof fn !== 'function') {
          console.error(`未定義のハンドラです: ${fnName}`);
        } else {
          let args = [];
          try {
            args = JSON.parse(node.getAttribute(argsKey) || '[]');
          } catch (err) {
            console.error(`引数の解析に失敗しました: ${fnName}`, err);
          }
          fn(...args);
        }
      }
      node = node.parentElement;
    }
  });
});

// 起動時：保存しておいた動作速度を反映する
window.addEventListener('load', () => {
  const cfg = loadSettings();
  if (cfg.speed) {
    setSimSpeed(cfg.speed);
    const slider = document.querySelector('input[oninput="setSimSpeedSaved(this.value)"]');
    if (slider) slider.value = SIM.speed;
  }
});
