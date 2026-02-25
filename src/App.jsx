import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Download,
  Image as ImageIcon,
  Import as ImportIcon,
  LayoutTemplate,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Type,
} from "lucide-react";

const TEMPLATES = {
  horizontal: { label: "Horizontal" },
  square: { label: "Square" },
  vertical: { label: "Vertical" },
};

const ASSET_TYPES = {
  post: { label: "Post" },
  header: { label: "Header" },
  link: { label: "Link" },
  story: { label: "Story" },
  universal: { label: "Universal" },
};

const PLATFORMS = {
  xPost: { label: "X Post", w: 1600, h: 900, template: "horizontal", assetType: "post" },
  twitter: { label: "X Header", w: 1500, h: 500, template: "horizontal", assetType: "header" },
  linkedinPost: { label: "LinkedIn Post", w: 1200, h: 627, template: "horizontal", assetType: "post" },
  linkedin: { label: "LinkedIn Cover", w: 1584, h: 396, template: "horizontal", assetType: "header" },
  facebookPost: { label: "Facebook Post", w: 1200, h: 630, template: "horizontal", assetType: "post" },
  facebook: { label: "Facebook Page Cover", w: 851, h: 315, template: "horizontal", assetType: "header" },
  og: { label: "OG / Link Share", w: 1200, h: 630, template: "horizontal", assetType: "link" },
  universalLink: { label: "Universal Link (All Social)", w: 1200, h: 630, template: "horizontal", assetType: "universal" },
  instagram: { label: "Instagram Square Post", w: 1080, h: 1080, template: "square", assetType: "post" },
  universalSquare: { label: "Universal Square (All Social)", w: 1080, h: 1080, template: "square", assetType: "universal" },
  portrait: { label: "Instagram Portrait Post", w: 1080, h: 1350, template: "vertical", assetType: "post" },
  story: { label: "Story", w: 1080, h: 1920, template: "vertical", assetType: "story" },
};

const DESIGN_SURFACES = {
  horizontal: { w: 1200, h: 630 },
  square: { w: 1080, h: 1080 },
  vertical: { w: 1080, h: 1350 },
};

const APP_THEMES = {
  light: {
    label: "Light",
    bg: "#F8FAFC",
    bg2: "#EEF2F7",
    text: "#0F172A",
    sub: "#475569",
    accent: "#2563EB",
    accentDark: "#1D4ED8",
  },
  dark: {
    label: "Dark",
    bg: "#0B1220",
    bg2: "#0F172A",
    text: "#E5E7EB",
    sub: "#94A3B8",
    accent: "#3B82F6",
    accentDark: "#2563EB",
  },
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
  sky: {
    label: "Sky",
    bg: "#EAF4FF",
    bg2: "#C9E2FF",
    text: "#10233F",
    sub: "#1E4C8F",
    muted: "#3B679D",
    accent: "#2F80ED",
    accentDark: "#1F5FB8",
    tile: "#DCEBFC",
    tileS: "#2F80ED",
    sOp: 0.22,
  },
  forest: {
    label: "Forest",
    bg: "#0F2E1F",
    bg2: "#1D5A3A",
    text: "#ECF8F1",
    sub: "#9FD9B5",
    muted: "#7FB592",
    accent: "#4DBB7A",
    accentDark: "#2D8A56",
    tile: "#163D2A",
    tileS: "#4DBB7A",
    sOp: 0.28,
  },
  royal: {
    label: "Royal",
    bg: "#1E1B4B",
    bg2: "#312E81",
    text: "#F5F3FF",
    sub: "#C4B5FD",
    muted: "#A78BFA",
    accent: "#8B5CF6",
    accentDark: "#6D28D9",
    tile: "#28235C",
    tileS: "#8B5CF6",
    sOp: 0.32,
  },
  cherry: {
    label: "Cherry",
    bg: "#FFF1F2",
    bg2: "#FFE4E6",
    text: "#3F0D16",
    sub: "#9F1239",
    muted: "#BE123C",
    accent: "#E11D48",
    accentDark: "#9F1239",
    tile: "#FFD7DE",
    tileS: "#E11D48",
    sOp: 0.22,
  },
  mono: {
    label: "Mono",
    bg: "#F5F5F5",
    bg2: null,
    text: "#111111",
    sub: "#333333",
    muted: "#555555",
    accent: "#111111",
    accentDark: "#000000",
    tile: "#E4E4E4",
    tileS: "#111111",
    sOp: 0.2,
  },
};

const QUICK_TEMPLATES = {
  launch: {
    label: "Product Launch",
    cfg: {
      title: "Kaso Studio",
      tagline: "Launch Day - New Creative Toolkit",
      description: "Design once, publish everywhere with professional brand consistency.",
      website: "peacae.com",
      handle: "@kaso_design",
      layout: "split",
      theme: "kasoGradient",
      fontPair: "readable",
      iconStyle: "tile",
      showDivider: true,
      showIcon: true,
    },
  },
  webinar: {
    label: "Event Promo",
    cfg: {
      title: "Live Design Session",
      tagline: "Thursday at 7:00 PM",
      description: "Learn visual storytelling and platform-ready workflows in one practical session.",
      website: "peacae.com/events",
      handle: "@kaso_design",
      layout: "left",
      theme: "royal",
      fontPair: "modern",
      iconStyle: "circle",
      showDivider: true,
      showIcon: true,
    },
  },
  quote: {
    label: "Quote Card",
    cfg: {
      title: "Design is direction.",
      tagline: "Not decoration.",
      description: "",
      website: "",
      handle: "@kaso_design",
      layout: "center",
      theme: "mono",
      fontPair: "editorial",
      iconStyle: "naked",
      showDivider: false,
      showIcon: false,
    },
  },
  update: {
    label: "Feature Update",
    cfg: {
      title: "New in Kaso",
      tagline: "Templates, Themes, and Better Exports",
      description: "Create faster with reusable structures and stronger visual quality controls.",
      website: "peacae.com",
      handle: "@kaso_design",
      layout: "left",
      theme: "sky",
      fontPair: "compact",
      iconStyle: "tile",
      showDivider: true,
      showIcon: true,
    },
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
  readable: {
    label: "Readable",
    title: "'Inter',sans-serif",
    body: "'Inter',sans-serif",
    tag: "'Manrope',sans-serif",
  },
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
  elegant: {
    label: "Elegant",
    title: "'Playfair Display',serif",
    body: "'EB Garamond',serif",
    tag: "'EB Garamond',serif",
  },
  compact: {
    label: "Compact",
    title: "'Manrope',sans-serif",
    body: "'Inter',sans-serif",
    tag: "'Inter',sans-serif",
  },
};

const DEFAULT_CFG = {
  assetType: "post",
  template: "horizontal",
  plat: "xPost",
  appTheme: "light",
  theme: "kasoLight",
  layout: "left",
  fontPair: "readable",
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
  return APP_THEMES[cfg.appTheme] || APP_THEMES.light;
}

function normalizeCfg(rawCfg) {
  const merged = { ...DEFAULT_CFG, ...rawCfg };
  const plat = PLATFORMS[merged.plat] ? merged.plat : DEFAULT_CFG.plat;
  return {
    ...merged,
    plat,
    template: PLATFORMS[plat].template,
    assetType: PLATFORMS[plat].assetType,
  };
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
  const lines = getWrappedLines(ctx, text, maxW);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  return lines.length * lineH;
}

function getWrappedLines(ctx, text, maxW) {
  const words = String(text || "").split(" ");
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
  lines.push(line || "");
  return lines;
}

function getTemplateMetrics(template) {
  if (template === "vertical") {
    return {
      padX: 0.09,
      padY: 0.09,
      titleMul: 1.02,
      tagMul: 1.02,
      descMul: 1.01,
      metaMul: 1.02,
    };
  }
  if (template === "square") {
    return {
      padX: 0.085,
      padY: 0.1,
      titleMul: 1,
      tagMul: 1,
      descMul: 1,
      metaMul: 1,
    };
  }
  return {
    padX: 0.08,
    padY: 0.12,
    titleMul: 1,
    tagMul: 1,
    descMul: 1,
    metaMul: 1,
  };
}

function getTypographySizes(H, W, metrics, previewMode = false) {
  const titleBase = Math.min(H * 0.14, W * 0.052) * metrics.titleMul;
  const tagBase = Math.min(H * 0.062, W * 0.022) * metrics.tagMul;
  const descBase = Math.min(H * 0.048, W * 0.017) * metrics.descMul;
  const metaBase = Math.min(H * 0.038, W * 0.014) * metrics.metaMul;

  if (!previewMode) {
    return {
      title: Math.max(30, titleBase),
      tag: Math.max(17, tagBase),
      desc: Math.max(14, descBase),
      meta: Math.max(11, metaBase),
    };
  }

  return {
    title: Math.max(26, titleBase),
    tag: Math.max(15, tagBase),
    desc: Math.max(12.5, descBase),
    meta: Math.max(10.5, metaBase),
  };
}

function getAspectRect(sw, sh, targetAspect) {
  if (!targetAspect) {
    return { x: 0, y: 0, w: sw, h: sh };
  }
  const sourceAspect = sw / sh;
  if (Math.abs(sourceAspect - targetAspect) < 0.0001) {
    return { x: 0, y: 0, w: sw, h: sh };
  }
  if (targetAspect > sourceAspect) {
    const h = sw / targetAspect;
    return { x: 0, y: (sh - h) / 2, w: sw, h };
  }
  const w = sh * targetAspect;
  return { x: (sw - w) / 2, y: 0, w, h: sh };
}

function renderCardCanvas(cfg, W, H, templateKey, targetAspect = null) {
  const { title, tagline, description, website, handle, showIcon, isHQ, iconStyle, layout, fontPair, showDivider, showWatermark } = cfg;
  const t = resolveTheme(cfg);
  const fp = FONT_PAIRS[fontPair];
  const metrics = getTemplateMetrics(templateKey);
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
  const frame = getAspectRect(W, H, targetAspect);
  const padX = frame.x + frame.w * metrics.padX;
  const padY = frame.y + frame.h * metrics.padY;
  const contentW = isSplit ? frame.w * 0.52 : frame.w * 0.84;
  const iconSz = Math.min(frame.h * 0.38, frame.w * 0.12);
  const startX = isCentered ? frame.x + frame.w / 2 : padX;
  const baseSizes = getTypographySizes(frame.h, frame.w, metrics, false);

  const estimateHeight = (sizes) => {
    let total = 0;

    ctx.font = `900 ${sizes.title}px ${fp.title}`;
    total += getWrappedLines(ctx, title, contentW).length * sizes.title * 1.2;
    total += sizes.title * 0.3;

    if (showDivider) {
      const dh = Math.max(2, H * 0.006);
      total += dh + sizes.title * 0.5;
    }

    if (tagline) {
      ctx.font = `italic ${sizes.tag}px ${fp.body}`;
      total += getWrappedLines(ctx, tagline, contentW).length * sizes.tag * 1.5;
      total += sizes.tag * 0.5;
    }

    if (description) {
      ctx.font = `${sizes.desc}px ${fp.body}`;
      total += getWrappedLines(ctx, description, contentW).length * sizes.desc * 1.6;
      total += sizes.desc * 0.5;
    }

    const metaItems = [website, handle].filter(Boolean);
    if (metaItems.length) {
      total += sizes.meta * 0.4;
      total += metaItems.length * sizes.meta * 1.8;
    }

    return total;
  };

  let fitScale = 1;
  let typeSizes = baseSizes;
  const startY = isCentered ? (showIcon ? padY + iconSz + frame.h * 0.06 : frame.y + frame.h * 0.25) : frame.y + frame.h / 2 - frame.h * 0.22;
  const maxY = frame.y + frame.h * 0.93;
  for (let i = 0; i < 12; i += 1) {
    const estimated = estimateHeight(typeSizes);
    if (startY + estimated <= maxY || fitScale <= 0.72) {
      break;
    }
    fitScale *= 0.94;
    typeSizes = {
      title: baseSizes.title * fitScale,
      tag: baseSizes.tag * fitScale,
      desc: baseSizes.desc * fitScale,
      meta: baseSizes.meta * fitScale,
    };
  }

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
    iconEndX = isCentered ? frame.x + frame.w / 2 : ix + iconSz + frame.w * 0.03;
  }

  const tx = isCentered ? startX : showIcon && !isCentered ? iconEndX : padX;
  ctx.textAlign = isCentered ? "center" : "left";
  let curY = startY;

  const titleSz = typeSizes.title;
  ctx.font = `900 ${titleSz}px ${fp.title}`;
  ctx.fillStyle = t.text;
  curY += wrapText(ctx, title, tx, curY, contentW, titleSz * 1.2);
  curY += titleSz * 0.3;

  if (showDivider) {
    const dw = Math.min(56, frame.w * 0.05);
    const dh = Math.max(2, frame.h * 0.006);
    ctx.fillStyle = t.accent;
    ctx.fillRect(isCentered ? frame.x + frame.w / 2 - dw / 2 : tx, curY, dw, dh);
    curY += dh + titleSz * 0.5;
  }

  if (tagline) {
    const tagSz = typeSizes.tag;
    ctx.font = `italic ${tagSz}px ${fp.body}`;
    ctx.fillStyle = t.sub;
    curY += wrapText(ctx, tagline, tx, curY, contentW, tagSz * 1.5);
    curY += tagSz * 0.5;
  }

  if (description) {
    const descSz = typeSizes.desc;
    ctx.font = `${descSz}px ${fp.body}`;
    ctx.fillStyle = t.muted;
    curY += wrapText(ctx, description, tx, curY, contentW, descSz * 1.6);
    curY += descSz * 0.5;
  }

  const metaSz = typeSizes.meta;
  ctx.font = `500 ${metaSz}px ${fp.tag}`;
  ctx.fillStyle = t.muted;
  const metaItems = [website, handle].filter(Boolean);
  if (metaItems.length) {
    curY += metaSz * 0.4;
    metaItems.forEach((m, i) => {
      const my = curY + i * metaSz * 1.8;
      const dotR = metaSz * 0.22;
      const dotX = isCentered ? frame.x + frame.w / 2 - ctx.measureText(m).width / 2 - dotR * 3 : tx;
      ctx.beginPath();
      ctx.arc(dotX + dotR, my - dotR, dotR, 0, Math.PI * 2);
      ctx.fillStyle = t.accent;
      ctx.fill();
      ctx.fillStyle = t.muted;
      ctx.fillText(m, dotX + dotR * 3.5, my);
    });
  }

  if (isSplit && showIcon) {
    const rix = frame.x + frame.w * 0.62;
    const riy = frame.y + frame.h / 2 - iconSz * 0.7;
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

  return c;
}

function getCropRect(sw, sh, targetW, targetH) {
  const sourceAspect = sw / sh;
  const targetAspect = targetW / targetH;
  if (Math.abs(sourceAspect - targetAspect) < 0.0001) {
    return { sx: 0, sy: 0, cw: sw, ch: sh };
  }
  if (targetAspect > sourceAspect) {
    const ch = sw / targetAspect;
    return { sx: 0, sy: (sh - ch) / 2, cw: sw, ch };
  }
  const cw = sh * targetAspect;
  return { sx: (sw - cw) / 2, sy: 0, cw, ch: sh };
}

function renderToCanvas(cfg) {
  const target = PLATFORMS[cfg.plat];
  const designSurface = DESIGN_SURFACES[cfg.template] || DESIGN_SURFACES.horizontal;
  const baseCrop = getCropRect(designSurface.w, designSurface.h, target.w, target.h);
  const scale = Math.max(target.w / baseCrop.cw, target.h / baseCrop.ch, 1);
  const baseW = Math.round(designSurface.w * scale);
  const baseH = Math.round(designSurface.h * scale);
  const source = renderCardCanvas(cfg, baseW, baseH, cfg.template, target.w / target.h);
  const crop = getCropRect(baseW, baseH, target.w, target.h);
  const out = document.createElement("canvas");
  out.width = target.w;
  out.height = target.h;
  const ctx = out.getContext("2d");
  ctx.drawImage(source, crop.sx, crop.sy, crop.cw, crop.ch, 0, 0, target.w, target.h);
  return out.toDataURL("image/png");
}

function renderPreviewCanvas(cfg) {
  const designSurface = DESIGN_SURFACES[cfg.template] || DESIGN_SURFACES.horizontal;
  const target = PLATFORMS[cfg.plat];
  return renderCardCanvas(cfg, designSurface.w, designSurface.h, cfg.template, target.w / target.h);
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
  const { plat } = cfg;
  const target = PLATFORMS[plat];
  const designSurface = DESIGN_SURFACES[cfg.template] || DESIGN_SURFACES.horizontal;
  const sz = designSurface;
  const template = cfg.template;
  const maxBox = template === "vertical" ? { w: 420, h: 760 } : template === "square" ? { w: 640, h: 640 } : { w: 980, h: 430 };
  const scale = Math.min(maxBox.w / sz.w, maxBox.h / sz.h, 1);
  const dw = sz.w * scale;
  const dh = sz.h * scale;
  const previewUrl = useMemo(() => renderPreviewCanvas(cfg).toDataURL("image/png"), [cfg]);
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
    <div style={{ width: dw, height: dh, borderRadius: 14, position: "relative", overflow: "hidden", boxShadow: "0 24px 90px rgba(0,0,0,0.45)", flexShrink: 0 }}>
      <img
        src={previewUrl}
        alt="Design preview"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 14,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
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
              fontFamily: "Inter,sans-serif",
              fontSize: 10,
              letterSpacing: "0.03em",
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
    </div>
  );
}

function Section({ title, icon: Icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`section ${open ? "section-open" : ""}`}>
      <button type="button" className="section-title" onClick={() => setOpen((v) => !v)}>
        <span className="section-title-left">
          {Icon ? <Icon size={13} /> : null}
          <span>{title}</span>
        </span>
        <ChevronDown size={14} className={`section-chevron ${open ? "section-chevron-open" : ""}`} />
      </button>
      {open ? <div className="section-body">{children}</div> : null}
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
      return raw ? normalizeCfg(JSON.parse(raw)) : DEFAULT_CFG;
    } catch {
      return DEFAULT_CFG;
    }
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef(null);
  const themeNow = useMemo(() => resolveTheme(cfg), [cfg]);
  const appThemeNow = useMemo(() => resolveUiTheme(cfg), [cfg]);
  const uiVars = useMemo(() => {
    const isLightApp = cfg.appTheme === "light";
    const bg = appThemeNow.bg || "#0d1f1c";
    const bg2 = appThemeNow.bg2 || mixHex(bg, "#000000", 0.24);
    const accent = appThemeNow.accent || "#4db896";
    const accentDark = appThemeNow.accentDark || mixHex(accent, "#000000", 0.2);
    const text = appThemeNow.text || "#e9f1ee";
    const sub = appThemeNow.sub || text;
    const panelBg = isLightApp ? withAlpha("#FFFFFF", 0.84) : withAlpha(bg, 0.68);
    const panelBgSoft = isLightApp ? withAlpha("#FFFFFF", 0.72) : withAlpha(bg, 0.52);
    const surface = isLightApp ? withAlpha("#FFFFFF", 0.9) : withAlpha(mixHex(bg, "#ffffff", 0.08), 0.72);
    const border = isLightApp ? "rgba(15,23,42,0.14)" : withAlpha(accent, 0.28);
    const borderSoft = isLightApp ? "rgba(15,23,42,0.1)" : withAlpha(accent, 0.18);
    const chipBg = isLightApp ? "rgba(255,255,255,0.86)" : withAlpha("#ffffff", 0.04);
    const inputBg = isLightApp ? "rgba(255,255,255,0.95)" : withAlpha("#ffffff", 0.05);
    const shadow = isLightApp ? "rgba(15,23,42,0.14)" : withAlpha("#000000", 0.34);
    return {
      "--app-bg-gradient": isLightApp
        ? `linear-gradient(180deg, ${bg} 0%, ${bg2} 100%)`
        : `radial-gradient(circle at 20% 0%, ${mixHex(bg, accentDark, 0.35)} 0%, ${bg} 42%, ${bg2} 100%)`,
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
  }, [appThemeNow, cfg.appTheme]);

  const set = useCallback((k, v) => setCfg((p) => ({ ...p, [k]: v })), []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  }, [cfg]);

  const pickPlatform = useCallback((template, assetType, fallback) => {
    const entries = Object.entries(PLATFORMS);
    return (
      entries.find(([, v]) => v.template === template && v.assetType === assetType)?.[0] ||
      entries.find(([, v]) => v.assetType === assetType)?.[0] ||
      entries.find(([, v]) => v.template === template)?.[0] ||
      fallback ||
      DEFAULT_CFG.plat
    );
  }, []);

  const platformOptions = useMemo(() => {
    const exact = Object.entries(PLATFORMS).filter(([, v]) => v.template === cfg.template && v.assetType === cfg.assetType);
    const fallback = Object.entries(PLATFORMS).filter(([, v]) => v.template === cfg.template);
    const source = exact.length ? exact : fallback;
    return source
      .map(([k, v]) => ({ value: k, label: v.label }));
  }, [cfg.template, cfg.assetType]);

  const setTemplate = useCallback((template) => {
    setCfg((p) => {
      const plat = pickPlatform(template, p.assetType, p.plat);
      return { ...p, template, plat, assetType: PLATFORMS[plat].assetType };
    });
  }, [pickPlatform]);

  const setAssetType = useCallback((assetType) => {
    setCfg((p) => {
      const plat = pickPlatform(p.template, assetType, p.plat);
      return { ...p, assetType, plat, template: PLATFORMS[plat].template };
    });
  }, [pickPlatform]);

  const setPlatform = useCallback((plat) => {
    setCfg((p) => ({ ...p, plat, template: PLATFORMS[plat].template, assetType: PLATFORMS[plat].assetType }));
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

  const applyQuickTemplate = useCallback((templateKey) => {
    const preset = QUICK_TEMPLATES[templateKey];
    if (!preset) return;
    setCfg((p) => normalizeCfg({ ...p, ...preset.cfg }));
    setMessage(`Template applied: ${preset.label}`);
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
        setCfg(normalizeCfg(parsed));
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
    <div className={`app-root ${sidebarCollapsed ? "app-root-sidebar-collapsed" : ""}`} style={uiVars}>
      <aside className={`sidebar ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="sidebar-toggle-row">
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {sidebarCollapsed ? (
          <div className="collapsed-brand">
            <AppFlowerLogo size={38} />
          </div>
        ) : (
          <>
            <div className="brand">
              <div className="brand-mark">
                <AppFlowerLogo size={54} />
              </div>
              <div className="brand-title">Kaso</div>
              <div className="brand-subtitle">Flower - Branding & Design Module</div>
              <div className="theme-picker-inline">
                <Palette size={13} />
                <label htmlFor="themeSelect">App Theme</label>
                <select id="themeSelect" value={cfg.appTheme} onChange={(e) => setAppThemeKey(e.target.value)}>
                  {Object.entries(APP_THEMES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Section title="Content" icon={Type} defaultOpen>
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

            <Section title="Look & Feel" icon={Palette}>
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

            <Section title="Quick Templates" icon={LayoutTemplate}>
              <div className="quick-template-grid">
                {Object.entries(QUICK_TEMPLATES).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    className="quick-template-btn"
                    onClick={() => applyQuickTemplate(key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Icon & Details" icon={SlidersHorizontal}>
          <Toggle label="Show icon" value={cfg.showIcon} onChange={(v) => set("showIcon", v)} />
          <Toggle label="HQ version" value={cfg.isHQ} onChange={(v) => set("isHQ", v)} />
          {cfg.showIcon && <ToggleGroup value={cfg.iconStyle} onChange={(v) => set("iconStyle", v)} options={Object.entries(ICON_STYLES).map(([k, v]) => ({ value: k, label: v.label }))} />}
          <Toggle label="Divider line" value={cfg.showDivider} onChange={(v) => set("showDivider", v)} />
          <Toggle label="Watermark" value={cfg.showWatermark} onChange={(v) => set("showWatermark", v)} />
            </Section>

            <div className="action-row">
              <button type="button" onClick={resetAll} className="ghost-btn">
                <RotateCcw size={13} />
                Reset
              </button>
              <button type="button" onClick={exportPreset} className="ghost-btn">
                <Save size={13} />
                Export
              </button>
              <button type="button" onClick={() => fileRef.current?.click()} className="ghost-btn">
                <ImportIcon size={13} />
                Import
              </button>
              <input ref={fileRef} className="hidden-file" type="file" accept="application/json" onChange={importPreset} />
            </div>

            <button type="button" onClick={download} disabled={downloading} className="download-btn">
              <Download size={13} />
              {downloading ? "Saving..." : "Download PNG"}
            </button>
          </>
        )}
      </aside>

      <main className="workspace">
        <div className="workspace-shell">
          <div className="workspace-toolbar">
            <div className="toolbar-group">
              <span className="toolbar-label">
                <ImageIcon size={12} />
                Asset Type
              </span>
              <ToggleGroup value={cfg.assetType} onChange={setAssetType} options={Object.entries(ASSET_TYPES).map(([k, v]) => ({ value: k, label: v.label }))} />
            </div>
            <div className="toolbar-group">
              <span className="toolbar-label">
                <LayoutTemplate size={12} />
                Template
              </span>
              <ToggleGroup value={cfg.template} onChange={setTemplate} options={Object.entries(TEMPLATES).map(([k, v]) => ({ value: k, label: v.label }))} />
            </div>
            <div className="toolbar-group">
              <span className="toolbar-label">
                <SlidersHorizontal size={12} />
                Platform
              </span>
              <ToggleGroup value={cfg.plat} onChange={setPlatform} options={platformOptions} />
            </div>
            <div className="toolbar-group">
              <span className="toolbar-label">
                <Type size={12} />
                Design Font
              </span>
              <select className="toolbar-select" value={cfg.fontPair} onChange={(e) => set("fontPair", e.target.value)}>
                {Object.entries(FONT_PAIRS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="preview-stage">
            <PreviewCard cfg={cfg} />
          </div>

          <div className="workspace-actions">
            <button type="button" onClick={download} disabled={downloading} className="download-under-btn">
              <Download size={14} />
              {downloading ? "Saving..." : "Download This Design"}
            </button>
          </div>

          <div className="workspace-meta">
            <span>{ASSET_TYPES[cfg.assetType]?.label || "Asset"}</span>
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
