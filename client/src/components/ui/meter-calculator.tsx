import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Ruler, Package, CheckCircle } from 'lucide-react';

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
  const [labelWidth, setLabelWidth] = useState<number>(10);
  const [labelHeight, setLabelHeight] = useState<number>(5);
  const [totalLabels, setTotalLabels] = useState<number>(100);
  const [spacing, setSpacing] = useState<number>(0.2);
  const [printMargin, setPrintMargin] = useState<number>(0.5);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  // Predefined label sizes
  const commonSizes = [
    { name: "Küçük Etiket", width: 5, height: 3 },
    { name: "Orta Etiket", width: 10, height: 5 },
    { name: "Büyük Etiket", width: 15, height: 8 },
    { name: "Dikdörtgen", width: 20, height: 10 },
    { name: "Kare", width: 8, height: 8 },
    { name: "Özel", width: 0, height: 0 }
  ];

  const calculateMeters = () => {
    if (!labelWidth || !labelHeight || !totalLabels) return;

    // Calculate effective printing area (minus margins)
    const effectiveWidth = SHEET_WIDTH - (2 * printMargin);
    const effectiveHeight = SHEET_HEIGHT - (2 * printMargin);

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
      efficiency
    };

    setCalculation(result);
    setIsCalculated(true);
  };

  const handleUseCalculation = () => {
    if (calculation) {
      onCalculationComplete(calculation.totalMeters);
    }
  };

  const handlePresetSize = (size: typeof commonSizes[0]) => {
    if (size.name === "Özel") return;
    setLabelWidth(size.width);
    setLabelHeight(size.height);
  };

  useEffect(() => {
    if (labelWidth && labelHeight && totalLabels) {
      calculateMeters();
    }
  }, [labelWidth, labelHeight, totalLabels, spacing, printMargin]);

  return (
    <Card className={className}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center text-lg">
          <Calculator className="w-5 h-5 mr-2 text-blue-600" />
          Metretül Hesaplama Aracı
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Preset Sizes */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Hazır Etiket Boyutları
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {commonSizes.map((size, index) => (
              <Button
                key={index}
                variant={size.name === "Özel" ? "outline" : "ghost"}
                size="sm"
                onClick={() => handlePresetSize(size)}
                className="text-left justify-start"
              >
                {size.name}
                {size.name !== "Özel" && (
                  <span className="ml-2 text-xs text-gray-500">
                    {size.width}x{size.height}cm
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="labelWidth" className="text-sm font-medium text-gray-700 mb-2 block">
              Etiket Genişliği (cm)
            </Label>
            <Input
              id="labelWidth"
              type="number"
              min="1"
              max="50"
              step="0.1"
              value={labelWidth}
              onChange={(e) => setLabelWidth(parseFloat(e.target.value) || 0)}
              placeholder="10"
            />
          </div>
          <div>
            <Label htmlFor="labelHeight" className="text-sm font-medium text-gray-700 mb-2 block">
              Etiket Yüksekliği (cm)
            </Label>
            <Input
              id="labelHeight"
              type="number"
              min="1"
              max="95"
              step="0.1"
              value={labelHeight}
              onChange={(e) => setLabelHeight(parseFloat(e.target.value) || 0)}
              placeholder="5"
            />
          </div>
        </div>

        {/* Total Labels */}
        <div>
          <Label htmlFor="totalLabels" className="text-sm font-medium text-gray-700 mb-2 block">
            Toplam Etiket Sayısı
          </Label>
          <Input
            id="totalLabels"
            type="number"
            min="1"
            value={totalLabels}
            onChange={(e) => setTotalLabels(parseInt(e.target.value) || 0)}
            placeholder="100"
          />
        </div>

        {/* Advanced Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="spacing" className="text-sm font-medium text-gray-700 mb-2 block">
              Etiket Arası Boşluk (cm)
            </Label>
            <Input
              id="spacing"
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={spacing}
              onChange={(e) => setSpacing(parseFloat(e.target.value) || 0)}
              placeholder="0.2"
            />
          </div>
          <div>
            <Label htmlFor="printMargin" className="text-sm font-medium text-gray-700 mb-2 block">
              Kenar Boşluğu (cm)
            </Label>
            <Input
              id="printMargin"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={printMargin}
              onChange={(e) => setPrintMargin(parseFloat(e.target.value) || 0)}
              placeholder="0.5"
            />
          </div>
        </div>

        {/* Calculation Results */}
        {calculation && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Ruler className="w-4 h-4 mr-2" />
              Hesaplama Sonuçları
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Satır başına etiket:</span>
                <span className="font-medium">{calculation.labelsPerRow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sütun başına etiket:</span>
                <span className="font-medium">{calculation.labelsPerColumn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metre başına etiket:</span>
                <span className="font-medium">{calculation.labelsPerSheet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gereken metre:</span>
                <span className="font-medium text-primary">{calculation.totalMeters}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-2">
                <Badge variant={calculation.efficiency > 80 ? "default" : "secondary"}>
                  %{calculation.efficiency.toFixed(1)} Verimlilik
                </Badge>
                {calculation.efficiency > 80 && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="text-sm text-gray-600">
                Fire: %{calculation.wastePercentage.toFixed(1)}
              </div>
            </div>
          </div>
        )}

        {/* Use Calculation Button */}
        {isCalculated && calculation && (
          <Button 
            onClick={handleUseCalculation}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Package className="w-4 h-4 mr-2" />
            Bu Hesaplamayı Kullan ({calculation.totalMeters} metretül)
          </Button>
        )}

        {/* Helper Text */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 İpucu:</p>
          <p>57x100cm (1 metretül) malzeme üzerinde etiketlerinizin nasıl yerleşeceğini hesaplayın. Verimlilik oranı %80'in üzerinde olması önerilir.</p>
        </div>
      </CardContent>
    </Card>
  );
}