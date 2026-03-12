'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ColorWheel } from './ColorWheel';
import {
  getAllColorRecommendations,
  type ColorRecommendation,
  getRandomColor,
} from '@/lib/colorUtils';
import { Palette, Sparkles, Layers, Check, RefreshCw } from 'lucide-react';

interface ColorSelectorProps {
  colors: string[];
  setColors: (colors: string[]) => void;
}

type SelectionMode = 'free' | 'recommended';

export function ColorSelector({ colors, setColors }: ColorSelectorProps) {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [selectedColor1, setSelectedColor1] = useState(colors[0] || '#5135FF');
  const [selectedColor2, setSelectedColor2] = useState(colors[1] || '#FF5828');
  const [recommendations, setRecommendations] = useState<ColorRecommendation[]>([]);
  const [selectedRecommendationType, setSelectedRecommendationType] = useState<string | null>(null);

  const handleGenerateRecommendations = () => {
    const recs = getAllColorRecommendations(selectedColor1);
    setRecommendations(recs);
  };

  const handleApplyColors = (color1: string, color2: string) => {
    // Always maintain two colors for the gradient for the color wheel
    setColors([color1, color2]);
  };

  const handleApplyRecommendation = (rec: ColorRecommendation) => {
    setSelectedRecommendationType(rec.type);
    // For recommendations, we take the primary selected color and the first recommended color
    // If there are more colors in the recommendation, we use them too.
    const newColors = [selectedColor1, ...rec.colors];
    setColors(newColors);
    if (rec.colors.length > 0) {
      setSelectedColor2(rec.colors[0]);
    } else {
      // Fallback if recommendation doesn't provide additional colors
      setSelectedColor2(selectedColor1);
    }
  };

  const handleRandomize = () => {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    setSelectedColor1(color1);
    setSelectedColor2(color2);
    handleApplyColors(color1, color2);
    if (mode === 'recommended') {
      const recs = getAllColorRecommendations(color1);
      setRecommendations(recs);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg">色彩选择</h2>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={mode === 'free' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('free')}
          className="flex-1"
        >
          <Layers className="w-4 h-4 mr-2" />
          自由选择
        </Button>
        <Button
          variant={mode === 'recommended' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setMode('recommended');
            if (recommendations.length === 0) {
              handleGenerateRecommendations();
            }
          }}
          className="flex-1"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          推荐选择
        </Button>
      </div>

      <div className="flex justify-center">
        <ColorWheel
          color1={selectedColor1}
          color2={selectedColor2}
          onColor1Change={(color) => {
            setSelectedColor1(color);
            handleApplyColors(color, selectedColor2);
            if (mode === 'recommended') {
              const recs = getAllColorRecommendations(color);
              setRecommendations(recs);
            }
          }}
          onColor2Change={(color) => {
            setSelectedColor2(color);
            handleApplyColors(selectedColor1, color);
          }}
          size={320} // Use the larger size here
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleRandomize}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          随机颜色
        </Button>
      </div>

      {mode === 'recommended' && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-muted-foreground">推荐配色方案</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateRecommendations}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid gap-3">
            {recommendations.map((rec) => (
              <button
                key={rec.type}
                onClick={() => handleApplyRecommendation(rec)}
                className={`p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                  selectedRecommendationType === rec.type
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{rec.name}</span>
                  {selectedRecommendationType === rec.type && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex gap-2">
                  <div
                    className="flex-1 h-8 rounded-lg border border-border"
                    style={{ backgroundColor: selectedColor1 }}
                  />
                  {rec.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-8 rounded-lg border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'free' && (
        <div className="pt-2">
          <div 
            className="w-full h-16 rounded-xl border border-border overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${selectedColor1}, ${selectedColor2})`,
            }}
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            拖动色轮上的标记选择两种颜色
          </p>
        </div>
      )}
    </div>
  );
}