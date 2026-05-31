/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ACTIVITY_FACTORS, STRESS_FACTORS } from '../data';
import { Sparkles, Calculator, Flame, ChevronRight, HelpCircle } from 'lucide-react';

interface CalculatorZatGiziProps {
  gender: 'Laki-laki' | 'Perempuan';
  age: number;
  height: number;
  currentWeight: number;
  idealWeight: number;
  imt: number;
  
  // Backwards feeding callback
  activityFactor: number;
  stressFactor: number;
  onUpdate: (data: {
    bmr: number;
    activityFactor: number;
    stressFactor: number;
    tee: number;
    targetProtein: number;
    targetFat: number;
    targetCarbo: number;
    targetFluid: number;
  }) => void;

  // Initial loaded states
  initialTargetFluid?: number;
}

export default function CalculatorZatGizi({
  gender,
  age,
  height,
  currentWeight,
  idealWeight,
  imt,
  activityFactor: loadedAct,
  stressFactor: loadedStr,
  onUpdate,
  initialTargetFluid
}: CalculatorZatGiziProps) {
  const [actFactor, setActFactor] = useState<number>(loadedAct || 1.2);
  const [strFactor, setStrFactor] = useState<number>(loadedStr || 1.0);
  
  // Nutrition splits %
  const [proteinPercent, setProteinPercent] = useState<number>(15);
  const [fatPercent, setFatPercent] = useState<number>(25);

  // Auto balance carb %
  const carbPercent = Math.max(0, 100 - proteinPercent - fatPercent);

  // Determine weight source based on IMT Asia-Pasifik:
  // Jika IMT normal (18 <= IMT < 23), gunakan BB aktual (currentWeight)
  // Jika IMT kurang (<18) atau lebih (>=23), gunakan BBI (idealWeight)
  const isImtNormal = imt >= 18 && imt < 23;
  const weightUsed = isImtNormal ? currentWeight : idealWeight;

  // Formulas BMR:
  // BMR pria = 66 + (13.7 × BB/BBI) + (5 × TB) - (6.8 × usia)
  // BMR wanita = 655 + (9.6 × BB/BBI) + (1.8 × TB) - (4.7 × usia)
  let bmr = 0;
  if (weightUsed && height && age) {
    if (gender === 'Laki-laki') {
      bmr = 66 + (13.7 * weightUsed) + (5 * height) - (6.8 * age);
    } else {
      bmr = 655 + (9.6 * weightUsed) + (1.8 * height) - (4.7 * age);
    }
    // Round
    bmr = Math.round(bmr);
  }

  // TEE = BMR * act * stress
  const tee = Math.round(bmr * actFactor * strFactor);

  // Gram calculations
  // 1g Prot = 4 cal, 1g Fat = 9 cal, 1g Carb = 4 cal
  const targetProtein = Math.round(((tee * (proteinPercent / 100)) / 4) * 10) / 10;
  const targetFat = Math.round(((tee * (fatPercent / 100)) / 9) * 10) / 10;
  const targetCarbo = Math.round(((tee * (carbPercent / 100)) / 4) * 10) / 10;

  // Indon Fluid standard: 30 ml / kg weightUsed
  const targetFluid = initialTargetFluid || Math.round(weightUsed * 30);

  // Trigger state propagation
  useEffect(() => {
    if (bmr > 0) {
      onUpdate({
        bmr,
        activityFactor: actFactor,
        stressFactor: strFactor,
        tee,
        targetProtein,
        targetFat,
        targetCarbo,
        targetFluid
      });
    }
  }, [bmr, actFactor, strFactor, proteinPercent, fatPercent, targetFluid]);

  return (
    <div className="bg-white border border-slate-100 shadow-xs rounded-xl p-5 space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Hitung Kebutuhan Gizi Klinik (PAGT RI)</h3>
          <p className="text-xs text-slate-400">Penyetelan energi Harris-Benedict & balancing gizi makro.</p>
        </div>
      </div>

      {/* Decision metadata display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Kategori IMT & Acuan BB</span>
          <span className={`text-xs font-bold block ${isImtNormal ? 'text-emerald-700' : 'text-amber-700'}`}>
            IMT: {imt ? imt.toFixed(1) : '--'} ({isImtNormal ? 'Normal (18-23)' : 'Tidak Normal'})
          </span>
          <p className="text-[10px] text-slate-500 leading-tight">
            Sesuai PAGT: karena status {isImtNormal ? 'Normal' : 'Abnormal'}, acuan energi menggunakan 
            <strong className="text-teal-600 block mt-0.5">
              {isImtNormal ? `BB Aktual (${currentWeight} kg)` : `Berat Badan Ideal (BBI) (${idealWeight} kg)`}
            </strong>
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Kalkulasi BMR Dasar</span>
          <div className="flex items-center space-x-2">
            <Flame className="h-4 w-4 text-rose-500 shrink-0" />
            <span className="text-sm font-bold text-slate-800 font-mono">{bmr} kkal</span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono mt-1 block">
            {gender === 'Laki-laki' 
              ? `66 + (13.7x${weightUsed}) + (5x${height}) - (6.8x${age})`
              : `655 + (9.6x${weightUsed}) + (1.8x${height}) - (4.7x${age})`
            }
          </span>
        </div>

        <div className="p-3 bg-teal-50 border border-teal-100 rounded-lg space-y-1">
          <span className="text-[10px] text-teal-600 font-bold block uppercase">Total Energy Expenditure (TEE)</span>
          <div className="flex items-center space-x-1.5 text-teal-900 font-black">
            <Sparkles className="h-4 w-4 text-teal-500" />
            <span className="text-lg font-mono">{tee} kkal / hari</span>
          </div>
          <span className="text-[9px] text-teal-600 block">
            BMR ({bmr}) × FA ({actFactor}) × FS ({strFactor})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step inputs */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ChevronRight className="h-4.5 w-4.5 text-teal-600 shrink-0" />
            Sesuaikan Faktor Kali
          </h4>

          {/* Activity Factor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex justify-between items-center">
              <span>Faktor Aktivitas Fisik (FA):</span>
              <span className="font-mono text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded text-[11px]">{actFactor}</span>
            </label>
            <select
              value={actFactor}
              onChange={(e) => setActFactor(parseFloat(e.target.value))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all text-slate-700 font-medium"
            >
              {ACTIVITY_FACTORS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>

          {/* Stress Factor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex justify-between items-center">
              <span>Faktor Stres / Patologi Penyakit (FS):</span>
              <span className="font-mono text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded text-[11px]">{strFactor}</span>
            </label>
            <select
              value={strFactor}
              onChange={(e) => setStrFactor(parseFloat(e.target.value))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all text-slate-700 font-medium"
            >
              {STRESS_FACTORS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Splits and Gram weights */}
        <div className="space-y-4 bg-slate-50/50 p-4 border border-slate-100 rounded-xl">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ChevronRight className="h-4.5 w-4.5 text-teal-600 shrink-0" />
            Distribusi & Gram Zat Gizi (Balanced)
          </h4>

          {/* Sliders for split percentages */}
          <div className="space-y-3.5 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Protein (%):</span>
                <span className="text-teal-700 font-bold font-mono">{proteinPercent}% ({targetProtein}g)</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                step="5"
                value={proteinPercent}
                onChange={(e) => setProteinPercent(parseInt(e.target.value))}
                className="w-full accent-teal-600 h-1.5 rounded-lg"
              />
              <span className="text-[10px] text-slate-400 leading-none block">Indikasi Kemenkes: 10 - 20% (bisa disesuaikan klinis CKD/luka bakar)</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Lemak (%):</span>
                <span className="text-teal-700 font-bold font-mono">{fatPercent}% ({targetFat}g)</span>
              </div>
              <input
                type="range"
                min="15"
                max="35"
                step="5"
                value={fatPercent}
                onChange={(e) => setFatPercent(parseInt(e.target.value))}
                className="w-full accent-teal-600 h-1.5 rounded-lg"
              />
              <span className="text-[10px] text-slate-400 leading-none block">Indikasi Kemenkes: 20 - 30%</span>
            </div>

            {/* Carbo is locked to make sure total equals 100% */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex justify-between items-center">
              <div>
                <span className="text-slate-600 font-medium block">Karbohidrat (Sisa Otomatis):</span>
                <span className="text-[10px] text-slate-400">Menjaga total kontribusi tetap 100%</span>
              </div>
              <span className="text-teal-800 font-extrabold font-mono text-sm">
                {carbPercent}% ({targetCarbo}g)
              </span>
            </div>

            {/* Fluid */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex justify-between items-center">
              <div>
                <span className="text-slate-600 font-medium block">Kebutuhan Cairan Harian:</span>
                <span className="text-[10px] text-slate-400">30 ml / kg acuan BB</span>
              </div>
              <span className="text-teal-800 font-extrabold font-mono text-sm">
                {targetFluid} ml / hari
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
