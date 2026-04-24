// Main App — screens + state

const { useState, useEffect, useRef, useCallback } = React;

// ─── Helpers
const PLANT_GROW_MS = 8000; // full grow 8s, for demo
const WATER_COOLDOWN = 3000;
const DRY_AFTER = 6000;

function uid() { return Math.random().toString(36).slice(2, 9); }

function PetalPurrs() {
  const [tab, setTab] = useState('home');
  const [coins, setCoins] = useState(500);
  const [level, setLevel] = useState(5);
  const [xp, setXp] = useState(60);
  const [coinBump, setCoinBump] = useState(false);

  // Orders
  const [orders, setOrders] = useState(() => [
    { id: uid(), num: 1, catName: 'Mochi',   catColor: CAT_COLORS[0], tea: 'chamomile', cup: 'teacup', temp: 'hot',  extras: ['honey','lemon'], tip: 4, bubble: "Something soothing, please! I had a long day at the yarn shop.", done: false },
    { id: uid(), num: 2, catName: 'Juniper', catColor: CAT_COLORS[5], tea: 'lavender',  cup: 'mug',    temp: 'warm', extras: ['mint'],          tip: 3, bubble: "A lavender for dreamy thoughts ✨", done: false },
    { id: uid(), num: 3, catName: 'Saffron', catColor: CAT_COLORS[2], tea: 'green',     cup: 'tall',   temp: 'iced', extras: [],                tip: 2, bubble: "Iced green, refreshing!", done: false },
  ]);
  const [activeOrderId, setActiveOrderId] = useState(null);

  // Current in-progress brew
  const [draft, setDraft] = useState({ tea: null, cup: null, temp: 60, extras: [] });

  // Inventory of harvested tea leaves
  const [inventory, setInventory] = useState({ green: 12, chamomile: 8, rose: 4, lavender: 5, matcha: 2, hibiscus: 0 });

  // Garden beds
  const [beds, setBeds] = useState(() => [
    { id: 1, plant: 'green',     stage: 4, growth: 1,    dryness: 0.3, planted: Date.now() - 8000 },
    { id: 2, plant: 'chamomile', stage: 3, growth: 0.75, dryness: 0.2, planted: Date.now() - 6000 },
    { id: 3, plant: 'rose',      stage: 2, growth: 0.45, dryness: 0.5, planted: Date.now() - 3600 },
    { id: 4, plant: null,        stage: 0, growth: 0,    dryness: 0,   planted: 0 },
    { id: 5, plant: 'lavender',  stage: 1, growth: 0.2,  dryness: 0.1, planted: Date.now() - 1600 },
    { id: 6, plant: null,        stage: 0, growth: 0,    dryness: 0,   planted: 0 },
  ]);
  const [selectedSeed, setSelectedSeed] = useState('green');

  // Drag state for tea leaf → cup
  const [dragging, setDragging] = useState(null); // {teaId, x, y}

  // Tutorial
  const [tut, setTut] = useState({ open: true, step: 0 });
  const tutorialSteps = [
    { title: 'Welcome, new barista!', body: "I'm Biscuit 🐱 — I'll show you the ropes. Tap through the tabs up top to find ingredients, cups, teas and treats." },
    { title: 'Take an order', body: "Pick an order from the rail on the left. Its icons tell you what our customer wants." },
    { title: 'Grow your tea', body: "Hop into <strong>Plantjes</strong> to water beds and plant new seedlings. Harvest when a bed glows." },
    { title: 'Brew it up', body: "Visit <strong>Cups</strong>, <strong>Tea</strong>, and <strong>Extras</strong> in order — then hit <strong>Serve</strong> on the order!" },
  ];

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settings, setSettings] = useState({ sound: 70, music: 50, theme: 'warm', tutorialHints: true, fastGrow: false });

  const [toast, setToast] = useState(null);
  const showToast = (msg, icon = '✨') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2000);
  };

  // Bump coins animation
  const bumpCoins = (amt) => {
    setCoins(c => c + amt);
    setCoinBump(true);
    setTimeout(() => setCoinBump(false), 400);
  };

  // Plant growth tick
  useEffect(() => {
    const t = setInterval(() => {
      setBeds(prev => prev.map(b => {
        if (!b.plant) return b;
        const wateredBoost = b.dryness < 0.6 ? 1 : 0.3;
        const newGrowth = Math.min(1, b.growth + (0.015 * wateredBoost));
        const newDry = Math.min(1, b.dryness + 0.008);
        return { ...b, growth: newGrowth, dryness: newDry, stage: Math.min(4, Math.floor(newGrowth * 4) + (newGrowth >= 1 ? 0 : 1)) };
      }));
    }, 400);
    return () => clearInterval(t);
  }, []);

  // New cat arrival occasionally
  useEffect(() => {
    const t = setInterval(() => {
      if (orders.filter(o => !o.done).length < 4) {
        setOrders(prev => [...prev, makeOrder(prev.length, level)]);
      }
    }, 25000);
    return () => clearInterval(t);
  }, [orders.length, level]);

  const activeOrder = orders.find(o => o.id === activeOrderId);

  const waterBed = (bedId, e) => {
    // animate droplet
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = document.createElement('div');
    dx.className = 'droplet-anim';
    dx.textContent = '💧';
    dx.style.left = rect.left + rect.width / 2 - 10 + 'px';
    dx.style.top = rect.top + 'px';
    document.body.appendChild(dx);
    setTimeout(() => dx.remove(), 1000);
    setBeds(prev => prev.map(b => b.id === bedId ? { ...b, dryness: 0 } : b));
  };

  const harvestBed = (bed) => {
    if (bed.growth < 1 || !bed.plant) return;
    setInventory(inv => ({ ...inv, [bed.plant]: (inv[bed.plant] || 0) + 3 }));
    setBeds(prev => prev.map(b => b.id === bed.id ? { ...b, plant: null, stage: 0, growth: 0, dryness: 0 } : b));
    showToast(`+3 ${bed.plant} leaves`, '🌿');
    setXp(x => Math.min(100, x + 5));
  };

  const plantSeed = (bed) => {
    if (bed.plant) return;
    setBeds(prev => prev.map(b => b.id === bed.id ? { ...b, plant: selectedSeed, stage: 1, growth: 0.05, dryness: 0, planted: Date.now() } : b));
    showToast(`Planted ${selectedSeed}`, '🌱');
  };

  const selectOrder = (id) => { setActiveOrderId(id); setDraft({ tea: null, cup: null, temp: 60, extras: [] }); };

  const serveOrder = () => {
    if (!activeOrder || !draft.tea || !draft.cup) { showToast('Brew is incomplete', '⚠️'); return; }
    const o = activeOrder;
    let match = 0, total = 3 + o.extras.length;
    if (draft.tea === o.tea) match++;
    if (draft.cup === o.cup) match++;
    const targetTemp = o.temp === 'iced' ? 20 : o.temp === 'warm' ? 55 : 85;
    if (Math.abs(draft.temp - targetTemp) < 15) match++;
    o.extras.forEach(e => { if (draft.extras.includes(e)) match++; });
    const pct = match / total;
    const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;
    const reward = Math.round(15 + stars * 8 + o.tip * stars);
    bumpCoins(reward);
    setOrders(prev => prev.map(x => x.id === o.id ? { ...x, done: true } : x));
    setActiveOrderId(null);
    setDraft({ tea: null, cup: null, temp: 60, extras: [] });
    setXp(x => {
      const n = x + stars * 8;
      if (n >= 100) { setLevel(l => l + 1); return n - 100; }
      return n;
    });
    showToast(`+$${reward} · ${'⭐'.repeat(stars)}`, '🎉');
    setTab('home');
  };

  // Tab definitions
  const tabs = [
    { id: 'home',   label: 'Home',     icon: 'home' },
    { id: 'plants', label: 'Plantjes', icon: 'plant' },
    { id: 'cups',   label: 'Cups',     icon: 'cup' },
    { id: 'tea',    label: 'Tea',      icon: 'leaf' },
    { id: 'extras', label: 'Extras',   icon: 'sparkles' },
  ];

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
          {tabs.map(t => (
            <button key={t.id} className={'nav-tab' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>
              <span className="tab-ico"><Ico name={t.icon} size={16}/></span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="nav-spacer"/>

        <div className="nav-stats">
          <div className="chip chip-level">
            <span className="chip-icon">🌿</span>
            <span>Lv {level}</span>
            <div style={{ width: 40, height: 5, background: 'rgba(255,255,255,0.5)', borderRadius: 99, overflow:'hidden' }}>
              <div style={{ width: xp + '%', height: '100%', background: C.leafDeep }}/>
            </div>
          </div>
          <div className="chip chip-coin">
            <span className="chip-icon">💰</span>
            <span className={'chip-val' + (coinBump ? ' bump' : '')}>${coins}</span>
          </div>
          <button className="icon-btn" title="Settings" onClick={() => { setSettingsOpen(v => !v); setNotifOpen(false); }}><Ico name="settings" size={18}/></button>
          <button className="icon-btn" title="Notifications" onClick={() => { setNotifOpen(v => !v); setSettingsOpen(false); }} style={{ position: 'relative' }}>
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
        />

        <div className="stage">
          {tab === 'home' && <HomeScreen level={level} coins={coins} orders={orders} xp={xp} onGoto={setTab} activeOrder={activeOrder} draft={draft}/>}
          {tab === 'plants' && <PlantsScreen beds={beds} selectedSeed={selectedSeed} setSelectedSeed={setSelectedSeed} inventory={inventory} waterBed={waterBed} harvestBed={harvestBed} plantSeed={plantSeed}/>}
          {tab === 'cups' && <CupsScreen level={level} draft={draft} setDraft={setDraft} activeOrder={activeOrder}/>}
          {tab === 'tea' && <TeaScreen draft={draft} setDraft={setDraft} inventory={inventory} activeOrder={activeOrder}/>}
          {tab === 'extras' && <ExtrasScreen draft={draft} setDraft={setDraft} activeOrder={activeOrder} onServe={serveOrder}/>}
        </div>
      </div>

      {/* Settings popover */}
      {settingsOpen && (
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
          <div className="pop-row">
            <label>Music</label>
            <input type="range" min="0" max="100" value={settings.music} onChange={e => setSettings(s => ({ ...s, music: +e.target.value }))}/>
            <span className="pop-val">{settings.music}</span>
          </div>
          <div className="pop-row">
            <label>Theme</label>
            <div className="pop-seg">
              {['warm','sage','lavender'].map(t => (
                <button key={t} className={'pop-seg-btn' + (settings.theme === t ? ' on' : '')} onClick={() => { setSettings(s => ({ ...s, theme: t })); document.documentElement.setAttribute('data-theme', t); }}>{t}</button>
              ))}
            </div>
          </div>
          <div className="pop-row pop-toggle" onClick={() => setSettings(s => ({ ...s, tutorialHints: !s.tutorialHints }))}>
            <label>Tutorial hints</label>
            <div className={'pop-switch' + (settings.tutorialHints ? ' on' : '')}><span/></div>
          </div>
          <div className="pop-row pop-toggle" onClick={() => setSettings(s => ({ ...s, fastGrow: !s.fastGrow }))}>
            <label>Speedy growth ⚡</label>
            <div className={'pop-switch' + (settings.fastGrow ? ' on' : '')}><span/></div>
          </div>
          <div className="pop-foot">
            <button className="pop-btn ghost" onClick={() => { setOrders(orders.map(o => ({ ...o, done: false }))); showToast('Orders reset', '🔄'); }}>Reset orders</button>
            <button className="pop-btn" onClick={() => { setTut({ open: true, step: 0 }); setSettingsOpen(false); }}>Restart tour</button>
          </div>
        </div>
      )}

      {/* Notifications popover */}
      {notifOpen && (
        <div className="popover" style={{ right: 64 }}>
          <div className="pop-head">
            <h3>Notifications</h3>
            <button className="pop-close" onClick={() => setNotifOpen(false)}>×</button>
          </div>
          <div className="pop-notif">
            <div className="notif-dot" style={{ background: C.peach }}/>
            <div><div style={{fontWeight:700,fontSize:13}}>New customer arrived</div><div style={{fontSize:11,color:C.cocoaSoft}}>Saffron is waiting at the counter · just now</div></div>
          </div>
          <div className="pop-notif">
            <div className="notif-dot" style={{ background: C.sage }}/>
            <div><div style={{fontWeight:700,fontSize:13}}>Garden ready to harvest</div><div style={{fontSize:11,color:C.cocoaSoft}}>Chamomile bed is blooming · 2m ago</div></div>
          </div>
          <div className="pop-notif">
            <div className="notif-dot" style={{ background: C.lavender }}/>
            <div><div style={{fontWeight:700,fontSize:13}}>Level up unlocked!</div><div style={{fontSize:11,color:C.cocoaSoft}}>Tea bowl is now available · earlier</div></div>
          </div>
          <div className="pop-foot">
            <button className="pop-btn ghost" style={{ flex: 1 }} onClick={() => setNotifOpen(false)}>Mark all read</button>
          </div>
        </div>
      )}

      {/* Tutorial cat */}
      {tut.open && (
        <div className="tutorial">
          <div className="tut-bubble">
            <button className="tut-close" onClick={() => setTut(t => ({ ...t, open: false }))}>×</button>
            <div style={{ fontWeight: 800, marginBottom: 4, color: C.cocoa }}>{tutorialSteps[tut.step].title}</div>
            <div dangerouslySetInnerHTML={{ __html: tutorialSteps[tut.step].body }}/>
            <div className="tut-actions">
              {tut.step < tutorialSteps.length - 1 ? (
                <button className="next" onClick={() => setTut(t => ({ ...t, step: t.step + 1 }))}>Next →</button>
              ) : (
                <button className="next" onClick={() => setTut({ open: false, step: 0 })}>Let's brew!</button>
              )}
              <button className="dismiss" onClick={() => setTut({ open: false, step: 0 })}>Skip tour</button>
            </div>
          </div>
          <div className="tut-cat">
            <Cat size={80} color={C.butter} accent="#c99e5c" expression="smile"/>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <span>{toast.icon}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { PetalPurrs });
