// lib/app-store-assets/config.ts

// --- Gradient Presets ---
export const gradientPresets = {
  'Modern & Professional': [
    { colors: ['#4A90E2', '#5CB3FF'], name: 'Corporate Blue' },
    { colors: ['#FFFFFF', '#F5F7FA'], name: 'Clean White' },
    { colors: ['#2C3E50', '#3498DB'], name: 'Deep Ocean' },
    { colors: ['#ECE9E6', '#FFFFFF'], name: 'Soft Paper' },
  ],
  'Vibrant & Bold': [
    { colors: ['#FF416C', '#FF4B2B'], name: 'Sunset Red' },
    { colors: ['#7F7FD5', '#86A8E7'], name: 'Lavender Blue' },
    { colors: ['#00B4DB', '#0083B0'], name: 'Azure' },
    { colors: ['#4B0082', '#8A2BE2'], name: 'Royal Indigo' },
  ],
  'Dark Themes': [
    { colors: ['#1A1A1A', '#434343'], name: 'Charcoal' },
    { colors: ['#2C3E50', '#1A1A1A'], name: 'Night Blue' },
    { colors: ['#434343', '#000000'], name: 'Dark Gray' },
  ],
};

// --- Template Definitions ---
export type TemplateConfig = {
  name: string;
  backgroundType: 'color' | 'gradient' | 'none';
  defaultBackgroundColor?: string;
  defaultGradientStart?: string;
  defaultGradientEnd?: string;
  frame?: {
    color: string;
    thickness: number;
    outerRadius: number;
    innerRadius: number;
    outerPadding?: number;
  };
  padding?: number;
};

export const TEMPLATES: { [key: string]: TemplateConfig } = {
  simpleColor: {
    name: 'Simple Color Background',
    backgroundType: 'color',
    defaultBackgroundColor: '#FFFFFF',
    padding: 50,
  },
  simpleGradient: {
    name: 'Simple Gradient Background',
    backgroundType: 'gradient',
    defaultGradientStart: '#4A90E2',
    defaultGradientEnd: '#5CB3FF',
    padding: 50,
  },
  deviceFrameColor: {
    name: 'Device Frame (Color BG)',
    backgroundType: 'color',
    defaultBackgroundColor: '#B3E5FC',
    frame: {
      color: '#111827',
      thickness: 25,
      outerRadius: 40,
      innerRadius: 20,
      outerPadding: 50,
    },
  },
  deviceFrameGradient: {
    name: 'Device Frame (Gradient BG)',
    backgroundType: 'gradient',
    defaultGradientStart: '#2C3E50',
    defaultGradientEnd: '#1A1A1A',
    frame: {
      color: '#000000',
      thickness: 30,
      outerRadius: 45,
      innerRadius: 25,
      outerPadding: 60,
    },
  },
};

// --- Asset Dimensions ---
export const APP_ICON_SIZES = [1024, 180, 120, 167, 152];

export const SCREENSHOT_DIMENSIONS = {
  'iPhone 6.7" Super Retina XDR': { width: 1290, height: 2796 },
  'iPhone 6.9" Super Retina XDR': { width: 1320, height: 2868 },
  'iPhone 6.5" Super Retina': { width: 1242, height: 2688 },
  'iPhone 5.5" Retina': { width: 1242, height: 2208 },
  'iPad Pro 12.9" (6th Gen) Liquid Retina XDR': { width: 2048, height: 2732 },
};

export type ScreenshotDimensionValue = { width: number; height: number };
export type ScreenshotDimensions = { [key: string]: ScreenshotDimensionValue };
