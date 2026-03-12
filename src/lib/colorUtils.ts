export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorRecommendation {
  type: 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'monochromatic';
  name: string;
  colors: string[];
}

export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function hexToHsl(hex: string): HSL {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

export function getComplementaryColor(hex: string): string {
  const hsl = hexToHsl(hex);
  const complementaryHue = (hsl.h + 180) % 360;
  return hslToHex(complementaryHue, hsl.s, hsl.l);
}

export function getAnalogousColors(hex: string, count: number = 2): string[] {
  const hsl = hexToHsl(hex);
  const step = 30;
  const colors: string[] = [];
  
  for (let i = 1; i <= count; i++) {
    const hue1 = (hsl.h - step * i + 360) % 360;
    const hue2 = (hsl.h + step * i) % 360;
    colors.push(hslToHex(hue1, hsl.s, hsl.l));
    colors.push(hslToHex(hue2, hsl.s, hsl.l));
  }
  
  return colors;
}

export function getTriadicColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  const hue1 = (hsl.h + 120) % 360;
  const hue2 = (hsl.h + 240) % 360;
  return [
    hslToHex(hue1, hsl.s, hsl.l),
    hslToHex(hue2, hsl.s, hsl.l),
  ];
}

export function getSplitComplementaryColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  const complementary = (hsl.h + 180) % 360;
  const hue1 = (complementary - 30 + 360) % 360;
  const hue2 = (complementary + 30) % 360;
  return [
    hslToHex(hue1, hsl.s, hsl.l),
    hslToHex(hue2, hsl.s, hsl.l),
  ];
}

export function getMonochromaticColors(hex: string, count: number = 4): string[] {
  const hsl = hexToHsl(hex);
  const colors: string[] = [];
  const lightnessStep = 20;
  const startLightness = Math.max(10, hsl.l - lightnessStep * Math.floor(count / 2));
  
  for (let i = 0; i < count; i++) {
    const lightness = Math.min(90, startLightness + lightnessStep * i);
    colors.push(hslToHex(hsl.h, hsl.s, lightness));
  }
  
  return colors;
}

export function getAllColorRecommendations(hex: string): ColorRecommendation[] {
  const recommendations: ColorRecommendation[] = [];
  
  recommendations.push({
    type: 'complementary',
    name: '互补色',
    colors: [getComplementaryColor(hex)],
  });
  
  recommendations.push({
    type: 'analogous',
    name: '类似色',
    colors: getAnalogousColors(hex, 1),
  });
  
  recommendations.push({
    type: 'triadic',
    name: '三角色',
    colors: getTriadicColors(hex),
  });
  
  recommendations.push({
    type: 'split-complementary',
    name: '分裂互补色',
    colors: getSplitComplementaryColors(hex),
  });
  
  recommendations.push({
    type: 'monochromatic',
    name: '单色渐变',
    colors: getMonochromaticColors(hex, 3),
  });
  
  return recommendations;
}

export function getRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return rgbToHex(r, g, b);
}
