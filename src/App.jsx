import React, { useCallback, useEffect, useRef, useState } from "react";

const PLATFORMS = {
  twitter: { label: "Twitter / X", w: 1500, h: 500, aspect: 3 },
  linkedin: { label: "LinkedIn", w: 1584, h: 396, aspect: 4 },
  facebook: { label: "Facebook", w: 820, h: 312, aspect: 2.63 },
  instagram: { label: "Instagram", w: 1080, h: 1080, aspect: 1 },
  og: { label: "OG / Blog", w: 1200, h: 630, aspect: 1.9 },
};

const THEMES = {
  ivory: {
    label: "Ivory",
    bg: "#FBF0E8",
    bg2: null,
    text: "#1A0800",
    sub: "#6A2800",
    muted: "#9A4010",
    accent: "#D94F14",
    accentDark: "#9A2E06",
    tile: "#EEE0D0",
    tileS: "#D94F14",
    sOp: 0.18,
  },
  dark: {
    label: "Dark",
    bg: "#1A0800",
    bg2: null,
    text: "#FFF4EC",
    sub: "#FFA878",
    muted: "#FF8040",
    accent: "#FF6B2B",
    accentDark: "#C84010",
    tile: "rgba(255,90,20,0.09)",
    tileS: "#D94F14",
    sOp: 0.3,
  },
  rust: {
    label: "Rust",
    bg: "#BF3F0F",
    bg2: null,
    text: "#FFFFFF",
    sub: "rgba(255,255,255,0.85)",
    muted: "rgba(255,255,255,0.65)",
    accent: "rgba(255,255,255,0.9)",
    accentDark: "rgba(255,255,255,0.6)",
    tile: "rgba(255,255,255,0.12)",
    tileS: "rgba(255,255,255,0.3)",
    sOp: 1,
  },
  grad: {
    label: "Gradient",
    bg: "#D94F14",
    bg2: "#7A1E00",
    text: "#FFFFFF",
    sub: "rgba(255,255,255,0.85)",
    muted: "rgba(255,255,255,0.65)",
    accent: "rgba(255,255,255,0.9)",
    accentDark: "rgba(255,255,255,0.6)",
    tile: "rgba(255,255,255,0.1)",
    tileS: "rgba(255,255,255,0.25)",
    sOp: 1,
  },
  coal: {
    label: "Coal",
    bg: "#0D0D0D",
    bg2: null,
    text: "#F5EDE0",
    sub: "#D94F14",
    muted: "#9A4010",
    accent: "#D94F14",
    accentDark: "#9A2E06",
    tile: "rgba(217,79,20,0.12)",
    tileS: "#D94F14",
    sOp: 0.3,
  },
  sand: {
    label: "Sand",
    bg: "#E8D5B0",
    bg2: null,
    text: "#2A0E00",
    sub: "#7A3210",
    muted: "#9A5020",
    accent: "#BF3F0F",
    accentDark: "#7A1E00",
    tile: "rgba(191,63,15,0.12)",
    tileS: "#BF3F0F",
    sOp: 0.2,
  },
};

const LAYOUTS = {
  left: { label: "Left align" },
  center: { label: "Centered" },
  split: { label: "Split" },
};

const ICON_STYLES = {
  tile: { label: "Tile" },
  naked: { label: "Bare" },
  circle: { label: "Circle" },
};

const FONT_PAIRS = {
  classic: {
    label: "Classic",
    title: "'Playfair Display',serif",
    body: "'EB Garamond',serif",
    tag: "'Cinzel',serif",
  },
  modern: {
    label: "Modern",
    title: "'Cinzel',serif",
    body: "'Cinzel',serif",
    tag: "'Cinzel',serif",
  },
  editorial: {
    label: "Editorial",
    title: "'Playfair Display',serif",
    body: "'Cinzel',serif",
    tag: "'EB Garamond',serif",
  },
};

const DEFAULT_CFG = {
  plat: "twitter",
  theme: "ivory",
  layout: "left",
  fontPair: "classic",
  iconStyle: "tile",
  title: "Kifuliiru",
  tagline: "Ndeto Y'Abafuliiru - Language & Culture",
  description: "",
  website: "kifuliiru.com",
  handle: "@kifuliiru",
  showIcon: true,
  isHQ: false,
  showDivider: true,
  showWatermark: true,
};

const STORAGE_KEY = "kaso-design-v1";

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawK(ctx, tx, ty, size, isHQ, kColor, hqColor) {
  const sc = size / 150;
  const ky = isHQ ? 14 : 18;
  const kh = isHQ ? 88 : 90;
  const ny = isHQ ? 45 : 50;
  const pu = isHQ
    ? [
        [42, 58],
        [88, 14],
        [112, 14],
        [112, 34],
        [66, 58],
      ]
    : [
        [42, 63],
        [88, 18],
        [112, 18],
        [112, 38],
        [66, 63],
      ];
  const pl = isHQ
    ? [
        [42, 58],
        [66, 58],
        [112, 88],
        [112, 108],
        [88, 108],
      ]
    : [
        [42, 63],
        [66, 63],
        [112, 92],
        [112, 112],
        [88, 112],
      ];

  ctx.fillStyle = kColor;
  roundRect(ctx, tx + 18 * sc, ty + ky * sc, 24 * sc, kh * sc, 5 * sc);
  ctx.fill();
  ctx.beginPath();
  pu.forEach(([x, y], i) =>
    i ? ctx.lineTo(tx + x * sc, ty + y * sc) : ctx.moveTo(tx + x * sc, ty + y * sc),
  );
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  pl.forEach(([x, y], i) =>
    i ? ctx.lineTo(tx + x * sc, ty + y * sc) : ctx.moveTo(tx + x * sc, ty + y * sc),
  );
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(tx + 42 * sc, ty + ny * sc, 24 * sc, 26 * sc);

  if (isHQ && hqColor) {
    ctx.save();
    ctx.strokeStyle = hqColor;
    ctx.lineWidth = 1.5 * sc;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(tx + 116 * sc, ty + 90 * sc);
    ctx.lineTo(tx + 116 * sc, ty + 110 * sc);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = hqColor;
    ctx.font = `900 ${13 * sc}px Cinzel,serif`;
    ctx.textAlign = "center";
    ctx.fillText("HQ", tx + 130 * sc, ty + 105 * sc);
    ctx.textAlign = "left";
    ctx.restore();
  }
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(" ");
  let line = "";
  const lines = [];
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  return lines.length * lineH;
}

function renderToCanvas(cfg) {
  const {
    plat,
    theme: themeName,
    title,
    tagline,
    description,
    website,
    handle,
    showIcon,
    isHQ,
    iconStyle,
    layout,
    fontPair,
    showDivider,
    showWatermark,
  } = cfg;
  const sz = PLATFORMS[plat];
  const t = THEMES[themeName];
  const fp = FONT_PAIRS[fontPair];
  const W = sz.w;
  const H = sz.h;

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");

  if (t.bg2) {
    const g = ctx.createLinearGradient(0, 0, W * 0.7, H);
    g.addColorStop(0, t.bg);
    g.addColorStop(1, t.bg2);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = t.bg;
  }
  ctx.fillRect(0, 0, W, H);

  if (showWatermark) {
    ctx.save();
    ctx.globalAlpha = 0.04;
    drawK(ctx, W * 0.62, H * 0.4, H * 0.85, false, t.text, null);
    ctx.restore();
  }

  const isCentered = layout === "center";
  const isSplit = layout === "split";
  const padX = W * 0.08;
  const padY = H * 0.12;
  const contentW = isSplit ? W * 0.52 : W * 0.84;
  const iconSz = Math.min(H * 0.38, W * 0.12);
  const startX = isCentered ? W / 2 : padX;

  let iconEndX = padX;
  if (showIcon) {
    const ix = isCentered ? W / 2 - iconSz / 2 : padX;
    const iy = isCentered ? padY : H / 2 - iconSz / 2;
    if (iconStyle === "tile") {
      ctx.save();
      roundRect(ctx, ix, iy, iconSz, iconSz, iconSz * 0.187);
      ctx.fillStyle = t.tile;
      ctx.fill();
      ctx.strokeStyle = t.tileS;
      ctx.lineWidth = iconSz * 0.013;
      ctx.globalAlpha = t.sOp;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    } else if (iconStyle === "circle") {
      ctx.save();
      ctx.beginPath();
      ctx.arc(ix + iconSz / 2, iy + iconSz / 2, iconSz / 2, 0, Math.PI * 2);
      ctx.fillStyle = t.tile;
      ctx.fill();
      ctx.strokeStyle = t.tileS;
      ctx.lineWidth = iconSz * 0.013;
      ctx.globalAlpha = t.sOp;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    const kGrad = ctx.createLinearGradient(ix, iy, ix, iy + iconSz);
    kGrad.addColorStop(0, t.accent);
    kGrad.addColorStop(1, t.accentDark);
    const kColor = themeName === "rust" || themeName === "grad" ? "white" : kGrad;
    const hqColor =
      themeName === "rust" || themeName === "grad" ? "rgba(255,255,255,0.88)" : t.accentDark;
    drawK(ctx, ix, iy, iconSz, isHQ, kColor, hqColor);
    iconEndX = isCentered ? W / 2 : ix + iconSz + W * 0.03;
  }

  const tx = isCentered ? startX : showIcon && !isCentered ? iconEndX : padX;
  const textAlign = isCentered ? "center" : "left";
  ctx.textAlign = textAlign;
  let curY = isCentered ? (showIcon ? padY + iconSz + H * 0.06 : H * 0.25) : H / 2 - H * 0.22;

  const titleSz = Math.min(H * 0.14, W * 0.052);
  ctx.font = `900 ${titleSz}px ${fp.title}`;
  ctx.fillStyle = t.text;
  curY += wrapText(ctx, title, tx, curY, contentW, titleSz * 1.2);
  curY += titleSz * 0.3;

  if (showDivider) {
    const dw = Math.min(56, W * 0.05);
    const dh = Math.max(2, H * 0.006);
    ctx.fillStyle = t.accent;
    ctx.fillRect(isCentered ? W / 2 - dw / 2 : tx, curY, dw, dh);
    curY += dh + titleSz * 0.5;
  }

  if (tagline) {
    const tagSz = Math.min(H * 0.062, W * 0.022);
    ctx.font = `italic ${tagSz}px ${fp.body}`;
    ctx.fillStyle = t.sub;
    curY += wrapText(ctx, tagline, tx, curY, contentW, tagSz * 1.5);
    curY += tagSz * 0.5;
  }

  if (description) {
    const descSz = Math.min(H * 0.048, W * 0.017);
    ctx.font = `${descSz}px ${fp.body}`;
    ctx.fillStyle = t.muted;
    curY += wrapText(ctx, description, tx, curY, contentW, descSz * 1.6);
    curY += descSz * 0.5;
  }

  const metaSz = Math.min(H * 0.038, W * 0.014);
  ctx.font = `500 ${metaSz}px ${fp.tag}`;
  ctx.fillStyle = t.muted;
  const metaItems = [website, handle].filter(Boolean);
  if (metaItems.length) {
    curY += metaSz * 0.4;
    metaItems.forEach((m, i) => {
      const my = curY + i * metaSz * 1.8;
      const dotR = metaSz * 0.22;
      const dotX = isCentered ? W / 2 - ctx.measureText(m).width / 2 - dotR * 3 : tx;
      ctx.beginPath();
      ctx.arc(dotX + dotR, my - dotR, dotR, 0, Math.PI * 2);
      ctx.fillStyle = t.accent;
      ctx.fill();
      ctx.fillStyle = t.muted;
      ctx.fillText(m, dotX + dotR * 3.5, my);
    });
  }

  if (isSplit && showIcon) {
    const rix = W * 0.62;
    const riy = H / 2 - iconSz * 0.7;
    const kGrad = ctx.createLinearGradient(rix, riy, rix, riy + iconSz * 1.4);
    kGrad.addColorStop(0, t.accent);
    kGrad.addColorStop(1, t.accentDark);
    const kColor = themeName === "rust" || themeName === "grad" ? "white" : kGrad;
    if (iconStyle === "tile") {
      ctx.save();
      roundRect(ctx, rix, riy, iconSz * 1.4, iconSz * 1.4, iconSz * 0.187 * 1.4);
      ctx.fillStyle = t.tile;
      ctx.fill();
      ctx.strokeStyle = t.tileS;
      ctx.lineWidth = iconSz * 0.013;
      ctx.globalAlpha = t.sOp;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    drawK(ctx, rix, riy, iconSz * 1.4, isHQ, kColor, t.muted);
  }

  ctx.textAlign = "left";
  return c.toDataURL("image/png");
}

function KSvg({ size, t, isHQ, iconStyle }) {
  const id = useRef(`k${Math.random().toString(36).slice(2, 7)}`).current;
  const isLight = t.tileS === "rgba(255,255,255,0.3)" || t.tileS === "rgba(255,255,255,0.25)";
  const kColor = isLight ? "white" : `url(#${id})`;
  const hqColor = isLight ? "rgba(255,255,255,0.88)" : t.accentDark;
  const ptsU = isHQ ? "42,58 88,14 112,14 112,34 66,58" : "42,63 88,18 112,18 112,38 66,63";
  const ptsL = isHQ ? "42,58 66,58 112,88 112,108 88,108" : "42,63 66,63 112,92 112,112 88,112";
  const ky = isHQ ? 14 : 18;
  const kh = isHQ ? 88 : 90;
  const ny = isHQ ? 45 : 50;

  return (
    <svg viewBox="0 0 150 150" width={size} height={size} style={{ flexShrink: 0, display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.accent} />
          <stop offset="100%" stopColor={t.accentDark} />
        </linearGradient>
        {iconStyle === "circle" && (
          <clipPath id={`${id}clip`}>
            <circle cx="75" cy="75" r="73" />
          </clipPath>
        )}
      </defs>
      {iconStyle === "tile" && (
        <rect x="4" y="4" width="142" height="142" rx="28" fill={t.tile} stroke={t.tileS} strokeWidth="2" strokeOpacity="0.2" />
      )}
      {iconStyle === "circle" && (
        <circle cx="75" cy="75" r="73" fill={t.tile} stroke={t.tileS} strokeWidth="2" strokeOpacity="0.2" />
      )}
      <g clipPath={iconStyle === "circle" ? `url(#${id}clip)` : undefined}>
        <rect x="18" y={ky} width="24" height={kh} rx="5" fill={kColor} />
        <polygon points={ptsU} fill={kColor} />
        <polygon points={ptsL} fill={kColor} />
        <rect x="42" y={ny} width="24" height="26" fill={kColor} />
        {isHQ && (
          <>
            <line x1="116" y1="90" x2="116" y2="110" stroke={hqColor} strokeWidth="1.5" strokeOpacity="0.5" />
            <text x="130" y="105" fontFamily="Cinzel,serif" fontSize="13" fontWeight="900" fill={hqColor} textAnchor="middle">
              HQ
            </text>
          </>
        )}
      </g>
    </svg>
  );
}

function PreviewCard({ cfg }) {
  const {
    plat,
    theme: themeName,
    title,
    tagline,
    description,
    website,
    handle,
    showIcon,
    isHQ,
    iconStyle,
    layout,
    fontPair,
    showDivider,
    showWatermark,
  } = cfg;
  const sz = PLATFORMS[plat];
  const t = THEMES[themeName];
  const fp = FONT_PAIRS[fontPair];
  const maxW = 680;
  const scale = Math.min(maxW / sz.w, 340 / sz.h, 1);
  const dw = sz.w * scale;
  const dh = sz.h * scale;
  const isCentered = layout === "center";
  const isSplit = layout === "split";
  const iconSz = Math.min(dh * 0.38, dw * 0.12);
  const padX = dw * 0.08;
  const padY = dh * 0.11;
  const bgStyle = t.bg2 ? { background: `linear-gradient(145deg,${t.bg},${t.bg2})` } : { background: t.bg };

  return (
    <div
      style={{
        ...bgStyle,
        width: dw,
        height: dh,
        borderRadius: 8,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 72px rgba(0,0,0,0.65)",
        flexShrink: 0,
      }}
    >
      {showWatermark && (
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "38%", height: "80%", opacity: 0.04, pointerEvents: "none" }}>
          <KSvg size="100%" t={t} isHQ={false} iconStyle="naked" />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: isCentered ? "column" : "row",
          alignItems: "center",
          justifyContent: isSplit ? "space-between" : isCentered ? "center" : "flex-start",
          padding: `${padY}px ${padX}px`,
          gap: dw * 0.03,
          textAlign: isCentered ? "center" : "left",
        }}
      >
        {showIcon && !isSplit && <KSvg size={iconSz} t={t} isHQ={isHQ} iconStyle={iconStyle} />}
        <div style={{ display: "flex", flexDirection: "column", gap: dh * 0.028, maxWidth: isSplit ? "52%" : "100%", alignItems: isCentered ? "center" : "flex-start" }}>
          {title && <div style={{ fontFamily: fp.title, fontWeight: 900, fontSize: Math.min(dh * 0.14, dw * 0.052), color: t.text, letterSpacing: -0.5, lineHeight: 1.1 }}>{title}</div>}
          {showDivider && <div style={{ width: Math.min(48, dw * 0.05), height: Math.max(2, dh * 0.006), background: t.accent, borderRadius: 2 }} />}
          {tagline && <div style={{ fontFamily: fp.body, fontStyle: "italic", fontSize: Math.min(dh * 0.062, dw * 0.022), color: t.sub, lineHeight: 1.45 }}>{tagline}</div>}
          {description && <div style={{ fontFamily: fp.body, fontSize: Math.min(dh * 0.048, dw * 0.017), color: t.muted, lineHeight: 1.55, maxWidth: "94%" }}>{description}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: dh * 0.02, marginTop: dh * 0.01 }}>
            {[website, handle].filter(Boolean).map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: dw * 0.008,
                  fontFamily: fp.tag,
                  fontSize: Math.min(dh * 0.038, dw * 0.014),
                  letterSpacing: "0.1em",
                  color: t.muted,
                }}
              >
                <span style={{ width: dh * 0.016, height: dh * 0.016, borderRadius: "50%", background: t.accent, flexShrink: 0 }} />
                {m}
              </div>
            ))}
          </div>
        </div>
        {showIcon && isSplit && <KSvg size={iconSz * 1.4} t={t} isHQ={isHQ} iconStyle={iconStyle} />}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="section">
      <div className="section-title">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {children}
    </div>
  );
}

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="toggle-group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`chip ${value === o.value ? "chip-active" : ""}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="toggle-row">
      <span className="toggle-label">{label}</span>
      <button type="button" onClick={() => onChange(!value)} className={`switch ${value ? "switch-on" : ""}`} aria-pressed={value} />
    </div>
  );
}

export default function App() {
  const [cfg, setCfg] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_CFG, ...JSON.parse(raw) } : DEFAULT_CFG;
    } catch {
      return DEFAULT_CFG;
    }
  });
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef(null);

  const set = useCallback((k, v) => setCfg((p) => ({ ...p, [k]: v })), []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  }, [cfg]);

  const download = useCallback(() => {
    setDownloading(true);
    setTimeout(() => {
      const url = renderToCanvas(cfg);
      const a = document.createElement("a");
      a.download = `kaso-${cfg.plat}-${cfg.theme}.png`;
      a.href = url;
      a.click();
      setDownloading(false);
      setMessage("PNG downloaded.");
    }, 50);
  }, [cfg]);

  const exportPreset = useCallback(() => {
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `kaso-preset-${Date.now()}.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Preset exported.");
  }, [cfg]);

  const importPreset = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        setCfg({ ...DEFAULT_CFG, ...parsed });
        setMessage("Preset imported.");
      } catch {
        setMessage("Import failed: invalid JSON.");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }, []);

  const resetAll = useCallback(() => {
    setCfg(DEFAULT_CFG);
    setMessage("Reset to defaults.");
  }, []);

  const sz = PLATFORMS[cfg.plat];

  return (
    <div className="app-root">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-title">Kaso</div>
          <div className="brand-subtitle">Design Studio</div>
        </div>

        <Section title="Platform">
          <ToggleGroup value={cfg.plat} onChange={(v) => set("plat", v)} options={Object.entries(PLATFORMS).map(([k, v]) => ({ value: k, label: v.label }))} />
          <div className="hint">
            {sz.w} x {sz.h}px
          </div>
        </Section>

        <Section title="Content">
          <Field label="Title">
            <input value={cfg.title} onChange={(e) => set("title", e.target.value)} className="input" />
          </Field>
          <Field label="Tagline">
            <input value={cfg.tagline} onChange={(e) => set("tagline", e.target.value)} className="input" />
          </Field>
          <Field label="Short Description">
            <textarea value={cfg.description} onChange={(e) => set("description", e.target.value)} rows={3} className="input textarea" placeholder="Optional..." />
          </Field>
          <Field label="Website">
            <input value={cfg.website} onChange={(e) => set("website", e.target.value)} className="input" />
          </Field>
          <Field label="Social Handle">
            <input value={cfg.handle} onChange={(e) => set("handle", e.target.value)} className="input" />
          </Field>
        </Section>

        <Section title="Theme">
          <ToggleGroup value={cfg.theme} onChange={(v) => set("theme", v)} options={Object.entries(THEMES).map(([k, v]) => ({ value: k, label: v.label }))} />
        </Section>

        <Section title="Layout">
          <ToggleGroup value={cfg.layout} onChange={(v) => set("layout", v)} options={Object.entries(LAYOUTS).map(([k, v]) => ({ value: k, label: v.label }))} />
        </Section>

        <Section title="Typography">
          <ToggleGroup value={cfg.fontPair} onChange={(v) => set("fontPair", v)} options={Object.entries(FONT_PAIRS).map(([k, v]) => ({ value: k, label: v.label }))} />
        </Section>

        <Section title="Icon">
          <Toggle label="Show icon" value={cfg.showIcon} onChange={(v) => set("showIcon", v)} />
          <Toggle label="HQ version" value={cfg.isHQ} onChange={(v) => set("isHQ", v)} />
          {cfg.showIcon && (
            <ToggleGroup value={cfg.iconStyle} onChange={(v) => set("iconStyle", v)} options={Object.entries(ICON_STYLES).map(([k, v]) => ({ value: k, label: v.label }))} />
          )}
        </Section>

        <Section title="Details">
          <Toggle label="Divider line" value={cfg.showDivider} onChange={(v) => set("showDivider", v)} />
          <Toggle label="Watermark" value={cfg.showWatermark} onChange={(v) => set("showWatermark", v)} />
        </Section>

        <div className="action-row">
          <button type="button" onClick={resetAll} className="ghost-btn">
            Reset
          </button>
          <button type="button" onClick={exportPreset} className="ghost-btn">
            Export
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="ghost-btn">
            Import
          </button>
          <input ref={fileRef} className="hidden-file" type="file" accept="application/json" onChange={importPreset} />
        </div>

        <button type="button" onClick={download} disabled={downloading} className="download-btn">
          {downloading ? "Saving..." : "Download PNG"}
        </button>
      </aside>

      <main className="preview-pane">
        <PreviewCard cfg={cfg} />
        <div className="preview-meta">
          {PLATFORMS[cfg.plat].label} | {THEMES[cfg.theme].label} | {LAYOUTS[cfg.layout].label}
        </div>
        {message && <div className="message">{message}</div>}
      </main>
    </div>
  );
}
