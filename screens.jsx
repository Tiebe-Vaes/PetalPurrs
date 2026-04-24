// Screens — one file per is overkill; grouped here.

// ───────────────── Orders rail
function OrdersRail({ orders, activeId, onSelect }) {
  const open = orders.filter(o => !o.done);
  const done = orders.filter(o => o.done);
  return (
    <div className="orders-rail">
      <div className="rail-title">
        <h2>Orders</h2>
        <span className="count">{open.length} waiting</span>
      </div>
      {open.map(o => <OrderCard key={o.id} order={o} active={o.id === activeId} onClick={() => onSelect(o.id)}/>)}
      {done.length > 0 && (
        <>
          <div className="rail-title" style={{ marginTop: 12 }}>
            <h2 style={{ fontSize: 18, color: C.cocoaSoft }}>Served</h2>
            <span className="count">{done.length}</span>
          </div>
          {done.map(o => <OrderCard key={o.id} order={o} active={false} onClick={() => {}}/>)}
        </>
      )}
    </div>
  );
}

function OrderCard({ order, active, onClick }) {
  const tea = TEA_TYPES.find(t => t.id === order.tea);
  const cup = CUPS.find(c => c.id === order.cup);
  const tempLabel = { iced: 'Iced', warm: 'Warm', hot: 'Hot' }[order.temp];
  return (
    <div className={'order-card' + (active ? ' active' : '') + (order.done ? ' done' : '')} onClick={onClick}>
      <div className="order-head">
        <div className="order-num">{order.num}</div>
        <div className="order-cat">
          <Cat size={38} color={order.catColor.body} accent={order.catColor.accent} expression="smile"/>
        </div>
        <div className="order-name">{order.catName}</div>
        <div className="order-tip">+${order.tip}</div>
      </div>
      <div className="order-bubble">{order.bubble}</div>
      <div className="order-specs">
        <div className="order-spec">Tea<span className="spec-val">{tea.name.split(' ')[0]}</span></div>
        <div className="order-spec">Cup<span className="spec-val">{cup.name.split(' ')[0]}</span></div>
        <div className="order-spec">Temp<span className="spec-val">{tempLabel}</span></div>
        <div className="order-spec">Extras<span className="spec-val">{order.extras.length || '—'}</span></div>
      </div>
    </div>
  );
}

// ───────────────── Home
function HomeScreen({ level, coins, orders, xp, onGoto, activeOrder, draft }) {
  const todays = orders.filter(o => o.done).length;
  const pending = orders.filter(o => !o.done).length;
  return (
    <>
      <div className="welcome">
        <div>
          <h2>Good afternoon, barista ☕</h2>
          <p>The café is buzzing today. {pending} customer{pending === 1 ? '' : 's'} waiting at the counter — pick an order from the rail to begin brewing.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="cta peach" onClick={() => onGoto('plants')}><Ico name="plant" size={16}/> Tend garden</button>
            <button className="cta ghost" onClick={() => onGoto('cups')}><Ico name="cup" size={16}/> Start brewing</button>
          </div>
        </div>
        <div className="welcome-cat">
          <Cat size={160} color={C.peach} accent={C.peachDeep} expression="smile"/>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-label">Orders today</div>
          <div className="kpi-val">{todays}</div>
          <div className="kpi-delta">+{todays} today</div>
          <div className="kpi-ico" style={{ background: '#fde6b8' }}><Ico name="basket" size={20}/></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Level</div>
          <div className="kpi-val">{level}</div>
          <div className="kpi-delta">{xp}% to next</div>
          <div className="kpi-ico" style={{ background: '#d8e7d0' }}><Ico name="star" size={20}/></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Coins</div>
          <div className="kpi-val">${coins}</div>
          <div className="kpi-delta">pastel pennies</div>
          <div className="kpi-ico" style={{ background: '#fde6b8' }}><Ico name="coin" size={20}/></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Queue</div>
          <div className="kpi-val">{pending}</div>
          <div className="kpi-delta">{pending > 2 ? 'busy!' : 'cozy'}</div>
          <div className="kpi-ico" style={{ background: '#e7d6ed' }}><Ico name="bell" size={20}/></div>
        </div>
      </div>

      {activeOrder && <CurrentBrewPanel activeOrder={activeOrder} draft={draft}/>}

      <div className="sect-h">Today's regulars <span className="pill">lucky cats</span></div>
      <div className="tile-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
        {[0,1,2,3,4].map(i => {
          const c = CAT_COLORS[i];
          return (
            <div key={i} style={{ background: C.card, borderRadius: 18, padding: 16, textAlign:'center', boxShadow:'var(--shadow-soft)' }}>
              <Cat size={72} color={c.body} accent={c.accent} expression="smile"/>
              <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6, color: C.cocoa }}>{CAT_NAMES[i]}</div>
              <div style={{ fontSize: 11, color: C.cocoaSoft }}>{TEA_TYPES[i % TEA_TYPES.length].name}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function CurrentBrewPanel({ activeOrder, draft }) {
  const tea = TEA_TYPES.find(t => t.id === draft.tea);
  const cup = CUPS.find(c => c.id === draft.cup);
  return (
    <>
      <div className="sect-h">Now brewing for {activeOrder.catName} <span className="pill">order #{activeOrder.num}</span></div>
      <div className="brew-visual">
        <div className="brew-slots">
          <div className="brew-slot"><span className="brew-slot-label">Cup</span><span className={'brew-slot-val' + (cup ? '' : ' empty')}>{cup?.name || 'not chosen'}</span></div>
          <div className="brew-slot"><span className="brew-slot-label">Tea</span><span className={'brew-slot-val' + (tea ? '' : ' empty')}>{tea?.name || 'not chosen'}</span></div>
          <div className="brew-slot"><span className="brew-slot-label">Temp</span><span className="brew-slot-val">{draft.temp}°</span></div>
          <div className="brew-slot"><span className="brew-slot-label">Extras</span><span className={'brew-slot-val' + (draft.extras.length ? '' : ' empty')}>{draft.extras.length ? draft.extras.join(', ') : 'none'}</span></div>
        </div>
        <div className="cup-display">
          {cup ? <Cup shape={cup.shape} color={cup.color} ring={cup.ring} size={140} filled={tea ? 0.7 : 0} fillColor={tea?.color}/> : <Cup shape="mug" color={C.cream} ring={C.cocoaFaint || '#c8b5a2'} size={140} filled={0}/>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 12, color: C.cocoaSoft, fontWeight: 700, textTransform: 'uppercase', letterSpacing:'.05em' }}>Customer wants</div>
          <OrderCardMini order={activeOrder}/>
        </div>
      </div>
    </>
  );
}

function OrderCardMini({ order }) {
  const tea = TEA_TYPES.find(t => t.id === order.tea);
  const cup = CUPS.find(c => c.id === order.cup);
  return (
    <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 10, fontSize: 12, color: C.cocoa }}>
      <div style={{ display:'flex', gap: 6, alignItems:'center', marginBottom: 4 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', overflow:'hidden', background: C.cream }}>
          <Cat size={28} color={order.catColor.body} accent={order.catColor.accent}/>
        </div>
        <span style={{ fontWeight: 700 }}>{order.catName}</span>
      </div>
      <div>🍵 {tea.name} · {order.temp} · {cup.name}</div>
      {order.extras.length > 0 && <div style={{ color: C.cocoaSoft, marginTop: 2 }}>+ {order.extras.join(', ')}</div>}
    </div>
  );
}

// ───────────────── Plants / Garden
function PlantsScreen({ beds, selectedSeed, setSelectedSeed, inventory, waterBed, harvestBed, plantSeed }) {
  return (
    <>
      <div className="stage-header">
        <div>
          <h1>Plantjes 🌿</h1>
          <div className="sub">Water your beds, wait for them to bloom, then harvest fresh leaves. Dry beds wilt — keep them happy.</div>
        </div>
        <div className="right">
          <div className="chip" style={{ background: C.sage, color: '#3f5b38' }}>🌱 {Object.values(inventory).reduce((a,b)=>a+b,0)} leaves total</div>
        </div>
      </div>

      <div className="garden">
        <div className="garden-beds">
          {beds.map(bed => <Bed key={bed.id} bed={bed} onWater={waterBed} onHarvest={harvestBed} onPlant={plantSeed}/>)}
        </div>
        <div className="garden-side">
          <div style={{ fontWeight: 700, fontSize: 14, color: C.cocoa, padding: '2px 4px' }}>Seed packets</div>
          {TEA_TYPES.filter(t => t.plant).map(t => (
            <div key={t.id} className={'seed-card' + (selectedSeed === t.id ? ' selected' : '')} onClick={() => setSelectedSeed(t.id)}>
              <div className="seed-art"><TeaPlant stage={4} variant={t.plant} size={40}/></div>
              <div className="seed-info">
                <div className="seed-name">{t.name}</div>
                <div className="seed-meta">{t.sub}</div>
              </div>
              <div className="seed-qty">×{inventory[t.id] || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Bed({ bed, onWater, onHarvest, onPlant }) {
  const ready = bed.growth >= 1;
  const dry = bed.dryness > 0.6;
  if (!bed.plant) {
    return <div className="bed empty" onClick={() => onPlant(bed)}/>;
  }
  return (
    <div className="bed" onClick={() => ready ? onHarvest(bed) : null}>
      {ready && <div className="bed-ready-badge">READY!</div>}
      <div className="bed-plant">
        <TeaPlant stage={bed.stage} variant={bed.plant} size={100}/>
      </div>
      <div className="bed-footer">
        <div className="bed-progress"><div style={{ width: (bed.growth * 100) + '%' }}/></div>
        <button className={'bed-water-btn' + (dry ? ' dry' : '')} onClick={(e) => { e.stopPropagation(); onWater(bed.id, e); }}>
          <Ico name="droplet" size={18}/>
        </button>
      </div>
    </div>
  );
}

// ───────────────── Cups
function CupsScreen({ level, draft, setDraft, activeOrder }) {
  return (
    <>
      <div className="stage-header">
        <div>
          <h1>Choose a Cup</h1>
          <div className="sub">{activeOrder ? `For ${activeOrder.catName}'s ${activeOrder.temp} tea — they asked for a ${CUPS.find(c => c.id === activeOrder.cup)?.name}.` : 'Pick any cup to preview. Select an order from the rail to brew to spec.'}</div>
        </div>
      </div>
      <div className="tile-grid cups-grid">
        {CUPS.map(c => {
          const locked = c.unlock > level;
          const selected = draft.cup === c.id;
          return (
            <div key={c.id} className={'cup-card' + (locked ? ' locked' : '') + (selected ? ' selected' : '')} onClick={() => !locked && setDraft(d => ({ ...d, cup: c.id }))}>
              {locked && <div className="cup-lock">Lv {c.unlock}</div>}
              <div className="cup-art"><Cup shape={c.shape} color={c.color} ring={c.ring} size={96} filled={selected ? 0.5 : 0} fillColor="#c9986b"/></div>
              <div className="cup-name">{c.name}</div>
              <div className="cup-meta">{locked ? 'Locked' : 'Tap to select'}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ───────────────── Tea + Temp
function TeaScreen({ draft, setDraft, inventory, activeOrder }) {
  const trackRef = React.useRef(null);
  const dragRef = React.useRef(false);

  const onTrackEvent = (e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    setDraft(d => ({ ...d, temp: Math.round(pct * 100) }));
  };

  React.useEffect(() => {
    const up = () => { dragRef.current = false; };
    const move = (e) => { if (dragRef.current) onTrackEvent(e); };
    window.addEventListener('pointerup', up);
    window.addEventListener('pointermove', move);
    return () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointermove', move); };
  }, []);

  return (
    <>
      <div className="stage-header">
        <div>
          <h1>Tea Type</h1>
          <div className="sub">{activeOrder ? `${activeOrder.catName} wants ${TEA_TYPES.find(t => t.id === activeOrder.tea).name}.` : 'Pick a leaf and set the temperature.'}</div>
        </div>
      </div>

      <div className="tile-grid tea-grid">
        {TEA_TYPES.map(t => {
          const qty = inventory[t.id] || 0;
          const selected = draft.tea === t.id;
          return (
            <div key={t.id} className={'tea-card' + (selected ? ' selected' : '')} onClick={() => qty > 0 && setDraft(d => ({ ...d, tea: t.id }))} style={{ opacity: qty > 0 ? 1 : 0.45 }}>
              <div className="tea-row">
                <div className="tea-art" style={{ background: t.color + '33' }}><TeaPlant stage={4} variant={t.plant} size={46}/></div>
                <div style={{ flex: 1 }}>
                  <div className="tea-name">{t.name}</div>
                  <div className="tea-sub">{t.sub}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 13, color: qty > 0 ? C.cocoa : C.rose, background: C.creamDeep, padding:'4px 9px', borderRadius: 10 }}>×{qty}</div>
              </div>
              <div className="tea-bar"><div style={{ width: Math.min(100, qty * 8) + '%', background: t.color }}/></div>
            </div>
          );
        })}
      </div>

      <div className="temp-panel">
        <div className="temp-head">
          <h4>Temperature</h4>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div className="steam" style={{ opacity: draft.temp > 60 ? 1 : 0 }}>
              <span/><span/><span/>
            </div>
            <div className="temp-val">{draft.temp}°</div>
          </div>
        </div>
        <div
          ref={trackRef}
          className="temp-track"
          onPointerDown={(e) => { dragRef.current = true; onTrackEvent(e); }}
        >
          <div className="temp-thumb" style={{ left: draft.temp + '%' }}/>
        </div>
        <div className="temp-labels">
          <span>❄ Iced</span><span>Cool</span><span>Warm</span><span>Hot</span><span>Steaming ♨</span>
        </div>
      </div>
    </>
  );
}

// ───────────────── Extras + Serve
function ExtrasScreen({ draft, setDraft, activeOrder, onServe }) {
  const toggle = (id) => {
    setDraft(d => ({ ...d, extras: d.extras.includes(id) ? d.extras.filter(x => x !== id) : [...d.extras, id] }));
  };
  return (
    <>
      <div className="stage-header">
        <div>
          <h1>Extras & Treats</h1>
          <div className="sub">{activeOrder ? `Adding treats for ${activeOrder.catName}. They asked for: ${activeOrder.extras.length ? activeOrder.extras.join(', ') : 'nothing extra'}.` : 'Sprinkle a little something special.'}</div>
        </div>
        <div className="right">
          <button className="cta sage" disabled={!activeOrder || !draft.tea || !draft.cup} onClick={onServe}>
            <Ico name="check" size={16}/> Serve order
          </button>
        </div>
      </div>

      <div className="tile-grid extras-grid">
        {EXTRAS.map(e => {
          const selected = draft.extras.includes(e.id);
          return (
            <div key={e.id} style={{ position:'relative' }} className={'extra-card' + (selected ? ' selected' : '')} onClick={() => toggle(e.id)}>
              {selected && <div className="check"><Ico name="check" size={12}/></div>}
              <div style={{ height: 72, display:'grid', placeItems:'center' }}><Extra kind={e.id} size={60}/></div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.cocoa }}>{e.name}</div>
              <div style={{ fontSize: 11, color: C.cocoaSoft }}>+${e.price}</div>
            </div>
          );
        })}
      </div>

      {activeOrder && (
        <div className="receipt" style={{ marginTop: 22 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 22 }}>Receipt preview</h3>
          <div className="receipt-item"><span className="receipt-label">Tea</span><span className="receipt-val">{draft.tea ? TEA_TYPES.find(t => t.id === draft.tea).name : '—'}</span></div>
          <div className="receipt-item"><span className="receipt-label">Cup</span><span className="receipt-val">{draft.cup ? CUPS.find(c => c.id === draft.cup).name : '—'}</span></div>
          <div className="receipt-item"><span className="receipt-label">Temperature</span><span className="receipt-val">{draft.temp}°</span></div>
          <div className="receipt-item"><span className="receipt-label">Extras</span><span className="receipt-val">{draft.extras.join(', ') || 'none'}</span></div>
          <div className="receipt-total">
            <span className="receipt-label" style={{ alignSelf: 'flex-end' }}>Base + tip estimate</span>
            <span className="tval">${12 + draft.extras.length * 2 + activeOrder.tip}</span>
          </div>
        </div>
      )}
    </>
  );
}

Object.assign(window, { OrdersRail, HomeScreen, PlantsScreen, CupsScreen, TeaScreen, ExtrasScreen });
