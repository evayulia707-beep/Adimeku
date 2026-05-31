/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Patient } from '../types';
import { BIOMARKER_RANGES } from '../types';
import { 
  Printer, 
  ArrowLeft, 
  Activity, 
  Calendar, 
  User, 
  FileText, 
  Bookmark, 
  CheckSquare, 
  TrendingUp, 
  Clock, 
  HeartPlus,
  Download,
  Loader2
} from 'lucide-react';

interface MedicalReportProps {
  patient: Patient;
  onBack: () => void;
  dietitianName: string;
}

export default function MedicalReport({ patient, onBack, dietitianName }: MedicalReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const element = reportRef.current;
      
      // Captured at high scale with white bg and fixed desktop viewport width (1024px)
      // to ensure elegant column positioning in PDF and avoid narrow mobile layout wrapping.
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Standard A4 sizes: 210mm x 297mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Page 1
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      
      // Support multi-page auto splicing
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
      
      const pName = patient.name ? patient.name.replace(/\s+/g, '_') : 'Pasien';
      const pReg = patient.registerNo ? patient.registerNo.replace(/\//g, '-') : 'REG';
      const filename = `ADIMEKU_Laporan_${pName}_${pReg}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat mengolah file PDF. Silakan gunakan tombol "Cetak Laporan / Browser Save" sebagai alternatif.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadWord = () => {
    const pName = patient.name ? patient.name.replace(/\s+/g, '_') : 'Pasien';
    const pReg = patient.registerNo ? patient.registerNo.replace(/\//g, '-') : 'REG';
    const filename = `ADIMEKU_Laporan_${pName}_${pReg}.doc`;

    const screeningItemsHtml = getSelectedScreeningItems()
      .map(item => `<li>${item}</li>`)
      .join('');
      
    const screeningContent = getSelectedScreeningItems().length > 0
      ? `<ul>${screeningItemsHtml}</ul>`
      : `<p style="color: #047857; font-weight: bold; background-color: #f0fdf4; padding: 10px; border: 1px solid #d1fae5; border-radius: 6px; margin: 0;">
          ✓ Hasil skrining: Pasien diklasifikasikan sebagai Risiko Rendah (tidak ada keluhan kepatuhan dasar/kehilangan nafsu makan).
         </p>`;

    const diagnosesRows = patient.diagnoses.map((d, idx) => `
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">${idx + 1}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">
          <div style="font-family: monospace; font-size: 11px; color: #0f766e; font-weight: bold;">${d.problemCode}</div>
          <strong>${d.problemLabel}</strong>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; color: #475569;">${d.etiology}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; color: #475569;">${d.signsSymptoms}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; font-style: italic; color: #115e59; background-color: #f0fdfa;">
          "${d.problemLabel} berkaitan dengan ${d.etiology} ditandai dengan ${d.signsSymptoms}."
        </td>
      </tr>
    `).join('');

    const diagnosesContent = patient.diagnoses.length > 0
      ? `<table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 40px;">No</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 25%;">Problem Gizi E-NCPT</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 20%;">Etiologi</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 20%;">Sign & Symptoms</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Pernyataan Kalimat PES</th>
            </tr>
          </thead>
          <tbody>
            ${diagnosesRows}
          </tbody>
         </table>`
      : `<p style="font-style: italic; color: #64748b; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; text-align: center;">
          Belum ada diagnosis PES terdokumentasi.
         </p>`;

    const biochemistryRows = Object.entries(BIOMARKER_RANGES).map(([key, marker]) => {
      const value = patient.biochemistry[key as keyof Patient['biochemistry']];
      if (value === '' || value === undefined) return '';
      
      const getInterText = () => {
        if (key === 'gdp') {
          const normMin = patient.anthropometry.isChild ? 60 : 70;
          if (value < normMin) return 'Rendah';
          if (value > 100) return 'Tinggi';
          return 'Normal';
        }
        if (key === 'gds') {
          if (value < 140) return 'Normal';
          if (value >= 140 && value <= 200) return 'Pradiabetes';
          return 'Diabetes';
        }
        if (key === 'albumin') {
          if (value < 3.5) return 'Rendah';
          if (value > 5.5) return 'Tinggi';
          return 'Normal';
        }
        if (key === 'hb') {
          const lim = patient.gender === 'Laki-laki' ? 13 : 12;
          return value < lim ? 'Rendah' : 'Normal';
        }
        if (key === 'totalCholesterol') {
          if (value < 200) return 'Normal';
          if (value >= 200 && value < 240) return 'Tinggi (Batas)';
          return 'Sangat Tinggi';
        }
        return 'Terekam';
      };
      
      const statusStr = getInterText();
      const isAbnormal = statusStr !== 'Normal' && statusStr !== 'Terekam';
      
      return `
        <tr style="${isAbnormal ? 'background-color: #fef2f2; color: #7f1d1d;' : 'color: #0f172a;'}">
          <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">${marker.name}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; font-family: monospace;">${value} ${marker.unit}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">${statusStr}</td>
        </tr>
      `;
    }).filter(Boolean).join('');

    const biochemistryTable = biochemistryRows.length > 0
      ? `<table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Parameter Makronutrien / Marker</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Hasil Laboratorium</th>
              <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Interpretasi Status</th>
            </tr>
          </thead>
          <tbody>
            ${biochemistryRows}
          </tbody>
         </table>`
      : `<p style="font-style: italic; color: #64748b; padding: 10px; text-align: center;">Tidak ada penanda uji biokimia yang terekam.</p>`;

    const monitoringRows = `
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">Antropometri</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.anthropometryTarget || 'Pertahankan atau perbaiki BB'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.anthropometryAction || 'Lakukan penimbangan berkala'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.anthropometryEvaluation || 'Sesuai ekspektasi klinis'}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">Biokimia</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.biochemistryTarget || 'Dekatkan hasil lab pada rujukan normal'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.biochemistryAction || 'Cek ulang panel lab klinis'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.biochemistryEvaluation || 'Nilai lab berangsur paten'}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">Fisik / Klinis</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.clinicalTarget || 'Meredakan gejala GI dan tanda edema'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.clinicalAction || 'Pengecekan fisik rutin'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.clinicalEvaluation || 'Kemajuan pemulihan pesat'}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">Asupan Makanan</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.dietaryTarget || 'Asupan makan oral terpenuhi minimal 80%'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.dietaryAction || 'Metode Comstock dan record makanan harian'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.dietaryEvaluation || 'Porsi makanan habis tinggi'}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold;">Kepatuhan Diet</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.complianceTarget || 'Patuh sepenuhnya pada asuhan diet'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.complianceAction || 'Wawancara and feed-back diet harian'}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px;">${patient.monitoring?.complianceEvaluation || 'Komitmen tinggi ditunjukkan'}</td>
      </tr>
    `;

    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>LAPORAN ASUHAN GIZI ADIME</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.4; color: #1e293b; margin: 1in; }
          h1, h2, h3, h4 { font-family: Arial, Helvetica, sans-serif; color: #0f172a; }
          h1 { font-size: 16pt; text-align: center; text-transform: uppercase; margin-bottom: 5px; font-weight: bold; }
          h2 { font-size: 12pt; border-bottom: 2px solid #0f766e; padding-bottom: 3px; margin-top: 25px; text-transform: uppercase; font-weight: bold; color: #0d9488; }
          h3 { font-size: 11pt; margin-top: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; font-weight: bold; color: #334155; }
          .meta-info { font-style: italic; font-size: 9.5pt; text-align: center; margin-bottom: 25px; color: #475569; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10pt; }
          td, th { padding: 6px 8px; border: 1px solid #cbd5e1; vertical-align: top; }
          th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; }
          ul, ol { margin-top: 5px; margin-bottom: 10px; padding-left: 20px; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .bold { font-weight: bold; }
          .italic { font-style: italic; }
        </style>
      </head>
      <body>
        
        <h1>Laporan Asuhan Gizi Terstandar (ADIME)</h1>
        <div class="meta-info">
          Platform ADIMEKU | Tanggal Asuhan: ${formattedDate(patient.entryDate)}
        </div>

        <h2>I. Identitas & Profil Pasien</h2>
        <table>
          <tr>
            <td width="25%" class="bold" style="background-color: #f8fafc;">Nama Pasien:</td>
            <td width="25%">${patient.name || '--'}</td>
            <td width="25%" class="bold" style="background-color: #f8fafc;">No. Register Medis:</td>
            <td width="25%">${patient.registerNo || '--'}</td>
          </tr>
          <tr>
            <td class="bold" style="background-color: #f8fafc;">Umur / Gender:</td>
            <td>${patient.age} Tahun / ${patient.gender}</td>
            <td class="bold" style="background-color: #f8fafc;">Status / Ruang Rawat:</td>
            <td>${patient.status} - ${patient.room || '--'}</td>
          </tr>
          <tr>
            <td class="bold" style="background-color: #f8fafc;">Diagnosis Medis:</td>
            <td colspan="3"><strong>${patient.medicalDiagnosis || '--'}</strong></td>
          </tr>
          <tr>
            <td class="bold" style="background-color: #f8fafc;">Dokter Pengirim:</td>
            <td>${patient.doctor || '--'}</td>
            <td class="bold" style="background-color: #f8fafc;">Alamat / Kontak:</td>
            <td>${patient.addressPhone || '--'}</td>
          </tr>
        </table>

        <h2>II. Skrining Awal Risiko Malnutrisi</h2>
        <div style="padding: 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; border-radius: 6px;">
          ${screeningContent}
        </div>

        <h2>III. Nutrition Assessment (Pengkajian Gizi)</h2>
        
        <h3>A. Antropometri</h3>
        <table>
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th align="left">Indikator Antropometri</th>
              <th align="right">Hasil Ukur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="bold">Berat Badan Aktual (BB):</td>
              <td align="right">${patient.anthropometry.currentWeight || '--'} kg</td>
            </tr>
            <tr>
              <td class="bold">Tinggi Badan (TB):</td>
              <td align="right">${patient.anthropometry.height || '--'} cm</td>
            </tr>
            <tr>
              <td class="bold">Berat Badan Ideal (BBI):</td>
              <td align="right" style="color: #0d9488; font-weight: bold;">${patient.anthropometry.idealWeight || '--'} kg</td>
            </tr>
            <tr>
              <td class="bold">Indeks Massa Tubuh (IMT):</td>
              <td align="right">${patient.anthropometry.imt ? patient.anthropometry.imt.toFixed(1) : '--'} kg/m²</td>
            </tr>
            ${patient.anthropometry.muac ? `
            <tr>
              <td class="bold">Lingkar Lengan Atas (LiLA):</td>
              <td align="right">${patient.anthropometry.muac} cm</td>
            </tr>` : ''}
            <tr style="background-color: #f0fdfa;">
              <td class="bold" style="color: #0f766e;">Status Gizi (Asia-Pasifik):</td>
              <td align="right" class="bold" style="color: #0f766e; text-transform: uppercase;">${getSytematicIMT(patient.anthropometry.imt)}</td>
            </tr>
            ${patient.anthropometry.isChild ? `
            <tr style="background-color: #f0fdf4;">
              <td class="bold" style="color: #065f46;">Interpretasi WHO Growth (Standard Balita):</td>
              <td align="right" class="bold" style="color: #065f46; text-transform: uppercase;">${patient.anthropometry.childInterpretation || 'Belum dipilih'}</td>
            </tr>` : ''}
          </tbody>
        </table>

        <h3>B. Fisik / Pemeriksaan Klinis</h3>
        <p><strong>Riwayat Penyakit & Keluhan:</strong> ${patient.physicalClinical.medicalHistory || 'Tidak ada riwayat signifikan'}</p>
        <p><strong>Vital Signs:</strong> TD: ${patient.physicalClinical.systolic || '--'}/${patient.physicalClinical.diastolic || '--'} mmHg, Nadi: ${patient.physicalClinical.pulse || '--'} x/m, Suhu: ${patient.physicalClinical.temperature || '--'} °C</p>
        <p><strong>Keluhan GI Tracker:</strong> 
          ${[
            patient.physicalClinical.nausea && 'Mual',
            patient.physicalClinical.vomiting && 'Muntah',
            patient.physicalClinical.diarrhea && 'Diare',
            patient.physicalClinical.constipation && 'Konstipasi',
            patient.physicalClinical.swallowingDifficulty && 'Sulit Menelan',
            patient.physicalClinical.chewingDifficulty && 'Sulit Mengunyah',
            patient.physicalClinical.edema && 'Bengkak (Edema)'
          ].filter(Boolean).join(', ') || 'Negatif (tidak ada keluhan pencernaan)'}
        </p>
        <p><strong>Tanda Defisiensi Zat Gizi:</strong> ${patient.physicalClinical.deficiencySigns || 'Tidak dijumpai tanda klinis nyata'}</p>

        <h3>C. Biokimia & Penanda Laboratorium</h3>
        ${biochemistryTable}

        <h3>D. Riwayat Makan (Dietary History) & Recall 24 Jam</h3>
        <p><strong>Pola Makan Kualitatif:</strong> ${patient.dietaryHistory.dietaryPattern || '--'}</p>
        <p><strong>Konsumsi Lauk Hewani:</strong> ${patient.dietaryHistory.animalProtein || '--'} | <strong>Lauk Nabati:</strong> ${patient.dietaryHistory.plantProtein || '--'}</p>
        <p><strong>Sayur & Buah:</strong> ${patient.dietaryHistory.vegFruit || '--'}</p>
        <p><strong>Metode Masak & Aditif:</strong> ${patient.dietaryHistory.cookingMethod || '--'} ; ${patient.dietaryHistory.foodAdditive || '--'}</p>
        <p><strong>Sosioekonomi & Terapi Obat:</strong> Sosial: ${patient.dietaryHistory.socialEconomic || 'Ekonomi cukup'} | Obat: ${patient.dietaryHistory.medications || 'Tidak ada obat terdaftar'}</p>
        
        <p class="bold" style="margin-top: 10px; font-size: 11pt; color: #475569;">Data Recall 24 Jam & Persentase Pemenuhan:</p>
        <table style="width: 80%;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th align="left">Zat Gizi</th>
              <th align="center">Hasil Recall</th>
              <th align="center">% Kecukupan terhadap Kebutuhan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="bold">Energi:</td>
              <td align="center">${patient.dietaryHistory.recallEnergy || '--'} kkal</td>
              <td align="center" class="bold" style="color: #0f766e;">${patient.dietaryHistory.recallEnergyPercent || '--'}%</td>
            </tr>
            <tr>
              <td class="bold">Protein:</td>
              <td align="center">${patient.dietaryHistory.recallProtein || '--'} g</td>
              <td align="center" class="bold" style="color: #0f766e;">${patient.dietaryHistory.recallProteinPercent || '--'}%</td>
            </tr>
            <tr>
              <td class="bold">Lemak:</td>
              <td align="center">${patient.dietaryHistory.recallFat || '--'} g</td>
              <td align="center" class="bold" style="color: #0f766e;">${patient.dietaryHistory.recallFatPercent || '--'}%</td>
            </tr>
            <tr>
              <td class="bold">Karbohidrat:</td>
              <td align="center">${patient.dietaryHistory.recallCarbo || '--'} g</td>
              <td align="center" class="bold" style="color: #0f766e;">${patient.dietaryHistory.recallCarboPercent || '--'}%</td>
            </tr>
          </tbody>
        </table>

        <h2>IV. Nutrition Diagnosis (Diagnosis Gizi - PES Table)</h2>
        ${diagnosesContent}

        <h2>V. Nutrition Intervention (Intervensi Gizi & Target)</h2>
        <table style="width: 100%;">
          <tr>
            <td width="42%" style="background-color: #f0fdfa; border: 1px solid #cbd5e1;">
              <strong style="color: #0f766e;">A. Rencana Kebutuhan Zat Gizi (TEE)</strong><br/><br/>
              • <strong>Total Kalori:</strong> ${patient.intervention.tee} kkal/hari<br/>
              • <strong>Protein target:</strong> ${patient.intervention.targetProtein} g (${Math.round(patient.intervention.targetProtein * 4)} kkal)<br/>
              • <strong>Lemak target:</strong> ${patient.intervention.targetFat} g (${Math.round(patient.intervention.targetFat * 9)} kkal)<br/>
              • <strong>Karbohidrat target:</strong> ${patient.intervention.targetCarbo} g (${Math.round(patient.intervention.targetCarbo * 4)} kkal)<br/>
              • <strong>Kebutuhan Cairan:</strong> ${patient.intervention.targetFluid} ml/hari
            </td>
            <td width="58%" style="border: 1px solid #cbd5e1;">
              <strong style="color: #334155;">B. Preskripsi Diet & Terapi Pangan</strong><br/><br/>
              • <strong>Jenis Diet:</strong> ${patient.intervention.dietType || '--'}<br/>
              • <strong>Bentuk Konsistensi:</strong> ${patient.intervention.foodTexture || '--'}<br/>
              • <strong>Tujuan Terapi:</strong> ${patient.intervention.dietGoal || '--'}<br/>
              • <strong>Prinsip & Syarat:</strong> ${patient.intervention.dietPrinciple || '--'} ; ${patient.intervention.dietRequirement || '--'}<br/>
              • <strong>Bahan Pangan Direkomendasikan:</strong> ${patient.intervention.foodRecommendation || '--'}
            </td>
          </tr>
        </table>
        
        <p><strong>Edukasi & Konseling Gizi:</strong> ${patient.intervention.nutritionCounseling || '--'}</p>
        <p><strong>Target Perubahan Perilaku:</strong> ${patient.intervention.behaviorChangeTarget || '--'}</p>

        <h2>VI. Nutrition Monitoring & Evaluation (PAGT Monev)</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th align="left">Parameter Pengawasan</th>
              <th align="left">Target Monev</th>
              <th align="left">Metode Pelaksanaan</th>
              <th align="left">Hasil Evaluasi Kelanjutan</th>
            </tr>
          </thead>
          <tbody>
            ${monitoringRows}
          </tbody>
        </table>
        
        ${(patient.monitoring?.newDiagnosis || patient.monitoring?.nextIntervention) ? `
        <div style="background-color: #f8fafc; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; margin-top: 10px;">
          <p><strong>Indikasi Diagnosis Gizi Baru:</strong> ${patient.monitoring.newDiagnosis || 'Tidak ada'}</p>
          <p><strong>Rencana Tindakan Intervensi Lanjutan:</strong> ${patient.monitoring.nextIntervention || 'Lanjutkan intervensi gizi tipe awal'}</p>
        </div>` : ''}

        <hr style="border: none; border-top: 1px solid #cbd5e1; margin-top: 40px;"/>
        
        <table style="border: none; width: 100%; margin-top: 30px;">
          <tr>
            <td width="60%" style="border: none; font-size: 8.5pt; color: #64748b; font-style: italic; padding: 0;">
              Catatan Penting: Dokumen ini diterbitkan oleh platform ADIMEKU sebagai resume asuhan gizi terstandar resmi penunjang rekam medis pasien. Terapi gizi harus selalu dikonsultasikan berkala bersama Dokter Penanggung Jawab Pelayanan (DPJP) yang berwenang.
            </td>
            <td width="40%" style="border: none; text-align: center; padding: 0;">
              <p style="margin: 0 0 45px 0;">Dietisien / Nutritionist Penanggung Jawab,</p>
              <p style="text-decoration: underline; font-weight: bold; margin-bottom: 2px; color: #011627;">${dietitianName || 'Eva Yulia Rahma'}</p>
              <p style="font-size: 8.5pt; color: #64748b; margin: 0;">nutritionist</p>
            </td>
          </tr>
        </table>

      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlString], {
      type: 'application/msword;charset=utf-8'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getSytematicIMT = (imt: number | ''): string => {
    if (imt === '') return 'Belum terisi';
    if (imt < 17) return 'Kekurangan BB Tingkat Berat';
    if (imt >= 17 && imt < 18) return 'Kekurangan BB Tingkat Ringan';
    if (imt >= 18 && imt < 23) return 'Normal';
    if (imt >= 23 && imt < 27) return 'Kelebihan BB Ringan (Overweight)';
    return 'Kelebihan BB Tingkat Berat (Obesitas)';
  };

  const getSelectedScreeningItems = () => {
    const list: string[] = [];
    if (patient.screening.weightLoss) list.push('Penurunan berat badan tidak direncanakan');
    if (patient.screening.poorAppetite) list.push('Nafsu makan menurun');
    if (patient.screening.chewingSwallowingDifficulty) list.push('Kesulitan mengunyah atau menelan');
    if (patient.screening.nauseaVomiting) list.push('Mengalami mual atau muntah');
    if (patient.screening.diarrheaConstipation) list.push('Mengalami diare atau konstipasi kronis');
    if (patient.screening.allergyIntolerance) list.push('Alergi atau intoleransi terhadap bahan zat gizi tertentu');
    if (patient.screening.specialDiet) list.push('Sedang menjalani diet khusus');
    if (patient.screening.enteralParenteral) list.push('Mendapat asupan terapi gizi enteral/parenteral');
    if (patient.screening.lowAlbumin) list.push('Kadar serum albumin tercatat rendah');
    return list;
  };

  const formattedDate = (dStr: string) => {
    try {
      const d = new Date(dStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dStr;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-slate-50 print:bg-white print:p-0 print:max-w-full">
      
      {/* Control Actions - hidden in print */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs print:hidden gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Rekam Medis
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border shadow-xs ${
              isGeneratingPdf
                ? 'bg-emerald-50 border-emerald-200 text-emerald-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 hover:shadow-sm'
            }`}
            id="adimeku-download-pdf-btn"
          >
            {isGeneratingPdf ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isGeneratingPdf ? 'Memproses PDF...' : 'Unduh Laporan (PDF)'}
          </button>

          <button
            onClick={handleDownloadWord}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border shadow-xs bg-blue-600 hover:bg-blue-700 text-white border-blue-500 hover:shadow-sm"
            id="adimeku-download-word-btn"
          >
            <FileText className="h-4 w-4" />
            Unduh Laporan (Word)
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 border border-slate-700 text-white text-xs font-bold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            id="adimeku-print-btn"
          >
            <Printer className="h-4 w-4" />
            Cetak Laporan / Browser Save
          </button>
        </div>
      </div>

      {/* Actual Medical Record Sheet */}
      <div 
        ref={reportRef}
        id="adimeku-report-sheet" 
        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 print:p-0 print:border-none print:shadow-none space-y-8 font-sans"
      >
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-5 text-center relative">
          <div className="absolute top-0 left-0 text-left hidden sm:flex items-center space-x-2 text-slate-400 print:flex">
            <Activity className="h-10 w-10 text-teal-600 shrink-0" />
            <div>
              <span className="text-xl font-black tracking-tight text-slate-800 leading-none">
                ADIME<span className="text-teal-600 font-extrabold">KU</span>
              </span>
              <span className="text-[10px] block font-semibold text-slate-400 mt-0.5">PAGT Kemenkes RI</span>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-snug">
            LAPORAN ASYHAN GIZI TERSTANDAR (ADIME)
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            Dokumen resmi asuhan gizi terstandar klinis berdasarkan klasifikasi NCP/PAGT Kemenkes RI.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 border-r border-slate-200 pr-5 last:border-none">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              Tgl Asuhan: {formattedDate(patient.entryDate)}
            </span>
            <span className="flex items-center gap-1.5 border-r border-slate-200 pr-5 last:border-none">
              <Clock className="h-3.5 w-3.5 text-teal-600" />
              Waktu Ekspor: {new Date().toLocaleDateString('id-ID')}
            </span>
          </div>
        </div>

        {/* 1. Patient Dossier Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <User className="h-4 w-4 text-teal-600" />
            I. Identitas & Profil Pasien
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">Nama Pasien:</span>
              <span className="font-bold text-slate-800">{patient.name || '--'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">No. Register Medis:</span>
              <span className="font-mono font-bold text-slate-800">{patient.registerNo || '--'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Umur / Jenis Kelamin:</span>
              <span className="font-bold text-slate-800">{patient.age} Tahun / {patient.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Status / Ruang Rawat:</span>
              <span className="font-bold text-slate-800">{patient.status} - {patient.room || '--'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Diagnosis Medis:</span>
              <span className="font-bold text-teal-950 leading-relaxed block col-span-2">{patient.medicalDiagnosis || '--'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Dokter Pengirim:</span>
              <span className="font-bold text-slate-800">{patient.doctor || '--'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 font-semibold block">Alamat / Kontak:</span>
              <span className="font-medium text-slate-700 leading-normal">{patient.addressPhone || '--'}</span>
            </div>
          </div>
        </div>

        {/* 2. Screening Awal */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <CheckSquare className="h-4 w-4 text-teal-600" />
            II. Skrining Awal Risiko Malnutrisi
          </h3>
          {getSelectedScreeningItems().length > 0 ? (
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
              <span className="text-[10px] text-rose-500 font-bold uppercase block mb-2">INDATOR RISIKO TERIDENTIFIKASI:</span>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1.5">
                {getSelectedScreeningItems().map((item, i) => (
                  <li key={i} className="leading-tight">{item}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
              ✓ Hasil skrining: Pasien diklasifikasikan sebagai Risiko Rendah (tidak ada keluhan kepatuhan dasar/kehilangan nafsu makan).
            </p>
          )}
        </div>

        {/* 3. ASSESSMENTS */}
        <div className="space-y-5">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <FileText className="h-4 w-4 text-teal-600" />
            III. Nutrition Assessment (Pengkajian Gizi)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 3a. Antropometri */}
            <div className="space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase border-b border-slate-200 pb-1 flex justify-between">
                <span>A. Antropometri</span>
                <span className="text-[10px] text-teal-600 font-mono">PAGT-A</span>
              </h4>
              <table className="min-w-full text-xs text-slate-700 divide-y divide-slate-100">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 text-slate-500 font-semibold">Berat Badan Aktual (BB):</td>
                    <td className="py-2 font-bold text-slate-800 text-right">{patient.anthropometry.currentWeight || '--'} kg</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 text-slate-500 font-semibold">Tinggi Badan (TB):</td>
                    <td className="py-2 font-bold text-slate-800 text-right">{patient.anthropometry.height || '--'} cm</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 text-slate-500 font-semibold">Berat Badan Ideal (BBI):</td>
                    <td className="py-2 font-bold text-teal-700 text-right">{patient.anthropometry.idealWeight || '--'} kg</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 text-slate-500 font-semibold">Indeks Massa Tubuh (IMT):</td>
                    <td className="py-2 font-bold text-slate-800 text-right">
                      {patient.anthropometry.imt ? patient.anthropometry.imt.toFixed(1) : '--'} kg/m²
                    </td>
                  </tr>
                  {patient.anthropometry.muac && (
                    <tr className="border-b border-slate-100">
                      <td className="py-2 text-slate-500 font-semibold">Lingkar Lengan Atas (LiLA):</td>
                      <td className="py-2 font-bold text-slate-800 text-right">{patient.anthropometry.muac} cm</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 text-slate-500 font-semibold">Status Gizi (Asia-Pasifik):</td>
                    <td className="py-2 font-bold text-teal-800 text-right uppercase">
                      {getSytematicIMT(patient.anthropometry.imt)}
                    </td>
                  </tr>
                  {patient.anthropometry.isChild && (
                    <tr className="bg-teal-50/50">
                      <td className="py-2 px-2 text-teal-900 font-bold">Interpretasi WHO Growth:</td>
                      <td className="py-2 px-2 font-bold text-teal-800 text-right uppercase">{patient.anthropometry.childInterpretation || 'Belum dipilih'}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 3b. Fisik / Klinis */}
            <div className="space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100 col-span-1">
              <h4 className="text-xs font-bold text-slate-800 uppercase border-b border-slate-200 pb-1 flex justify-between">
                <span>B. Fisik / Pemeriksaan Klinis</span>
                <span className="text-[10px] text-teal-600 font-mono">PAGT-F</span>
              </h4>
              <div className="text-xs text-slate-700 space-y-2">
                <p>
                  <strong className="text-slate-500 font-semibold">Riwayat Penyakit & Keluhan:</strong><br />
                  <span className="font-medium text-slate-800 leading-normal block mt-0.5">{patient.physicalClinical.medicalHistory || 'Tidak ada riwayat signifikan'}</span>
                </p>
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 font-mono">
                  <div>
                    <span className="text-slate-400 font-bold block">Vital Signs:</span>
                    <span className="font-semibold text-slate-800">
                      TD: {patient.physicalClinical.systolic || '--'}/{patient.physicalClinical.diastolic || '--'} mmHg<br />
                      Nadi: {patient.physicalClinical.pulse || '--'} x/m<br />
                      Suhu: {patient.physicalClinical.temperature || '--'} °C
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Keluhan GI Tracker:</span>
                    <span className="font-semibold text-slate-800 block text-[11px]">
                      {patient.physicalClinical.nausea && '• Mual '}
                      {patient.physicalClinical.vomiting && '• Muntah '}
                      {patient.physicalClinical.diarrhea && '• Diare '}
                      {patient.physicalClinical.constipation && '• Konstipasi '}
                      {patient.physicalClinical.swallowingDifficulty && '• Sulit Menelan '}
                      {patient.physicalClinical.chewingDifficulty && '• Sulit Mengunyah '}
                      {patient.physicalClinical.edema && '• bengkak (edema)'}
                      {(!patient.physicalClinical.nausea && !patient.physicalClinical.vomiting && !patient.physicalClinical.diarrhea && !patient.physicalClinical.constipation && !patient.physicalClinical.swallowingDifficulty && !patient.physicalClinical.chewingDifficulty && !patient.physicalClinical.edema) && 'Keluhan GI Negatif'}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-2 text-[11px] font-sans">
                  <span className="text-slate-500 font-semibold block">Tanda Defisiensi Zat Gizi:</span>
                  <span className="font-medium text-slate-800 block mt-0.5">{patient.physicalClinical.deficiencySigns || 'Tidak dijumpai tanda klinis nyata'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3c. Biokimia */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase border-b border-slate-200 pb-1.5 flex justify-between mb-3 text-left">
              <span>C. Biokimia & Penanda Laboratorium</span>
              <span className="text-[10px] text-teal-600 font-mono">PAGT-B</span>
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
              {Object.entries(BIOMARKER_RANGES).map(([key, marker]) => {
                const value = patient.biochemistry[key as keyof Patient['biochemistry']];
                if (value === '' || value === undefined) return null;
                
                // Fetch dynamic clinical threshold
                const getInterText = () => {
                  if (key === 'gdp') {
                    const normMin = patient.anthropometry.isChild ? 60 : 70;
                    if (value < normMin) return 'Rendah';
                    if (value > 100) return 'Tinggi';
                    return 'Normal';
                  }
                  if (key === 'gds') {
                    if (value < 140) return 'Normal';
                    if (value >= 140 && value <= 200) return 'Pradiabetes';
                    return 'Diabetes';
                  }
                  if (key === 'albumin') {
                    if (value < 3.5) return 'Rendah';
                    if (value > 5.5) return 'Tinggi';
                    return 'Normal';
                  }
                  if (key === 'hb') {
                    const lim = patient.gender === 'Laki-laki' ? 13 : 12;
                    return value < lim ? 'Rendah' : 'Normal';
                  }
                  if (key === 'totalCholesterol') {
                    if (value < 200) return 'Normal';
                    if (value >= 200 && value < 240) return 'Tinggi (Batas)';
                    return 'Sangat Tinggi';
                  }
                  return 'Terekam';
                };
                
                const statusStr = getInterText();
                const isAbnormal = statusStr !== 'Normal' && statusStr !== 'Terekam';

                return (
                  <div key={key} className={`p-2.5 rounded-lg border ${isAbnormal ? 'bg-rose-50/40 border-rose-100 text-rose-950' : 'bg-white border-slate-100 text-slate-900'} space-y-0.5`}>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">{marker.name}</span>
                    <span className="text-xs font-black font-mono block mt-1">{value} {marker.unit}</span>
                    <span className={`text-[10px] font-bold inline-block px-1.5 py-0.5 rounded-sm mt-1 leading-none ${isAbnormal ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {statusStr}
                    </span>
                  </div>
                );
              })}
              {Object.values(patient.biochemistry).every((v) => v === '') && (
                <p className="text-xs text-slate-400 col-span-4 py-2 text-center font-medium italic">Tidak ada penanda uji biokimia yang terekam.</p>
              )}
            </div>
          </div>

          {/* 3d. Riwayat Gizi - Gizi & Sosial */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase border-b border-slate-200 pb-1.5 flex justify-between mb-3 text-left">
              <span>D. Riwayat Makan (Dietary History) & Recall 24 Jam</span>
              <span className="text-[10px] text-teal-600 font-mono">PAGT-D</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
              <div className="space-y-2">
                <p><strong className="text-slate-500 font-semibold block">Pola Makan Kualitatif:</strong> {patient.dietaryHistory.dietaryPattern || '--'}</p>
                <p><strong className="text-slate-500 font-semibold block">Konsumsi Lauk Hewani:</strong> {patient.dietaryHistory.animalProtein || '--'}</p>
                <p><strong className="text-slate-500 font-semibold block">Konsumsi Lauk Nabati:</strong> {patient.dietaryHistory.plantProtein || '--'}</p>
                <p><strong className="text-slate-500 font-semibold block">Konsumsi Sayur & Buah:</strong> {patient.dietaryHistory.vegFruit || '--'}</p>
                <p><strong className="text-slate-500 font-semibold block">Metode Masak & Aditif:</strong> {patient.dietaryHistory.cookingMethod || '--'} ; {patient.dietaryHistory.foodAdditive || '--'}</p>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 font-mono text-[11px] leading-relaxed">
                  <strong className="text-slate-500 font-bold block mb-1">DATA SOSIOEKONOMI & TERAPI OBAT:</strong>
                  • Sosial: {patient.dietaryHistory.socialEconomic || 'Ekonomi cukup'}<br />
                  • Obat-obatan: {patient.dietaryHistory.medications || 'Tidak ada obat terdaftar'}
                </div>
              </div>

              <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3.5">
                <span className="font-bold text-slate-800 text-xs block border-b border-slate-100 pb-1">RECALL 24 JAM & PERSENTASE KECUKUPAN</span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[9px] text-slate-400 font-bold block">ENERGI</span>
                    <span className="text-xs font-black text-slate-800">{patient.dietaryHistory.recallEnergy || '--'} kkal</span>
                    <span className="text-[11px] font-bold text-teal-700 block mt-1">{patient.dietaryHistory.recallEnergyPercent || '--'}%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[9px] text-slate-400 font-bold block">PROTEIN</span>
                    <span className="text-xs font-black text-slate-800">{patient.dietaryHistory.recallProtein || '--'}g</span>
                    <span className="text-[11px] font-bold text-teal-700 block mt-1">{patient.dietaryHistory.recallProteinPercent || '--'}%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[9px] text-slate-400 font-bold block">LEMAK</span>
                    <span className="text-xs font-black text-slate-800">{patient.dietaryHistory.recallFat || '--'}g</span>
                    <span className="text-[11px] font-bold text-teal-700 block mt-1">{patient.dietaryHistory.recallFatPercent || '--'}%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[9px] text-slate-400 font-bold block">KARBO</span>
                    <span className="text-xs font-black text-slate-800">{patient.dietaryHistory.recallCarbo || '--'}g</span>
                    <span className="text-[11px] font-bold text-teal-700 block mt-1">{patient.dietaryHistory.recallCarboPercent || '--'}%</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-sans leading-snug">
                  *Kritikal Evaluasi: Persentase asupan gizi dihitung bersanding dengan angka kecukupan TEE harian yang dibutuhkan demi pemantauan nutrisi ketat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. DIAGNOSIS GIZI (PES TABLE) */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <Bookmark className="h-4 w-4 text-teal-600" />
            IV. Nutrition Diagnosis (Diagnosis Gizi - PES Table)
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-xs text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left font-bold text-slate-700 w-10">No</th>
                  <th scope="col" className="px-4 py-2 text-left font-bold text-slate-700 w-1/4">Problem Gizi E-NCPT</th>
                  <th scope="col" className="px-4 py-2 text-left font-bold text-slate-700 w-1/4">Etiologi (Penyebab)</th>
                  <th scope="col" className="px-4 py-2 text-left font-bold text-slate-700 w-1/4">Sign & Symptoms (Tanda)</th>
                  <th scope="col" className="px-4 py-2 text-left font-bold text-slate-700">Pernyataan Kalimat Diagnosis Gizi (PES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {patient.diagnoses.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-teal-800 text-[10px] block">{d.problemCode}</span>
                      <strong className="font-semibold text-slate-800">{d.problemLabel}</strong>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{d.etiology}</td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{d.signsSymptoms}</td>
                    <td className="px-4 py-3 font-serif italic text-teal-900 bg-teal-50/10 leading-relaxed font-semibold">
                      "{d.problemLabel} berkaitan dengan {d.etiology} ditandai dengan {d.signsSymptoms}."
                    </td>
                  </tr>
                ))}
                {patient.diagnoses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 italic">Belum ada diagnosis PES terdokumentasi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. INTERVENSI GIZI */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <HeartPlus className="h-4 w-4 text-teal-600" />
            V. Nutrition Intervention (Intervensi Gizi & Target Zat Gizi)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            {/* Targets */}
            <div className="bg-teal-50/30 border border-teal-100 rounded-xl p-4 md:col-span-1 font-mono">
              <span className="font-bold text-teal-900 text-xs block mb-3 uppercase tracking-wider border-b border-teal-100 pb-1">TARGET DISTRIBUSI ZAT GIZI</span>
              <div className="space-y-2.5">
                <div className="flex justify-between border-b border-teal-50 pb-1">
                  <span className="text-emerald-950 font-bold">Total Kalori (TEE):</span>
                  <span className="font-black text-emerald-900">{patient.intervention.tee} kkal/hari</span>
                </div>
                <div className="flex justify-between border-b border-teal-50 pb-1">
                  <span className="text-teal-950 font-bold">Protein target:</span>
                  <span className="font-black text-teal-900">{patient.intervention.targetProtein} g ({Math.round(patient.intervention.targetProtein * 4)} kkal)</span>
                </div>
                <div className="flex justify-between border-b border-teal-50 pb-1">
                  <span className="text-teal-950 font-bold">Lemak target:</span>
                  <span className="font-black text-teal-900">{patient.intervention.targetFat} g ({Math.round(patient.intervention.targetFat * 9)} kkal)</span>
                </div>
                <div className="flex justify-between border-b border-teal-50 pb-1">
                  <span className="text-teal-950 font-bold">Karbohidrat target:</span>
                  <span className="font-black text-teal-900">{patient.intervention.targetCarbo} g ({Math.round(patient.intervention.targetCarbo * 4)} kkal)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-950 font-bold">Kebutuhan Cairan:</span>
                  <span className="font-black text-teal-900">{patient.intervention.targetFluid} ml/hari</span>
                </div>
              </div>
            </div>

            {/* Prescriptions */}
            <div className="md:col-span-2 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-semibold block">Jenis Diet:</span>
                  <span className="font-bold text-slate-800">{patient.intervention.dietType || '--'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Bentuk Konsistensi Pangan:</span>
                  <span className="font-bold text-slate-800">{patient.intervention.foodTexture || '--'}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <p>
                  <strong className="text-slate-500 font-semibold block text-[11px] leading-tight">Tujuan Diet:</strong>
                  <span className="font-medium text-slate-800">{patient.intervention.dietGoal || '--'}</span>
                </p>
                <p>
                  <strong className="text-slate-500 font-semibold block text-[11px] leading-tight">Prinsip & Syarat Diet:</strong>
                  <span className="font-medium text-slate-800">{patient.intervention.dietPrinciple || '--'} ; {patient.intervention.dietRequirement || '--'}</span>
                </p>
                <p className="col-span-2 border-t border-slate-100 pt-1.5">
                  <strong className="text-slate-500 font-semibold block text-[11px]">Rekomendasi Bahan Pangan:</strong>
                  <span className="font-medium text-slate-800 block mt-0.5 leading-normal">{patient.intervention.foodRecommendation || '--'}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs">
            <span className="font-bold text-slate-800 block mb-2 uppercase text-[10px]">Edukasi & Konseling Gizi:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong className="text-slate-500 block leading-tight">Terapi Gizi & Penyuluhan:</strong> <span className="font-medium text-slate-700 mt-1 block">{patient.intervention.nutritionCounseling || '--'}</span></p>
              <p><strong className="text-slate-500 block leading-tight">Target Perubahan Perilaku Pasien:</strong> <span className="font-medium text-slate-700 mt-1 block">{patient.intervention.behaviorChangeTarget || '--'}</span></p>
            </div>
          </div>
        </div>

        {/* 6. MONITORING & EVALUASI */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1.5">
            <TrendingUp className="h-4 w-4 text-teal-600" />
            VI. Nutrition Monitoring & Evaluation (PAGT Monev)
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-xs text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left font-bold text-slate-700 w-1/4">Parameter Pengawasan</th>
                  <th scope="col" className="px-4 py-2 text-left font-bold text-slate-700 w-1/4">Target Monev</th>
                  <th scope="col" className="px-4 py-2 text-left font-bold text-slate-700 w-1/4">Metode Pelaksanaan</th>
                  <th scope="col" className="px-4 py-2 text-left font-bold text-slate-700">Hasil Evaluasi Kelanjutan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="px-4 py-2.5 font-bold text-slate-800">Antropometri</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.anthropometryTarget || 'Pertahankan atau perbaiki BB'}</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.anthropometryAction || 'Lakukan penimbangan berkala'}</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.anthropometryEvaluation || 'Sesuai ekspektasi klinis'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-bold text-slate-800">Biokimia</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.biochemistryTarget || 'Dekatkan hasil lab pada rujukan normal'}</td>
                  <td className="px-4 py-3">{patient.monitoring?.biochemistryAction || 'Cek ulang panel lab klinis'}</td>
                  <td className="px-4 py-3">{patient.monitoring?.biochemistryEvaluation || 'Nilai lab berangsur paten'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-bold text-slate-800">Fisik / Klinis</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.clinicalTarget || 'Meredakan gejala GI dan tanda edema'}</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.clinicalAction || 'Pengecekan fisik rutin'}</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.clinicalEvaluation || 'Kemajuan pemulihan pesat'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-bold text-slate-800">Asupan Makanan</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.dietaryTarget || 'Asupan makan oral terpenuhi minimal 80%'}</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.dietaryAction || 'Metode Comstock dan record makanan harian'}</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.dietaryEvaluation || 'Porsi makanan habis tinggi'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-bold text-slate-800">Kepatuhan Diet</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.complianceTarget || 'Patuh sepenuhnya pada asuhan diet'}</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.complianceAction || 'Wawancara and feed-back diet harian'}</td>
                  <td className="px-4 py-2.5">{patient.monitoring?.complianceEvaluation || 'Komitmen tinggi ditunjukkan'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* New diagnostics & next steps */}
          {(patient.monitoring?.newDiagnosis || patient.monitoring?.nextIntervention) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-3 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
              <p><strong className="text-slate-600 block">Indikasi Diagnosis Gizi Baru:</strong> <span className="font-medium text-slate-700 italic block mt-0.5">{patient.monitoring.newDiagnosis || 'Tidak ada'}</span></p>
              <p><strong className="text-slate-600 block">Rencana Tindakan Intervensi Lanjutan:</strong> <span className="font-medium text-slate-700 block mt-0.5">{patient.monitoring.nextIntervention || 'Lanjutkan intervensi gizi tipe awal'}</span></p>
            </div>
          )}
        </div>

        {/* 7. Clinical Disclaimer & Signature Block */}
        <div className="border-t border-slate-300 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-500 leading-relaxed">
          <div className="space-y-2">
            <span className="font-black text-slate-700 block uppercase text-[10px]">Catatan Penting Keamanan Evaluasi Medis:</span>
            <p className="italic">
              Aplikasi ADIMEKU adalah instrumen pengambil keputusan penunjang dokumentasi diet klinis, bukan pengganti mutlak penilaian klinis profesional terpercaya. Seluruh tindakan terapi gizi wajib dikoordinasikan klinis dengan dokter dokter spesialis dan paramedik penanggung jawab pasien.
            </p>
          </div>

          {/* Signature lines */}
          <div className="text-center md:text-right flex flex-col justify-end items-end space-y-12">
            <div>
              <p className="font-semibold text-slate-700">Dietisien / Nutritionist Penanggung Jawab,</p>
            </div>
            <div className="w-48 text-center border-t border-slate-700 pt-1.5 font-bold text-slate-800 uppercase">
              {dietitianName || 'Eva Yulia Rahma'}
              <span className="text-[10px] text-slate-500 block font-normal capitalize">nutritionist</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
