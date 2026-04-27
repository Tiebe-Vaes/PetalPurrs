const { useState, useEffect, useRef } = React;
const PLANT_GROW_MS = 15000;
function uid() { return Math.random().toString(36).slice(2, 9); }

function PetalPurrs() {
  const [tab, setTab] = useState('home');
  const [coins, setCoins] = useState(50);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [coinBump, setCoinBump] = useState(false);

  const [isBuildMode, setIsBuildMode] = useState(false);
  const [decorations, setDecorations] = useState([
    { id: 'dec1', type: 'plant', x: 20 },
    { id: 'dec2', type: 'sign', x: 45 }
  ]);

  const [orders, setOrders] = useState(() => {
    const arr = [];
    for (let i = 0; i < 3; i++) arr.push(makeOrder(i, 1));
    return arr;
  });
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [draft, setDraft] = useState({ tea: null, cup: null, temp: 60, extras: [] });
  const [inventory, setInventory] = useState({ green: 5, chamomile: 3, rose: 2, lavender: 2 });
  const [beds, setBeds] = useState(() => [
    { id: 1, plant: 'green', stage: 4, growth: 1, planted: Date.now() - PLANT_GROW_MS },
    { id: 2, plant: null, stage: 0, growth: 0, planted: 0 },
    { id: 3, plant: null, stage: 0, growth: 0, planted: 0 },
  ]);

  const [customers, setCustomers] = useState(() => [
    { id: uid(), name: 'Mochi', color: CAT_COLORS[0], pos: 60, target: 60, speed: 24 },
  ]);

  const [tut, setTut] = useState({ open: true, step: 0 });
  const [toast, setToast] = useState(null);
  const showToast = (msg, icon = '✨') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2200);
  };

  const activeOrder = orders.find(o => o.id === activeOrderId);

  const serveOrder = () => {
    showToast('Order served!', '🍵');
    setTab('home');
  };

  const harvestBed = (bed) => {
    setInventory(inv => ({ ...inv, [bed.plant]: (inv[bed.plant] || 0) + 3 }));
    setBeds(prev => prev.map(b => b.id === bed.id ? { ...b, plant: null, growth: 0 } : b));
  };

  const plantSeed = (bed, sid) => {
    setBeds(prev => prev.map(b => b.id === bed.id ? { ...b, plant: sid, growth: 0.1, planted: Date.now() } : b));
  };

  return (
    <div className="app">
      <div className="nav">
        <div className="brand"><div className="brand-name">PetalPurrs</div></div>
        <div className="nav-tabs">
          <button className={`nav-tab ${tab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>Home</button>
          <button className={`nav-tab ${tab === 'plants' ? 'active' : ''}`} onClick={() => setTab('plants')}>Garden</button>
        </div>
        <div className="nav-stats">
          <div className="chip">💰 ${coins}</div>
          <div className="chip">Lv {level}</div>
        </div>
      </div>

      <div className="page">
        <OrdersRail orders={orders} activeId={activeOrderId} onSelect={setActiveOrderId} />
        <div className="stage">
          {tab === 'home' && (
            <CafeDiorama
              customers={customers}
              level={level}
              coins={coins}
              orders={orders}
              onGoto={setTab}
              activeOrder={activeOrder}
              draft={draft}
              isBuildMode={isBuildMode}
              setIsBuildMode={setIsBuildMode}
              decorations={decorations}
              setDecorations={setDecorations}
            />
          )}
          {tab === 'plants' && (
            <PlantsScreen 
              beds={beds} inventory={inventory} 
              harvestBed={harvestBed} plantSeed={plantSeed}
            />
          )}
          {tab === 'cups' && <CupsScreen level={level} draft={draft} setDraft={setDraft} activeOrder={activeOrder} />}
          {tab === 'tea' && <TeaScreen draft={draft} setDraft={setDraft} inventory={inventory} activeOrder={activeOrder} />}
          {tab === 'extras' && <ExtrasScreen draft={draft} setDraft={setDraft} activeOrder={activeOrder} onServe={serveOrder} />}
        </div>
      </div>

      {toast && <div className="toast"><span>{toast.icon}</span><span>{toast.msg}</span></div>}
    </div>
  );
}

Object.assign(window, { PetalPurrs });