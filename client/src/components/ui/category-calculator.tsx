import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Grid3x3, Zap, Info } from 'lucide-react';

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

  // Otomatik hesaplama fonksiyonu
  const calculatePrice = () => {
    const width = parseFloat(labelWidth);
    const height = parseFloat(labelHeight);
    const qty = parseInt(quantity);

    if (!width || !height || !qty || width <= 0 || height <= 0 || qty < 100) {
      setCalculation(null);
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
      efficiency,
    });
  };

  // Input değişikliklerinde otomatik hesaplama
  useEffect(() => {
    const width = parseFloat(labelWidth);
    const height = parseFloat(labelHeight);
    const qty = parseInt(quantity);

    if (width > 0 && height > 0 && qty >= 100) {
      calculatePrice();
    } else {
      setCalculation(null);
    }
  }, [labelWidth, labelHeight, quantity]);

  const clearCalculation = () => {
    setLabelWidth('');
    setLabelHeight('');
    setQuantity('');
    setCalculation(null);
  };

  // Benzersiz ID'ler için categoryName'i kullan
  const uniqueId = categoryName.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        <Zap className="w-4 h-4 text-blue-600 mr-2 animate-pulse" />
        <h4 className="text-sm font-bold text-gray-800">Anında Fiyat Hesaplama</h4>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label
            htmlFor={`width-${uniqueId}`}
            className="text-xs font-semibold text-gray-700 mb-2 block flex items-center"
          >
            <Grid3x3 className="w-3 h-3 mr-1" />
            Genişlik (mm)
          </Label>
          <Input
            id={`width-${uniqueId}`}
            type="number"
            value={labelWidth}
            onChange={(e) => setLabelWidth(e.target.value)}
            placeholder="40"
            className="text-sm h-9 border-2 border-gray-200 focus:border-blue-500 rounded-lg hover:border-blue-300 transition-all duration-200 focus:ring-2 focus:ring-blue-200"
            min="1"
            step="0.1"
            onFocus={(e) => e.target.select()}
          />
        </div>

        <div>
          <Label
            htmlFor={`height-${uniqueId}`}
            className="text-xs font-semibold text-gray-700 mb-2 block flex items-center"
          >
            <Grid3x3 className="w-3 h-3 mr-1" />
            Yükseklik (mm)
          </Label>
          <Input
            id={`height-${uniqueId}`}
            type="number"
            value={labelHeight}
            onChange={(e) => setLabelHeight(e.target.value)}
            placeholder="40"
            className="text-sm h-9 border-2 border-gray-200 focus:border-blue-500 rounded-lg hover:border-blue-300 transition-all duration-200 focus:ring-2 focus:ring-blue-200"
            min="1"
            step="0.1"
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>

      <div>
        <Label
          htmlFor={`quantity-${uniqueId}`}
          className="text-xs font-semibold text-gray-700 mb-2 block flex items-center"
        >
          <Calculator className="w-3 h-3 mr-1" />
          Adet (Minimum 100)
        </Label>
        <Input
          id={`quantity-${uniqueId}`}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="1000"
          className="text-sm h-9 border-2 border-gray-200 focus:border-blue-500 rounded-lg hover:border-blue-300 transition-all duration-200 focus:ring-2 focus:ring-blue-200"
          min="100"
          onFocus={(e) => e.target.select()}
        />
      </div>

      {/* Clear Button */}
      <div className="flex justify-end">
        <Button 
          onClick={clearCalculation} 
          variant="outline" 
          size="sm" 
          className="text-xs h-8 border-gray-300 hover:bg-gray-50"
        >
          Temizle
        </Button>
      </div>

      {/* Results - Otomatik Görünüm */}
      {calculation && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 space-y-3 border-2 border-green-200 shadow-lg animate-fade-in">
          <div className="flex items-center mb-3">
            <Calculator className="w-5 h-5 text-green-600 mr-2 animate-pulse" />
            <h5 className="text-sm font-bold text-gray-800">Hesaplama Sonucu</h5>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/70 rounded-lg p-3 border border-green-100 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-gray-600 mb-1">Tabaka Başına</div>
              <div className="text-lg font-bold text-green-600">{calculation.labelsPerSheet} adet</div>
            </div>
            <div className="bg-white/70 rounded-lg p-3 border border-green-100 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-gray-600 mb-1">Gerekli Tabaka</div>
              <div className="text-lg font-bold text-green-600">{calculation.requiredSheets} adet</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Toplam Fiyat:</span>
              <span className="text-2xl font-bold animate-pulse">₺{calculation.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="bg-white/50 rounded p-2 hover:bg-white/70 transition-colors">
              <div className="font-medium">Düzen:</div>
              <div className="text-green-600 font-semibold">{calculation.labelsPerRow} x {calculation.labelsPerColumn}</div>
            </div>
            <div className="bg-white/50 rounded p-2 hover:bg-white/70 transition-colors">
              <div className="font-medium">Verimlilik:</div>
              <div className="text-green-600 font-semibold">%{calculation.efficiency.toFixed(1)}</div>
            </div>
          </div>

          {/* Teslimat Bilgisi */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">Tahmini Teslimat:</span>
              <span className="text-blue-600 font-semibold">2-3 İş Günü</span>
            </div>
          </div>

          {/* Profesyonel Danışmanlık Butonu */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-blue-600 border-blue-300 hover:bg-blue-50 text-xs py-2"
          >
            <Info className="w-3 h-3 mr-1" />
            Profesyonel Danışmanlık
          </Button>
        </div>
      )}

      {/* Placeholder - Hesaplama yokken */}
      {!calculation && (labelWidth || labelHeight || quantity) && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200 animate-fade-in">
          <div className="flex items-center">
            <Calculator className="w-4 h-4 text-yellow-600 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-yellow-800">
              Tüm alanları doldurun ve minimum 100 adet girin, fiyat otomatik hesaplanacak
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
