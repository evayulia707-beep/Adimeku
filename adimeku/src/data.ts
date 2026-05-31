/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient } from './types';

export const ACTIVITY_FACTORS = [
  { label: 'Sangat Ringan (Bedrest total) - 1.0', value: 1.0 },
  { label: 'Ringan (Kerja kantoran, jalan santai) - 1.2', value: 1.2 },
  { label: 'Sedang (Guru, aktivitas rumah tangga, olahraga ringan) - 1.3', value: 1.3 },
  { label: 'Berat (Kuli bangunan, petani, olahraga intensif) - 1.5', value: 1.5 },
];

export const STRESS_FACTORS = [
  { label: 'Normal / Tanpa Stres - 1.0', value: 1.0 },
  { label: 'Stres Ringan (Infeksi ringan, pemulihan bedah minor) - 1.1', value: 1.1 },
  { label: 'Stres Sedang (Patah tulang, penyakit kronis, bedah mayor) - 1.3', value: 1.3 },
  { label: 'Stres Berat (Sepsis, trauma ganda, luka bakar luas) - 1.5', value: 1.5 },
  { label: 'Kanker / Malignant - 1.4', value: 1.4 },
];

export const TEMPLATE_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'Budi Santoso',
    registerNo: 'REG/2026/0892',
    age: 52,
    gender: 'Laki-laki',
    room: 'Melati Room 3A',
    entryDate: '2026-05-28',
    medicalDiagnosis: 'Diabetes Mellitus Tipe 2, Chronic Kidney Disease Stage III, Hipoalbuminemia',
    doctor: 'dr. Ahmad Fauzi, Sp.PD',
    addressPhone: 'Jl. Sudirman No. 45, Jakarta Selatan (0812-3456-7890)',
    status: 'Rawat Inap',
    createdAt: '2026-05-28T09:00:00Z',

    // 1. Skrining Awal
    screening: {
      weightLoss: true,
      poorAppetite: true,
      chewingSwallowingDifficulty: false,
      nauseaVomiting: true,
      diarrheaConstipation: false,
      allergyIntolerance: false,
      specialDiet: true,
      enteralParenteral: false,
      lowAlbumin: true,
    },

    // 2. Assessment Antropometri
    anthropometry: {
      currentWeight: 78,
      idealWeight: 63, // Calculated: (170 - 100) - 10%(70) = 70 - 7 = 63 kg
      height: 170,
      imt: 27.0, // Calculated: 78 / (1.7^2) = 27.0
      nutritionalStatus: 'Kelebihan BB Tingkat Berat (Obesitas)',
      muac: 32,
      isChild: false,
      childInterpretation: '',
    },

    // 3. Assessment Biokimia/Laboratorium
    biochemistry: {
      gdp: 185, // High (>100)
      gds: 245, // Diabetes (>200)
      kreatinin: 1.8, // High for male (>1.2)
      albumin: 2.9, // Low (<3.5)
      transferrin: 1.8, // Low (<2.0)
      rbp: 2.1, // Low (<2.5)
      totalCholesterol: 250, // Sangat Tinggi (>=240)
      hdl: 38, // Rendah (<40)
      ldl: 165, // Batas Tinggi (160-189)
      triglyceride: 220, // Batas Tinggi
      vitaminA: 25,
      hb: 11.5, // Rendah for male (<13)
    },

    // 4. Assessment Fisik/Klinis
    physicalClinical: {
      medicalHistory: 'Pasien datang dengan keluhan badan lemas sejak 3 hari yang lalu, polidipsi, poliuri pada malam hari, mual di pagi hari, dan bengkak di pergelangan kaki.',
      generalCondition: 'Sadar penuh (Compos Mentis), tampak lemas lemah fisik.',
      systolic: 140,
      diastolic: 90,
      pulse: 88,
      temperature: 36.8,
      nausea: true,
      vomiting: false,
      diarrhea: false,
      constipation: false,
      swallowingDifficulty: false,
      chewingDifficulty: false,
      edema: true,
      appetite: 'Kurang',
      deficiencySigns: 'Konjungtiva anemis, edema bilateral pitting pada ekstremitas bawah.',
    },

    // 5. Riwayat Gizi/Dietary History
    dietaryHistory: {
      dietaryPattern: 'Makan 3 kali sehari dengan porsi besar, sering mengonsumsi nasi putih hangat, menyukai lauk digoreng garing, serta minuman manis kemasan.',
      animalProtein: 'Ayam goreng, telur ceplok hampir setiap hari.',
      plantProtein: 'Tahu dan tempe goreng.',
      vegFruit: 'Jarang makan sayur, menyukai buah pisang.',
      stapleFood: 'Nasi putih 3-4 centong per sajian.',
      snack: 'Gorengan di sore hari.',
      cookingMethod: 'Sering digoreng (deep-fry), bersantan.',
      supplement: 'Tidak ada.',
      foodAdditive: 'Penggunaan MSG dan kecap manis cukup tinggi.',
      exercise: 'Jarang sekali berolahraga, aktivitas fisik sangat ringan.',
      recallEnergy: 2400,
      recallProtein: 85,
      recallFat: 90,
      recallCarbo: 310,
      recallEnergyPercent: 125, // Asumsi kebutuhan sekitar 1900 kkal
      recallProteinPercent: 121,
      recallFatPercent: 130,
      recallCarboPercent: 123,
      pastNutritionHistory: 'Keluarga memiliki riwayat diabetes (ibu). Pasien belum pernah mendapat edukasi nutrisi formal sebelumnya.',
      socialEconomic: 'Pensiunan swasta, tinggal bersama istri dan anak, tingkat ekonomi menengah.',
      medications: 'Metformin 500mg (3x1), Furosemide 40mg (1x1).',
    },

    // 6. Diagnosis Gizi (PES)
    diagnoses: [
      {
        id: 'diag-1',
        domain: 'NI',
        problemCode: 'NI-5.3',
        problemLabel: 'Asupan protein-energi tidak adekuat (lebih/overnutrition)',
        etiology: 'Kurangnya kesadaran gizi terkait porsi piring makan dan konsumsi makanan padat energi tinggi lemak karbohidrat',
        signsSymptoms: 'Hasil recall 24 jam menunjukkan asupan energi mencapai 125% dari perkiraan kebutuhan dan kadar gula darah tinggi.'
      },
      {
        id: 'diag-2',
        domain: 'NC',
        problemCode: 'NC-2.2',
        problemLabel: 'Perubahan nilai laboratorium terkait gizi',
        etiology: 'Gangguan klirens ginjal sekunder akibat nefropati diabetik dan penurunan kapasitas metabolisme lemak karbohidrat',
        signsSymptoms: 'Ditandai dengan serum kreatinin tinggi (1.8 mg/dL), hipoalbuminemia (2.9 g/dL), dan hemoglobin rendah (11.5 g/dL).'
      }
    ],

    // 7. Intervensi Gizi
    intervention: {
      dietGoal: 'Membantu menurunkan kadar glukosa darah menuju batas normal, mengurangi beban ginjal dengan pembatasan protein terkontrol, mempertahankan status volume cairan tubuh, serta memperbaiki kadar albumin darah.',
      dietPrinciple: 'Diet DM (Gula rendah/karbohidrat kompleks), Rendah Protein (CKD non-dialisis), Rendah Garam (karena edema).',
      dietRequirement: 'Energi disesuaikan dengan BBI karena kategori Obesitas, Protein moderat 0.8g/kg BBI, Karbohidrat kompleks 55% total energi, Lemak 25% total energi, pembatasan asupan Na <2000 mg sehari.',
      dietType: 'Diet DM 1700 kkal + Rendah Protein CKD + Rendah Garam II',
      foodTexture: 'Makanan Lunak / Tim nasi',
      nutritionTherapyPlan: 'Pemberian formula enteral glukosa-spesifik jika asupan oral menurun, pemantauan asupan 3 hari berturut-turut.',
      nutritionCounseling: 'Edukasi piring sehat DM, pembatasan buah tinggi kalium (CKD) dan bahan pengawet/natrium tinggi, demonstrasi porsi makan menggunakan food model.',
      behaviorChangeTarget: 'Dapat mengganti nasi putih hangat dengan nasi dingin/merah, mengurangi asupan gorengan, serta membatasi jajan minuman manis.',
      foodRecommendation: 'Rekomendasi karbohidrat: Oatmeal, beras merah, kentang kukus. Protein: Putih telur, dada ayam tanpa kulit digulung tim, tahu kukus. Hindari: Jeroan, sosis, kornet, ikan asin.',
      bmr: 1332, // Calculated based on formula
      activityFactor: 1.2,
      stressFactor: 1.1,
      tee: 1758,
      targetProtein: 50, // CKD non dialisis 0.8g * 63kg BBI
      targetFat: 48,
      targetCarbo: 280,
      targetFluid: 1500,
    },

    // 8. Monitoring dan Evaluasi
    monitoring: {
      anthropometryTarget: 'Mempertahankan atau menurunkan BB secara perlahan menuju BBI (target realistis 1-2 kg per bulan).',
      anthropometryAction: 'Penimbangan BB setiap minggu pada kondisi hidrasi yang stabil (tanpa edema).',
      anthropometryEvaluation: 'Pengurangan berat badan fiktif karena penurunan edema kaki wajib diperhitungkan.',

      biochemistryTarget: 'Kadar albumin meningkat ke >= 3.2 g/dL, GDP turun < 130 mg/dL, dan ureum/kreatinin terkontrol.',
      biochemistryAction: 'Pengambilan sampel darah vena laboratorium berkala oleh dokter penanggung jawab.',
      biochemistryEvaluation: 'Gula darah puasa turun dari 185 mg/dL menjadi 140 mg/dL setelah 3 hari terapi di rutan.',

      clinicalTarget: 'Tekanan darah turun mendekati normal (120/80 mmHg), edema ekstremitas berkurang atau hilang.',
      clinicalAction: 'Pemeriksaan fisik setiap pagi hari oleh perawat dan nutrisionis.',
      clinicalEvaluation: 'Bengkak edema berkurang dari pitting grado 2+ menjadi grado 1+.',

      dietaryTarget: 'Asupan porsi makan mencakup minimal 80% dari target diet terapi (energi 1400 kkal, protein 40-50g).',
      dietaryAction: 'Observasi sisa makanan di piring katering rumah sakit (metode Comstock).',
      dietaryEvaluation: 'Pasien menghabiskan 85% porsi makanan lunak yang disediakan rumah sakit.',

      complianceTarget: 'Pasien dan keluarga memahami diet khusus diabetes-rendah protein dan patuh membawakan makanan luar rumah sakit.',
      complianceAction: 'Kunjungan edukasi gizi ke bed pasien serta tanda tangan lembar kepatuhan katering.',
      complianceEvaluation: 'Keluarga berkomitmen tidak lagi menyuplai kue manis-gurih ke dalam ruang rawat.',

      newDiagnosis: 'Belum diperlukan diagnosis gizi baru, melanjutkan rencana terapi dengan penyesuaian porsi.',
      nextIntervention: 'Melanjutkan pembatasan natrium dan protein terkontrol serta memberikan dukungan enteral jika asupan makan oral menurun pagi hari.',
    }
  },
  {
    id: 'pat-2',
    name: 'Retno Wulandari',
    registerNo: 'REG/2026/0911',
    age: 28,
    gender: 'Perempuan',
    room: 'Poli Gizi Rawat Jalan',
    entryDate: '2026-05-30',
    medicalDiagnosis: 'Hypercholesterolemia Berat, Riwayat Gerd aktif',
    doctor: 'dr. Shinta Rahayu, Sp.PD',
    addressPhone: 'Kavling Wisata Indah Blok B/12, Bandung (0857-1111-2222)',
    status: 'Rawat Jalan',
    createdAt: '2026-05-30T10:30:00Z',

    // 1. Skrining Awal
    screening: {
      weightLoss: false,
      poorAppetite: false,
      chewingSwallowingDifficulty: false,
      nauseaVomiting: true,
      diarrheaConstipation: true,
      allergyIntolerance: false,
      specialDiet: false,
      enteralParenteral: false,
      lowAlbumin: false,
    },

    // 2. Assessment Antropometri
    anthropometry: {
      currentWeight: 51,
      idealWeight: 49.5, // (155 - 100) = 55. Bila TB <155: TB - 100. TB is 155, so 155-100 = 55kg? Wait! Instructions say: BBI = (TB-100)-10%(TB-100) bila TB >155cm. Bila TB <=155cm, gunakan TB-100.
      height: 155,
      imt: 21.2, // normal
      nutritionalStatus: 'Normal',
      muac: '',
      isChild: false,
      childInterpretation: '',
    },

    // 3. Assessment Biokimia/Laboratorium
    biochemistry: {
      gdp: 88,
      gds: 110,
      kreatinin: 0.7,
      albumin: 4.1,
      transferrin: 2.5,
      rbp: '',
      totalCholesterol: 285, // Sangat tinggi (>240)
      hdl: 52, // Normal (>50)
      ldl: 195, // Sangat tinggi (>190)
      triglyceride: 175, // Perlu evaluasi lanjut (>150)
      vitaminA: '',
      hb: 12.8,
    },

    // 4. Assessment Fisik/Klinis
    physicalClinical: {
      medicalHistory: 'Pasien sering merasakan nyeri dada kiri, pusing di leher bagian belakang sejak 2 minggu terakhir. Mengalami kembung dan begah/ulu hati perih jika terlambat makan.',
      generalCondition: 'Compos mentis, mandiri, keluhan nyeri kepala ringan kambuhan.',
      systolic: 125,
      diastolic: 80,
      pulse: 76,
      temperature: 36.5,
      nausea: true,
      vomiting: false,
      diarrhea: false,
      constipation: true,
      swallowingDifficulty: false,
      chewingDifficulty: false,
      edema: false,
      appetite: 'Baik',
      deficiencySigns: 'Tidak ditemukan tanda defisiensi vitamin/mineral nyata.',
    },

    // 5. Riwayat Gizi/Dietary History
    dietaryHistory: {
      dietaryPattern: 'Pola makan teratur 3 kali sehari, menyukai gorengan, udang, cumi-cumi tepung, kikil sapi, dan masakan Padang bersantan kental.',
      animalProtein: 'Daging ayam dengan kulit goreng tepung, cumi-cumi sering dikonsumsi.',
      plantProtein: 'Tempe goreng tepung garing.',
      vegFruit: 'Sangat jarang mengonsumsi buah, sayur hanya kubis pada sop.',
      stapleFood: 'Nasi putih 2 centong per sajian.',
      snack: 'Cireng, cilok, kerupuk kulit.',
      cookingMethod: 'Digoreng, tumis minyak banyak, atau gulai bersantan pekat.',
      supplement: 'Minyak ikan kadang-kadang.',
      foodAdditive: 'Penyedap rasa buatan dosis tinggi.',
      exercise: 'Jalan kaki pagi hanya 1 kali seminggu, dominan duduk depan laptop (desk-job).',
      recallEnergy: 2100,
      recallProtein: 72,
      recallFat: 95, // Tinggi lemak jenuh
      recallCarbo: 238,
      recallEnergyPercent: 121,
      recallProteinPercent: 120,
      recallFatPercent: 140,
      recallCarboPercent: 110,
      pastNutritionHistory: 'Dietary habit tinggi kolesterol jenuh semenjak 3 tahun kuliah kerja kantoran.',
      socialEconomic: 'Pegawai swasta IT, tinggal sendiri, finansial cukup baik.',
      medications: 'Omeprazole 20mg kapsul (2x1), Atorvastatin 20mg malam hari.',
    },

    // 6. Diagnosis Gizi (PES)
    diagnoses: [
      {
        id: 'diag-3',
        domain: 'NI',
        problemCode: 'NI-5.6.2',
        problemLabel: 'Kelebihan asupan lemak',
        etiology: 'Pilihan makanan yang salah tinggi asam lemak jenuh dan tinggi kolesterol diet harian',
        signsSymptoms: 'Ditandai dengan asupan lemak recall 24 jam mencapai 140% kebutuhan dan nilai Kolesterol Total yang tinggi (285 mg/dL) serta LDL jenuh (195 mg/dL).'
      },
      {
        id: 'diag-4',
        domain: 'NB',
        problemCode: 'NB-1.3',
        problemLabel: 'Pemilihan makanan yang salah',
        etiology: 'Kurangnya pemahaman mengenai dampak lemak jenuh terhadap sirkulasi darah dan kurangnya keterampilan membaca label gizi kemasan',
        signsSymptoms: 'Ditandai dengan konsumsi harian masakan bersantan pekat, cireng gorengan tepung, penolakan konsumsi sayur-buah serat laut.'
      }
    ],

    // 7. Intervensi Gizi
    intervention: {
      dietGoal: 'Membantu menurunkan asupan kolesterol pangan hingga < 200 mg sehari, menurunkan kadar kolesterol LDL dan kolesterol total mendekati normal, serta meredakan iritasi asam lambung kronis.',
      dietPrinciple: 'Diet Jantung / Rendah Kolesterol dan Rendah Lemak Jenuh (TLC Diet) + Diet Lambung (hindari pedas/asam/gas).',
      dietRequirement: 'Energi sesuai kebutuhan aktual karena IMT normal (51 kg), lemak berkisar 20% total energi prioritas lemak tidak jenuh ganda (PUFA), protein cukup 15% total energi, karbohidrat kompleks kaya serat larut air (Oat, apel) 65% total kalori.',
      dietType: 'Diet Jantung I + Diet Gizi Seimbang Rendah Kolesterol 1600 kkal',
      foodTexture: 'Makanan Biasa',
      nutritionTherapyPlan: 'Edukasi dan modifikasi menu masakan dalam 14 hari bebas gorengan.',
      nutritionCounseling: 'Edukasi memasak tanpa menggoreng (rebus, kukus, pepes), pengenalan sayur berserat tinggi pengikat empedu kolesterol, pembagian porsi makan kecil tapi sering (mencegah Gerd).',
      behaviorChangeTarget: 'Dapat makan buah apel/pir minimal 2 porsi sehari dan mengganti gorengan tepung dengan edamame kukus atau buah berakar.',
      foodRecommendation: 'Rekomendasi pangan: Gandum utuh, oatmeal, ikan kembung/salmon kukus, tempe bacem panggang tanpa minyak, pepaya, brokoli rebus, minyak zaitun dosis rendah. Batasi: Kulit ayam, jeroan, margarin, santan gumpal.',
      bmr: 1251,
      activityFactor: 1.2,
      stressFactor: 1.0,
      tee: 1501,
      targetProtein: 56,
      targetFat: 33,
      targetCarbo: 244,
      targetFluid: 2000,
    },

    // 8. Monitoring dan Evaluasi
    monitoring: {
      anthropometryTarget: 'Mempertahankan berat badan stabil pada rentang normal (50-52 kg) dengan komposisi tubuh bugar.',
      anthropometryAction: 'Penimbangan mandiri setiap 2 minggu sekali.',
      anthropometryEvaluation: 'Berat badan stabil pada 51 kg setelah kunjungan sela 1.',

      biochemistryTarget: 'Kadar kolesterol total menurun menuju < 220 mg/dL dan LDL < 130 mg/dL setelah 1 bulan intervensi.',
      biochemistryAction: 'Pengulangan uji laboratorium lipid profile di poli gizi klinik bulan depan.',
      biochemistryEvaluation: 'Kolesterol total turun 10% sewaktu dikontrol berkala.',

      clinicalTarget: 'Nyeri leher tegang berkurang, tidak ada sesak atau nyeri dada kiri mendadak, ulu hati bebas perih begah.',
      clinicalAction: 'Pelaporan mandiri skala nyeri dada dan rasa panas ulu hati (heartburn) pada buku harian diet.',
      clinicalEvaluation: 'Rasa mual begah akibat keterlambatan makan berkurang dari skala 5/10 menjadi 2/10.',

      dietaryTarget: 'Asupan lemak jenuh berkurang secara konsisten dan serat sayur buah meningkat menjadi 25 gram/hari.',
      dietaryAction: 'Pengisian food record secara berkala serta konseling evaluasi mingguan via whatsapp asisten diet.',
      dietaryEvaluation: 'Konsumsi gorengan berkurang drastis menjadi maksimal 2 buah seminggu porsi rebusan naik.',

      complianceTarget: 'Mampu menolak konsumsi olahan bersantan jenuh ekstrem saat bersosialisasi atau makan di luar.',
      complianceAction: 'Wawancara gizi kualitatif mengenai komitmen perilaku makan mandiri.',
      complianceEvaluation: 'Pasien berhasil memilih menu ikan bakar/sop bening saat makan siang bersama rekan kerja.',

      newDiagnosis: 'Belum terindikasi diagnosis baru, kemajuan perilaku asupan pasien sangat mengagumkan.',
      nextIntervention: 'Memperluas olahraga aerobik jalan sehat dari 1x seminggu menjadi 3x seminggu durasi 30 menit serta penyesuaian terapi herbal pengontrol lemak jenuh.',
    }
  }
];
