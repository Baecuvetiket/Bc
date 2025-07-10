import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, Ruler, Grid3x3, Package } from 'lucide-react';

interface CalculationResult {
  labelWidth: number;
  labelHeight: number;
  labelsPerRow: number;
  labelsPerColumn: number;
  labelsPerSheet: number;
  neededQuantity: number;
  totalSheets: number;
  wastePercentage: number;
}

export function CalculatorTool() {
  const [labelWidth, setLabelWidth] = useState<string>('');
  const [labelHeight, setLabelHeight] = useState<string>('');
  const [neededQuantity, setNeededQuantity] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  // 57x100 cm = 570x1000 mm (1 metretül)
  const SHEET_WIDTH = 570; // mm
  const SHEET_HEIGHT = 1000; // mm
  const DESIGN_GAP = 2; // mm (tasarım arası boşluk)

  const calculateLabels = () => {
    const width = parseFloat(labelWidth);
    const height = parseFloat(labelHeight);
    const quantity = parseInt(neededQuantity);

    if (!width || !height || !quantity || width <= 0 || height <= 0 || quantity <= 0) {
      return;
    }

    // Her etiket için boşluk dahil toplam alan
    const totalLabelWidth = width + DESIGN_GAP;
    const totalLabelHeight = height + DESIGN_GAP;

    // Bir metretülde kaç adet sığar
    const labelsPerRow = Math.floor(SHEET_WIDTH / totalLabelWidth);
    const labelsPerColumn = Math.floor(SHEET_HEIGHT / totalLabelHeight);
    const labelsPerSheet = labelsPerRow * labelsPerColumn;

    // Kaç metretül gerekli
    const totalSheets = Math.ceil(quantity / labelsPerSheet);

    // Fire oranı
    const totalProducedLabels = totalSheets * labelsPerSheet;
    const wastePercentage = ((totalProducedLabels - quantity) / totalProducedLabels) * 100;

    setResult({
      labelWidth: width,
      labelHeight: height,
      labelsPerRow,
      labelsPerColumn,
      labelsPerSheet,
      neededQuantity: quantity,
      totalSheets,
      wastePercentage,
    });
  };

  const resetCalculator = () => {
    setLabelWidth('');
    setLabelHeight('');
    setNeededQuantity('');
    setResult(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-center mb-4">
          <Calculator className="w-8 h-8 text-primary mr-3" />
          <CardTitle className="text-2xl font-bold text-gray-800">
            Metretül Hesaplama Aracı
          </CardTitle>
        </div>
        <p className="text-gray-600">
          Etiket ölçüsü ve adet bilgisine göre kaç metretül baskı gerektiğini hesaplayın
        </p>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Baskı Alanı Bilgisi */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Ruler className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-gray-800">Baskı Alanı</h4>
          </div>
          <p className="text-gray-600 text-sm">1 Metretül = 57 cm x 100 cm (570 mm x 1000 mm)</p>
          <p className="text-gray-600 text-xs mt-1">* Tasarım arası boşluk: 2mm</p>
        </div>

        {/* Giriş Alanları */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="labelWidth" className="text-sm font-medium text-gray-700 mb-2 block">
              Etiket Genişliği (mm)
            </Label>
            <div className="relative">
              <Input
                id="labelWidth"
                type="number"
                value={labelWidth}
                onChange={(e) => setLabelWidth(e.target.value)}
                placeholder="40"
                className="pr-10"
                min="1"
                step="0.1"
              />
              <span className="absolute right-3 top-3 text-xs text-gray-400">mm</span>
            </div>
          </div>

          <div>
            <Label htmlFor="labelHeight" className="text-sm font-medium text-gray-700 mb-2 block">
              Etiket Yüksekliği (mm)
            </Label>
            <div className="relative">
              <Input
                id="labelHeight"
                type="number"
                value={labelHeight}
                onChange={(e) => setLabelHeight(e.target.value)}
                placeholder="40"
                className="pr-10"
                min="1"
                step="0.1"
              />
              <span className="absolute right-3 top-3 text-xs text-gray-400">mm</span>
            </div>
          </div>

          <div>
            <Label
              htmlFor="neededQuantity"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              İhtiyaç Adedi
            </Label>
            <div className="relative">
              <Input
                id="neededQuantity"
                type="number"
                value={neededQuantity}
                onChange={(e) => setNeededQuantity(e.target.value)}
                placeholder="100"
                className="pr-12"
                min="1"
              />
              <span className="absolute right-3 top-3 text-xs text-gray-400">adet</span>
            </div>
          </div>
        </div>

        {/* Hesaplama Butonları */}
        <div className="flex gap-3">
          <Button
            onClick={calculateLabels}
            className="flex-1"
            disabled={!labelWidth || !labelHeight || !neededQuantity}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Hesapla
          </Button>
          <Button onClick={resetCalculator} variant="outline">
            Temizle
          </Button>
        </div>

        {/* Sonuçlar */}
        {result && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 space-y-4 border border-green-200">
            <div className="flex items-center mb-4">
              <Grid3x3 className="w-6 h-6 text-green-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-800">Hesaplama Sonucu</h4>
            </div>

            {/* Etiket Düzeni */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Etiket Düzeni
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Satır başına:</span>
                    <Badge variant="secondary">{result.labelsPerRow} adet</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sütun başına:</span>
                    <Badge variant="secondary">{result.labelsPerColumn} adet</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metretül başına:</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {result.labelsPerSheet} adet
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                  <Ruler className="w-4 h-4 mr-2" />
                  Üretim Bilgisi
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">İhtiyaç:</span>
                    <Badge variant="outline">{result.neededQuantity.toLocaleString()} adet</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gerekli metretül:</span>
                    <Badge className="bg-primary text-white">{result.totalSheets} metretül</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fire oranı:</span>
                    <Badge
                      className={
                        result.wastePercentage > 20
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }
                    >
                      %{result.wastePercentage.toFixed(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Maliyet Tahmini */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h5 className="font-medium text-gray-700 mb-3">Maliyet Tahmini</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Normal Baskı:</span>
                  <span className="font-medium">₺{(result.totalSheets * 20).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Metalik Baskı:</span>
                  <span className="font-medium">₺{(result.totalSheets * 50).toFixed(2)}</span>
                </div>
              </div>

              {result.totalSheets >= 10 && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-700 text-xs font-medium">
                    🎉 10+ metretül siparişte %30 indirim fırsatı!
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                    <div className="flex justify-between">
                      <span>Normal (İndirimli):</span>
                      <span className="font-medium">
                        ₺{(result.totalSheets * 20 * 0.7).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Metalik (İndirimli):</span>
                      <span className="font-medium">
                        ₺{(result.totalSheets * 50 * 0.7).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Optimizasyon Önerileri */}
            {result.wastePercentage > 15 && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h5 className="font-medium text-yellow-800 mb-2">💡 Optimizasyon Önerisi</h5>
                <p className="text-yellow-700 text-sm">
                  Fire oranınız yüksek (%{result.wastePercentage.toFixed(1)}). Etiket ölçüsünü küçük
                  ayarlamalar yaparak fire oranını azaltabilirsiniz.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
