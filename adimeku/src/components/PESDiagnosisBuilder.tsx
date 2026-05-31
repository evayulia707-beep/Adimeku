/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PESDiagnosis, ENCPT_PROBLEMS, ENCPTTerm } from '../types';
import { Plus, Trash2, BookOpen, AlertCircle } from 'lucide-react';

interface PESDiagnosisBuilderProps {
  diagnoses: PESDiagnosis[];
  onChange: (diagnoses: PESDiagnosis[]) => void;
}

export default function PESDiagnosisBuilder({ diagnoses, onChange }: PESDiagnosisBuilderProps) {
  const [selectedDomain, setSelectedDomain] = useState<'NI' | 'NC' | 'NB'>('NI');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<ENCPTTerm | null>(null);
  
  const [etiology, setEtiology] = useState('');
  const [signsSymptoms, setSignsSymptoms] = useState('');

  // Suggestions helper for rapid clicking
  const etiologySuggestions = [
    'Pilihan bahan makanan yang kurang tepat secara konsisten',
    'Gangguan klirens fungsi fisiologis organ sekunder akibat patologi penyakit',
    'Kurangnya asupan gizi per oral akibat nafsu makan yang menurun',
    'Gangguan metabolisme zat gizi makro akibat defisiensi insulin sekunder',
    'Kurangnya paparan edukasi nutrisi terstandar oleh praktisi kesehatan',
    'Keterbatasan ekonomi dalam menjangkau fungsional pangan bergizi tinggi',
  ];

  const signSuggestions = [
    'Ditandai dengan asupan recall 24 jam di atas 120% kebutuhan',
    'Nilai laboratorium plasma kolesterol melebihi rentang klinis (280 mg/dL)',
    'Penurunan berat badan tidak terencana >5% dalam satu bulan',
    'Nilai albumin serum abnormal (2.8 g/dL) disertai bengkak ekstremitas',
    'Hasil wawancara yang menyatakan konsumsi tinggi lemak jenuh harian',
  ];

  // Filtering E-NCPT problems
  const filteredProblems = ENCPT_PROBLEMS.filter(
    (p) =>
      p.domain === selectedDomain &&
      (p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const generatePESString = (pCode: string, pLabel: string, etio: string, signs: string) => {
    if (!pCode || !etio || !signs) return 'Masukkan Problem, Etiologoi, dan Signs untuk memicu kalimat diagnosis otomatis.';
    return `[${pCode}] ${pLabel} berkaitan dengan ${etio} ditandai dengan ${signs}.`;
  };

  const handleAddDiagnosis = () => {
    if (!selectedProblem) return;
    if (!etiology.trim() || !signsSymptoms.trim()) {
      alert('Mohon isi Etiologi dan Sign/Symptom terlebih dahulu.');
      return;
    }

    const newDiagnosis: PESDiagnosis = {
      id: `pes-${Date.now()}`,
      domain: selectedProblem.domain,
      problemCode: selectedProblem.code,
      problemLabel: selectedProblem.label,
      etiology: etiology.trim(),
      signsSymptoms: signsSymptoms.trim(),
    };

    onChange([...diagnoses, newDiagnosis]);

    // reset inputs
    setEtiology('');
    setSignsSymptoms('');
    setSelectedProblem(null);
    setSearchQuery('');
  };

  const handleRemoveDiagnosis = (id: string) => {
    onChange(diagnoses.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-xs text-slate-600">
        <AlertCircle className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Panduan Diagnosis PES (Process Asuhan Gizi):</span>
          <p className="mt-1">
            Diagnosis Gizi ditulis menggunakan terminology E-NCPT terstandar. Formula PES merangkai 
            <strong> Problem (Masalah)</strong> yang dihubungkan dengan kalimat 
            <em> "berkaitan dengan"</em> <strong>Etiologi (Penyebab)</strong> yang dihubungkan dengan kata 
            <em> "ditandai dengan"</em> <strong>Sign & Symptoms (Tanda/Gejala)</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selection panel */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-xl p-4 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-teal-600" />
            1. PIlih Problem E-NCPT
          </h3>

          {/* Domain tabs */}
          <div className="flex bg-slate-100 p-1 rounded-md">
            {(['NI', 'NC', 'NB'] as const).map((dm) => (
              <button
                key={dm}
                type="button"
                onClick={() => {
                  setSelectedDomain(dm);
                  setSelectedProblem(null);
                }}
                className={`flex-1 text-center text-xs py-1.5 rounded font-semibold transition-all ${
                  selectedDomain === dm
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {dm === 'NI' ? 'NI (Intake)' : dm === 'NC' ? 'NC (Klinis)' : 'NB (Perilaku)'}
              </button>
            ))}
          </div>

          {/* Search box */}
          <input
            type="text"
            placeholder="Cari kode/nama masalah gizi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-hidden focus:border-teal-500 focus:bg-white transition-all"
          />

          {/* Problems list */}
          <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-100">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((term) => (
                <button
                  key={term.code}
                  type="button"
                  onClick={() => setSelectedProblem(term)}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors block ${
                    selectedProblem?.code === term.code
                      ? 'bg-teal-50/80 text-teal-900 border-l-4 border-teal-500 font-medium'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-mono text-teal-700 mr-2 font-bold">{term.code}</span>
                  {term.label}
                </button>
              ))
            ) : (
              <p className="p-4 text-xs text-slate-400 text-center">Tidak ketemu. Tulis kode manual.</p>
            )}
          </div>

          {selectedProblem && (
            <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-100 text-xs">
              <span className="text-[10px] uppercase font-mono font-bold text-teal-600 block">MODEL DAN KODE TERPILIH</span>
              <span className="font-bold text-teal-800">{selectedProblem.code} - {selectedProblem.label}</span>
            </div>
          )}
        </div>

        {/* Content panel */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-xl p-4 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-xs">
            2. Lengkapi Etiologi & Gejala (PES)
          </h3>

          {/* Etiology Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 block">Etiologi (Penyebab):</label>
            <textarea
              rows={2}
              value={etiology}
              onChange={(e) => setEtiology(e.target.value)}
              placeholder="Contoh: Kurangnya pengetahuan terkait diet diabetes melahirkan pemilihan karbohidrat berlebih..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all text-slate-700"
            />
            {/* Rapid click suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {etiologySuggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setEtiology(sug)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors text-left max-w-[200px] truncate"
                  title={sug}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Sign/Symptom Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 block">Sign / Symptom (Tanda & Gejala):</label>
            <textarea
              rows={2}
              value={signsSymptoms}
              onChange={(e) => setSignsSymptoms(e.target.value)}
              placeholder="Contoh: Ditandai dengan kadar gula darah puasa mencapai 185 mg/dL dan hasil recall 3 hari..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all text-slate-700"
            />
            {/* Rapid click suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {signSuggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSignsSymptoms(sug)}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors text-left max-w-[200px] truncate"
                  title={sug}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Automatic Preview Phrase */}
          {selectedProblem && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Kalimat Diagnosa Otomatis (PES):</span>
              <p className="text-xs text-teal-800 italic font-medium leading-relaxed">
                "{generatePESString(selectedProblem.code, selectedProblem.label, etiology, signsSymptoms)}"
              </p>
            </div>
          )}

          {/* Add action */}
          <button
            type="button"
            onClick={handleAddDiagnosis}
            disabled={!selectedProblem || !etiology.trim() || !signsSymptoms.trim()}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Tambahkan Diagnosa PES Ke Rekam Medis
          </button>
        </div>
      </div>

      {/* Grid view of Added PES Diagnoses */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-100">
          <h4 className="font-bold text-slate-800 text-xs">Daftar Diagnosa Gizi Terpilih (PAGT PES Table)</h4>
        </div>
        <div className="overflow-x-auto">
          {diagnoses.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-100 text-xs text-slate-700">
              <thead className="bg-slate-50/50">
                <tr>
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold text-slate-500 w-12">No</th>
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold text-slate-500 w-1/4">Problem (E-NCPT)</th>
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold text-slate-500 w-1/4">Etiologi</th>
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold text-slate-500 w-1/4">Sign / Symptom</th>
                  <th scope="col" className="px-4 py-2.5 text-left font-semibold text-slate-500">Keterangan Kalimat Diagnosa</th>
                  <th scope="col" className="px-4 py-2.5 text-center font-semibold text-slate-500 w-12">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {diagnoses.map((d, index) => (
                  <tr key={d.id} className="hover:bg-slate-50/20">
                    <td className="px-4 py-3 font-semibold text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-teal-700 block text-[10px]">{d.problemCode}</span>
                      <span className="font-medium">{d.problemLabel}</span>
                    </td>
                    <td className="px-4 py-3">{d.etiology}</td>
                    <td className="px-4 py-3">{d.signsSymptoms}</td>
                    <td className="px-4 py-3 italic text-slate-600 leading-relaxed font-serif bg-teal-50/10">
                      "{d.problemLabel} berkaitan dengan {d.etiology} ditandai dengan {d.signsSymptoms}."
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveDiagnosis(d.id)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Hapus diagnosa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-slate-400 font-medium">
              Belum ada diagnosa gizi terpilih. Gunakan formulir di atas untuk merumuskan diagnosis PES.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
