import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Ruler, CheckCircle } from 'lucide-react';

interface CalculationResult {
  labelWidth: number;
  labelHeight: number;
  labelsPerRow: number;
  labelsPerColumn: number;
  labelsPerSheet: number;
  totalLabels: number;
  requiredSheets: number;
  totalMeters: number;
  wastePercentage: number;
  efficiency: number;
}

interface MeterCalculatorProps {
  onCalculationComplete: (meters: number) => void;
  className?: string;
}

const SHEET_WIDTH = 57; // cm
const SHEET_HEIGHT = 100; // cm (1 meter)

export function MeterCalculator({ onCalculationComplete, className }: MeterCalculatorProps) {
  const [labelWidth, setLabelWidth] = useState<number>(4);
  const [labelHeight, setLabelHeight] = useState<number>(4);
  const [totalLabels, setTotalLabels] = useState<number>(100);
  const [spacing, setSpacing] = useState<number>(0.2);
  const [printMargin, setPrintMargin] = useState<number>(0.5);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);

  // Predefined label sizes
  const commonSizes = [
    { name: '2x2 cm', width: 2, height: 2 },
    { name: '3x3 cm', width: 3, height: 3 },
    { name: '4x4 cm', width: 4, height: 4 },
    { name: '5x5 cm', width: 5, height: 5 },
    { name: '6x6 cm', width: 6, height: 6 },
    { name: '8x8 cm', width: 8, height: 8 },
  ];

  const calculateMeters = () => {
    if (!labelWidth || !labelHeight || !totalLabels) return;

    // Calculate effective printing area (minus margins)
    const effectiveWidth = SHEET_WIDTH - 2 * printMargin;
    const effectiveHeight = SHEET_HEIGHT - 2 * printMargin;

    // Calculate how many labels fit per row and column
    const labelsPerRow = Math.floor(effectiveWidth / (labelWidth + spacing));
    const labelsPerColumn = Math.floor(effectiveHeight / (labelHeight + spacing));
    const labelsPerSheet = labelsPerRow * labelsPerColumn;

    // Calculate required sheets and meters
    const requiredSheets = Math.ceil(totalLabels / labelsPerSheet);
    const totalMeters = requiredSheets;

    // Calculate efficiency
    const usedLabels = Math.min(totalLabels, labelsPerSheet * requiredSheets);
    const totalPossibleLabels = labelsPerSheet * requiredSheets;
    const efficiency = (usedLabels / totalPossibleLabels) * 100;
    const wastePercentage = 100 - efficiency;

    const result: CalculationResult = {
      labelWidth,
      labelHeight,
      labelsPerRow,
      labelsPerColumn,
      labelsPerSheet,
      totalLabels,
      requiredSheets,
      totalMeters,
      wastePercentage,
      efficiency,
    };

    setCalculation(result);
    onCalculationComplete(result.totalMeters);
  };

  const handlePresetSize = (size: (typeof commonSizes)[0]) => {
    setLabelWidth(size.width);
    setLabelHeight(size.height);
  };

  // Auto-calculate when values change
  useEffect(() => {
    if (labelWidth && labelHeight && totalLabels) {
      calculateMeters();
    }
  }, [labelWidth, labelHeight, totalLabels, spacing, printMargin]);

  return (
    <div className={`bg-blue-50 rounded-lg p-4 space-y-4 ${className}`}>
      <div className="flex items-center mb-3">
        <Calculator className="w-5 h-5 mr-2 text-blue-600" />
        <h4 className="font-semibold text-gray-800">Metretül Hesaplayıcı</h4>
      </div>

      {/* Preset Sizes */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Hazır Boyutlar</Label>
        <div className="grid grid-cols-3 gap-2">
          {commonSizes.map((size, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handlePresetSize(size)}
              className="text-xs h-8"
            >
              {size.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Dimensions */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-1 block">Genişlik (cm)</Label>
          <Input
            type="number"
            min="1"
            max="50"
            step="0.1"
            value={labelWidth}
            onChange={(e) => setLabelWidth(parseFloat(e.target.value) || 0)}
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-1 block">Yükseklik (cm)</Label>
          <Input
            type="number"
            min="1"
            max="95"
            step="0.1"
            value={labelHeight}
            onChange={(e) => setLabelHeight(parseFloat(e.target.value) || 0)}
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-1 block">Adet</Label>
          <Input
            type="number"
            min="1"
            value={totalLabels}
            onChange={(e) => setTotalLabels(parseInt(e.target.value) || 0)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* Calculation Results */}
      {calculation && (
        <div className="bg-white rounded-lg p-3 space-y-2 border">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Satır başına:</span>
              <span className="font-medium">{calculation.labelsPerRow}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sütun başına:</span>
              <span className="font-medium">{calculation.labelsPerColumn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Metre başına:</span>
              <span className="font-medium">{calculation.labelsPerSheet}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Toplam metre:</span>
              <span className="font-medium text-blue-600">{calculation.totalMeters}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <Badge
              variant={calculation.efficiency > 80 ? 'default' : 'secondary'}
              className="text-xs"
            >
              %{calculation.efficiency.toFixed(1)} Verimlilik
            </Badge>
            {calculation.efficiency > 80 && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
        </div>
      )}
    </div>
  );
}
