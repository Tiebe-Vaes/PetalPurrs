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
function CafeDiorama({ 
  customers, level, coins, orders, onGoto, activeOrder, draft,
  isBuildMode, setIsBuildMode, decorations, setDecorations 
}) {
  
  const handleFloorClick = (e) => {
    if (!isBuildMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    // Move the last decoration for simplicity in this version
    setDecorations(prev => {
      const next = [...prev];
      next[0] = { ...next[0], x: Math.max(5, Math.min(95, x)) };
      return next;
    });
  };

  return (
    <>
      <div className={`cafe-scene ${isBuildMode ? 'build-active' : ''}`} onClick={handleFloorClick}>
        <div className="cafe-sky"/>
        <div className="cafe-floor"/>
        
        {/* Render Draggable Decorations */}
        {decorations.map(dec => (
          <div 
            key={dec.id}
            className={`cafe-decoration ${isBuildMode ? 'draggable' : ''}`}
            style={{ left: dec.x + '%', bottom: '15%', zIndex: 4 }}
          >
            {dec.type === 'plant' && <TeaPlant stage={4} variant="rose" size={60}/>}
            {dec.type === 'sign' && <div className="mini-sign" style={{fontSize: 24}}>🍵</div>}
          </div>
        ))}

        <div className="cafe-outside">
          <div className="outside-bush" style={{left: 30}}/>
          <div className="outside-bush" style={{left: 90, transform:'scale(0.7)'}}/>
        </div>
        <div className="cafe-door">
          <div className="door-frame"/>
          <div className="door-sign">OPEN</div>
        </div>
        <div className="cafe-counter">
          <div className="counter-top"/>
          <div className="counter-front"/>
          <div className="counter-shelf">
            <div className="shelf-jar"><div className="jar-lid"/><div className="jar-body" style={{background:'#8fb96b'}}/></div>
            <div className="shelf-jar"><div className="jar-lid"/><div className="jar-body" style={{background:'#e8d38a'}}/></div>
          </div>
          <div className="barista">
            <Cat size={86} color={C.peach} accent={C.peachDeep} expression="smile"/>
            <div className="barista-apron"/>
          </div>
          <div className="cafe-sign">PetalPurrs Café</div>
        </div>
        <div className="cafe-rug"/>
        {customers.map((c, i) => (
          <div
            key={c.id}
            className="cafe-customer"
            style={{
              left: c.pos + '%',
              animationDuration: c.speed + 's',
              zIndex: 10 + i,
            }}
          >
            <Cat size={72} color={c.color.body} accent={c.color.accent} expression="smile"/>
            <div className="customer-name">{c.name}</div>
          </div>
        ))}
      </div>

      <div className="home-actions">
        <button className="cta peach" onClick={() => onGoto('plants')}><Ico name="plant" size={16}/> Tend garden</button>
        
        {/* Build Mode Toggle */}
        <button 
          className={`cta ${isBuildMode ? 'active-build' : 'warm'}`} 
          onClick={() => setIsBuildMode(!isBuildMode)}
        >
          <Ico name={isBuildMode ? 'check' : 'settings'} size={16}/> 
          {isBuildMode ? 'Save Layout' : 'Build Mode'}
        </button>

        <button className="cta sage" onClick={() => onGoto('cups')}><Ico name="cup" size={16}/> Start brewing</button>
        
        <div className="home-stats">
          <span><strong>{orders.filter(o => !o.done).length}</strong> waiting</span>
          <span><strong>{orders.filter(o => o.done).length}</strong> served</span>
        </div>
      </div>

      {activeOrder && !isBuildMode && <CurrentBrewPanel activeOrder={activeOrder} draft={draft}/>}
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
        </div>
        <div className="cup-display">
          {cup ? <Cup shape={cup.shape} color={cup.color} ring={cup.ring} size={140} filled={tea ? 0.7 : 0} fillColor={tea?.color}/> : <Cup shape="mug" color={C.cream} ring={'#c8b5a2'} size={140} filled={0}/>}
        </div>
      </div>
    </>
  );
}

// ───────────────── Plants / Garden
function PlantsScreen({ beds, selectedSeed, setSelectedSeed, inventory, harvestBed, plantSeed, draggingSeed, setDraggingSeed }) {
  return (
    <>
      <div className="stage-header">
        <div>
          <h1>Plantjes 🌿</h1>
          <div className="sub">Drag a seed packet onto an empty bed to plant.</div>
        </div>
      </div>
      <div className="leaf-inventory">
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
        onDragStart();
      }}
      onDragEnd={onDragEnd}
    >
      <div className="seed-art"><TeaPlant stage={4} variant={tea.plant} size={40}/></div>
      <div className="seed-info"><div className="seed-name">{tea.name}</div></div>
    </div>
  );
}

function Bed({ bed, onHarvest, onPlant, onClick, draggingSeed }) {
  const ready = bed.plant && bed.growth >= 1;
  return (
    <div 
      className={'bed' + (ready ? ' ready' : '') + (!bed.plant ? ' empty' : '')} 
      onClick={onClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const seedId = e.dataTransfer.getData('text/plain');
        if (seedId) onPlant(bed, seedId);
      }}
    >
      {bed.plant ? (
        <>
          <div className="bed-plant"><TeaPlant stage={bed.stage} variant={bed.plant} size={100}/></div>
          <div className="bed-footer">
            <div className="bed-progress"><div style={{ width: (bed.growth * 100) + '%' }}/></div>
          </div>
        </>
      ) : <div className="bed-empty-text">+ plant</div>}
    </div>
  );
}

// ───────────────── Cups
function CupsScreen({ level, draft, setDraft, activeOrder, tutLockTarget }) {
  return (
    <>
      <div className="stage-header">
        <h1>Choose a Cup</h1>
      </div>
      <div className="tile-grid cups-grid">
        {CUPS.map(c => {
          const locked = c.unlock > level;
          const selected = draft.cup === c.id;
          return (
            <div
              key={c.id}
              className={'cup-card' + (locked ? ' locked' : '') + (selected ? ' selected' : '')}
              onClick={() => !locked && setDraft(d => ({ ...d, cup: c.id }))}
            >
              <div className="cup-art"><Cup shape={c.shape} color={c.color} ring={c.ring} size={96}/></div>
              <div className="cup-name">{c.name}</div>
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
  const onTrackEvent = (e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    setDraft(d => ({ ...d, temp: Math.round(pct * 100) }));
  };

  return (
    <>
      <div className="stage-header">
        <h1>Tea Type</h1>
      </div>
      <div className="tile-grid tea-grid">
        {TEA_TYPES.map(t => {
          const qty = inventory[t.id] || 0;
          const selected = draft.tea === t.id;
          return (
            <div
              key={t.id}
              className={'tea-card' + (selected ? ' selected' : '') + (qty <= 0 ? ' tea-empty' : '')}
              onClick={() => qty > 0 && setDraft(d => ({ ...d, tea: t.id }))}
            >
              <div className="tea-name">{t.name} (×{qty})</div>
            </div>
          );
        })}
      </div>
      <div className="temp-panel">
        <div className="temp-head"><h4>Temperature: {draft.temp}°</h4></div>
        <div ref={trackRef} className="temp-track" onPointerDown={onTrackEvent}>
          <div className="temp-thumb" style={{ left: draft.temp + '%' }}/>
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
  return (
    <>
      <div className="stage-header">
        <h1>Extras</h1>
        <button className="cta sage" onClick={onServe}>Serve order</button>
      </div>
      <div className="tile-grid extras-grid">
        {EXTRAS.map(e => (
          <div key={e.id} className={'extra-card' + (draft.extras.includes(e.id) ? ' selected' : '')} onClick={() => toggle(e.id)}>
            <div className="extra-name">{e.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}

Object.assign(window, { OrdersRail, CafeDiorama, PlantsScreen, CupsScreen, TeaScreen, ExtrasScreen });