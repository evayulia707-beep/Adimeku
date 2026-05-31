/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Patient {
  id: string; // Unique ID
  name: string;
  registerNo: string;
  age: number;
  gender: 'Laki-laki' | 'Perempuan';
  room: string; // Ruang atau Rawat Jalan
  entryDate: string;
  medicalDiagnosis: string;
  doctor: string;
  addressPhone: string;
  status: 'Rawat Inap' | 'Rawat Jalan';
  createdAt: string;

  // 1. Skrining Awal
  screening: {
    weightLoss: boolean;
    poorAppetite: boolean;
    chewingSwallowingDifficulty: boolean;
    nauseaVomiting: boolean;
    diarrheaConstipation: boolean;
    allergyIntolerance: boolean;
    specialDiet: boolean;
    enteralParenteral: boolean;
    lowAlbumin: boolean;
  };

  // 2. Assessment Antropometri
  anthropometry: {
    currentWeight: number | ''; // BB aktual kg
    idealWeight: number | ''; // BBI kg
    height: number | ''; // TB cm
    imt: number | ''; // IMT
    nutritionalStatus: string; // Kategori IMT
    muac: number | ''; // Lingkar lengan atas (cm)
    isChild: boolean; // Jika bayi/balita
    childInterpretation: string; // Interpretasi WHO Growth Chart
  };

  // 3. Assessment Biokimia/Laboratorium
  biochemistry: {
    gdp: number | ''; // Gula Darah Puasa
    gds: number | ''; // Gula Darah Sewaktu/Setelah Makan
    kreatinin: number | ''; // Kreatinin
    albumin: number | ''; // Albumin serum
    transferrin: number | ''; // Transferin
    rbp: number | ''; // Retinol Binding Protein
    totalCholesterol: number | ''; // Kolesterol total
    hdl: number | ''; // HDL
    ldl: number | ''; // LDL
    triglyceride: number | ''; // Trigliserida
    vitaminA: number | ''; // Vitamin A serum
    hb: number | ''; // Hemoglobin
  };

  // 4. Assessment Fisik/Klinis
  physicalClinical: {
    medicalHistory: string; // Riwayat penyakit/keluhan
    generalCondition: string; // Keadaan umum
    systolic: number | ''; // Tekanan darah sistolik
    diastolic: number | ''; // Tekanan darah diastolik
    pulse: number | ''; // Nadi (x/menit)
    temperature: number | ''; // Suhu (°C)
    nausea: boolean;
    vomiting: boolean;
    diarrhea: boolean;
    constipation: boolean;
    swallowingDifficulty: boolean;
    chewingDifficulty: boolean;
    edema: boolean;
    appetite: 'Baik' | 'Sedang' | 'Kurang' | 'Sangat Kurang';
    deficiencySigns: string; // Tanda klinis defisiensi zat gizi
  };

  // 5. Riwayat Gizi/Dietary History
  dietaryHistory: {
    dietaryPattern: string; // Pola makan sehari
    animalProtein: string;
    plantProtein: string;
    vegFruit: string;
    stapleFood: string;
    snack: string;
    cookingMethod: string;
    supplement: string;
    foodAdditive: string;
    exercise: string;
    // Recall 24 Jam
    recallEnergy: number | ''; // kkal
    recallProtein: number | ''; // g
    recallFat: number | ''; // g
    recallCarbo: number | ''; // g
    recallEnergyPercent: number | ''; // % kecukupan
    recallProteinPercent: number | ''; // %
    recallFatPercent: number | ''; // %
    recallCarboPercent: number | ''; // %
    pastNutritionHistory: string;
    socialEconomic: string;
    medications: string;
  };

  // 6. Diagnosis Gizi (PES Statement)
  diagnoses: PESDiagnosis[];

  // 7. Intervensi Gizi
  intervention: {
    dietGoal: string;
    dietPrinciple: string;
    dietRequirement: string;
    dietType: string;
    foodTexture: string;
    nutritionTherapyPlan: string;
    nutritionCounseling: string;
    behaviorChangeTarget: string;
    foodRecommendation: string;
    // Perhitungan
    bmr: number;
    activityFactor: number;
    stressFactor: number;
    tee: number; // Total Energy Expenditure
    targetProtein: number;
    targetFat: number;
    targetCarbo: number;
    targetFluid: number;
  };

  // 8. Monitoring dan Evaluasi
  monitoring: {
    anthropometryTarget: string;
    anthropometryAction: string;
    anthropometryEvaluation: string;

    biochemistryTarget: string;
    biochemistryAction: string;
    biochemistryEvaluation: string;

    clinicalTarget: string;
    clinicalAction: string;
    clinicalEvaluation: string;

    dietaryTarget: string;
    dietaryAction: string;
    dietaryEvaluation: string;

    complianceTarget: string;
    complianceAction: string;
    complianceEvaluation: string;

    newDiagnosis: string;
    nextIntervention: string;
  };
}

export interface PESDiagnosis {
  id: string;
  domain: 'NI' | 'NC' | 'NB';
  problemCode: string;
  problemLabel: string;
  etiology: string;
  signsSymptoms: string;
}

export interface ENCPTTerm {
  code: string;
  label: string;
  domain: 'NI' | 'NC' | 'NB';
}

export const ENCPT_PROBLEMS: ENCPTTerm[] = [
  // NI: Nutrition Intake
  { code: 'NI-1.1', label: 'Peningkatan pengeluaran energi', domain: 'NI' },
  { code: 'NI-1.2', label: 'Asupan energi tidak adekuat', domain: 'NI' },
  { code: 'NI-1.3', label: 'Kelebihan asupan energi', domain: 'NI' },
  { code: 'NI-2.1', label: 'Asupan oral makanan/minuman tidak adekuat', domain: 'NI' },
  { code: 'NI-2.2', label: 'Kelebihan asupan oral makanan/minuman', domain: 'NI' },
  { code: 'NI-3.1', label: 'Asupan cairan tidak adekuat', domain: 'NI' },
  { code: 'NI-3.2', label: 'Kelebihan asupan cairan', domain: 'NI' },
  { code: 'NI-5.1', label: 'Peningkatan kebutuhan zat gizi', domain: 'NI' },
  { code: 'NI-5.2', label: 'Malnutrisi nyata', domain: 'NI' },
  { code: 'NI-5.3', label: 'Asupan protein-energi tidak adekuat', domain: 'NI' },
  { code: 'NI-5.4', label: 'Asupan zat gizi tidak adekuat', domain: 'NI' },
  { code: 'NI-5.5', label: 'Kelebihan asupan zat gizi', domain: 'NI' },
  { code: 'NI-5.6.1', label: 'Asupan lemak tidak adekuat', domain: 'NI' },
  { code: 'NI-5.6.2', label: 'Kelebihan asupan lemak', domain: 'NI' },
  { code: 'NI-5.7.1', label: 'Asupan protein tidak adekuat', domain: 'NI' },
  { code: 'NI-5.7.2', label: 'Kelebihan asupan protein', domain: 'NI' },
  { code: 'NI-5.8.1', label: 'Asupan karbohidrat tidak adekuat', domain: 'NI' },
  { code: 'NI-5.8.2', label: 'Kelebihan asupan karbohidrat', domain: 'NI' },

  // NC: Nutrition Clinical
  { code: 'NC-1.1', label: 'Kesulitan menelan (Disfagia)', domain: 'NC' },
  { code: 'NC-1.2', label: 'Kesulitan mengunyah', domain: 'NC' },
  { code: 'NC-1.4', label: 'Gangguan fungsi gastrointestinal (GI)', domain: 'NC' },
  { code: 'NC-2.1', label: 'Gangguan utilisasi zat gizi', domain: 'NC' },
  { code: 'NC-2.2', label: 'Perubahan nilai laboratorium terkait gizi', domain: 'NC' },
  { code: 'NC-2.3', label: 'Interaksi obat dan makanan', domain: 'NC' },
  { code: 'NC-3.1', label: 'Berat badan kurang (Underweight)', domain: 'NC' },
  { code: 'NC-3.2', label: 'Penurunan berat badan yang tidak diharapkan', domain: 'NC' },
  { code: 'NC-3.3', label: 'Kelebihan berat badan (Overweight/Obesitas)', domain: 'NC' },
  { code: 'NC-3.4', label: 'Kenaikan berat badan yang tidak diharapkan', domain: 'NC' },

  // NB: Nutrition Behavioral-Environmental
  { code: 'NB-1.1', label: 'Kurang pengetahuan terkait pangan dan gizi', domain: 'NB' },
  { code: 'NB-1.3', label: 'Pemilihan makanan yang salah', domain: 'NB' },
  { code: 'NB-1.4', label: 'Kurang dapat mengevaluasi informasi gizi', domain: 'NB' },
  { code: 'NB-1.5', label: 'Perilaku salah terkait makanan', domain: 'NB' },
  { code: 'NB-1.7', label: 'Pola makan yang salah', domain: 'NB' },
  { code: 'NB-2.1', label: 'Kurang aktivitas fisik', domain: 'NB' },
  { code: 'NB-2.2', label: 'Aktivitas fisik berlebih', domain: 'NB' },
  { code: 'NB-3.1', label: 'Akses makanan yang terbatas', domain: 'NB' },
  { code: 'NB-3.2', label: 'Ketidakamanan pangan (Food Insecurity)', domain: 'NB' },
  { code: 'NB-3.3', label: 'Akses air minum/bersih yang terbatas', domain: 'NB' },
];

export const BIOMARKER_RANGES = {
  gdp: {
    name: 'Gula Darah Puasa (GDP)',
    unit: 'mg/dL',
    getRange: (isChild: boolean, gender: 'Laki-laki' | 'Perempuan', ageRangeText: string) => {
      if (isChild) return { min: 60, max: 100, normalText: '60 - 100 mg/dL' };
      return { min: 70, max: 100, normalText: '70 - 100 mg/dL' };
    }
  },
  gds: {
    name: 'Gula Darah Sewaktu/Setelah Makan',
    unit: 'mg/dL',
    getRange: (isChild: boolean, gender: 'Laki-laki' | 'Perempuan', ageRangeText: string) => {
      return { min: 0, max: 140, normalText: 'Normal: <140 mg/dL, Pradiabetes: 140-200 mg/dL, Diabetes: >200 mg/dL' };
    }
  },
  kreatinin: {
    name: 'Kreatinin',
    unit: 'mg/dL',
    getRange: (isChild: boolean, gender: 'Laki-laki' | 'Perempuan', ageRangeText: string) => {
      if (gender === 'Laki-laki') return { min: 0.6, max: 1.2, normalText: '0.6 - 1.2 mg/dL' };
      return { min: 0.5, max: 1.1, normalText: '0.5 - 1.1 mg/dL' };
    }
  },
  albumin: {
    name: 'Albumin Serum',
    unit: 'g/dL',
    getRange: () => ({ min: 3.5, max: 5.5, normalText: '3.5 - 5.5 g/dL' })
  },
  transferrin: {
    name: 'Transferin',
    unit: 'g/L',
    getRange: () => ({ min: 2, max: 4, normalText: '2.0 - 4.0 g/L' })
  },
  rbp: {
    name: 'Retinol Binding Protein (RBP)',
    unit: 'mg/dL',
    getRange: () => ({ min: 2.5, max: 7.5, normalText: '2.5 - 7.5 mg/dL' })
  },
  totalCholesterol: {
    name: 'Kolesterol Total',
    unit: 'mg/dL',
    getRange: () => ({ min: 0, max: 200, normalText: 'Normal: <200 mg/dL, Tinggi: 200-239, Sangat Tinggi: >=240' })
  },
  hdl: {
    name: 'Kolesterol HDL',
    unit: 'mg/dL',
    getRange: (isChild: boolean, gender: 'Laki-laki' | 'Perempuan') => {
      if (gender === 'Laki-laki') return { min: 40, max: 50, normalText: '>40 - 50 mg/dL' };
      return { min: 50, max: 59, normalText: '>50 - 59 mg/dL' };
    }
  },
  ldl: {
    name: 'Kolesterol LDL',
    unit: 'mg/dL',
    getRange: () => ({ min: 0, max: 100, normalText: 'Optimal: <100 mg/dL, Batas Tinggi: 160-189, Sangat Tinggi: >=190' })
  },
  triglyceride: {
    name: 'Trigliserida',
    unit: 'mg/dL',
    getRange: () => ({ min: 0, max: 150, normalText: 'Normal: <150 mg/dL, Batas Tinggi: 200-499' })
  },
  vitaminA: {
    name: 'Vitamin A Serum',
    unit: 'mcg/dL',
    getRange: () => ({ min: 20, max: Infinity, normalText: '>20 mcg/dL' })
  },
  hb: {
    name: 'Hemoglobin',
    unit: 'g/dL',
    getRange: (isChild: boolean, gender: 'Laki-laki' | 'Perempuan', ageGroup: string) => {
      if (ageGroup === 'balita') return { min: 11, max: 18, normalText: '>=11 g/dL' };
      if (ageGroup === 'sekolah') return { min: 12, max: 18, normalText: '>=12 g/dL' };
      if (gender === 'Perempuan') return { min: 12, max: 16, normalText: '12 - 16 g/dL' };
      return { min: 13, max: 18, normalText: '13 - 18 g/dL' };
    }
  }
};
