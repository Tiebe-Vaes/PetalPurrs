// Art components: cats, plants, cups, icons — all CSS/SVG, drawn from scratch.

const C = {
  cream: '#f7efe2',
  creamDeep: '#f0e4cf',
  card: '#fff8ee',
  peach: '#e8b596',
  peachDeep: '#d48f6c',
  sage: '#a8c4a2',
  sageDeep: '#7fa079',
  lavender: '#c9a3d4',
  lavenderDeep: '#a57ab0',
  butter: '#f3d8a8',
  cocoa: '#6b4f3a',
  cocoaSoft: '#8a6f5a',
  ink: '#3d2d20',
  leaf: '#6b8e4e',
  leafDeep: '#4a6b33',
  rose: '#e89b9b',
};

// Cat — color parameterized, with expression
function Cat({ size = 80, color = C.peach, accent = C.peachDeep, expression = 'smile', sleepy = false }) {
  const eyes = sleepy ? (
    <>
      <path d="M34 46 Q38 48 42 46" stroke={C.ink} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M58 46 Q62 48 66 46" stroke={C.ink} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </>
  ) : (
    <>
      <ellipse cx="38" cy="46" rx="3" ry="4" fill={C.ink}/>
      <ellipse cx="62" cy="46" rx="3" ry="4" fill={C.ink}/>
      <circle cx="39" cy="45" r="1" fill="white"/>
      <circle cx="63" cy="45" r="1" fill="white"/>
    </>
  );
  const mouth = expression === 'smile' ? (
    <path d="M44 56 Q50 60 56 56" stroke={C.ink} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  ) : expression === 'open' ? (
    <ellipse cx="50" cy="58" rx="4" ry="3" fill={C.rose}/>
  ) : (
    <path d="M46 56 Q50 58 54 56" stroke={C.ink} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  );

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* body hint */}
      <ellipse cx="50" cy="85" rx="28" ry="12" fill={color} opacity="0.6"/>
      {/* ears */}
      <path d="M22 30 L28 12 L40 24 Z" fill={color}/>
      <path d="M78 30 L72 12 L60 24 Z" fill={color}/>
      <path d="M26 26 L30 18 L36 24 Z" fill={accent}/>
      <path d="M74 26 L70 18 L64 24 Z" fill={accent}/>
      {/* head */}
      <ellipse cx="50" cy="50" rx="28" ry="26" fill={color}/>
      {/* cheek blush */}
      <circle cx="30" cy="56" r="5" fill={C.rose} opacity="0.45"/>
      <circle cx="70" cy="56" r="5" fill={C.rose} opacity="0.45"/>
      {/* stripes */}
      <path d="M36 32 Q40 28 44 32" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M56 32 Q60 28 64 32" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* face */}
      {eyes}
      <path d="M46 52 L50 56 L54 52 Z" fill={accent}/>
      {mouth}
      {/* whiskers */}
      <line x1="20" y1="54" x2="30" y2="56" stroke={C.cocoaSoft} strokeWidth="0.8"/>
      <line x1="20" y1="58" x2="30" y2="58" stroke={C.cocoaSoft} strokeWidth="0.8"/>
      <line x1="80" y1="54" x2="70" y2="56" stroke={C.cocoaSoft} strokeWidth="0.8"/>
      <line x1="80" y1="58" x2="70" y2="58" stroke={C.cocoaSoft} strokeWidth="0.8"/>
    </svg>
  );
}

// Tea plant with growth stages 0..4
function TeaPlant({ stage = 4, size = 80, variant = 'green' }) {
  const palette = {
    green:    { leaf: C.leaf, leafLight: C.sage, flower: null },
    chamomile:{ leaf: C.sage, leafLight: '#c4d8be', flower: '#fff5c4' },
    rose:     { leaf: C.leaf, leafLight: C.sage, flower: C.rose },
    lavender: { leaf: C.sage, leafLight: '#c8d8be', flower: C.lavender },
  }[variant];

  if (stage === 0) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <ellipse cx="50" cy="84" rx="20" ry="4" fill={C.cocoa} opacity="0.2"/>
        <circle cx="50" cy="80" r="3" fill={C.cocoa}/>
      </svg>
    );
  }
  if (stage === 1) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <ellipse cx="50" cy="84" rx="22" ry="4" fill={C.cocoa} opacity="0.2"/>
        <line x1="50" y1="82" x2="50" y2="68" stroke={palette.leaf} strokeWidth="2.5"/>
        <ellipse cx="44" cy="70" rx="5" ry="3" fill={palette.leafLight} transform="rotate(-30 44 70)"/>
        <ellipse cx="56" cy="70" rx="5" ry="3" fill={palette.leafLight} transform="rotate(30 56 70)"/>
      </svg>
    );
  }
  if (stage === 2) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <ellipse cx="50" cy="84" rx="24" ry="4" fill={C.cocoa} opacity="0.2"/>
        <line x1="50" y1="82" x2="50" y2="50" stroke={palette.leaf} strokeWidth="3"/>
        <ellipse cx="40" cy="64" rx="8" ry="4" fill={palette.leafLight} transform="rotate(-25 40 64)"/>
        <ellipse cx="60" cy="64" rx="8" ry="4" fill={palette.leafLight} transform="rotate(25 60 64)"/>
        <ellipse cx="42" cy="52" rx="7" ry="4" fill={palette.leaf} transform="rotate(-20 42 52)"/>
        <ellipse cx="58" cy="52" rx="7" ry="4" fill={palette.leaf} transform="rotate(20 58 52)"/>
      </svg>
    );
  }
  // stage 3-4: full bush
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <ellipse cx="50" cy="86" rx="28" ry="4" fill={C.cocoa} opacity="0.2"/>
      <line x1="50" y1="84" x2="50" y2="40" stroke={palette.leaf} strokeWidth="3"/>
      <ellipse cx="35" cy="72" rx="10" ry="5" fill={palette.leafLight} transform="rotate(-25 35 72)"/>
      <ellipse cx="65" cy="72" rx="10" ry="5" fill={palette.leafLight} transform="rotate(25 65 72)"/>
      <ellipse cx="32" cy="56" rx="11" ry="5" fill={palette.leaf} transform="rotate(-30 32 56)"/>
      <ellipse cx="68" cy="56" rx="11" ry="5" fill={palette.leaf} transform="rotate(30 68 56)"/>
      <ellipse cx="40" cy="42" rx="9" ry="5" fill={palette.leafLight} transform="rotate(-15 40 42)"/>
      <ellipse cx="60" cy="42" rx="9" ry="5" fill={palette.leafLight} transform="rotate(15 60 42)"/>
      {palette.flower && stage === 4 && (
        <>
          <circle cx="34" cy="50" r="4" fill={palette.flower}/>
          <circle cx="66" cy="50" r="4" fill={palette.flower}/>
          <circle cx="50" cy="38" r="5" fill={palette.flower}/>
          <circle cx="34" cy="50" r="1.5" fill={C.butter}/>
          <circle cx="66" cy="50" r="1.5" fill={C.butter}/>
          <circle cx="50" cy="38" r="1.5" fill={C.butter}/>
        </>
      )}
    </svg>
  );
}

// Cup: shape variants
function Cup({ size = 80, shape = 'mug', color = C.peach, ring = C.peachDeep, filled = 0, fillColor = '#c9986b' }) {
  // filled 0..1
  const body = {
    mug:     { path: 'M25 35 L25 72 Q25 82 35 82 L65 82 Q75 82 75 72 L75 35 Z', handle: 'M75 45 Q88 45 88 58 Q88 70 75 70' },
    tall:    { path: 'M30 28 L30 80 Q30 86 36 86 L64 86 Q70 86 70 80 L70 28 Z', handle: null },
    teacup:  { path: 'M22 44 Q22 76 50 80 Q78 76 78 44 Z', handle: 'M78 52 Q90 52 90 62 Q90 72 78 68' },
    bowl:    { path: 'M20 48 Q20 80 50 82 Q80 80 80 48 Z', handle: null },
    travel:  { path: 'M30 30 L30 80 Q30 86 36 86 L64 86 Q70 86 70 80 L70 30 Z M30 30 L70 30 L68 24 L32 24 Z', handle: null },
  }[shape] || { path: 'M25 35 L25 72 Q25 82 35 82 L65 82 Q75 82 75 72 L75 35 Z', handle: 'M75 45 Q88 45 88 58 Q88 70 75 70' };

  const fillHeight = 45 * filled;
  const fillY = 78 - fillHeight;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {body.handle && <path d={body.handle} stroke={ring} strokeWidth="6" fill="none" strokeLinecap="round"/>}
      <path d={body.path} fill={color}/>
      {/* fill liquid via clip */}
      <defs>
        <clipPath id={`cup-clip-${shape}`}>
          <path d={body.path}/>
        </clipPath>
      </defs>
      {filled > 0 && (
        <g clipPath={`url(#cup-clip-${shape})`}>
          <rect x="15" y={fillY} width="80" height={fillHeight + 10} fill={fillColor}/>
          <ellipse cx="50" cy={fillY} rx="30" ry="3" fill={fillColor} opacity="0.8"/>
          <ellipse cx="50" cy={fillY} rx="25" ry="1.5" fill="white" opacity="0.25"/>
        </g>
      )}
      <path d={body.path} fill="none" stroke={ring} strokeWidth="3" strokeLinejoin="round"/>
      {/* rim highlight */}
      <ellipse cx="50" cy="37" rx="22" ry="2" fill="white" opacity="0.4"/>
      {/* saucer */}
      <ellipse cx="50" cy="90" rx="35" ry="4" fill={C.cocoa} opacity="0.2"/>
    </svg>
  );
}

// Extras: lemon, honey, milk, sugar, mint, biscuit, whipped cream, cinnamon
function Extra({ kind, size = 56 }) {
  const props = { width: size, height: size, viewBox: '0 0 60 60' };
  switch (kind) {
    case 'lemon': return (
      <svg {...props}>
        <ellipse cx="30" cy="30" rx="20" ry="14" fill="#f3d866"/>
        <ellipse cx="30" cy="30" rx="14" ry="10" fill="#f5e08e"/>
        <line x1="16" y1="30" x2="44" y2="30" stroke="#d9b94a" strokeWidth="1"/>
        <line x1="30" y1="20" x2="30" y2="40" stroke="#d9b94a" strokeWidth="1"/>
        <line x1="20" y1="22" x2="40" y2="38" stroke="#d9b94a" strokeWidth="1"/>
        <line x1="40" y1="22" x2="20" y2="38" stroke="#d9b94a" strokeWidth="1"/>
      </svg>
    );
    case 'honey': return (
      <svg {...props}>
        <path d="M22 14 L38 14 L42 22 L38 50 L22 50 L18 22 Z" fill="#f0b64e"/>
        <rect x="20" y="18" width="20" height="8" fill="#e89b3e"/>
        <text x="30" y="40" textAnchor="middle" fontSize="12" fill="#7a4a18" fontWeight="700" fontFamily="sans-serif">H</text>
      </svg>
    );
    case 'milk': return (
      <svg {...props}>
        <path d="M20 18 L40 18 L42 26 L42 50 L18 50 L18 26 Z" fill="white" stroke={C.cocoaSoft} strokeWidth="1.5"/>
        <rect x="24" y="14" width="12" height="6" fill="white" stroke={C.cocoaSoft} strokeWidth="1.5"/>
        <rect x="22" y="32" width="16" height="8" fill={C.sage} opacity="0.6"/>
      </svg>
    );
    case 'sugar': return (
      <svg {...props}>
        <rect x="14" y="22" width="32" height="22" rx="3" fill={C.cream}/>
        <rect x="14" y="22" width="32" height="6" fill={C.cocoa} opacity="0.2"/>
        <rect x="14" y="22" width="32" height="22" rx="3" fill="none" stroke={C.cocoaSoft} strokeWidth="1.5"/>
        <circle cx="22" cy="34" r="2" fill="white"/>
        <circle cx="30" cy="36" r="2" fill="white"/>
        <circle cx="38" cy="34" r="2" fill="white"/>
      </svg>
    );
    case 'mint': return (
      <svg {...props}>
        <ellipse cx="22" cy="28" rx="10" ry="6" fill={C.leaf} transform="rotate(-30 22 28)"/>
        <ellipse cx="38" cy="28" rx="10" ry="6" fill={C.sageDeep} transform="rotate(30 38 28)"/>
        <path d="M30 42 L30 22" stroke={C.leafDeep} strokeWidth="1.5"/>
        <path d="M22 28 Q26 24 22 20" stroke={C.leafDeep} strokeWidth="0.8" fill="none"/>
      </svg>
    );
    case 'biscuit': return (
      <svg {...props}>
        <circle cx="30" cy="30" r="18" fill="#d4a874"/>
        <circle cx="30" cy="30" r="18" fill="none" stroke="#a67f4c" strokeWidth="1.5"/>
        <circle cx="24" cy="26" r="1.8" fill="#6b4020"/>
        <circle cx="36" cy="28" r="1.8" fill="#6b4020"/>
        <circle cx="28" cy="36" r="1.8" fill="#6b4020"/>
        <circle cx="36" cy="38" r="1.5" fill="#6b4020"/>
      </svg>
    );
    case 'cream': return (
      <svg {...props}>
        <path d="M18 38 Q24 20 30 30 Q36 16 42 38 Q42 48 30 48 Q18 48 18 38 Z" fill="white" stroke={C.cocoaSoft} strokeWidth="1.2"/>
        <circle cx="26" cy="34" r="2" fill="white"/>
      </svg>
    );
    case 'cinnamon': return (
      <svg {...props}>
        <rect x="20" y="16" width="7" height="28" rx="2" fill="#a15a28" transform="rotate(-10 23 30)"/>
        <rect x="32" y="18" width="7" height="26" rx="2" fill="#c47540" transform="rotate(15 36 30)"/>
      </svg>
    );
    default: return <svg {...props}><circle cx="30" cy="30" r="16" fill={C.cream}/></svg>;
  }
}

// Icons
function Ico({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path d="M3 10 L12 3 L21 10 V20 Q21 21 20 21 H4 Q3 21 3 20 Z"/><path d="M9 21 V13 H15 V21"/></>,
    plant: <><path d="M12 21 V10"/><path d="M12 10 Q5 10 5 4 Q12 4 12 10 Z"/><path d="M12 10 Q19 10 19 4 Q12 4 12 10 Z"/></>,
    cup: <><path d="M5 8 H17 V16 Q17 20 13 20 H9 Q5 20 5 16 Z"/><path d="M17 10 Q21 10 21 13 Q21 16 17 16"/><path d="M8 5 Q8 3 10 3"/><path d="M12 5 Q12 3 14 3"/></>,
    tea: <><path d="M6 10 H18 V16 Q18 20 14 20 H10 Q6 20 6 16 Z"/><path d="M18 12 Q20 12 20 14 Q20 16 18 16"/><path d="M10 6 Q10 4 12 4 Q14 4 14 6 Q14 8 12 8"/></>,
    sparkles: <><path d="M12 3 L13.5 9 L19 10.5 L13.5 12 L12 18 L10.5 12 L5 10.5 L10.5 9 Z"/><path d="M18 4 L18.8 6.2 L21 7 L18.8 7.8 L18 10 L17.2 7.8 L15 7 L17.2 6.2 Z"/></>,
    coin: <><circle cx="12" cy="12" r="9"/><path d="M9 8 Q9 7 11 7 H13 Q15 7 15 9 Q15 11 13 11 H11 Q9 11 9 13 Q9 15 11 15 H13 Q15 15 15 14"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2 V5 M12 19 V22 M4.2 4.2 L6.3 6.3 M17.7 17.7 L19.8 19.8 M2 12 H5 M19 12 H22 M4.2 19.8 L6.3 17.7 M17.7 6.3 L19.8 4.2"/></>,
    droplet: <path d="M12 3 Q5 11 5 15 Q5 20 12 20 Q19 20 19 15 Q19 11 12 3 Z"/>,
    check: <path d="M4 12 L10 18 L20 6"/>,
    plus: <><path d="M12 5 V19"/><path d="M5 12 H19"/></>,
    x: <><path d="M6 6 L18 18"/><path d="M18 6 L6 18"/></>,
    thermometer: <><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4 4 0 1 0 5 0z"/></>,
    chevronRight: <path d="M9 6 L15 12 L9 18"/>,
    bell: <><path d="M6 8 Q6 3 12 3 Q18 3 18 8 V13 L20 16 H4 L6 13 Z"/><path d="M10 18 Q10 21 12 21 Q14 21 14 18"/></>,
    trash: <><path d="M4 7 H20"/><path d="M9 7 V4 H15 V7"/><path d="M6 7 L7 20 H17 L18 7"/></>,
    basket: <><path d="M3 9 H21 L19 20 H5 Z"/><path d="M8 9 L12 3 L16 9"/></>,
    star: <path d="M12 3 L14.5 9 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 9 Z"/>,
    leaf: <><path d="M4 20 Q4 8 20 4 Q20 20 8 20 Q4 20 4 20 Z"/><path d="M4 20 L12 12"/></>,
    book: <><path d="M4 4 H11 Q13 4 13 6 V20 H6 Q4 20 4 18 Z"/><path d="M20 4 H13 V20 H18 Q20 20 20 18 Z"/></>,
  };
  return <svg {...p}>{paths[name]}</svg>;
}

Object.assign(window, { Cat, TeaPlant, Cup, Extra, Ico, C });
