'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, ArrowLeft, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductScreenshotPage() {
  return <ProductFrame />;
}

const gradientPresets = {
  'Modern & Professional': [
    { colors: ['#4A90E2', '#5CB3FF'], name: 'Corporate Blue' },
    { colors: ['#FFFFFF', '#F5F7FA'], name: 'Clean White' },
    { colors: ['#2C3E50', '#3498DB'], name: 'Deep Ocean' },
    { colors: ['#ECE9E6', '#FFFFFF'], name: 'Soft Paper' },
  ],
  'Subtle & Neutral': [
    { colors: ['#E0EAFC', '#CFDEF3'], name: 'Gentle Sky' },
    { colors: ['#F5F7FA', '#E4E7EB'], name: 'Light Gray' },
    { colors: ['#DFE3E8', '#F0F4F8'], name: 'Cool Gray' },
    { colors: ['#FFF9F4', '#FFE4E1'], name: 'Warm White' },
  ],
  'Vibrant & Bold': [
    { colors: ['#FF416C', '#FF4B2B'], name: 'Sunset Red' },
    { colors: ['#7F7FD5', '#86A8E7'], name: 'Lavender Blue' },
    { colors: ['#00B4DB', '#0083B0'], name: 'Azure' },
    { colors: ['#02AAB0', '#00CDAC'], name: 'Emerald' },
    { colors: ['#FF8008', '#FFA034'], name: 'Warm Orange' },
    { colors: ['#FF0844', '#FFB199'], name: 'Coral Red' },
    { colors: ['#4B0082', '#8A2BE2'], name: 'Royal Indigo' },
    { colors: ['#2563EB', '#60A5FA'], name: 'Electric Blue' },
  ],
  Pastels: [
    { colors: ['#FFE5F1', '#FFC8DD'], name: 'Soft Pink' },
    { colors: ['#E0F4FF', '#C8E9FF'], name: 'Baby Blue' },
    { colors: ['#E6FFE6', '#C8F2C8'], name: 'Mint' },
    { colors: ['#FFF3E6', '#FFE5CC'], name: 'Peach' },
  ],
  'Dark Themes': [
    { colors: ['#1A1A1A', '#434343'], name: 'Charcoal' },
    { colors: ['#2C3E50', '#1A1A1A'], name: 'Night Blue' },
    { colors: ['#434343', '#000000'], name: 'Dark Gray' },
    { colors: ['#20202C', '#515151'], name: 'Slate' },
  ],
};

const ControlGroup = ({ title, children }) => (
  <div className="space-y-2 p-4 bg-gray-800 rounded-lg">
    <h3 className="font-medium text-gray-300">{title}</h3>
    {children}
  </div>
);

const ProductFrame = () => {
  const [image, setImage] = useState<string | null>(null);
  const [padding, setPadding] = useState(100);
  const [outerRadius, setOuterRadius] = useState(24);
  const [innerRadius, setInnerRadius] = useState(24);
  const [inset, setInset] = useState(16);
  const [insetColor, setInsetColor] = useState('#000000');
  const [insetOpacity, setInsetOpacity] = useState(50);
  const [shadow, setShadow] = useState(10);
  const [backgroundType, setBackgroundType] = useState('gradient');
  const [gradientStart, setGradientStart] = useState(
    gradientPresets['Modern & Professional'][0].colors[0]
  );
  const [gradientEnd, setGradientEnd] = useState(
    gradientPresets['Modern & Professional'][0].colors[1]
  );
  const [useGradient, setUseGradient] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [frameOpacity, setFrameOpacity] = useState(100);
  const [frameColor, setFrameColor] = useState('#000000');
  const [frameSize, setFrameSize] = useState(16);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          setImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getBackgroundStyle = () => {
    if (backgroundType === 'gradient') {
      return {
        background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
      };
    }
    return {
      backgroundColor,
    };
  };

  const handleExport = () => {
    if (!image) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const totalWidth = img.width + padding * 2;
      const totalHeight = img.height + padding * 2;

      canvas.width = totalWidth;
      canvas.height = totalHeight;

      // Draw background
      ctx.fillStyle =
        backgroundType === 'gradient'
          ? createGradient(ctx, totalWidth, totalHeight)
          : backgroundColor;

      // Draw rounded rectangle background
      ctx.beginPath();
      ctx.roundRect(0, 0, totalWidth, totalHeight, outerRadius);
      ctx.fill();

      // Draw the image with inner radius
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(padding, padding, img.width, img.height, innerRadius);
      ctx.clip();
      ctx.drawImage(img, padding, padding, img.width, img.height);
      ctx.restore();

      // Draw inset if enabled
      if (inset > 0) {
        ctx.strokeStyle =
          insetColor +
          Math.round(insetOpacity * 2.55)
            .toString(16)
            .padStart(2, '0');
        ctx.lineWidth = inset;
        ctx.beginPath();
        ctx.roundRect(padding, padding, img.width, img.height, innerRadius);
        ctx.stroke();
      }

      // Create download link
      const link = document.createElement('a');
      link.download = 'framed-screenshot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  const createGradient = (ctx, width, height) => {
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, gradientStart);
    gradient.addColorStop(1, gradientEnd);
    return gradient;
  };

  return (
    <div className="flex fixed w-full inset-0 bg-gray-950">
      <Link
        href="/tools"
        className="absolute text-white top-4 left-4 flex items-center gap-1"
      >
        <ChevronLeft className="size-4 text-gray-400" />
        Go Back
      </Link>
      {/* Main Content Area */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div
          className="relative"
          style={{
            padding: `${padding}px`,
            // borderRadius: `${outerRadius}px`,
            ...getBackgroundStyle(),
          }}
        >
          {!image ? (
            <button
              className="min-h-[200px] bg-white aspect-square w-full flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-gray-400" />
            </button>
          ) : (
            <div
              style={{
                borderRadius: `${innerRadius - 8}px`,
                boxShadow:
                  shadow > 0
                    ? `0 ${shadow}px ${shadow * 2}px rgba(0,0,0,${
                        shadow * 0.02
                      })`
                    : 'none',
                padding: `${frameSize}px`,
                background:
                  frameColor +
                  Math.round(frameOpacity).toString(16).padStart(2, '0'),
                overflow: 'hidden',
              }}
            >
              <img
                src={image}
                alt="Preview"
                className="w-full h-auto"
                style={{
                  display: 'block',
                  borderRadius: `${16}px`,
                }}
              />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* Controls Sidebar */}
      <div className="w-80 bg-gray-900 border-l border-gray-800 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Upload & Export Buttons */}
          <ControlGroup title="Image">
            <div className="flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md border"
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              {image && (
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              )}
            </div>
          </ControlGroup>

          {/* Background Controls */}
          <ControlGroup title="Background">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={gradientStart}
                  onChange={(e) => setGradientStart(e.target.value)}
                  className="w-1/2 h-10 rounded cursor-pointer"
                />
                <input
                  type="color"
                  value={gradientEnd}
                  onChange={(e) => setGradientEnd(e.target.value)}
                  className="w-1/2 h-10 rounded cursor-pointer"
                />
              </div>

              {Object.entries(gradientPresets).map(([groupName, presets]) => (
                <div key={groupName} className="space-y-2">
                  <label className="block text-xs text-gray-500">
                    {groupName}
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {presets.map((preset, index) => (
                      <button
                        key={index}
                        className="w-full aspect-square border rounded-lg hover:ring-2 hover:ring-blue-500 transition-all"
                        style={{
                          background: `linear-gradient(to right, ${preset.colors[0]}, ${preset.colors[1]})`,
                        }}
                        onClick={() => {
                          setGradientStart(preset.colors[0]);
                          setGradientEnd(preset.colors[1]);
                        }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ControlGroup>

          {/* Size Controls */}
          <ControlGroup title="Dimensions">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Padding
                </label>
                <p className="text-xs text-gray-500">({padding}px padding)</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Rounded corners
                </label>
                <p className="text-xs text-gray-500">
                  ({innerRadius}px inner, {outerRadius}px outer)
                </p>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={innerRadius}
                  onChange={(e) => {
                    setInnerRadius(Number(e.target.value));
                    setOuterRadius(Number(e.target.value));
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Shadow
                </label>
                <p className="text-xs text-gray-500">
                  ({shadow}px blur, {shadow * 2}px spread)
                </p>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={shadow}
                  onChange={(e) => setShadow(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </ControlGroup>

          {/* Frame Controls */}
          <ControlGroup title="Frame">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Frame Size
                </label>
                <p className="text-xs text-gray-500">({frameSize}px padding)</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={frameSize}
                  onChange={(e) => setFrameSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Frame Color
                </label>
                <p className="text-xs text-gray-500">
                  (Hex color code, e.g. #000000)
                </p>
                <input
                  type="color"
                  value={frameColor}
                  onChange={(e) => setFrameColor(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Frame Opacity
                </label>
                <p className="text-xs text-gray-500">
                  ({Math.round(frameOpacity / 2.55)}% opacity)
                </p>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={frameOpacity}
                  onChange={(e) => setFrameOpacity(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </ControlGroup>
        </div>
      </div>
    </div>
  );
};
