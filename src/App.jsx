import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TEMPLATES = {
  horizontal: { label: "Horizontal" },
  square: { label: "Square" },
  vertical: { label: "Vertical" },
};

const PLATFORMS = {
  twitter: { label: "Twitter / X Header", w: 1500, h: 500, template: "horizontal" },
  linkedin: { label: "LinkedIn Cover", w: 1584, h: 396, template: "horizontal" },
  facebook: { label: "Facebook Page Cover", w: 851, h: 315, template: "horizontal" },
  og: { label: "OG / Link Share", w: 1200, h: 630, template: "horizontal" },
  universalLink: { label: "Universal Link (All Social)", w: 1200, h: 630, template: "horizontal" },
  instagram: { label: "Instagram Square Post", w: 1080, h: 1080, template: "square" },
  universalSquare: { label: "Universal Square (All Social)", w: 1080, h: 1080, template: "square" },
  portrait: { label: "Portrait", w: 1080, h: 1350, template: "vertical" },
  story: { label: "Story", w: 1080, h: 1920, template: "vertical" },
};

const DESIGN_SURFACES = {
  horizontal: { w: 1200, h: 630 },
  square: { w: 1080, h: 1080 },
  vertical: { w: 1080, h: 1350 },
};

const THEMES = {
  kasoLight: {
    label: "Kaso Light",
    bg: "#EDF5F2",
    bg2: null,
    text: "#0D1F1C",
    sub: "#1A7A6A",
    muted: "#2E6B61",
    accent: "#2AA88C",
    accentDark: "#1A7A6A",
    tile: "rgba(42,168,140,0.08)",
    tileS: "#2AA88C",
    sOp: 0.24,
  },
  kasoDark: {
    label: "Kaso Dark",
    bg: "#0D1F1C",
    bg2: null,
    text: "#EDF5F2",
    sub: "#6DDCB4",
    muted: "#A7D7C8",
    accent: "#4DB896",
    accentDark: "#2AA88C",
    tile: "rgba(109,220,180,0.1)",
    tileS: "#6DDCB4",
    sOp: 0.3,
  },
  kasoGradient: {
    label: "Kaso Gradient",
    bg: "#4DB896",
    bg2: "#1A7A6A",
    text: "#FFFFFF",
    sub: "rgba(255,255,255,0.9)",
    muted: "rgba(255,255,255,0.76)",
    accent: "#6DDCB4",
    accentDark: "#2AA88C",
    tile: "rgba(255,255,255,0.12)",
    tileS: "rgba(255,255,255,0.35)",
    sOp: 1,
  },
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
    tile: "#2A140A",
    tileS: "#D94F14",
    sOp: 0.3,
  },
  rust: {
    label: "Rust",
    bg: "#BF3F0F",
    bg2: null,
    text: "#FFFFFF",
    sub: "#F8DCCD",
    muted: "#F1C0A6",
    accent: "#FFF0E8",
    accentDark: "#FBD8C2",
    tile: "#D86639",
    tileS: "#FCE3D5",
    sOp: 1,
  },
  grad: {
    label: "Gradient",
    bg: "#D94F14",
    bg2: "#7A1E00",
    text: "#FFFFFF",
    sub: "#F6DDD0",
    muted: "#F1C1A7",
    accent: "#FFF3EC",
    accentDark: "#F7C9AE",
    tile: "#E17B4B",
    tileS: "#FFD8C4",
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
    tile: "#211610",
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
    tile: "#DCC39B",
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
  template: "horizontal",
  plat: "twitter",
  appTheme: "kasoDark",
  theme: "kasoLight",
  layout: "left",
  fontPair: "classic",
  iconStyle: "tile",
  title: "Kaso",
  tagline: "Flower - Branding & Design Module",
  description: "Create, customize, and export beautiful visual assets with a clean, elegant flow.",
  website: "peacae.com",
  handle: "@kaso_design",
  showIcon: true,
  isHQ: false,
  showDivider: true,
  showWatermark: true,
  useCustomTheme: false,
  customTheme: null,
};

const STORAGE_KEY = "kaso-design-v2";
const THEME_EDIT_FIELDS = [
  { key: "bg", label: "Background" },
  { key: "bg2", label: "Gradient 2" },
  { key: "text", label: "Text" },
  { key: "sub", label: "Subtext" },
  { key: "muted", label: "Muted" },
  { key: "accent", label: "Accent" },
  { key: "accentDark", label: "Accent Dark" },
  { key: "tile", label: "Tile Fill" },
  { key: "tileS", label: "Tile Stroke" },
];

function resolveTheme(cfg) {
  const base = THEMES[cfg.theme] || THEMES.kasoLight;
  if (!cfg.useCustomTheme || !cfg.customTheme) {
    return base;
  }
  return {
    ...base,
    ...cfg.customTheme,
    label: `Custom ${base.label}`,
    bg2: cfg.customTheme.bg2 || null,
    sOp: Number.isFinite(cfg.customTheme.sOp) ? cfg.customTheme.sOp : base.sOp,
  };
}

function resolveUiTheme(cfg) {
  return THEMES[cfg.appTheme] || THEMES.kasoDark;
}

function hexToRgb(hex) {
  if (!hex || !hex.startsWith("#")) return null;
  const raw = hex.replace("#", "");
  const normalized = raw.length === 3 ? raw.split("").map((x) => `${x}${x}`).join("") : raw;
  const val = Number.parseInt(normalized, 16);
  if (Number.isNaN(val)) return null;
  return {
    r: (val >> 16) & 255,
    g: (val >> 8) & 255,
    b: val & 255,
  };
}

function withAlpha(hex, alpha) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function mixHex(a, b, t) {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  if (!c1 || !c2) return a;
  const lerp = (x, y) => Math.round(x + (y - x) * t);
  const r = lerp(c1.r, c2.r).toString(16).padStart(2, "0");
  const g = lerp(c1.g, c2.g).toString(16).padStart(2, "0");
  const bch = lerp(c1.b, c2.b).toString(16).padStart(2, "0");
  return `#${r}${g}${bch}`;
}

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

function drawDesignMonogram(ctx, tx, ty, size, isHQ, kColor, hqColor) {
  const sc = size / 150;
  const ky = isHQ ? 14 : 18;
  const kh = isHQ ? 88 : 90;
  const ny = isHQ ? 45 : 50;
  const pu = isHQ ? [[42, 58], [88, 14], [112, 14], [112, 34], [66, 58]] : [[42, 63], [88, 18], [112, 18], [112, 38], [66, 63]];
  const pl = isHQ ? [[42, 58], [66, 58], [112, 88], [112, 108], [88, 108]] : [[42, 63], [66, 63], [112, 92], [112, 112], [88, 112]];

  ctx.fillStyle = kColor;
  roundRect(ctx, tx + 18 * sc, ty + ky * sc, 24 * sc, kh * sc, 5 * sc);
  ctx.fill();
  ctx.beginPath();
  pu.forEach(([x, y], i) => (i ? ctx.lineTo(tx + x * sc, ty + y * sc) : ctx.moveTo(tx + x * sc, ty + y * sc)));
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  pl.forEach(([x, y], i) => (i ? ctx.lineTo(tx + x * sc, ty + y * sc) : ctx.moveTo(tx + x * sc, ty + y * sc)));
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
  const { plat, theme: themeName, title, tagline, description, website, handle, showIcon, isHQ, iconStyle, layout, fontPair, showDivider, showWatermark } = cfg;
  const sz = PLATFORMS[plat];
  const t = resolveTheme(cfg);
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
    drawDesignMonogram(ctx, W * 0.62, H * 0.4, H * 0.85, false, t.text, null);
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
    const useWhiteMark = Boolean(t.bg2);
    const kColor = useWhiteMark ? "white" : kGrad;
    const hqColor = useWhiteMark ? "rgba(255,255,255,0.88)" : t.accentDark;
    drawDesignMonogram(ctx, ix, iy, iconSz, isHQ, kColor, hqColor);
    iconEndX = isCentered ? W / 2 : ix + iconSz + W * 0.03;
  }

  const tx = isCentered ? startX : showIcon && !isCentered ? iconEndX : padX;
  ctx.textAlign = isCentered ? "center" : "left";
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
    const useWhiteMark = Boolean(t.bg2);
    const kColor = useWhiteMark ? "white" : kGrad;
    const hqColor = useWhiteMark ? "rgba(255,255,255,0.88)" : t.muted;
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
    drawDesignMonogram(ctx, rix, riy, iconSz * 1.4, isHQ, kColor, hqColor);
  }

  return c.toDataURL("image/png");
}

function DesignLogoSvg({ size, t, isHQ, iconStyle }) {
  const id = useRef(`k${Math.random().toString(36).slice(2, 7)}`).current;
  const light = t.tileS.includes("255");
  const kColor = light ? "white" : `url(#${id})`;
  const hqColor = light ? "rgba(255,255,255,0.88)" : t.accentDark;
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
      {iconStyle === "tile" && <rect x="4" y="4" width="142" height="142" rx="28" fill={t.tile} stroke={t.tileS} strokeWidth="2" strokeOpacity={t.sOp} />}
      {iconStyle === "circle" && <circle cx="75" cy="75" r="73" fill={t.tile} stroke={t.tileS} strokeWidth="2" strokeOpacity={t.sOp} />}
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

function AppFlowerLogo({ size = 48 }) {
  const petals = [1, 0.85, 0.7, 1, 0.85, 0.7];
  return (
    <svg viewBox="0 0 150 150" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="flowerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6DDCB4" />
          <stop offset="100%" stopColor="#1A7A6A" />
        </linearGradient>
      </defs>
      {petals.map((opacity, i) => (
        <g key={i} opacity={opacity} transform={`rotate(${i * 60} 75 75)`}>
          <rect x="60" y="12" width="30" height="63" rx="14" fill="url(#flowerGrad)" />
        </g>
      ))}
      <circle cx="75" cy="75" r="14" fill="#0D1F1C" />
      <circle cx="70" cy="70" r="5.5" fill="white" fillOpacity="0.3" />
    </svg>
  );
}

function PreviewCard({ cfg }) {
  const { plat, theme: themeName, title, tagline, description, website, handle, showIcon, isHQ, iconStyle, layout, fontPair, showDivider, showWatermark } = cfg;
  const target = PLATFORMS[plat];
  const designSurface = DESIGN_SURFACES[cfg.template] || DESIGN_SURFACES.horizontal;
  const sz = designSurface;
  const t = resolveTheme(cfg);
  const fp = FONT_PAIRS[fontPair];
  const template = cfg.template;
  const maxBox = template === "vertical" ? { w: 420, h: 760 } : template === "square" ? { w: 640, h: 640 } : { w: 980, h: 430 };
  const scale = Math.min(maxBox.w / sz.w, maxBox.h / sz.h, 1);
  const dw = sz.w * scale;
  const dh = sz.h * scale;
  const isCentered = layout === "center";
  const isSplit = layout === "split";
  const iconSz = Math.min(dh * 0.38, dw * 0.12);
  const padX = dw * 0.08;
  const padY = dh * 0.11;
  const bgStyle = t.bg2 ? { background: `linear-gradient(145deg,${t.bg},${t.bg2})` } : { background: t.bg };
  const targetAspect = target.w / target.h;
  const previewAspect = sz.w / sz.h;
  const showSafeGuide = Math.abs(targetAspect - previewAspect) > 0.01;
  const safeGuide = (() => {
    if (!showSafeGuide) {
      return null;
    }
    if (targetAspect > previewAspect) {
      const h = dw / targetAspect;
      return { x: 0, y: (dh - h) / 2, w: dw, h };
    }
    const w = dh * targetAspect;
    return { x: (dw - w) / 2, y: 0, w, h: dh };
  })();

  return (
    <div style={{ ...bgStyle, width: dw, height: dh, borderRadius: 14, position: "relative", overflow: "hidden", boxShadow: "0 24px 90px rgba(0,0,0,0.45)", flexShrink: 0 }}>
      {safeGuide && (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: safeGuide.y, background: "rgba(0,0,0,0.18)", pointerEvents: "none", zIndex: 2 }} />
          <div style={{ position: "absolute", left: 0, top: safeGuide.y + safeGuide.h, width: "100%", height: dh - (safeGuide.y + safeGuide.h), background: "rgba(0,0,0,0.18)", pointerEvents: "none", zIndex: 2 }} />
          <div style={{ position: "absolute", left: 0, top: safeGuide.y, width: safeGuide.x, height: safeGuide.h, background: "rgba(0,0,0,0.18)", pointerEvents: "none", zIndex: 2 }} />
          <div style={{ position: "absolute", left: safeGuide.x + safeGuide.w, top: safeGuide.y, width: dw - (safeGuide.x + safeGuide.w), height: safeGuide.h, background: "rgba(0,0,0,0.18)", pointerEvents: "none", zIndex: 2 }} />
          <div
            style={{
              position: "absolute",
              left: safeGuide.x,
              top: safeGuide.y,
              width: safeGuide.w,
              height: safeGuide.h,
              border: "1px dashed rgba(255,255,255,0.65)",
              borderRadius: 8,
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              zIndex: 4,
              fontFamily: "Cinzel,serif",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.9)",
              background: "rgba(0,0,0,0.34)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 999,
              padding: "4px 8px",
              pointerEvents: "none",
            }}
          >
            Export Crop
          </div>
        </>
      )}
      {showWatermark && (
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "38%", height: "80%", opacity: 0.04, pointerEvents: "none" }}>
          <DesignLogoSvg size="100%" t={t} isHQ={false} iconStyle="naked" />
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
        {showIcon && !isSplit && <DesignLogoSvg size={iconSz} t={t} isHQ={isHQ} iconStyle={iconStyle} />}
        <div style={{ display: "flex", flexDirection: "column", gap: dh * 0.028, maxWidth: isSplit ? "52%" : "100%", alignItems: isCentered ? "center" : "flex-start" }}>
          {title && <div style={{ fontFamily: fp.title, fontWeight: 900, fontSize: Math.min(dh * 0.14, dw * 0.052), color: t.text, letterSpacing: -0.5, lineHeight: 1.1 }}>{title}</div>}
          {showDivider && <div style={{ width: Math.min(48, dw * 0.05), height: Math.max(2, dh * 0.006), background: t.accent, borderRadius: 2 }} />}
          {tagline && <div style={{ fontFamily: fp.body, fontStyle: "italic", fontSize: Math.min(dh * 0.062, dw * 0.022), color: t.sub, lineHeight: 1.45 }}>{tagline}</div>}
          {description && <div style={{ fontFamily: fp.body, fontSize: Math.min(dh * 0.048, dw * 0.017), color: t.muted, lineHeight: 1.55, maxWidth: "94%" }}>{description}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: dh * 0.02, marginTop: dh * 0.01 }}>
            {[website, handle].filter(Boolean).map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: dw * 0.008, fontFamily: fp.tag, fontSize: Math.min(dh * 0.038, dw * 0.014), letterSpacing: "0.1em", color: t.muted }}>
                <span style={{ width: dh * 0.016, height: dh * 0.016, borderRadius: "50%", background: t.accent, flexShrink: 0 }} />
                {m}
              </div>
            ))}
          </div>
        </div>
        {showIcon && isSplit && <DesignLogoSvg size={iconSz * 1.4} t={t} isHQ={isHQ} iconStyle={iconStyle} />}
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
        <button key={o.value} type="button" onClick={() => onChange(o.value)} className={`chip ${value === o.value ? "chip-active" : ""}`}>
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
  const themeNow = useMemo(() => resolveTheme(cfg), [cfg]);
  const appThemeNow = useMemo(() => resolveUiTheme(cfg), [cfg]);
  const uiVars = useMemo(() => {
    const bg = appThemeNow.bg || "#0d1f1c";
    const bg2 = appThemeNow.bg2 || mixHex(bg, "#000000", 0.24);
    const accent = appThemeNow.accent || "#4db896";
    const accentDark = appThemeNow.accentDark || mixHex(accent, "#000000", 0.2);
    const text = appThemeNow.text || "#e9f1ee";
    const sub = appThemeNow.sub || text;
    const panelBg = withAlpha(bg, 0.68);
    const panelBgSoft = withAlpha(bg, 0.52);
    const surface = withAlpha(mixHex(bg, "#ffffff", 0.08), 0.72);
    const border = withAlpha(accent, 0.28);
    const borderSoft = withAlpha(accent, 0.18);
    const chipBg = withAlpha("#ffffff", 0.04);
    const inputBg = withAlpha("#ffffff", 0.05);
    const shadow = withAlpha("#000000", 0.34);
    return {
      "--app-bg-gradient": `radial-gradient(circle at 20% 0%, ${mixHex(bg, accentDark, 0.35)} 0%, ${bg} 42%, ${bg2} 100%)`,
      "--ui-text": text,
      "--ui-subtext": withAlpha(sub, 0.78),
      "--ui-border": border,
      "--ui-border-soft": borderSoft,
      "--ui-panel-bg": panelBg,
      "--ui-panel-soft": panelBgSoft,
      "--ui-surface": surface,
      "--ui-chip-bg": chipBg,
      "--ui-input-bg": inputBg,
      "--ui-accent": accent,
      "--ui-accent-dark": accentDark,
      "--ui-shadow": shadow,
    };
  }, [appThemeNow]);

  const set = useCallback((k, v) => setCfg((p) => ({ ...p, [k]: v })), []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  }, [cfg]);

  const platformOptions = useMemo(() => {
    return Object.entries(PLATFORMS)
      .filter(([, v]) => v.template === cfg.template)
      .map(([k, v]) => ({ value: k, label: v.label }));
  }, [cfg.template]);

  const setTemplate = useCallback((template) => {
    const firstPlatform = Object.entries(PLATFORMS).find(([, v]) => v.template === template)?.[0] || "twitter";
    setCfg((p) => ({ ...p, template, plat: firstPlatform }));
  }, []);

  const setPlatform = useCallback((plat) => {
    setCfg((p) => ({ ...p, plat, template: PLATFORMS[plat].template }));
  }, []);

  const setAppThemeKey = useCallback((themeKey) => {
    setCfg((p) => {
      return { ...p, appTheme: themeKey };
    });
  }, []);

  const toggleCustomTheme = useCallback(
    (value) => {
      setCfg((p) => {
        if (!value) {
          return { ...p, useCustomTheme: false };
        }
        const base = THEMES[p.theme] || THEMES.kasoLight;
        return {
          ...p,
          useCustomTheme: true,
          customTheme: p.customTheme || { ...base },
        };
      });
    },
    [],
  );

  const setCustomThemeField = useCallback((key, value) => {
    setCfg((p) => {
      const base = THEMES[p.theme] || THEMES.kasoLight;
      const existing = p.customTheme || { ...base };
      return {
        ...p,
        useCustomTheme: true,
        customTheme: { ...existing, [key]: value },
      };
    });
  }, []);

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
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        const merged = { ...DEFAULT_CFG, ...parsed };
        const plat = PLATFORMS[merged.plat] ? merged.plat : DEFAULT_CFG.plat;
        setCfg({ ...merged, plat, template: PLATFORMS[plat].template });
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

  const size = PLATFORMS[cfg.plat];
  const designSize = DESIGN_SURFACES[cfg.template] || DESIGN_SURFACES.horizontal;

  return (
    <div className="app-root" style={uiVars}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <AppFlowerLogo size={54} />
          </div>
          <div className="brand-title">Kaso</div>
          <div className="brand-subtitle">Flower - Branding & Design Module</div>
          <div className="theme-picker-inline">
            <label htmlFor="themeSelect">Theme</label>
            <select id="themeSelect" value={cfg.appTheme} onChange={(e) => setAppThemeKey(e.target.value)}>
              {Object.entries(THEMES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Section title="Content">
          <Field label="Brand Name">
            <input value={cfg.title} onChange={(e) => set("title", e.target.value)} className="input" />
          </Field>
          <Field label="Tagline">
            <textarea value={cfg.tagline} onChange={(e) => set("tagline", e.target.value)} rows={2} className="input textarea" />
          </Field>
          <Field label="Description">
            <textarea value={cfg.description} onChange={(e) => set("description", e.target.value)} rows={4} className="input textarea" placeholder="Keep it short and clear..." />
          </Field>
          <Field label="Website">
            <input value={cfg.website} onChange={(e) => set("website", e.target.value)} className="input" />
          </Field>
          <Field label="Handle">
            <input value={cfg.handle} onChange={(e) => set("handle", e.target.value)} className="input" />
          </Field>
        </Section>

        <Section title="Look & Feel">
          <Field label="Design Theme">
            <ToggleGroup value={cfg.theme} onChange={(v) => set("theme", v)} options={Object.entries(THEMES).map(([k, v]) => ({ value: k, label: v.label }))} />
          </Field>
          <Toggle label="Custom colors" value={cfg.useCustomTheme} onChange={toggleCustomTheme} />
          {cfg.useCustomTheme && (
            <>
              <div className="color-grid">
                {THEME_EDIT_FIELDS.map((item) => (
                  <label key={item.key} className="color-field">
                    <span>{item.label}</span>
                    <input
                      type="color"
                      value={themeNow[item.key] || "#000000"}
                      onChange={(e) => setCustomThemeField(item.key, e.target.value)}
                    />
                  </label>
                ))}
              </div>
              <Field label="Tile Stroke Opacity">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={themeNow.sOp}
                  onChange={(e) => setCustomThemeField("sOp", Number(e.target.value))}
                  className="range-input"
                />
              </Field>
            </>
          )}
          <Field label="Layout">
            <ToggleGroup value={cfg.layout} onChange={(v) => set("layout", v)} options={Object.entries(LAYOUTS).map(([k, v]) => ({ value: k, label: v.label }))} />
          </Field>
          <Field label="Typography">
            <ToggleGroup value={cfg.fontPair} onChange={(v) => set("fontPair", v)} options={Object.entries(FONT_PAIRS).map(([k, v]) => ({ value: k, label: v.label }))} />
          </Field>
        </Section>

        <Section title="Icon & Details">
          <Toggle label="Show icon" value={cfg.showIcon} onChange={(v) => set("showIcon", v)} />
          <Toggle label="HQ version" value={cfg.isHQ} onChange={(v) => set("isHQ", v)} />
          {cfg.showIcon && <ToggleGroup value={cfg.iconStyle} onChange={(v) => set("iconStyle", v)} options={Object.entries(ICON_STYLES).map(([k, v]) => ({ value: k, label: v.label }))} />}
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

      <main className="workspace">
        <div className="workspace-shell">
          <div className="workspace-toolbar">
            <div className="toolbar-group">
              <span className="toolbar-label">Template</span>
              <ToggleGroup value={cfg.template} onChange={setTemplate} options={Object.entries(TEMPLATES).map(([k, v]) => ({ value: k, label: v.label }))} />
            </div>
            <div className="toolbar-group">
              <span className="toolbar-label">Platform</span>
              <ToggleGroup value={cfg.plat} onChange={setPlatform} options={platformOptions} />
            </div>
          </div>

          <div className="preview-stage">
            <PreviewCard cfg={cfg} />
          </div>

          <div className="workspace-meta">
            <span>Design {designSize.w} x {designSize.h}px</span>
            <span>Export {size.w} x {size.h}px</span>
            <span>{PLATFORMS[cfg.plat].label}</span>
            <span>{themeNow.label}</span>
            <span>{LAYOUTS[cfg.layout].label}</span>
          </div>
        </div>
        {message && <div className="message">{message}</div>}
      </main>
    </div>
  );
}
