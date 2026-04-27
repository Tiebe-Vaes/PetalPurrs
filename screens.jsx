// Screens

// ───────────────── Orders rail
function OrdersRail({ orders, activeId, onSelect, tutLockTarget }) {
  const open = orders.filter(o => !o.done);
  const done = orders.filter(o => o.done);
  return (
    <div className="orders-rail">
      <div className="rail-title">
        <h2>Orders</h2>
        <span className="count">{open.length} waiting</span>
      </div>
      {open.map((o, i) => (
        <OrderCard
          key={o.id}
          order={o}
          active={o.id === activeId}
          spotlight={tutLockTarget === 'order' && i === 0}
          locked={tutLockTarget === 'order' && i !== 0}
          onClick={() => onSelect(o.id)}
        />
      ))}
      {done.length > 0 && (
        <>
          <div className="rail-title" style={{ marginTop: 12 }}>
            <h2 style={{ fontSize: 16, color: C.cocoaSoft }}>Served</h2>
            <span className="count">{done.length}</span>
          </div>
          {done.map(o => <OrderCard key={o.id} order={o} active={false} onClick={() => {}}/>)}
        </>
      )}
    </div>
  );
}

function OrderCard({ order, active, onClick, spotlight, locked }) {
  const tea = TEA_TYPES.find(t => t.id === order.tea);
  const cup = CUPS.find(c => c.id === order.cup);
  return (
    <div
      className={'order-card' + (active ? ' active' : '') + (order.done ? ' done' : '') + (spotlight ? ' tut-spot' : '') + (locked ? ' tut-dim' : '')}
      data-tut="order"
      onClick={locked ? undefined : onClick}
    >
      <div className="order-head">
        <div className="order-num">#{order.num}</div>
        <div className="order-cat">
          <Cat size={70} color={order.catColor.body} accent={order.catColor.accent} expression="smile"/>
        </div>
        <div style={{flex: 1}}>
          <div className="order-name">{order.catName}</div>
          <div className="order-tip-row">
            <span className="order-tip">+${order.tip} tip</span>
            {order.rating != null && <span className="order-stars">{'⭐'.repeat(order.rating)}</span>}
          </div>
        </div>
      </div>
      <div className="order-bubble">{order.bubble}</div>
      <div className="order-want">
        <div className="want-row">
          <div className="want-cell">
            <div className="want-label">Tea</div>
            <div className="want-art" style={{ background: tea.color + '33' }}>
              <TeaPlant stage={4} variant={tea.plant} size={36}/>
            </div>
            <div className="want-name">{tea.name}</div>
          </div>
          <div className="want-cell">
            <div className="want-label">Cup</div>
            <div className="want-art">
              <Cup shape={cup.shape} color={cup.color} ring={cup.ring} size={42}/>
            </div>
            <div className="want-name">{cup.name}</div>
          </div>
          <div className="want-cell">
            <div className="want-label">Temp</div>
            <div className="want-art" style={{
              background: order.tempExact < 35 ? '#cfe6f0' : order.tempExact < 65 ? '#f3e3c8' : '#f3c8b0'
            }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.cocoa }}>
                {order.tempExact}°
              </span>
            </div>
            <div className="want-name">{order.temp}</div>
          </div>
        </div>
        {order.extras.length > 0 && (
          <div className="want-extras">
            <div className="want-label">Extras</div>
            <div className="want-extras-row">
              {order.extras.map(eid => {
                const e = EXTRAS.find(x => x.id === eid);
                return (
                  <div key={eid} className="want-extra" title={e.name}>
                    <Extra kind={eid} size={32}/>
                    <span>{e.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────── Cafe diorama (Home)
function CafeDiorama({ customers, level, coins, orders, onGoto, activeOrder, draft }) {
  return (
    <>
      <div className="cafe-scene">
        {/* sky / window backdrop */}
        <div className="cafe-sky"/>
        <div className="cafe-floor"/>
        {/* outside */}
        <div className="cafe-outside">
          <div className="outside-bush" style={{left: 30}}/>
          <div className="outside-bush" style={{left: 90, transform:'scale(0.7)'}}/>
        </div>
        {/* door frame */}
        <div className="cafe-door">
          <div className="door-frame"/>
          <div className="door-sign">OPEN</div>
        </div>
        {/* counter on the right */}
        <div className="cafe-counter">
          <div className="counter-top"/>
          <div className="counter-front"/>
          {/* shelf */}
          <div className="counter-shelf">
            <div className="shelf-jar"><div className="jar-lid"/><div className="jar-body" style={{background:'#8fb96b'}}/></div>
            <div className="shelf-jar"><div className="jar-lid"/><div className="jar-body" style={{background:'#e8d38a'}}/></div>
            <div className="shelf-jar"><div className="jar-lid"/><div className="jar-body" style={{background:'#c9a3d4'}}/></div>
            <div className="shelf-jar"><div className="jar-lid"/><div className="jar-body" style={{background:'#e89b9b'}}/></div>
          </div>
          {/* barista cat */}
          <div className="barista">
            <Cat size={86} color={C.peach} accent={C.peachDeep} expression="smile"/>
            <div className="barista-apron"/>
          </div>
          {/* sign */}
          <div className="cafe-sign">PetalPurrs Café</div>
        </div>
        {/* welcome rug */}
        <div className="cafe-rug"/>
        {/* customers */}
        {customers.map((c, i) => (
          <div
            key={c.id}
            className="cafe-customer"
            style={{
              left: c.pos + '%',
              animationDuration: c.speed + 's',
              zIndex: 5 + i,
            }}
          >
            <Cat size={72} color={c.color.body} accent={c.color.accent} expression="smile"/>
            <div className="customer-name">{c.name}</div>
          </div>
        ))}
        {/* hanging plants */}
        <div className="cafe-hang" style={{left: '30%'}}>
          <div className="hang-string"/>
          <TeaPlant stage={4} variant="green" size={50}/>
        </div>
        <div className="cafe-hang" style={{left: '55%'}}>
          <div className="hang-string"/>
          <TeaPlant stage={4} variant="lavender" size={50}/>
        </div>
      </div>

      <div className="home-actions">
        <button className="cta peach" onClick={() => onGoto('plants')}><Ico name="plant" size={16}/> Tend garden</button>
        <button className="cta sage" onClick={() => onGoto('cups')}><Ico name="cup" size={16}/> Start brewing</button>
        <div className="home-stats">
          <span><strong>{orders.filter(o => !o.done).length}</strong> waiting</span>
          <span><strong>{orders.filter(o => o.done).length}</strong> served</span>
        </div>
      </div>

      {activeOrder && <CurrentBrewPanel activeOrder={activeOrder} draft={draft}/>}
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
          {cup ? <Cup shape={cup.shape} color={cup.color} ring={cup.ring} size={140} filled={tea ? 0.7 : 0} fillColor={tea?.color}/> : <Cup shape="mug" color={C.cream} ring={'#c8b5a2'} size={140} filled={0}/>}
        </div>
      </div>
    </>
  );
}

// ───────────────── Plants / Garden — auto-grow, drag-to-plant
function PlantsScreen({ beds, selectedSeed, setSelectedSeed, inventory, harvestBed, plantSeed, draggingSeed, setDraggingSeed }) {
  return (
    <>
      <div className="stage-header">
        <div>
          <h1>Plantjes 🌿</h1>
          <div className="sub">Drag a seed packet onto an empty bed to plant. Plants grow on their own — come back later to harvest.</div>
        </div>
      </div>

      {/* Top inventory strip */}
      <div className="leaf-inventory">
        <div className="leaf-inv-label">My leaves</div>
        {TEA_TYPES.map(t => (
          <div key={t.id} className="leaf-pill">
            <div className="leaf-pill-art" style={{ background: t.color + '33' }}>
              <TeaPlant stage={4} variant={t.plant} size={28}/>
            </div>
            <div>
              <div className="leaf-pill-name">{t.name.split(' ')[0]}</div>
              <div className="leaf-pill-qty">×{inventory[t.id] || 0}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="garden">
        <div className="garden-beds">
          {beds.map(bed => (
            <Bed
              key={bed.id}
              bed={bed}
              draggingSeed={draggingSeed}
              onHarvest={harvestBed}
              onPlant={plantSeed}
              onClick={() => {
                if (selectedSeed && !bed.plant) plantSeed(bed, selectedSeed);
                else if (bed.plant && bed.growth >= 1) harvestBed(bed);
              }}
            />
          ))}
        </div>
        <div className="garden-side">
          <div style={{ fontWeight: 700, fontSize: 14, color: C.cocoa, padding: '2px 4px' }}>Seed packets · drag to plant</div>
          {TEA_TYPES.filter(t => t.plant).map(t => (
            <SeedCard
              key={t.id}
              tea={t}
              selected={selectedSeed === t.id}
              dragging={draggingSeed === t.id}
              onSelect={() => setSelectedSeed(selectedSeed === t.id ? null : t.id)}
              onDragStart={() => setDraggingSeed(t.id)}
              onDragEnd={() => setDraggingSeed(null)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function SeedCard({ tea, selected, dragging, onSelect, onDragStart, onDragEnd }) {
  return (
    <div
      className={'seed-card' + (selected ? ' selected' : '') + (dragging ? ' dragging' : '')}
      draggable
      onClick={onSelect}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', tea.id);
        e.dataTransfer.effectAllowed = 'copy';
        onDragStart();
      }}
      onDragEnd={onDragEnd}
    >
      <div className="seed-art"><TeaPlant stage={4} variant={tea.plant} size={40}/></div>
      <div className="seed-info">
        <div className="seed-name">{tea.name} seeds</div>
        <div className="seed-meta">{tea.sub}</div>
      </div>
      <div className="seed-grip">⋮⋮</div>
    </div>
  );
}

function Bed({ bed, onHarvest, onPlant, onClick, draggingSeed }) {
  const ready = bed.plant && bed.growth >= 1;
  const [dragOver, setDragOver] = React.useState(false);

  if (!bed.plant) {
    return (
      <div
        className={'bed empty' + (dragOver ? ' drag-over' : '') + (draggingSeed ? ' drop-hint' : '')}
        onClick={onClick}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const seedId = e.dataTransfer.getData('text/plain');
          if (seedId) onPlant(bed, seedId);
        }}
      >
        <div className="bed-empty-text">{dragOver ? '⬇ drop here' : '+ empty bed'}</div>
      </div>
    );
  }
  const tea = TEA_TYPES.find(t => t.id === bed.plant);
  return (
    <div className={'bed' + (ready ? ' ready' : '')} onClick={() => ready ? onHarvest(bed) : null}>
      {ready && <div className="bed-ready-badge">HARVEST!</div>}
      {!ready && <div className="bed-growing">growing…</div>}
      <div className="bed-plant">
        <TeaPlant stage={bed.stage} variant={tea?.plant || bed.plant} size={100}/>
      </div>
      <div className="bed-footer">
        <div className="bed-progress"><div style={{ width: (bed.growth * 100) + '%' }}/></div>
        <div className="bed-pct">{Math.round(bed.growth * 100)}%</div>
      </div>
      <div className="bed-tag">{tea?.name}</div>
    </div>
  );
}

// ───────────────── Cups
function CupsScreen({ level, draft, setDraft, activeOrder, tutLockTarget }) {
  return (
    <>
      <div className="stage-header">
        <div>
          <h1>Choose a Cup</h1>
          <div className="sub">{activeOrder ? `${activeOrder.catName} asked for a ${CUPS.find(c => c.id === activeOrder.cup)?.name}.` : 'Pick an order from the rail first.'}</div>
        </div>
      </div>
      <div className="tile-grid cups-grid">
        {CUPS.map(c => {
          const locked = c.unlock > level;
          const selected = draft.cup === c.id;
          const isTarget = activeOrder && activeOrder.cup === c.id;
          const dimmed = tutLockTarget === 'cup-target' && !isTarget;
          return (
            <div
              key={c.id}
              className={'cup-card' + (locked ? ' locked' : '') + (selected ? ' selected' : '') + (tutLockTarget === 'cup-target' && isTarget ? ' tut-spot' : '') + (dimmed ? ' tut-dim' : '')}
              onClick={() => !locked && (!dimmed) && setDraft(d => ({ ...d, cup: c.id }))}
            >
              {locked && <div className="cup-lock">Lv {c.unlock}</div>}
              <div className="cup-art"><Cup shape={c.shape} color={c.color} ring={c.ring} size={96} filled={selected ? 0.5 : 0} fillColor="#c9986b"/></div>
              <div className="cup-name">{c.name}</div>
              <div className="cup-meta">{locked ? 'Locked' : isTarget ? '★ what they want' : 'Tap to pick'}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ───────────────── Tea + Temp
function TeaScreen({ draft, setDraft, inventory, activeOrder, tutLockTarget }) {
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

  const targetTemp = activeOrder?.tempExact;
  const tempDelta = targetTemp != null ? Math.abs(draft.temp - targetTemp) : null;

  return (
    <>
      <div className="stage-header">
        <div>
          <h1>Tea Type</h1>
          <div className="sub">{activeOrder ? `${activeOrder.catName} wants ${TEA_TYPES.find(t => t.id === activeOrder.tea).name} at ${activeOrder.tempExact}°.` : 'Pick a leaf and set the temperature.'}</div>
        </div>
      </div>

      <div className="tile-grid tea-grid">
        {TEA_TYPES.map(t => {
          const qty = inventory[t.id] || 0;
          const selected = draft.tea === t.id;
          const isTarget = activeOrder && activeOrder.tea === t.id;
          const dimmed = tutLockTarget === 'tea-target' && !isTarget;
          const empty = qty <= 0;
          return (
            <div
              key={t.id}
              className={'tea-card' + (selected ? ' selected' : '') + (empty ? ' tea-empty' : '') + (tutLockTarget === 'tea-target' && isTarget ? ' tut-spot' : '') + (dimmed ? ' tut-dim' : '')}
              onClick={() => !empty && !dimmed && setDraft(d => ({ ...d, tea: t.id }))}
            >
              <div className="tea-row">
                <div className="tea-art" style={{ background: t.color + '33' }}><TeaPlant stage={4} variant={t.plant} size={46}/></div>
                <div style={{ flex: 1 }}>
                  <div className="tea-name">{t.name}</div>
                  <div className="tea-sub">{empty ? 'out of stock — grow some!' : t.sub}</div>
                </div>
                <div className="tea-qty" style={{ color: empty ? C.rose : C.cocoa }}>×{qty}</div>
              </div>
              <div className="tea-bar"><div style={{ width: Math.min(100, qty * 8) + '%', background: t.color }}/></div>
            </div>
          );
        })}
      </div>

      <div className={'temp-panel' + (tutLockTarget === 'temp' ? ' tut-spot' : '')}>
        <div className="temp-head">
          <h4>Temperature</h4>
          <div style={{ display:'flex', alignItems:'center', gap: 16 }}>
            {targetTemp != null && (
              <div className={'temp-target ' + (tempDelta < 5 ? 'perfect' : tempDelta < 15 ? 'close' : 'far')}>
                target: {targetTemp}° {tempDelta < 5 ? '✨ perfect' : tempDelta < 15 ? 'close' : 'too ' + (draft.temp > targetTemp ? 'hot' : 'cold')}
              </div>
            )}
            <div className="temp-val">{draft.temp}°</div>
          </div>
        </div>
        <div
          ref={trackRef}
          className="temp-track"
          onPointerDown={(e) => { dragRef.current = true; onTrackEvent(e); }}
        >
          {targetTemp != null && (
            <div className="temp-target-marker" style={{ left: targetTemp + '%' }}/>
          )}
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
function ExtrasScreen({ draft, setDraft, activeOrder, onServe, tutLockTarget }) {
  const toggle = (id) => {
    setDraft(d => ({ ...d, extras: d.extras.includes(id) ? d.extras.filter(x => x !== id) : [...d.extras, id] }));
  };
  const wanted = activeOrder?.extras || [];
  return (
    <>
      <div className="stage-header">
        <div>
          <h1>Extras & Treats</h1>
          <div className="sub">{activeOrder ? (wanted.length ? `${activeOrder.catName} wants: ${wanted.map(e => EXTRAS.find(x => x.id === e).name).join(', ')}.` : `${activeOrder.catName} doesn't want extras — keep it clean.`) : 'Sprinkle a little something special.'}</div>
        </div>
        <div className="right">
          <button
            className={'cta sage' + (tutLockTarget === 'serve' ? ' tut-spot' : '')}
            disabled={!activeOrder || !draft.tea || !draft.cup}
            onClick={onServe}
          >
            <Ico name="check" size={16}/> Serve order
          </button>
        </div>
      </div>

      <div className="tile-grid extras-grid">
        {EXTRAS.map(e => {
          const selected = draft.extras.includes(e.id);
          const isTarget = wanted.includes(e.id);
          const dimmed = tutLockTarget === 'extras-target' && !isTarget && wanted.length > 0;
          return (
            <div
              key={e.id}
              style={{ position:'relative' }}
              className={'extra-card' + (selected ? ' selected' : '') + (tutLockTarget === 'extras-target' && isTarget ? ' tut-spot' : '') + (dimmed ? ' tut-dim' : '')}
              onClick={() => !dimmed && toggle(e.id)}
            >
              {selected && <div className="check"><Ico name="check" size={12}/></div>}
              {isTarget && !selected && <div className="want-tag">wants this</div>}
              <div style={{ height: 72, display:'grid', placeItems:'center' }}><Extra kind={e.id} size={60}/></div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.cocoa }}>{e.name}</div>
              <div style={{ fontSize: 11, color: C.cocoaSoft }}>+${e.price}</div>
            </div>
          );
        })}
      </div>

      {activeOrder && (
        <div className="receipt" style={{ marginTop: 22 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 22 }}>Order summary</h3>
          <div className="receipt-item"><span className="receipt-label">Tea</span><span className="receipt-val">{draft.tea ? TEA_TYPES.find(t => t.id === draft.tea).name : '—'}</span></div>
          <div className="receipt-item"><span className="receipt-label">Cup</span><span className="receipt-val">{draft.cup ? CUPS.find(c => c.id === draft.cup).name : '—'}</span></div>
          <div className="receipt-item"><span className="receipt-label">Temperature</span><span className="receipt-val">{draft.temp}° (target {activeOrder.tempExact}°)</span></div>
          <div className="receipt-item"><span className="receipt-label">Extras</span><span className="receipt-val">{draft.extras.join(', ') || 'none'}</span></div>
          <div className="receipt-total">
            <span className="receipt-label" style={{ alignSelf: 'flex-end' }}>Estimated payout</span>
            <span className="tval">$5–15</span>
          </div>
        </div>
      )}
    </>
  );
}

Object.assign(window, { OrdersRail, CafeDiorama, PlantsScreen, CupsScreen, TeaScreen, ExtrasScreen });
