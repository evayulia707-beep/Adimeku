/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient } from '../types';

interface BiochemistryTableProps {
  biochemistry: Patient['biochemistry'];
  gender: Patient['gender'];
  age: Patient['age'];
  isChild: boolean;
  onChange: (key: keyof Patient['biochemistry'], value: number | '') => void;
}

// Interactive Indonesian list of medical lab ranges as requested in the PAGT.
export default function BiochemistryTable({ biochemistry, gender, age, isChild, onChange }: BiochemistryTableProps) {
  
  // Custom interpretation algorithm matching the exact Indonesian guidelines
  const getInterpretation = (key: keyof Patient['biochemistry'], val: number | ''): { text: string; color: string; range: string } => {
    if (val === '' || val === undefined || isNaN(val)) {
      return { text: 'Belum diisi', color: 'text-slate-400 bg-slate-50', range: '-' };
    }

    switch (key) {
      case 'gdp': {
        const lower = isChild ? 60 : 70;
        const norm = `${lower}-100 mg/dL`;
        if (val < lower) return { text: 'Rendah (Hipoglikemia)', color: 'text-amber-700 bg-amber-50 border border-amber-200 font-semibold', range: norm };
        if (val > 100) return { text: 'Tinggi (Hiperglikemia)', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: norm };
        return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
      }
      case 'gds': {
        const norm = '<140 mg/dL';
        if (val < 140) return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
        if (val >= 140 && val <= 200) return { text: 'Pradiabetes', color: 'text-amber-700 bg-amber-50 border border-amber-200 font-semibold', range: 'Normal: <140 mg/dL' };
        return { text: 'Diabetes', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: 'Normal: <140 mg/dL' };
      }
      case 'kreatinin': {
        const minVal = gender === 'Laki-laki' ? 0.6 : 0.5;
        const maxVal = gender === 'Laki-laki' ? 1.2 : 0.11; // 1.1 for female
        const rangeStr = gender === 'Laki-laki' ? '0.6-1.2 mg/dL' : '0.5-1.1 mg/dL';
        const actualMax = gender === 'Laki-laki' ? 1.2 : 1.1;
        if (val < minVal) return { text: 'Rendah', color: 'text-amber-700 bg-amber-50 border border-amber-200', range: rangeStr };
        if (val > actualMax) return { text: 'Tinggi', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: rangeStr };
        return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: rangeStr };
      }
      case 'albumin': {
        const norm = '3.5-5.5 g/dL';
        if (val < 3.5) return { text: 'Rendah (Hipoalbuminemia)', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: norm };
        if (val > 5.5) return { text: 'Tinggi', color: 'text-amber-700 bg-amber-50 border border-amber-200', range: norm };
        return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
      }
      case 'transferrin': {
        const norm = '2.0-4.0 g/L';
        if (val < 2.0) return { text: 'Rendah', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: norm };
        if (val > 4.0) return { text: 'Tinggi', color: 'text-amber-700 bg-amber-50 border border-amber-200', range: norm };
        return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
      }
      case 'rbp': {
        const norm = '2.5-7.5 mg/dL';
        if (val < 2.5) return { text: 'Rendah', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: norm };
        if (val > 7.5) return { text: 'Tinggi', color: 'text-amber-700 bg-amber-50 border border-amber-200', range: norm };
        return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
      }
      case 'totalCholesterol': {
        const norm = '<200 mg/dL';
        if (val < 200) return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
        if (val >= 200 && val < 240) return { text: 'Tinggi (Batas Atas)', color: 'text-amber-700 bg-amber-50 border border-amber-200 font-semibold', range: norm };
        return { text: 'Sangat Tinggi (Hiperkolesterolemia)', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: norm };
      }
      case 'hdl': {
        const minVal = gender === 'Laki-laki' ? 40 : 50;
        const norm = gender === 'Laki-laki' ? '>40-50 mg/dL' : '>50-59 mg/dL';
        if (val < minVal) return { text: 'Rendah (Risiko Kardiovaskular)', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: norm };
        return { text: 'Normal / Baik', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
      }
      case 'ldl': {
        const norm = '<100 mg/dL';
        if (val < 100) return { text: 'Optimal (Baik)', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
        if (val >= 100 && val < 160) return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
        if (val >= 160 && val < 190) return { text: 'Batas Tinggi', color: 'text-amber-700 bg-amber-50 border border-amber-200 font-semibold', range: norm };
        return { text: 'Sangat Tinggi', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: norm };
      }
      case 'triglyceride': {
        const norm = '<150 mg/dL';
        if (val < 150) return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
        if (val >= 150 && val < 200) return { text: 'Perlu Evaluasi Lanjut', color: 'text-amber-700 bg-amber-50 border border-amber-200 font-semibold', range: norm };
        return { text: 'Batas Tinggi (Hipertriglisideria)', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: norm };
      }
      case 'vitaminA': {
        const norm = '>20 mcg/dL';
        if (val < 20) return { text: 'Rendah', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: norm };
        return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
      }
      case 'hb': {
        let isBalita = age <= 5 || (isChild && age <= 6);
        let isSekolah = age > 5 && age <= 12;
        let limit = 12;
        let groupText = 'Wanita Dewasa';
        if (isBalita) {
          limit = 11;
          groupText = 'Anak Balita';
        } else if (isSekolah) {
          limit = 12;
          groupText = 'Anak Sekolah';
        } else if (gender === 'Laki-laki') {
          limit = 13;
          groupText = 'Laki-laki Dewasa';
        }

        const norm = `>=${limit} g/dL (${groupText})`;
        if (val < limit) return { text: 'Rendah (Anemia)', color: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold', range: norm };
        return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50 border border-emerald-200', range: norm };
      }
      default:
        return { text: 'Normal', color: 'text-emerald-700 bg-emerald-50', range: '-' };
    }
  };

  const biomarkers: Array<{ key: keyof Patient['biochemistry']; name: string; unit: string }> = [
    { key: 'gdp', name: 'Gula Darah Puasa (GDP)', unit: 'mg/dL' },
    { key: 'gds', name: 'Gula Darah Setelah Makan / Sewaktu (GDS)', unit: 'mg/dL' },
    { key: 'kreatinin', name: 'Kreatinin Serum', unit: 'mg/dL' },
    { key: 'albumin', name: 'Albumin Serum', unit: 'g/dL' },
    { key: 'transferrin', name: 'Transferin', unit: 'g/L' },
    { key: 'rbp', name: 'Retinol Binding Protein (RBP)', unit: 'mg/dL' },
    { key: 'totalCholesterol', name: 'Kolesterol Total', unit: 'mg/dL' },
    { key: 'hdl', name: 'Kolesterol HDL', unit: 'mg/dL' },
    { key: 'ldl', name: 'Kolesterol LDL', unit: 'mg/dL' },
    { key: 'triglyceride', name: 'Trigliserida', unit: 'mg/dL' },
    { key: 'vitaminA', name: 'Vitamin A Serum', unit: 'mcg/dL' },
    { key: 'hb', name: 'Hemoglobin (Hb)', unit: 'g/dL' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-sky-50 to-teal-50 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-sm">Tabel Pengukuran Biokimia / Laboratorium</h3>
        <p className="text-xs text-slate-500 mt-1">
          Masukkan nilai hasil lab, sistem akan memvalidasi status kelainan dan rentang normal Indonesia secara otomatis.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/70">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wider w-1/3">
                Parameter Biokimia
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wider">
                Nilai Rujukan Normal (Kemenkes)
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wider w-1/4">
                Hasil Input
              </th>
              <th scope="col" className="px-4 py-3 scope text-left text-xs font-semibold text-slate-500 tracking-wider">
                Interpretasi Sistem
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {biomarkers.map(({ key, name, unit }) => {
              const value = biochemistry[key];
              const interpretStep = getInterpretation(key, value);
              
              return (
                <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-medium text-slate-700 block">{name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {key.toUpperCase()}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded font-mono block w-fit">
                      {interpretStep.range}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-1.5 max-w-[150px]">
                      <input
                        type="number"
                        step="0.01"
                        value={value}
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(key, val === '' ? '' : parseFloat(val));
                        }}
                        placeholder="--"
                        className="w-full text-xs bg-slate-50 border border-slate-200 outline-hidden focus:border-teal-500 focus:bg-white rounded-md px-2.5 py-1.5 text-slate-700 font-medium transition-all"
                      />
                      <span className="text-xs font-sans text-slate-400 w-12 font-medium">{unit}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full text-center inline-block ${interpretStep.color}`}>
                      {interpretStep.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
