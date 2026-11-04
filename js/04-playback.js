// 列車進行・自動シミュレーション
    /* ==========================================================
       10. TRAIN PROGRESSION, PLATFORM JUMP & AUTO SIMULATION
       ========================================================== */
    function findNextStopIndex(fromIdx) {
      for (let i = fromIdx + 1; i < state.stations.length; i++) {
        if (state.stations[i].stop) return i;
      }
      return Math.min(fromIdx + 1, state.stations.length - 1);
    }

    function onTrainProgressScrub(val) {
      state.trainProgress = Number(val);
      document.getElementById('labelTrainProgress').textContent = `${state.trainProgress}%`;

      if (state.trainProgress === 0) {
        state.runningPhase = 'stopped';
      } else if (state.trainProgress >= 80) {
        state.runningPhase = 'arriving';
      } else {
        state.runningPhase = 'next';
      }
      renderLCD(true);
    }

    function stepStation(delta) {
      const maxIdx = Math.max(0, state.stations.length - 2);
      state.currentStationIndex = Math.max(0, Math.min(maxIdx, state.currentStationIndex + delta));
      state.runningPhase = 'next';
      state.trainProgress = 18;
      document.getElementById('sliderTrainProgress').value = 18;
      document.getElementById('labelTrainProgress').textContent = '18%';
      syncPlatformEditorFields();
      renderLCD(true);
    }

    function jumpToStationForPlatform(stationIdxStr) {
      const targetIdx = Number(stationIdxStr);
      selectStationDirectly(targetIdx);
    }

    function selectStationDirectly(targetIdx) {
      if (targetIdx <= 0) {
        state.currentStationIndex = 0;
        state.runningPhase = 'stopped';
        state.trainProgress = 0;
      } else {
        state.currentStationIndex = targetIdx - 1;
        state.runningPhase = state.runningPhase === 'stopped' ? 'next' : state.runningPhase;
        state.trainProgress = state.runningPhase === 'arriving' ? 85 : 20;
      }
      document.getElementById('sliderTrainProgress').value = state.trainProgress;
      document.getElementById('labelTrainProgress').textContent = `${state.trainProgress}%`;
      syncPlatformEditorFields();
      renderLCD(true);
    }

    function renderQuickStationPills(activeTargetIdx) {
      const wrap = document.getElementById('quickStationPills');
      if (!wrap) return;
      wrap.innerHTML = state.stations.map((st, idx) => {
        const isActive = idx === activeTargetIdx;
        const threeLtr = st.threeLetter ? `<span class="px-1 py-0.2 rounded bg-slate-900 text-white text-[9px] font-mono">${escapeHtml(st.threeLetter)}</span>` : '';
        return `
          <button onclick="selectStationDirectly(${idx})" class="station-pill-btn ${isActive ? 'active' : ''}">
            ${threeLtr}
            <span class="font-mono text-[10px] opacity-80">${escapeHtml(state.linePrefix)}${escapeHtml(st.num)}</span>
            <span>${escapeHtml(st.nameJp)}</span>
          </button>
        `;
      }).join('');
    }

    function syncPlatformEditorFields() {
      const targetIdx = state.runningPhase === 'stopped'
        ? state.currentStationIndex
        : findNextStopIndex(state.currentStationIndex);
      const st = state.stations[targetIdx] || state.stations[0];

      const jumpSel = document.getElementById('selectPlatformStationJump');
      if (jumpSel) {
        jumpSel.innerHTML = state.stations.map((s, idx) =>
          `<option value="${idx}" ${idx === targetIdx ? 'selected' : ''}>${escapeHtml(state.linePrefix)}${escapeHtml(s.num)} ${escapeHtml(s.nameJp)} (${escapeHtml(s.exitJp || '北口・南口')})</option>`
        ).join('');
      }

      if (st) {
        document.getElementById('selectDoorSide').value = st.doorSide || state.doorSide || 'this';
        document.getElementById('inputExitBannerJp').value = st.exitJp || '北口・南口';
        document.getElementById('inputExitBannerEn').value = st.exitEn || 'North Exit · South Exit';
      }
    }

    function updateCurrentStationPlatformMeta() {
      const targetIdx = state.runningPhase === 'stopped'
        ? state.currentStationIndex
        : findNextStopIndex(state.currentStationIndex);
      const st = state.stations[targetIdx];
      if (!st) return;

      st.exitJp = document.getElementById('inputExitBannerJp').value || '北口・南口';
      st.exitEn = document.getElementById('inputExitBannerEn').value || 'North Exit · South Exit';
      renderStationEditorTable();
      renderLCD(false);
    }

    function updateTotalCars(val) {
      state.totalCars = Number(val) || 11;
      renderLCD(false);
    }

    function cycleRunningPhase() {
      const order = ['next', 'arriving', 'stopped'];
      const idx = order.indexOf(state.runningPhase);
      state.runningPhase = order[(idx + 1) % order.length];
      state.trainProgress = state.runningPhase === 'stopped' ? 0 : (state.runningPhase === 'arriving' ? 88 : 22);
      document.getElementById('sliderTrainProgress').value = state.trainProgress;
      document.getElementById('labelTrainProgress').textContent = `${state.trainProgress}%`;
      syncPlatformEditorFields();
      renderLCD(true);
    }

    /* 画面の自動切替の1コマ（動作速度に合わせて間隔が変わる） */
    function autoPageTick() {
          let pages = ['straight', 'platform'];
          if (state.linePrefix === 'JY') {
            pages = ['curve_rtl', 'notice_info', 'loop', 'platform'];
          } else if (state.linePrefix === 'JC') {
            pages = ['chuo_stopping', 'chuo_train_info', 'chuo_platform', 'chuo_door', 'chuo_transfer'];
          } else if (state.linePrefix === 'JB') {
            pages = ['sobu_rect', 'chuo_platform', 'chuo_door', 'chuo_transfer'];
          }
          const curIdx = pages.indexOf(state.bodyLayout);
          state.bodyLayout = pages[(curIdx + 1) % pages.length];
          renderLCD(false);
    }

    /* 自動運転の1コマ（動作速度に合わせて間隔が変わる） */
    function autoRunTick() {
          state.trainProgress += 20;
          if (state.trainProgress > 100) {
            state.trainProgress = 0;
            state.runningPhase = 'stopped';
            if (state.currentStationIndex < state.stations.length - 2) {
              state.currentStationIndex++;
            } else {
              state.currentStationIndex = 0;
            }
            syncPlatformEditorFields();
          } else if (state.trainProgress >= 80) {
            if (state.runningPhase !== 'arriving') {
              state.runningPhase = 'arriving';
              playAnnouncement();
            }
          } else {
            state.runningPhase = 'next';
          }
          document.getElementById('sliderTrainProgress').value = state.trainProgress;
          document.getElementById('labelTrainProgress').textContent = `${state.trainProgress}%`;
          renderLCD(true);
      playPhaseSound(state.runningPhase);
    }

    function toggleAutoSimulation() {
      state.autoRunActive = !state.autoRunActive;
      const btn = document.getElementById('btnAutoRun');
      const txt = document.getElementById('autoRunText');

      if (state.autoRunActive) {
        btn.className = 'm3-btn-filled bg-amber-500 hover:bg-amber-400 text-slate-950 shadow';
        txt.textContent = '自動走行: ON';

        autoRunInterval = setInterval(autoRunTick, 1800 / SIM.speed);
      } else {
        btn.className = 'm3-btn-filled bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow';
        txt.textContent = '自動走行: OFF';
        clearInterval(autoRunInterval);
      }
    }

    function toggleAutoPageCycle() {
      state.autoPageCycleActive = !state.autoPageCycleActive;
      const btn = document.getElementById('btnAutoPage');
      const txt = document.getElementById('autoPageText');

      if (state.autoPageCycleActive) {
        btn.className = 'm3-chip active';
        txt.textContent = '画面自動ローテ: ON';
        autoPageInterval = setInterval(autoPageTick, 5000 / SIM.speed);
      } else {
        btn.className = 'm3-chip';
        txt.textContent = '画面自動ローテ: OFF';
        clearInterval(autoPageInterval);
      }
    }

    async function playAnnouncement() {
      try {
        await Tone.start();
        const synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 0.8 }
        }).toDestination();
        synth.volume.value = -8;

        const now = Tone.now();
        synth.triggerAttackRelease('G5', '8n', now);
        synth.triggerAttackRelease('C6', '8n', now + 0.22);
        synth.triggerAttackRelease('E6', '8n', now + 0.44);
        synth.triggerAttackRelease('G6', '4n', now + 0.66);

        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const targetIdx = state.runningPhase === 'stopped'
            ? state.currentStationIndex
            : findNextStopIndex(state.currentStationIndex);
          const st = state.stations[targetIdx] || state.stations[state.stations.length - 1];
          const doorSide = st.doorSide || state.doorSide || 'this';
          const doorJp = doorSide === 'opposite' ? '反対側' : 'こちら側';

          const phraseJp = state.runningPhase === 'arriving'
            ? `まもなく、${st.nameKana}、${st.nameKana}。お出口は、${doorJp}です。`
            : `次は、${st.nameKana}、${st.nameKana}。`;

          const utterJp = new SpeechSynthesisUtterance(phraseJp);
          utterJp.lang = 'ja-JP';
          utterJp.rate = 1.02;

          const utterEn = new SpeechSynthesisUtterance(
            `The next station is ${st.nameEn}, ${state.linePrefix} ${st.num}.`
          );
          utterEn.lang = 'en-US';
          utterEn.rate = 0.98;

          setTimeout(() => {
            window.speechSynthesis.speak(utterJp);
            window.speechSynthesis.speak(utterEn);
          }, 1100);
        }
      } catch (e) {}
    }


/* 動作速度（SIM.speed）：自動運転・画面切替の間隔を変える。動作中なら作り直す */
const SIM = { speed: 1, sound: false };
function setSimSpeed(v) {
  SIM.speed = Math.max(0.5, Math.min(3, Number(v) || 1));
  const lbl = document.getElementById('simSpeedLabel');
  if (lbl) lbl.textContent = SIM.speed.toFixed(1) + '倍速';
  if (typeof autoRunInterval !== 'undefined' && autoRunInterval) {
    clearInterval(autoRunInterval);
    autoRunInterval = setInterval(autoRunTick, 1800 / SIM.speed);
  }
  if (typeof autoPageInterval !== 'undefined' && autoPageInterval) {
    clearInterval(autoPageInterval);
    autoPageInterval = setInterval(autoPageTick, 5000 / SIM.speed);
  }
}
