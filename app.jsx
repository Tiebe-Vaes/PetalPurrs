// Main App

const { useState, useEffect, useRef } = React;

const PLANT_GROW_MS = 15000; // 15s full grow

function uid() { return Math.random().toString(36).slice(2, 9); }

function PetalPurrs() {
  const [tab, setTab] = useState('home');
  const [coins, setCoins] = useState(50);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0); // 0..100
  const [coinBump, setCoinBump] = useState(false);

  const [orders, setOrders] = useState(() => {
    const arr = [];
    for (let i = 0; i < 3; i++) arr.push(makeOrder(i, 1));
    return arr;
  });
  const [activeOrderId, setActiveOrderId] = useState(null);

  const [draft, setDraft] = useState({ tea: null, cup: null, temp: 60, extras: [] });

  const [inventory, setInventory] = useState({ green: 5, chamomile: 3, rose: 2, lavender: 2, matcha: 0, hibiscus: 0 });

  const [beds, setBeds] = useState(() => [
    { id: 1, plant: 'green',     stage: 4, growth: 1,    planted: Date.now() - PLANT_GROW_MS },
    { id: 2, plant: 'chamomile', stage: 3, growth: 0.6,  planted: Date.now() - 9000 },
    { id: 3, plant: null,        stage: 0, growth: 0,    planted: 0 },
    { id: 4, plant: null,        stage: 0, growth: 0,    planted: 0 },
    { id: 5, plant: 'lavender',  stage: 1, growth: 0.2,  planted: Date.now() - 3000 },
    { id: 6, plant: null,        stage: 0, growth: 0,    planted: 0 },
  ]);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [draggingSeed, setDraggingSeed] = useState(null);

  // Cafe customers (visual diorama)
  const [customers, setCustomers] = useState(() => [
    { id: uid(), name: 'Mochi',   color: CAT_COLORS[0], pos: 60, target: 60, speed: 24 },
    { id: uid(), name: 'Juniper', color: CAT_COLORS[5], pos: 45, target: 45, speed: 28 },
    { id: uid(), name: 'Saffron', color: CAT_COLORS[2], pos: 25, target: 25, speed: 30 },
  ]);

  // Tutorial — 10 steps
  const tutorialSteps = [
    { title: 'Welcome to PetalPurrs!', body: "I'm Biscuit 🐾 — your cafe mentor. Let's brew your first tea together!", target: null, mascot: 'wave' },
    { title: 'Read the order', body: 'Each cat shows you exactly what they want: a tea, a cup, an exact temperature, and sometimes extras like honey or lemon. Click the order on the left to take it.', target: 'order', mascot: 'point' },
    { title: 'Step 1 — Pick a cup', body: 'Open the Cups tab. The cup the customer wants is highlighted — tap it.', target: 'tab-cups', mascot: 'point' },
    { title: 'Pick THIS cup', body: 'This is the one they asked for. Tap it!', target: 'cup-target', mascot: 'point' },
    { title: 'Step 2 — Pick a tea', body: "Open Tea. If you're out of a leaf, you'll need to grow it in the garden. For now we have plenty.", target: 'tab-tea', mascot: 'point' },
    { title: 'Pick THIS tea', body: 'Tap the tea they want.', target: 'tea-target', mascot: 'point' },
    { title: 'Step 3 — Set the exact temperature', body: 'Drag the slider until it matches the target marker (within 5° = perfect ✨).', target: 'temp', mascot: 'point' },
    { title: 'Step 4 — Add the right extras', body: 'Open Extras. Tap each item the customer asked for — no more, no less.', target: 'tab-extras', mascot: 'point' },
    { title: 'Add their extras', body: 'These tiles are highlighted. Add only what they asked for.', target: 'extras-target', mascot: 'point' },
    { title: 'Step 5 — Serve!', body: '⭐⭐⭐ = perfect match → big payout. 1⭐ = unhappy customer → you LOSE XP. Hit Serve to finish.', target: 'serve', mascot: 'cheer' },
    { title: 'Bonus: garden', body: 'Drag seed packets onto empty beds in the Plantjes tab. Plants grow on their own — just wait. You got this!', target: null, mascot: 'wave' },
  ];
  const [tut, setTut] = useState({ open: true, step: 0 });

  const tutStep = tut.open ? tutorialSteps[tut.step] : null;
  const tutLockTarget = tutStep?.target;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settings, setSettings] = useState({ sound: 70, music: 50, theme: 'warm', tutorialHints: true, fastGrow: false });

  const [toast, setToast] = useState(null);
  const showToast = (msg, icon = '✨') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2200);
  };

  const bumpCoins = (amt) => {
    setCoins(c => Math.max(0, c + amt));
    setCoinBump(true);
    setTimeout(() => setCoinBump(false), 400);
  };

  // Plant growth tick — auto-grow, no watering
  useEffect(() => {
    const t = setInterval(() => {
      setBeds(prev => prev.map(b => {
        if (!b.plant || b.growth >= 1) return b;
        const elapsed = Date.now() - b.planted;
        const grow = Math.min(1, elapsed / PLANT_GROW_MS);
        return { ...b, growth: grow, stage: Math.min(4, Math.floor(grow * 4) + 1) };
      }));
    }, 300);
    return () => clearInterval(t);
  }, []);

  // Customer simulation — walk in from door, queue up, leave when served
  useEffect(() => {
    const t = setInterval(() => {
      setCustomers(prev => {
        // move toward target
        return prev.map(c => {
          if (Math.abs(c.pos - c.target) < 0.5) return c;
          const dir = c.pos < c.target ? 1 : -1;
          return { ...c, pos: c.pos + dir * 0.4 };
        });
      });
    }, 50);
    return () => clearInterval(t);
  }, []);

  // New customer arrives every ~20s
  useEffect(() => {
    const t = setInterval(() => {
      if (orders.filter(o => !o.done).length < 4) {
        const newOrder = makeOrder(orders.length, level);
        setOrders(prev => [...prev, newOrder]);
        // also walk a customer in
        setCustomers(prev => {
          if (prev.length >= 4) return prev;
          const targets = [25, 40, 55, 70];
          const taken = prev.map(c => c.target);
          const target = targets.find(t => !taken.includes(t)) || 70;
          return [...prev, {
            id: uid(),
            name: newOrder.catName,
            color: newOrder.catColor,
            pos: 5,
            target,
            speed: 24 + Math.random() * 8,
          }];
        });
      }
    }, 22000);
    return () => clearInterval(t);
  }, [orders.length, level]);

  const activeOrder = orders.find(o => o.id === activeOrderId);

  const harvestBed = (bed) => {
    if (!bed.plant || bed.growth < 1) return;
    setInventory(inv => ({ ...inv, [bed.plant]: (inv[bed.plant] || 0) + 3 }));
    setBeds(prev => prev.map(b => b.id === bed.id ? { ...b, plant: null, stage: 0, growth: 0, planted: 0 } : b));
    showToast(`+3 ${bed.plant} leaves`, '🌿');
    setXp(x => Math.min(100, x + 3));
  };

  // Drag-to-plant — accepts seedId from drag OR uses selectedSeed
  const plantSeed = (bed, seedId) => {
    if (bed.plant) return;
    const sid = seedId || selectedSeed;
    if (!sid) {
      showToast('Pick or drag a seed first', '🌱');
      return;
    }
    // Seeds are infinite — you grow leaves, not consume seeds
    setBeds(prev => prev.map(b => b.id === bed.id ? { ...b, plant: sid, stage: 1, growth: 0.05, planted: Date.now() } : b));
    showToast(`Planted ${sid}`, '🌱');
    setSelectedSeed(null);
    setDraggingSeed(null);
  };

  const selectOrder = (id) => {
    setActiveOrderId(id);
    setDraft({ tea: null, cup: null, temp: 60, extras: [] });
    if (tut.open && tut.step === 1) setTut(t => ({ ...t, step: 2 }));
  };

  const serveOrder = () => {
    if (!activeOrder || !draft.tea || !draft.cup) {
      showToast('Brew is incomplete', '⚠️');
      return;
    }
    const o = activeOrder;
    let match = 0;
    let total = 3 + o.extras.length;
    if (draft.tea === o.tea) match++;
    if (draft.cup === o.cup) match++;
    const tempDelta = Math.abs(draft.temp - o.tempExact);
    if (tempDelta < 5) match++;
    else if (tempDelta < 15) match += 0.5;
    o.extras.forEach(e => { if (draft.extras.includes(e)) match++; });
    // penalty for wrong extras
    const extraExtras = draft.extras.filter(e => !o.extras.includes(e)).length;
    match -= extraExtras * 0.5;

    const pct = total > 0 ? Math.max(0, match / total) : 0;
    const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;

    // Decrement leaf inventory
    setInventory(inv => ({ ...inv, [draft.tea]: Math.max(0, (inv[draft.tea] || 0) - 1) }));

    let reward, xpDelta;
    if (stars === 3) {
      reward = 12 + o.tip;       // $13-15
      xpDelta = 18;
      showToast(`+$${reward} · ⭐⭐⭐ perfect!`, '🎉');
    } else if (stars === 2) {
      reward = 7 + o.tip;        // $8-10
      xpDelta = 8;
      showToast(`+$${reward} · ⭐⭐ ok`, '👍');
    } else {
      reward = 3;                // small consolation
      xpDelta = -10;             // LOSE xp
      showToast(`+$${reward} · ⭐ unhappy customer (–10 XP)`, '😾');
    }
    bumpCoins(reward);
    setOrders(prev => prev.map(x => x.id === o.id ? { ...x, done: true, rating: stars } : x));

    // Remove the customer from the cafe (walk them out)
    setCustomers(prev => prev.map(c => c.name === o.catName ? { ...c, target: -10 } : c));
    setTimeout(() => {
      setCustomers(prev => prev.filter(c => c.pos > -8));
    }, 4000);

    setActiveOrderId(null);
    setDraft({ tea: null, cup: null, temp: 60, extras: [] });

    setXp(prevXp => {
      let nx = prevXp + xpDelta;
      let nlvl = level;
      while (nx >= 100) { nx -= 100; nlvl++; }
      while (nx < 0 && nlvl > 1) { nx += 100; nlvl--; }
      if (nx < 0) nx = 0;
      if (nlvl !== level) {
        setLevel(nlvl);
        if (nlvl > level) showToast(`Level up! Lv ${nlvl}`, '🎊');
        else showToast(`Level down… now Lv ${nlvl}`, '💔');
      }
      return nx;
    });

    if (tut.open && tut.step === 9) setTut(t => ({ ...t, step: 10 }));
    setTab('home');
  };

  // Auto-advance tutorial when user follows the path
  const goTab = (id) => {
    if (tut.open) {
      const stepTarget = tutorialSteps[tut.step]?.target;
      if (stepTarget === 'tab-cups' && id === 'cups') setTut(t => ({ ...t, step: 3 }));
      else if (stepTarget === 'tab-tea' && id === 'tea') setTut(t => ({ ...t, step: 5 }));
      else if (stepTarget === 'tab-extras' && id === 'extras') setTut(t => ({ ...t, step: 7 }));
    }
    setTab(id);
  };

  // Auto-advance when picking right cup/tea/extra
  useEffect(() => {
    if (!tut.open || !activeOrder) return;
    const s = tut.step;
    if (s === 3 && draft.cup === activeOrder.cup) setTut(t => ({ ...t, step: 4 }));
    if (s === 5 && draft.tea === activeOrder.tea) setTut(t => ({ ...t, step: 6 }));
    if (s === 6 && Math.abs(draft.temp - activeOrder.tempExact) < 5) setTut(t => ({ ...t, step: 7 }));
    if (s === 8) {
      // all required extras present and no extras
      const wanted = activeOrder.extras;
      const got = draft.extras;
      if (wanted.length === 0 || (wanted.every(e => got.includes(e)) && got.every(e => wanted.includes(e)))) {
        setTut(t => ({ ...t, step: 9 }));
      }
    }
  }, [draft, tut, activeOrder]);

  const tabs = [
    { id: 'home',   label: 'Home',     icon: 'home' },
    { id: 'plants', label: 'Plantjes', icon: 'plant' },
    { id: 'cups',   label: 'Cups',     icon: 'cup' },
    { id: 'tea',    label: 'Tea',      icon: 'leaf' },
    { id: 'extras', label: 'Extras',   icon: 'sparkles' },
  ];

  // Tutorial lock map: which tab is allowed
  const tabAllowed = (tabId) => {
    if (!tut.open) return true;
    const t = tutorialSteps[tut.step]?.target;
    // allow current expected tab; otherwise lock all but home
    if (t === 'tab-cups') return tabId === 'cups';
    if (t === 'tab-tea') return tabId === 'tea';
    if (t === 'tab-extras') return tabId === 'extras';
    if (t === 'cup-target') return tabId === 'cups';
    if (t === 'tea-target' || t === 'temp') return tabId === 'tea';
    if (t === 'extras-target' || t === 'serve') return tabId === 'extras';
    if (t === 'order') return tabId === 'home';
    return true;
  };

  return (
    <div className="app">
      {/* NAV */}
      <div className="nav">
        <div className="brand">
          <div className="brand-mark">
            <Cat size={30} color="#fff8ee" accent={C.peachDeep} expression="smile"/>
          </div>
          <div className="brand-name">PetalPurrs</div>
        </div>

        <div className="nav-tabs">
          {tabs.map(t => {
            const allowed = tabAllowed(t.id);
            const isTutTab = (tutLockTarget === 'tab-cups' && t.id === 'cups')
                          || (tutLockTarget === 'tab-tea' && t.id === 'tea')
                          || (tutLockTarget === 'tab-extras' && t.id === 'extras');
            return (
              <button
                key={t.id}
                className={'nav-tab' + (tab === t.id ? ' active' : '') + (isTutTab ? ' tut-spot' : '') + (!allowed ? ' tut-dim' : '')}
                onClick={() => allowed && goTab(t.id)}
                disabled={!allowed}
              >
                <span className="tab-ico"><Ico name={t.icon} size={16}/></span>
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="nav-spacer"/>

        <div className="nav-stats">
          {/* Big chunky level chip with inline XP bar */}
          <div className="level-chip">
            <div className="level-chip-badge">Lv {level}</div>
            <div className="level-chip-bar">
              <div className="level-chip-fill" style={{ width: xp + '%' }}/>
              <div className="level-chip-text">{xp} / 100 XP</div>
            </div>
          </div>
          <div className="chip chip-coin">
            <span className="chip-icon">💰</span>
            <span className={'chip-val' + (coinBump ? ' bump' : '')}>${coins}</span>
          </div>
          <button className="icon-btn" title="Settings" onClick={() => { setSettingsOpen(v => !v); setNotifOpen(false); }} disabled={tut.open}>
            <Ico name="settings" size={18}/>
          </button>
          <button className="icon-btn" title="Notifications" onClick={() => { setNotifOpen(v => !v); setSettingsOpen(false); }} disabled={tut.open} style={{ position: 'relative' }}>
            <Ico name="bell" size={18}/>
            {orders.filter(o => !o.done).length > 0 && (
              <span style={{ position:'absolute', top:4, right:4, width:10, height:10, borderRadius:'50%', background: C.peachDeep, border:'2px solid '+C.card }}/>
            )}
          </button>
        </div>
      </div>

      {/* PAGE */}
      <div className="page">
        <OrdersRail
          orders={orders}
          activeId={activeOrderId}
          onSelect={selectOrder}
          tutLockTarget={tutLockTarget}
        />

        <div className="stage">
          {tab === 'home' && <CafeDiorama customers={customers} level={level} coins={coins} orders={orders} onGoto={setTab} activeOrder={activeOrder} draft={draft}/>}
          {tab === 'plants' && (
            <PlantsScreen
              beds={beds}
              selectedSeed={selectedSeed}
              setSelectedSeed={setSelectedSeed}
              inventory={inventory}
              harvestBed={harvestBed}
              plantSeed={plantSeed}
              draggingSeed={draggingSeed}
              setDraggingSeed={setDraggingSeed}
            />
          )}
          {tab === 'cups' && <CupsScreen level={level} draft={draft} setDraft={setDraft} activeOrder={activeOrder} tutLockTarget={tutLockTarget}/>}
          {tab === 'tea' && <TeaScreen draft={draft} setDraft={setDraft} inventory={inventory} activeOrder={activeOrder} tutLockTarget={tutLockTarget}/>}
          {tab === 'extras' && <ExtrasScreen draft={draft} setDraft={setDraft} activeOrder={activeOrder} onServe={serveOrder} tutLockTarget={tutLockTarget}/>}
        </div>
      </div>

      {/* TUTORIAL — half-screen modal with dim overlay + spotlight */}
      {tut.open && tutStep && (
        <TutorialOverlay
          step={tutStep}
          stepIndex={tut.step}
          totalSteps={tutorialSteps.length}
          onNext={() => {
            if (tut.step < tutorialSteps.length - 1) setTut(t => ({ ...t, step: t.step + 1 }));
            else setTut({ open: false, step: 0 });
          }}
          onSkip={() => setTut({ open: false, step: 0 })}
          onBack={() => setTut(t => ({ ...t, step: Math.max(0, t.step - 1) }))}
        />
      )}

      {toast && (
        <div className="toast">
          <span>{toast.icon}</span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Settings popover */}
      {settingsOpen && !tut.open && (
        <div className="popover" onClick={(e) => e.stopPropagation()}>
          <div className="pop-head">
            <h3>Settings</h3>
            <button className="pop-close" onClick={() => setSettingsOpen(false)}>×</button>
          </div>
          <div className="pop-row">
            <label>Sound FX</label>
            <input type="range" min="0" max="100" value={settings.sound} onChange={e => setSettings(s => ({ ...s, sound: +e.target.value }))}/>
            <span className="pop-val">{settings.sound}</span>
          </div>
          <div className="pop-foot">
            <button className="pop-btn" onClick={() => { setTut({ open: true, step: 0 }); setSettingsOpen(false); }}>Restart tour</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Tutorial overlay — dims everything, spotlights target, mascot on the side
function TutorialOverlay({ step, stepIndex, totalSteps, onNext, onSkip, onBack }) {
  const [spotlight, setSpotlight] = useState(null);

  useEffect(() => {
    const updateSpot = () => {
      if (!step.target) { setSpotlight(null); return; }
      let el = null;
      if (step.target === 'order') el = document.querySelector('.order-card');
      else if (step.target === 'tab-cups') el = [...document.querySelectorAll('.nav-tab')].find(t => t.textContent.includes('Cups'));
      else if (step.target === 'tab-tea') el = [...document.querySelectorAll('.nav-tab')].find(t => t.textContent.includes('Tea'));
      else if (step.target === 'tab-extras') el = [...document.querySelectorAll('.nav-tab')].find(t => t.textContent.includes('Extras'));
      else if (step.target === 'cup-target') el = document.querySelector('.cup-card.tut-spot');
      else if (step.target === 'tea-target') el = document.querySelector('.tea-card.tut-spot');
      else if (step.target === 'temp') el = document.querySelector('.temp-panel');
      else if (step.target === 'extras-target') el = document.querySelector('.extra-card.tut-spot');
      else if (step.target === 'serve') el = document.querySelector('.cta.sage');
      if (el) {
        const r = el.getBoundingClientRect();
        setSpotlight({ x: r.left, y: r.top, w: r.width, h: r.height });
      } else {
        setSpotlight(null);
      }
    };
    updateSpot();
    const t = setInterval(updateSpot, 300);
    window.addEventListener('resize', updateSpot);
    return () => { clearInterval(t); window.removeEventListener('resize', updateSpot); };
  }, [step.target]);

  return (
    <>
      {/* SVG mask: darkens everything except a hole around the spotlight */}
      <svg className="tut-overlay" viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`} preserveAspectRatio="none">
        <defs>
          <mask id="tut-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white"/>
            {spotlight && (
              <rect
                x={spotlight.x - 8}
                y={spotlight.y - 8}
                width={spotlight.w + 16}
                height={spotlight.h + 16}
                rx="14"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(20,12,8,0.65)" mask="url(#tut-mask)"/>
      </svg>

      {/* Halo around spotlight */}
      {spotlight && (
        <div
          className="tut-halo"
          style={{
            left: spotlight.x - 8,
            top: spotlight.y - 8,
            width: spotlight.w + 16,
            height: spotlight.h + 16,
          }}
        />
      )}

      {/* Half-screen modal — centered bottom */}
      <div className="tut-modal">
        <div className="tut-mascot">
          <div className={'tut-mascot-cat ' + (step.mascot || 'wave')}>
            <Cat size={220} color={C.butter} accent="#c99e5c" expression="smile"/>
          </div>
          <div className="tut-mascot-glyph">
            {step.mascot === 'point' ? '👉' : step.mascot === 'cheer' ? '🎉' : '👋'}
          </div>
        </div>
        <div className="tut-content">
          <div className="tut-progress">
            <div className="tut-progress-text">Tutorial · Step {stepIndex + 1} of {totalSteps}</div>
            <div className="tut-progress-bar">
              <div style={{ width: ((stepIndex + 1) / totalSteps * 100) + '%' }}/>
            </div>
          </div>
          <h2 className="tut-title">{step.title}</h2>
          <p className="tut-body">{step.body}</p>
          <div className="tut-actions">
            <button className="tut-btn ghost" onClick={onSkip}>Skip tour</button>
            {stepIndex > 0 && <button className="tut-btn ghost" onClick={onBack}>← Back</button>}
            <button className="tut-btn primary" onClick={onNext}>
              {stepIndex < totalSteps - 1 ? 'Next →' : "Let's brew!"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { PetalPurrs });
