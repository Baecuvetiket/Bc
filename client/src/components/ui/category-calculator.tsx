
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Grid3x3 } from 'lucide-react';

interface CategoryCalculatorProps {
  categoryName: string;
  sheetPrice: number;
}

interface CalculationResult {
  labelWidth: number;
  labelHeight: number;
  quantity: number;
  labelsPerRow: number;
  labelsPerColumn: number;
  labelsPerSheet: number;
  requiredSheets: number;
  totalPrice: number;
  efficiency: number;
}

export function CategoryCalculator({ categoryName, sheetPrice }: CategoryCalculatorProps) {
  const [labelWidth, setLabelWidth] = useState<string>('');
  const [labelHeight, setLabelHeight] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);

  // 32x45 cm tabaka boyutu (320x450 mm)
  const SHEET_WIDTH = 320; // mm
  const SHEET_HEIGHT = 450; // mm
  const SPACING = 2; // mm (kesim boşluğu)

  const calculatePrice = () => {
    const width = parseFloat(labelWidth);
    const height = parseFloat(labelHeight);
    const qty = parseInt(quantity);

    if (!width || !height || !qty || width <= 0 || height <= 0 || qty <= 0) {
      return;
    }

    // Boşluk dahil etiket boyutu
    const totalLabelWidth = width + SPACING;
    const totalLabelHeight = height + SPACING;

    // Bir tabakada kaç adet sığar
    const labelsPerRow = Math.floor(SHEET_WIDTH / totalLabelWidth);
    const labelsPerColumn = Math.floor(SHEET_HEIGHT / totalLabelHeight);
    const labelsPerSheet = labelsPerRow * labelsPerColumn;

    // Kaç tabaka gerekli
    const requiredSheets = Math.ceil(qty / labelsPerSheet);

    // Toplam fiyat
    const totalPrice = requiredSheets * sheetPrice;

    // Verimlilik
    const usedLabels = Math.min(qty, labelsPerSheet * requiredSheets);
    const totalPossibleLabels = labelsPerSheet * requiredSheets;
    const efficiency = (usedLabels / totalPossibleLabels) * 100;

    setCalculation({
      labelWidth: width,
      labelHeight: height,
      quantity: qty,
      labelsPerRow,
      labelsPerColumn,
      labelsPerSheet,
      requiredSheets,
      totalPrice,
      efficiency
    });
  };

  const clearCalculation = () => {
    setLabelWidth('');
    setLabelHeight('');
    setQuantity('');
    setCalculation(null);
  };

  return (
    <div className="space-y-3">
      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`width-${categoryName}`} className="text-xs font-medium text-gray-700 mb-1 block">
            Genişlik (mm)
          </Label>
          <Input
            id={`width-${categoryName}`}
            type="number"
            value={labelWidth}
            onChange={(e) => setLabelWidth(e.target.value)}
            placeholder="40"
            className="text-xs h-8"
            min="1"
            step="0.1"
          />
        </div>
        
        <div>
          <Label htmlFor={`height-${categoryName}`} className="text-xs font-medium text-gray-700 mb-1 block">
            Yükseklik (mm)
          </Label>
          <Input
            id={`height-${categoryName}`}
            type="number"
            value={labelHeight}
            onChange={(e) => setLabelHeight(e.target.value)}
            placeholder="40"
            className="text-xs h-8"
            min="1"
            step="0.1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`quantity-${categoryName}`} className="text-xs font-medium text-gray-700 mb-1 block">
          Adet
        </Label>
        <Input
          id={`quantity-${categoryName}`}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="1000"
          className="text-xs h-8"
          min="1"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button 
          onClick={calculatePrice}
          size="sm"
          className="flex-1 text-xs h-8"
          disabled={!labelWidth || !labelHeight || !quantity}
        >
          <Calculator className="w-3 h-3 mr-1" />
          Hesapla
        </Button>
        <Button 
          onClick={clearCalculation}
          variant="outline"
          size="sm"
          className="text-xs h-8"
        >
          Temizle
        </Button>
      </div>

      {/* Results */}
      {calculation && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-3 space-y-2 border border-green-200">
          <div className="flex items-center mb-2">
            <Grid3x3 className="w-4 h-4 text-green-600 mr-2" />
            <h5 className="text-sm font-semibold text-gray-800">Hesaplama Sonucu</h5>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/50 rounded p-2">
              <div className="font-medium text-gray-700">Tabaka Başına</div>
              <div className="text-primary font-bold">{calculation.labelsPerSheet} adet</div>
            </div>
            <div className="bg-white/50 rounded p-2">
              <div className="font-medium text-gray-700">Gerekli Tabaka</div>
              <div className="text-primary font-bold">{calculation.requiredSheets} adet</div>
            </div>
          </div>

          <div className="bg-white/70 rounded p-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Toplam Fiyat:</span>
              <span className="text-lg font-bold text-primary">₺{calculation.totalPrice}</span>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            <div>Düzen: {calculation.labelsPerRow} x {calculation.labelsPerColumn}</div>
            <div>Verimlilik: %{calculation.efficiency.toFixed(1)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
