/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ChangeEvent } from 'react';
import Header from './components/Header';
import BiochemistryTable from './components/BiochemistryTable';
import PESDiagnosisBuilder from './components/PESDiagnosisBuilder';
import CalculatorZatGizi from './components/CalculatorZatGizi';
import MedicalReport from './components/MedicalReport';
import { Patient, PESDiagnosis } from './types';
import { TEMPLATE_PATIENTS } from './data';
import { 
  Users, 
  UserPlus, 
  Search, 
  Download, 
  Upload, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  ShieldAlert,
  Edit2,
  Trash2,
  Printer,
  Heart,
  TrendingUp,
  Activity,
  Award,
  LayoutDashboard,
  Bell,
  Menu,
  FileText
} from 'lucide-react';

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [view, setView] = useState<'dashboard' | 'wizard' | 'report'>('dashboard');
  
  // Wizard state variables
  const [activeStep, setActiveStep] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietitianName, setDietitianName] = useState<string>('Eva Yulia Rahma');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  
  // Form State under edited patient
  const [formPatient, setFormPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Load from local storage or populate template
  useEffect(() => {
    try {
      const stored = localStorage.getItem('adimeku_patients');
      if (stored) {
        setPatients(JSON.parse(stored));
      } else {
        localStorage.setItem('adimeku_patients', JSON.stringify(TEMPLATE_PATIENTS));
        setPatients(TEMPLATE_PATIENTS);
      }
    } catch (e) {
      console.error("Error reading localStorage:", e);
      setPatients(TEMPLATE_PATIENTS);
    }
  }, []);

  // Sync to database
  const saveToLocal = (updatedList: Patient[]) => {
    setPatients(updatedList);
    localStorage.setItem('adimeku_patients', JSON.stringify(updatedList));
  };

  // Helper mock trigger for newly created patient schema
  const createEmptyPatient = (): Patient => {
    return {
      id: `pat-${Date.now()}`,
      name: '',
      registerNo: `REG/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      age: 35,
      gender: 'Laki-laki',
      room: '',
      entryDate: new Date().toISOString().split('T')[0],
      medicalDiagnosis: '',
      doctor: '',
      addressPhone: '',
      status: 'Rawat Inap',
      createdAt: new Date().toISOString(),
      
      screening: {
        weightLoss: false,
        poorAppetite: false,
        chewingSwallowingDifficulty: false,
        nauseaVomiting: false,
        diarrheaConstipation: false,
        allergyIntolerance: false,
        specialDiet: false,
        enteralParenteral: false,
        lowAlbumin: false,
      },

      anthropometry: {
        currentWeight: '',
        idealWeight: '',
        height: '',
        imt: '',
        nutritionalStatus: '',
        muac: '',
        isChild: false,
        childInterpretation: '',
      },

      biochemistry: {
        gdp: '',
        gds: '',
        kreatinin: '',
        albumin: '',
        transferrin: '',
        rbp: '',
        totalCholesterol: '',
        hdl: '',
        ldl: '',
        triglyceride: '',
        vitaminA: '',
        hb: '',
      },

      physicalClinical: {
        medicalHistory: '',
        generalCondition: '',
        systolic: '',
        diastolic: '',
        pulse: '',
        temperature: '',
        nausea: false,
        vomiting: false,
        diarrhea: false,
        constipation: false,
        swallowingDifficulty: false,
        chewingDifficulty: false,
        edema: false,
        appetite: 'Baik',
        deficiencySigns: '',
      },

      dietaryHistory: {
        dietaryPattern: '',
        animalProtein: '',
        plantProtein: '',
        vegFruit: '',
        stapleFood: '',
        snack: '',
        cookingMethod: '',
        supplement: '',
        foodAdditive: '',
        exercise: '',
        recallEnergy: '',
        recallProtein: '',
        recallFat: '',
        recallCarbo: '',
        recallEnergyPercent: '',
        recallProteinPercent: '',
        recallFatPercent: '',
        recallCarboPercent: '',
        pastNutritionHistory: '',
        socialEconomic: '',
        medications: '',
      },

      diagnoses: [],

      intervention: {
        dietGoal: '',
        dietPrinciple: '',
        dietRequirement: '',
        dietType: '',
        foodTexture: '',
        nutritionTherapyPlan: '',
        nutritionCounseling: '',
        behaviorChangeTarget: '',
        foodRecommendation: '',
        bmr: 0,
        activityFactor: 1.2,
        stressFactor: 1.0,
        tee: 0,
        targetProtein: 0,
        targetFat: 0,
        targetCarbo: 0,
        targetFluid: 1500,
      },

      monitoring: {
        anthropometryTarget: 'Menjaga berat badan normal stabil sesuai BBI.',
        anthropometryAction: 'Penimbangan mandiri berkala.',
        anthropometryEvaluation: 'Fluktuasi berat badan terkontrol.',
        biochemistryTarget: 'Kadar biokimia darah mendekati nilai klinik normal.',
        biochemistryAction: 'Cek ulang berkala parameter terganggu.',
        biochemistryEvaluation: 'Penanda metabolik stabil.',
        clinicalTarget: 'Tekanan darah normal dan ulu hati bebas perih kembung.',
        clinicalAction: 'Observasi keluhan klinis.',
        clinicalEvaluation: 'Keluhan fisik mereda.',
        dietaryTarget: 'Asupan porsi makan sesuai anjuran diet gizi klinis minimal 80%.',
        dietaryAction: 'Pantau sisa makanan Comstock.',
        dietaryEvaluation: 'Asupan mendekati target.',
        complianceTarget: 'Meningkatkan kepatuhan diet pangan sehat sehari-hari.',
        complianceAction: 'Wawancara and konseling berkala.',
        complianceEvaluation: 'Tingkat kepatuhan gizi sangat baik.',
        newDiagnosis: '',
        nextIntervention: 'Terapi dilanjutkan sesuai anjuran awal.',
      }
    };
  };

  const handleStartNewPatient = () => {
    setFormPatient(createEmptyPatient());
    setIsEditing(false);
    setActiveStep(0);
    setView('wizard');
  };

  const handleEditPatient = (patient: Patient) => {
    // Deep clone to prevent direct state mutation on backout
    setFormPatient(JSON.parse(JSON.stringify(patient)));
    setIsEditing(true);
    setActiveStep(0);
    setView('wizard');
  };

  const handleDeletePatient = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data asuhan gizi pasien ini?')) {
      const updated = patients.filter((p) => p.id !== id);
      saveToLocal(updated);
    }
  };

  const handlePrintPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setView('report');
  };

  const handleSavePatient = () => {
    if (!formPatient) return;
    if (!formPatient.name.trim()) {
      alert('Nama pasien wajib diisi!');
      return;
    }

    let updatedList: Patient[];
    if (isEditing) {
      updatedList = patients.map((p) => (p.id === formPatient.id ? formPatient : p));
    } else {
      updatedList = [formPatient, ...patients];
    }

    saveToLocal(updatedList);
    setView('dashboard');
    setActiveStep(0);
    setFormPatient(null);
  };

  // Export Data to JSON
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patients, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `ADIMEKU_Backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  // Import Data from JSON
  const handleImportData = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            // Basic validation
            const isValid = parsed.every(p => p.id && p.name && p.screening && p.anthropometry);
            if (isValid) {
              const merged = [...parsed, ...patients.filter(p => !parsed.some(np => np.id === p.id))];
              saveToLocal(merged);
              alert(`Sukses mengimpor ${parsed.length} rekam medis pasien!`);
            } else {
              alert('File JSON tidak valid. Skema asuhan ADIMEKU tidak terpenuhi.');
            }
          } else {
            alert('Format salah. File JSON harus berupa array pasien.');
          }
        } catch (err) {
          alert('Terjadi kesalahan saat membaca file JSON.');
        }
      };
    }
  };

  // On-the-fly Calculations inside Wizard
  const updateAnthropometryValue = (key: keyof Patient['anthropometry'], val: any) => {
    if (!formPatient) return;

    const antrop = { ...formPatient.anthropometry, [key]: val };

    // IMT and BBI live recalculation
    const weight = antrop.currentWeight;
    const height = antrop.height;

    // Recalculate BBI
    if (height && typeof height === 'number') {
      if (height > 155) {
        antrop.idealWeight = Math.round(((height - 100) - 0.1 * (height - 100)) * 10) / 10;
      } else {
        antrop.idealWeight = Math.max(1, height - 100);
      }
    }

    // Recalculate IMT
    if (weight && height && typeof weight === 'number' && typeof height === 'number') {
      const heightInMeters = height / 100;
      const computedImt = weight / (heightInMeters * heightInMeters);
      antrop.imt = computedImt;

      // Classify Asia Pasifik
      if (computedImt < 17) {
        antrop.nutritionalStatus = 'Kekurangan BB Tingkat Berat';
      } else if (computedImt >= 17 && computedImt < 18) {
        antrop.nutritionalStatus = 'Kekurangan BB Tingkat Ringan';
      } else if (computedImt >= 18 && computedImt < 23) {
        antrop.nutritionalStatus = 'Normal';
      } else if (computedImt >= 23 && computedImt < 27) {
        antrop.nutritionalStatus = 'Kelebihan BB Ringan (Overweight)';
      } else {
        antrop.nutritionalStatus = 'Kelebihan BB Tingkat Berat (Obesitas)';
      }
    }

    setFormPatient({
      ...formPatient,
      anthropometry: antrop,
    });
  };

  const getStepStatus = (index: number) => {
    if (activeStep === index) return 'border-teal-500 bg-teal-50 text-teal-800';
    if (activeStep > index) return 'border-emerald-500 bg-emerald-50 text-emerald-800';
    return 'border-slate-200 bg-white text-slate-400';
  };

  // Filter patient directory
  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.registerNo.toLowerCase().includes(q) ||
      p.medicalDiagnosis.toLowerCase().includes(q) ||
      p.room.toLowerCase().includes(q)
    );
  });

  // Count active clinical alert issues
  const getHighRiskCount = () => {
    return patients.filter(p => p.screening.weightLoss && p.screening.poorAppetite).length;
  };

  // Indonesia Standard Growth values list
  const whoInterpretations = [
    'Gizi Buruk (Severely Wasted) [ < -3 SD ]',
    'Gizi Kurang (Wasted) [ -3 SD s/d -2 SD ]',
    'Gizi Baik (Normal) [ -2 SD s/d +1 SD ]',
    'Risiko Gizi Lebih (Possible Risk of Overweight) [ > +1 SD s/d +2 SD ]',
    'Gizi Lebih (Overweight) [ > +2 SD s/d +3 SD ]',
    'Obesitas (Obese) [ > +3 SD ]'
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col md:flex-row font-sans text-slate-800 antialiased overflow-x-hidden">
      
      {/* Mobile top trigger block (floating, with brand) */}
      <div className="bg-white border-b border-slate-200/50 p-4 flex items-center justify-between md:hidden print:hidden w-full shrink-0 animate-fade-in">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-[#e52e2e] text-white rounded-lg">
            <Activity className="h-4.5 w-4.5 stroke-[3]" />
          </div>
          <span className="font-bold text-slate-800 text-sm tracking-tight font-sans">ADIMEKU</span>
        </div>
        
        <button 
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 hover:bg-slate-50 text-slate-600 rounded-lg cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* THE SIDEBAR WRAPPER */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#e52e2e] text-white flex flex-col shrink-0 rounded-r-[2rem] shadow-xl md:shadow-none transform transition-transform duration-300 md:relative md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} print:hidden self-stretch`}>
        {/* Sidebar header logo & title */}
        <div className="p-6 flex items-center space-x-3 border-b border-white/10 shrink-0">
          <div className="p-2 bg-white text-[#e52e2e] rounded-xl shadow-xs shrink-0 flex items-center justify-center">
            <Activity className="h-6 w-6 stroke-[3]" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white">ADIMEKU</h1>
            <span className="text-[10px] text-white/70 block mt-1 uppercase font-semibold tracking-wider font-sans">Asuhan Gizi PAGT</span>
          </div>
        </div>

        {/* Nav menus matching the rounded pill aesthetics of Sahara */}
        <nav className="flex-1 p-4 space-y-2 mt-6 shrink-0">
          <button
            type="button"
            onClick={() => {
              setView('dashboard');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold font-sans tracking-wide transition-all cursor-pointer ${view === 'dashboard' ? 'bg-white text-[#e52e2e] shadow-xs' : 'text-white/80 hover:bg-white/15 hover:text-white'}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleStartNewPatient();
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold font-sans tracking-wide transition-all cursor-pointer ${view === 'wizard' && !isEditing ? 'bg-white text-[#e52e2e] shadow-xs' : 'text-white/80 hover:bg-white/15 hover:text-white'}`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Mulai ADIME Baru</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setView('dashboard');
              setMobileSidebarOpen(false);
              setTimeout(() => {
                document.getElementById('patient-directory-card')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold font-sans tracking-wide transition-all text-white/80 hover:bg-white/15 hover:text-white cursor-pointer"
          >
            <Users className="h-4 w-4 shrink-0" />
            <span>Direktori Pasien</span>
          </button>
        </nav>

        {/* Bottom banner for active dietitian profile - interactive! */}
        <div className="p-4 border-t border-white/10 mt-auto bg-white/5 space-y-3 rounded-b-[2rem] shrink-0 font-sans">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 bg-white text-[#e52e2e] rounded-full flex items-center justify-center font-bold text-xs tracking-wider shadow-inner shrink-0">
              {dietitianName ? dietitianName.substring(0, 2).toUpperCase() : 'SG'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] text-white/50 block font-bold tracking-wider leading-none uppercase">NUTRITIONIST</span>
              <input 
                type="text"
                value={dietitianName}
                onChange={(e) => setDietitianName(e.target.value)}
                className="bg-transparent text-xs font-bold text-white border-b border-transparent hover:border-white/30 focus:border-white outline-hidden w-full p-0 truncate font-sans cursor-pointer mt-0.5"
                title="Klik untuk ubah nama penanggung jawab langsung"
              />
            </div>
          </div>

          <div className="text-[10px] text-white/60 space-y-1 block pt-1 border-t border-white/5 leading-snug font-sans">
            <p>✓ Kemenkes RI Compliant</p>
            <p>✓ Asuhan Gizi Terstandar</p>
          </div>
        </div>
      </aside>

      {/* THE MAIN CONTENT FRAME */}
      <main className="flex-1 min-w-0 bg-white md:m-4 md:rounded-[2rem] shadow-xs flex flex-col border border-slate-100/60 md:overflow-y-auto min-h-screen md:h-[calc(100vh-2rem)] self-stretch">
        <div className="flex-1 p-5 md:p-6">
        
        {/* ==================== VIEW 1: DASHBOARD ==================== */}
        {view === 'dashboard' && (
          <div className="space-y-6 animate-fade-in flex flex-col lg:flex-row gap-6 items-start w-full">
            
            {/* LEFT ZONE */}
            <div className="flex-1 space-y-6 w-full font-sans">
              
              {/* WELCOMING ROW */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight font-sans">Dashboard</h1>
                  <p className="text-xs font-semibold text-[#e52e2e] uppercase tracking-wider mt-0.5 font-sans">
                    Welcome back, {dietitianName}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Floating Search Bar */}
                  <div className="relative w-full sm:w-60">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari pasien / register..."
                      className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/50 rounded-full outline-hidden focus:bg-white focus:border-[#e52e2e] transition-all text-slate-700 font-medium font-sans"
                    />
                  </div>

                  {/* Notification bubble */}
                  <div className="relative p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full cursor-pointer text-slate-500 shrink-0">
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#e52e2e] animate-pulse"></span>
                    <Bell className="h-4 w-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* THE 86 METRIC COMPLETENESS DESIGN */}
              <div className="bg-slate-50/70 p-6 md:p-8 rounded-[2rem] border border-slate-100/60 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-xs">
                
                <div className="flex items-center gap-6">
                  <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
                    <svg className="absolute transform -rotate-90 w-24 h-24">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        className="stroke-slate-200/60 fill-none"
                        strokeWidth="8"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        className="stroke-[#e52e2e] fill-none"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset="10"
                      />
                    </svg>
                    <div className="text-center font-sans">
                      <span className="text-3xl font-black text-slate-800 font-mono tracking-tight leading-none block">96</span>
                      <span className="text-[9px] text-[#e52e2e] font-black uppercase tracking-wider block mt-0.5">SCORE</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-800 leading-tight font-sans">Kelengkapan Asuhan ADIME</h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed font-sans">
                      Sistem asuhan gizi terstandar Kemenkes RI berjalan lancar & aman secara offline. Terus dokumentasikan rekam asuhan gizi Anda!
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end text-center sm:text-right shrink-0 bg-white py-3.5 px-6 rounded-2xl border border-slate-100 shadow-3xs font-sans">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider leading-none">RATING KINERJA</span>
                  <span className="text-3xl font-black text-slate-800 font-mono mt-1 leading-none">4.9<span className="text-xs text-slate-400">/5</span></span>
                  <div className="flex gap-0.5 text-amber-500 mt-1">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className="text-xs">{s}</span>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 block">Excellent Compliance</span>
                </div>
              </div>

              {/* THE BENTO CARD DIAGRAMS - CASE DISTRIBUTION & DIET PRESC ACTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SEBARAN KASUS (analogous to 'Your Skills' layout) */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100/60 shadow-xs font-sans">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Sebaran Kasus Pasien</span>
                    <span className="text-[10px] text-[#e52e2e] font-black">PAGT Case Mix</span>
                  </div>

                  <div className="flex items-center justify-around gap-4 py-2">
                    <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                      <svg className="absolute w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="32" className="stroke-rose-100 fill-none" strokeWidth="6" />
                        <circle cx="40" cy="40" r="32" className="stroke-[#e52e2e] fill-none" strokeWidth="6" strokeDasharray="200" strokeDashoffset="45" />
                        
                        <circle cx="40" cy="40" r="24" className="stroke-sky-100 fill-none" strokeWidth="5" />
                        <circle cx="40" cy="40" r="24" className="stroke-sky-500 fill-none" strokeWidth="5" strokeDasharray="150" strokeDashoffset="35" />
                      </svg>
                      <Heart className="h-6 w-6 text-rose-500" />
                    </div>

                    <div className="space-y-2 flex-1 max-w-[160px] text-xs font-medium text-slate-600 font-sans">
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[11px] font-semibold flex-row">
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#e52e2e] block"></span>Inap</span>
                          <span>{patients.filter(p => p.status === 'Rawat Inap').length} Kasus</span>
                        </div>
                        <div className="h-1.5 bg-rose-50 rounded-full overflow-hidden">
                          <div className="h-full bg-[#e52e2e]" style={{ width: `${patients.length ? (patients.filter(p => p.status === 'Rawat Inap').length / patients.length) * 100 : 0}%` }}></div>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[11px] font-semibold flex-row">
                          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500 block"></span>Jalan</span>
                          <span>{patients.filter(p => p.status === 'Rawat Jalan').length} Kasus</span>
                        </div>
                        <div className="h-1.5 bg-sky-50 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500" style={{ width: `${patients.length ? (patients.filter(p => p.status === 'Rawat Jalan').length / patients.length) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AKURASI PRESRIPSI (analogous to 'Your Ratings' layout) */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100/60 shadow-xs font-sans">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Akurasi Preskripsi Diet</span>
                    <span className="text-[10px] text-[#e52e2e] font-black">Monev Gizi</span>
                  </div>

                  <div className="flex justify-between items-start gap-4">
                    <div className="shrink-0 text-center">
                      <span className="text-2xl font-black text-slate-800 font-mono">4.8<span className="text-xs text-slate-400">/5</span></span>
                      <div className="flex gap-0.5 text-amber-500 justify-center mt-1">
                        {'★★★★★'.split('').map((s, i) => (
                          <span key={i} className="text-[10px]">{s}</span>
                        ))}
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">Keberhasilan Terapi</span>
                    </div>

                    <div className="flex-1 space-y-2 text-[10px] font-medium text-slate-500 font-sans">
                      <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <span>Diabetes Melitus</span>
                        <div className="flex text-amber-500 font-sans">★★★★★</div>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <span>Hipertensi / Stroke</span>
                        <div className="flex text-amber-500 font-sans">★★★★★</div>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <span>Malnutrisi / KEP</span>
                        <div className="flex text-amber-500 font-sans">★★★★☆</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* DIREKTORI PATIENT LIST TABLE AS THE CENTRAL ELEMENT */}
              <div id="patient-directory-card" className="bg-white rounded-[2rem] border border-slate-100 shadow-xs p-6 space-y-6 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-5">
                  <div>
                    <h3 className="text-base font-black text-slate-800 font-sans">Direktori Rekam Medis Asuhan Gizi</h3>
                    <p className="text-xs text-slate-400 font-semibold font-sans mt-0.5">
                      Database asuhan gizi terstandar berdasarkan PAGT Kemenkes.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 print:hidden select-none font-sans">
                    <button
                      type="button"
                      onClick={handleExportData}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-slate-200/50"
                      title="Simpan database pasien ke file lokal Anda"
                    >
                      <Download className="h-4 w-4" />
                      Ekspor Backup
                    </button>

                    <label className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-slate-200/50">
                      <Upload className="h-4 w-4" />
                      <span>Impor Backup</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleStartNewPatient}
                      className="bg-[#e52e2e] hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all"
                    >
                      <UserPlus className="h-4 w-4" />
                      Mulai ADIME Baru
                    </button>
                  </div>
                </div>

                {/* Patient list search-directory table */}
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    {filteredPatients.length > 0 ? (
                      <table className="min-w-full divide-y divide-slate-100 text-xs text-slate-700 font-sans">
                        <thead className="bg-slate-50/70">
                          <tr>
                            <th scope="col" className="px-5 py-3 text-left font-bold text-slate-400 tracking-wider">Identitas Pasien</th>
                            <th scope="col" className="px-5 py-3 text-left font-bold text-slate-400 tracking-wider">Nomor Register</th>
                            <th scope="col" className="px-5 py-3 text-left font-bold text-slate-400 tracking-wider">Ruang / Rawat</th>
                            <th scope="col" className="px-5 py-3 text-left font-bold text-slate-400 tracking-wider">Diagnosis Medis</th>
                            <th scope="col" className="px-5 py-3 text-left font-bold text-slate-400 tracking-wider">Nutrisi & TEE</th>
                            <th scope="col" className="px-5 py-3 text-center font-bold text-slate-400 tracking-wider w-36">Aksi Rekam Medis</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {filteredPatients.map((p) => {
                            const isHighRisk = p.screening.weightLoss && p.screening.poorAppetite;
                            return (
                              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-5 py-4 font-sans">
                                  <div className="flex items-center space-x-2.5">
                                    <div className={`p-2 rounded-lg font-bold font-mono text-[10px] ${p.gender === 'Laki-laki' ? 'bg-sky-50 text-sky-800' : 'bg-rose-50 text-rose-800'}`}>
                                      {p.gender === 'Laki-laki' ? 'LK' : 'PR'}
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-800 flex items-center gap-1.5 flex-row">
                                        {p.name}
                                        {isHighRisk && (
                                          <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded font-black animate-pulse">RISIKO TINGGI</span>
                                        )}
                                      </span>
                                      <span className="text-[10px] text-slate-400 block mt-0.5">{p.age} Tahun</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-4 font-mono text-slate-500">
                                  {p.registerNo}
                                </td>
                                <td className="px-5 py-4 font-sans">
                                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${p.status === 'Rawat Inap' ? 'bg-sky-50 text-sky-700' : 'bg-teal-50 text-teal-700'}`}>
                                    {p.status} - {p.room || 'Poli Gizi'}
                                  </span>
                                </td>
                                <td className="px-5 py-4 max-w-xs truncate font-medium text-slate-600 font-sans" title={p.medicalDiagnosis}>
                                  {p.medicalDiagnosis || '--'}
                                </td>
                                <td className="px-5 py-4">
                                  <div className="space-y-0.5 font-mono">
                                    <span className="font-bold text-slate-700 text-xs block">{p.intervention.tee} kkal</span>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                      P: {p.intervention.targetProtein}g | L: {p.intervention.targetFat}g
                                    </span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-center">
                                  <div className="flex items-center justify-center space-x-1.5 flex-row">
                                    <button
                                      type="button"
                                      onClick={() => handleEditPatient(p)}
                                      className="p-1.5 text-sky-600 hover:text-sky-800 bg-sky-50 rounded-lg hover:bg-sky-100 transition-all cursor-pointer border border-transparent hover:border-sky-200"
                                      title="Edit data asuhan gizi ADIME"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handlePrintPatient(p)}
                                      className="p-1.5 text-teal-600 hover:text-teal-800 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all cursor-pointer border border-transparent hover:border-teal-200"
                                      title="Cetak/Lihat Laporan ADIME"
                                    >
                                      <Printer className="h-4 w-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePatient(p.id)}
                                      className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100 transition-all cursor-pointer border border-transparent hover:border-rose-200"
                                      title="Hapus pasien"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-12 text-center text-slate-400 font-medium space-y-2 font-sans">
                        <p>Tidak ditemukan rekam medis pasien yang cocok.</p>
                        <button
                          type="button"
                          onClick={handleStartNewPatient}
                          className="text-[#e52e2e] hover:underline text-xs font-bold cursor-pointer"
                        >
                          Buat record baru sekarang
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Practical clinical disclaimer */}
              <div className="bg-rose-50/50 border border-rose-100 rounded-[2rem] p-5 flex gap-4 text-xs text-rose-950 font-sans w-full">
                <ShieldAlert className="h-5 w-5 text-[#e52e2e] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-900 block uppercase tracking-wider text-[10px]">Catatan Penting Etika Medis (SANGAT KRITIS):</span>
                  <p className="mt-1 leading-normal italic text-rose-800 font-sans">
                    Aplikasi ADIMEKU adalah instrumen pengambil keputusan penunjang dokumentasi asuhan gizi, bukan pengganti mutlak asesmen dan penilaian klinis profesional yang dipegang teguh oleh nutritionist/dietisien legal. Seluruh tindakan terapi gizi wajib dikolaborasikan dan disetujui oleh dokter penanggung jawab pelayanan (DPJP) demi menjaga keselamatan pasien. Data yang Anda simpan sepenuhnya diproses dan disimpan secara aman di browser lokal Anda demi etika kerahasiaan data medis.
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT ZONE - ROSTER REQUISITIONS IN BLACK/RED STYLE (Like "Requests" panel on far right of Sahara mockup!) */}
            <div className="w-full lg:w-80 bg-slate-50/70 p-6 rounded-[2rem] border border-slate-100/60 shadow-xs shrink-0 space-y-6 font-sans">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">Kasus Terbaru</span>
                  <span className="bg-[#e52e2e] text-white text-[9px] font-black px-2 py-0.5 rounded-full font-mono">{patients.length}</span>
                </div>
                <Users className="h-4 w-4 text-slate-400" />
              </div>

              <div className="space-y-4">
                {patients.length > 0 ? (
                  patients.slice(0, 5).map((p) => {
                    const isHighRisk = p.screening.weightLoss && p.screening.poorAppetite;
                    return (
                      <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-3xs flex flex-col gap-3 font-sans">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 ${p.gender === 'Laki-laki' ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'}`}>
                              {p.name ? p.name.substring(0, 2).toUpperCase() : 'PS'}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-800 text-xs block truncate" title={p.name}>
                                {p.name}
                              </span>
                              <span className="text-[10px] text-slate-400 block tracking-tight font-mono">{p.registerNo}</span>
                            </div>
                          </div>
                          
                          {isHighRisk && (
                            <span className="text-[8px] font-black bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100 shrink-0 font-sans">RISIKO</span>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-500 font-semibold leading-snug border-t border-slate-50 pt-2 flex items-center justify-between">
                          <span className="truncate max-w-[140px] italic">{p.medicalDiagnosis || 'No Diagnosis'}</span>
                          <span className="text-[9px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded-md font-bold font-mono">{p.room || 'Rawat'}</span>
                        </div>

                        {/* Action buttons matching the Accept/Decline design */}
                        <div className="flex items-center gap-1.5 justify-end mt-1 border-t border-slate-50/50 pt-2 font-sans flex-row">
                          <button
                            type="button"
                            onClick={() => handleEditPatient(p)}
                            className="flex-1 py-1 px-3 bg-sky-50 border border-sky-100 hover:bg-sky-100 rounded-lg text-[10px] font-bold text-sky-700 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            title="Edit"
                          >
                            Edit
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handlePrintPatient(p)}
                            className="py-1 px-2.5 bg-[#eafbf2] border border-emerald-100 hover:bg-[#d6f7e4] rounded-lg text-[10px] font-bold text-emerald-700 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            title="Lihat Laporan"
                          >
                            <Printer className="h-3 w-3" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePatient(p.id)}
                            className="py-1 px-2.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-lg text-[10px] font-bold text-[#e52e2e] flex items-center justify-center gap-1 cursor-pointer transition-colors animate-pulse"
                            title="Hapus"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-slate-400 text-xs py-4">Belum ada pasien terdaftar.</p>
                )}
              </div>

              {patients.length > 5 && (
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('patient-directory-card')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all font-sans cursor-pointer"
                >
                  Lihat Semua Konten ({patients.length})
                </button>
              )}
            </div>

          </div>
        )}

        {/* ==================== VIEW 2: MEDICAL REPORT PREVIEW ==================== */}
        {view === 'report' && selectedPatient && (
          <MedicalReport
            patient={selectedPatient}
            onBack={() => setView('dashboard')}
            dietitianName={dietitianName}
          />
        )}

        {/* ==================== VIEW 3: WIZARD FORM ADIME ==================== */}
        {view === 'wizard' && formPatient && (
          <div className="space-y-6">
            
            {/* Header controls of Wizard */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full uppercase leading-none font-mono">
                    {isEditing ? 'Mode Edit record' : 'Record baru'}
                  </span>
                  <span className="text-xs text-slate-400">Tgl: {formPatient.entryDate}</span>
                </div>
                <h2 className="text-base font-bold text-slate-800 mt-1">
                  {formPatient.name ? `Form ADIME: ${formPatient.name}` : 'Asuhan Gizi Terstandar (ADIME) Baru'}
                </h2>
              </div>

              <button
                onClick={() => {
                  if (confirm('Batal mengisi asuhan gizi ini? Segala perubahan akan dibuang.')) {
                    setView('dashboard');
                    setFormPatient(null);
                  }
                }}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                title="Batal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stepper Indictors */}
            <div className="overflow-x-auto bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
              <div className="flex items-center justify-between min-w-[700px] text-xs font-semibold px-4">
                {[
                  '1. Profil & Skrining',
                  '2. Antropometri',
                  '3. Biokimia',
                  '4. Fisik & Riwayat Gizi',
                  '5. Diagnosis Gizi (PES)',
                  '6. Intervensi',
                  '7. Monitoring Evaluasi'
                ].map((stepText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (formPatient.name.trim() === '') {
                        alert('Silahkan isi nama pasien pada langkah 1 terlebih dahulu.');
                        return;
                      }
                      setActiveStep(idx);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border transition-all ${getStepStatus(idx)}`}
                  >
                    <span className="h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0">
                      {idx + 1}
                    </span>
                    <span className="whitespace-nowrap">{stepText}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Step Container */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
              
              {/* === WIZARD STEP 0: PROFIL & SKRINNING === */}
              {activeStep === 0 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-sm">Langkah 1: Identitas & Skrining Awal Risiko</h3>
                    <p className="text-xs text-slate-400 mt-1">Lengkapi data pribadi dan indikator skrining asuhan gizi awal.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs text-slate-700">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Nama Lengkap Pasien <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Eva Yulia"
                        value={formPatient.name}
                        onChange={(e) => setFormPatient({ ...formPatient, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Nomor Register Medis (Otomatis)</label>
                      <input
                        type="text"
                        value={formPatient.registerNo}
                        onChange={(e) => setFormPatient({ ...formPatient, registerNo: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden font-mono font-bold text-slate-500 cursor-not-allowed"
                        disabled
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Umur Pasien (Tahun)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 32"
                        value={formPatient.age}
                        onChange={(e) => setFormPatient({ ...formPatient, age: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Jenis Kelamin</label>
                      <div className="flex gap-2">
                        {['Laki-laki', 'Perempuan'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setFormPatient({ ...formPatient, gender: g as 'Laki-laki' | 'Perempuan' })}
                            className={`flex-1 py-2.5 rounded-lg border text-xs font-bold transition-all ${
                              formPatient.gender === g
                                ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Status Pasien</label>
                      <div className="flex gap-2">
                        {['Rawat Inap', 'Rawat Jalan'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setFormPatient({ ...formPatient, status: s as 'Rawat Inap' | 'Rawat Jalan' })}
                            className={`flex-1 py-2.5 rounded-lg border text-xs font-bold transition-all ${
                              formPatient.status === s
                                ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Ruang / Kamar Rawat</label>
                      <input
                        type="text"
                        placeholder="Contoh: Melati Room 3A (atau Poliklinik)"
                        value={formPatient.room}
                        onChange={(e) => setFormPatient({ ...formPatient, room: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Tanggal Pemeriksaan</label>
                      <input
                        type="date"
                        value={formPatient.entryDate}
                        onChange={(e) => setFormPatient({ ...formPatient, entryDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Dokter Penanggung Jawab (DPJP)</label>
                      <input
                        type="text"
                        placeholder="Contoh: dr. Ahmad, Sp.PD"
                        value={formPatient.doctor}
                        onChange={(e) => setFormPatient({ ...formPatient, doctor: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Diagnosis Medis Awal</label>
                      <input
                        type="text"
                        placeholder="Contoh: DM Tipe 2, Stroke Iskemik"
                        value={formPatient.medicalDiagnosis}
                        onChange={(e) => setFormPatient({ ...formPatient, medicalDiagnosis: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden col-span-1 focus:border-teal-500 focus:bg-white transition-all font-semibold"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Alamat Rumah & No Telepon</label>
                      <input
                        type="text"
                        placeholder="Alamat lengkap, nomor handphone..."
                        value={formPatient.addressPhone}
                        onChange={(e) => setFormPatient({ ...formPatient, addressPhone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Checklist Skrining */}
                  <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-800 text-xs block border-b border-slate-200 pb-1.5 uppercase">Checklist Skrining Risiko Nutrisi / Malnutrisi</span>
                    <p className="text-xs text-slate-500">Centang indikator keluhan yang ditemukan saat wawancara medis awal.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3.5 gap-x-6 text-xs text-slate-700 mt-4">
                      {[
                        { key: 'weightLoss', label: 'Perubahan/Penurunan BB drastis tidak direncanakan' },
                        { key: 'poorAppetite', label: 'Nafsu makan menurun selama beberapa hari terakhir' },
                        { key: 'chewingSwallowingDifficulty', label: 'Kesulitan mengunyah atau menelan bahan pangan' },
                        { key: 'nauseaVomiting', label: 'Mengalami mual atau muntah hebat' },
                        { key: 'diarrheaConstipation', label: 'Mengalami diare berkepanjangan atau konstipasi kronis' },
                        { key: 'allergyIntolerance', label: 'Alergi makanan atau intoleransi zat gizi tertentu' },
                        { key: 'specialDiet', label: 'Sedang atau baru saja menjalani instruksi diet khusus' },
                        { key: 'enteralParenteral', label: 'Menggunakan terapi nutrisi enteral/parenteral' },
                        { key: 'lowAlbumin', label: 'Kadar albumin serum terkonfirmasi rendah di lab' },
                      ].map(({ key, label }) => (
                        <label 
                          key={key} 
                          className="flex items-start space-x-3 cursor-pointer select-none bg-white p-3 border border-slate-200/60 rounded-xl hover:border-teal-500 transition-all font-medium"
                        >
                          <input
                            type="checkbox"
                            checked={formPatient.screening[key as keyof Patient['screening']]}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              screening: {
                                ...formPatient.screening,
                                [key]: e.target.checked
                              }
                            })}
                            className="h-4 w-4 rounded-sm border-slate-300 text-teal-600 accent-teal-600 focus:ring-teal-500 shrink-0 mt-0.5"
                          />
                          <span className="leading-normal">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* === WIZARD STEP 1: ASSESSMENT ANTROPOMETRI === */}
              {activeStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-sm">Langkah 2: Antropometri & Kategori IMT</h3>
                    <p className="text-xs text-slate-400 mt-1">Input kondisi fisik badan pasien, sistem mendeteksi BBI, IMT, dan status asupan acuan otomatis.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs text-slate-700">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Berat Badan Aktual (kg)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 65"
                        value={formPatient.anthropometry.currentWeight}
                        onChange={(e) => updateAnthropometryValue('currentWeight', e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Tinggi Badan (cm)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 165"
                        value={formPatient.anthropometry.height}
                        onChange={(e) => updateAnthropometryValue('height', e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 focus:bg-white transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-1.5 bg-teal-50/20 p-3 rounded-lg border border-teal-100/40">
                      <span className="font-bold text-teal-600 text-[10px] uppercase block leading-none">BERAT BADAN IDEAL (BBI - RUMUS PAGT)</span>
                      <span className="text-xl font-mono font-black text-teal-900 block mt-1.5">
                        {formPatient.anthropometry.idealWeight || '--'} kg
                      </span>
                      <span className="text-[10px] text-slate-400 leading-none block font-semibold mt-1">
                        {formPatient.anthropometry.height && formPatient.anthropometry.height > 155 
                          ? 'Gunakan: (TB-100) - 10%' 
                          : 'Gunakan: TB - 100 (<155cm)'}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Lingkar Lengan Atas (LiLA) / Bila diperlukan (cm)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 28"
                        value={formPatient.anthropometry.muac}
                        onChange={(e) => updateAnthropometryValue('muac', e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-600 block">Indeks Massa Tubuh (IMT)</label>
                      <input
                        type="text"
                        value={formPatient.anthropometry.imt ? formPatient.anthropometry.imt.toFixed(2) : '--'}
                        disabled
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 outline-hidden font-mono font-black text-slate-700 cursor-not-allowed"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block">STATUS GIZI ASIA PASIFIK (KEMENKES):</span>
                      <span className="text-xs font-black text-teal-800 uppercase block">
                        {formPatient.anthropometry.nutritionalStatus || '--'}
                      </span>
                    </div>
                  </div>

                  {/* Child parameters */}
                  <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formPatient.anthropometry.isChild}
                        onChange={(e) => setFormPatient({
                          ...formPatient,
                          anthropometry: {
                            ...formPatient.anthropometry,
                            isChild: e.target.checked
                          }
                        })}
                        className="h-4.5 w-4.5 rounded-sm border-slate-300 text-teal-600"
                      />
                      <div>
                        <span className="font-bold text-slate-800 text-xs">Pasien ini adalah Bayi / Balita</span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">Centang jika memerlukan indeks interpretasi berdasarkan kurva pertumbuhan WHO (WHO Growth Chart).</span>
                      </div>
                    </label>

                    {formPatient.anthropometry.isChild && (
                      <div className="space-y-1.5 animate-slide-up pl-7">
                        <label className="text-xs font-semibold text-slate-600 block">Pilih status pertumbuhan WHO Growth Chart (Standard Balita):</label>
                        <select
                          value={formPatient.anthropometry.childInterpretation}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            anthropometry: {
                              ...formPatient.anthropometry,
                              childInterpretation: e.target.value
                            }
                          })}
                          className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-2.5 outline-hidden font-medium text-xs text-slate-700"
                        >
                          <option value="">-- Pilih Indeks WHO SD --</option>
                          {whoInterpretations.map((ii) => (
                            <option key={ii} value={ii}>{ii}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* === WIZARD STEP 2: ASSESSMENT BIOKIMIA === */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-sm">Langkah 3: Pemeriksaan Biokimia / Laboratorium</h3>
                    <p className="text-xs text-slate-400 mt-1">Masukkan hasil laboratorium untuk interpretasi biomarker otomatis.</p>
                  </div>

                  {/* Biochemistry sub-component */}
                  <BiochemistryTable
                    biochemistry={formPatient.biochemistry}
                    gender={formPatient.gender}
                    age={formPatient.age}
                    isChild={formPatient.anthropometry.isChild}
                    onChange={(key, val) => setFormPatient({
                      ...formPatient,
                      biochemistry: {
                        ...formPatient.biochemistry,
                        [key]: val
                      }
                    })}
                  />
                </div>
              )}

              {/* === WIZARD STEP 3: PHYSICAL/CLINICAL AND DIETARY === */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-sm">Langkah 4: Pemeriksaan Fisik, Klinis, & Riwayat Gizi</h3>
                    <p className="text-xs text-slate-400 mt-1">Lengkapi evaluasi sistem fisik, pencernaan, serta pola makan harian (Recall 24 Jam).</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
                    
                    {/* PHYSICAL / CLINICAL FORM CARD */}
                    <div className="bg-white border border-slate-100 p-5 rounded-xl space-y-4 shadow-2xs">
                      <h4 className="font-black text-slate-800 uppercase text-xs border-b border-slate-100 pb-1 flex justify-between">
                        <span>Pemeriksaan Fisik & Vital Signs</span>
                        <span className="text-[10px] text-teal-600 font-mono">PAGT CLINICAL</span>
                      </h4>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-600 block">Riwayat Penyakit Dahulu atau Keluhan Utama Pasien</label>
                        <textarea
                          rows={2.5}
                          value={formPatient.physicalClinical.medicalHistory}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            physicalClinical: { ...formPatient.physicalClinical, medicalHistory: e.target.value }
                          })}
                          placeholder="Tanyakan keluhan badan lemas, bengkak, sesak, atau penurunan kesadaran..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 text-slate-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">TD Sastolik</span>
                          <input
                            type="number"
                            placeholder="Sistolik"
                            value={formPatient.physicalClinical.systolic}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              physicalClinical: { ...formPatient.physicalClinical, systolic: e.target.value === '' ? '' : parseFloat(e.target.value) }
                            })}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5 focus:bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">TD Diastolik</span>
                          <input
                            type="number"
                            placeholder="Diastolik"
                            value={formPatient.physicalClinical.diastolic}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              physicalClinical: { ...formPatient.physicalClinical, diastolic: e.target.value === '' ? '' : parseFloat(e.target.value) }
                            })}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5 focus:bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Nadi (x/m)</span>
                          <input
                            type="number"
                            placeholder="HR"
                            value={formPatient.physicalClinical.pulse}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              physicalClinical: { ...formPatient.physicalClinical, pulse: e.target.value === '' ? '' : parseFloat(e.target.value) }
                            })}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5 focus:bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Suhu (°C)</span>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Temp"
                            value={formPatient.physicalClinical.temperature}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              physicalClinical: { ...formPatient.physicalClinical, temperature: e.target.value === '' ? '' : parseFloat(e.target.value) }
                            })}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5 focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* Keluhan GI checklists */}
                      <div className="space-y-1.5">
                        <span className="text-slate-500 font-semibold block">Kondisi Saluran Pencernaan & Edema (Checklist):</span>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {[
                            { key: 'nausea', label: 'Mual' },
                            { key: 'vomiting', label: 'Muntah' },
                            { key: 'diarrhea', label: 'Diare' },
                            { key: 'constipation', label: 'Konstipasi' },
                            { key: 'swallowingDifficulty', label: 'Sulit Menelan' },
                            { key: 'chewingDifficulty', label: 'Sulit Mengunyah' },
                            { key: 'edema', label: 'Udema bengkak' },
                          ].map(({ key, label }) => (
                            <label key={key} className="flex items-center space-x-2 bg-slate-50 p-2 rounded border border-slate-200/40 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formPatient.physicalClinical[key as keyof Patient['physicalClinical']] as boolean}
                                onChange={(e) => setFormPatient({
                                  ...formPatient,
                                  physicalClinical: {
                                    ...formPatient.physicalClinical,
                                    [key]: e.target.checked
                                  }
                                })}
                                className="h-4 w-4 text-teal-600 rounded"
                              />
                              <span className="text-[11px] font-semibold text-slate-600">{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-600 block">Tanda Klinis Defisiensi Zat Gizi</label>
                        <input
                          type="text"
                          placeholder="Contoh: Rambut tampak tipis kusam, konjungtiva anemis..."
                          value={formPatient.physicalClinical.deficiencySigns}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            physicalClinical: { ...formPatient.physicalClinical, deficiencySigns: e.target.value }
                          })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 text-slate-700"
                        />
                      </div>
                    </div>

                    {/* DIETARY HISTORY CARD */}
                    <div className="bg-white border border-slate-100 p-5 rounded-xl space-y-4 shadow-2xs">
                      <h4 className="font-black text-slate-800 uppercase text-xs border-b border-slate-100 pb-1 flex justify-between">
                        <span>Riwayat Pangan (Dietary History)</span>
                        <span className="text-[10px] text-teal-600 font-mono">PAGT DIETARY</span>
                      </h4>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-600 block">Pola Makan Kualitatif Sehari-hari</label>
                        <input
                          type="text"
                          placeholder="Makan 3x sehari porsi sedang / menyukai gorengan, dsb..."
                          value={formPatient.dietaryHistory.dietaryPattern}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            dietaryHistory: { ...formPatient.dietaryHistory, dietaryPattern: e.target.value }
                          })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <span className="text-slate-500 font-semibold block">Konsumsi Lauk Hewani:</span>
                          <input
                            type="text"
                            value={formPatient.dietaryHistory.animalProtein}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              dietaryHistory: { ...formPatient.dietaryHistory, animalProtein: e.target.value }
                            })}
                            placeholder="Kerap konsumsi ayam goreng, telur..."
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 font-semibold block">Konsumsi Lauk Nabati:</span>
                          <input
                            type="text"
                            value={formPatient.dietaryHistory.plantProtein}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              dietaryHistory: { ...formPatient.dietaryHistory, plantProtein: e.target.value }
                            })}
                            placeholder="Suka tahu/tempe bacem..."
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 font-semibold block">Metode Masak Dominan:</span>
                          <input
                            type="text"
                            value={formPatient.dietaryHistory.cookingMethod}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              dietaryHistory: { ...formPatient.dietaryHistory, cookingMethod: e.target.value }
                            })}
                            placeholder="Sering digoreng (deep fry)"
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500 font-semibold block">Konsumsi Sayur & Buah:</span>
                          <input
                            type="text"
                            value={formPatient.dietaryHistory.vegFruit}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              dietaryHistory: { ...formPatient.dietaryHistory, vegFruit: e.target.value }
                            })}
                            placeholder="Pisang ambon, jarang kangkung"
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 border-t border-slate-50 pt-2 grid grid-cols-2 gap-3">
                        <div className="col-span-1">
                          <span className="text-slate-500 font-semibold block leading-tight">Sosioekonomi:</span>
                          <input
                            type="text"
                            value={formPatient.dietaryHistory.socialEconomic}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              dietaryHistory: { ...formPatient.dietaryHistory, socialEconomic: e.target.value }
                            })}
                            placeholder="Pensiunan, tinggal bersama istri"
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5"
                          />
                        </div>
                        <div className="col-span-1">
                          <span className="text-slate-500 font-semibold block leading-tight">Riwayat Penggunaan Obat:</span>
                          <input
                            type="text"
                            value={formPatient.dietaryHistory.medications}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              dietaryHistory: { ...formPatient.dietaryHistory, medications: e.target.value }
                            })}
                            placeholder="Metformin 500mg, Atorvastatin..."
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 24-HOUR RECALL NUMERICS CARD */}
                  <div className="bg-teal-50/15 border border-teal-100 rounded-2xl p-5 space-y-4">
                    <span className="font-bold text-slate-800 text-xs block border-b border-teal-200/60 pb-1.5 uppercase">Kuesioner Food Recall 24 Jam & Persentase Kecukupan</span>
                    <p className="text-xs text-slate-500">Kalkulasi asupan metabolit pasien dalam satu hari ke belakang dibandingkan standar gizi.</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Energi (kkal)</span>
                        <input
                          type="number"
                          placeholder="Sajian kalori"
                          value={formPatient.dietaryHistory.recallEnergy}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            dietaryHistory: { ...formPatient.dietaryHistory, recallEnergy: e.target.value === '' ? '' : parseInt(e.target.value) }
                          })}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 focus:bg-white"
                        />
                        <div className="flex justify-between items-center text-[10px] font-sans">
                          <span className="text-slate-400">Kecukupan:</span>
                          <input
                            type="number"
                            placeholder="%"
                            value={formPatient.dietaryHistory.recallEnergyPercent}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              dietaryHistory: { ...formPatient.dietaryHistory, recallEnergyPercent: e.target.value === '' ? '' : parseInt(e.target.value) }
                            })}
                            className="w-12 bg-slate-100 p-0.5 rounded text-right font-bold"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Protein (g)</span>
                        <input
                          type="number"
                          placeholder="Gram Protein"
                          value={formPatient.dietaryHistory.recallProtein}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            dietaryHistory: { ...formPatient.dietaryHistory, recallProtein: e.target.value === '' ? '' : parseFloat(e.target.value) }
                          })}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 focus:bg-white"
                        />
                        <div className="flex justify-between items-center text-[10px] font-sans">
                          <span className="text-slate-400">Kecukupan:</span>
                          <input
                            type="number"
                            placeholder="%"
                            value={formPatient.dietaryHistory.recallProteinPercent}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              dietaryHistory: { ...formPatient.dietaryHistory, recallProteinPercent: e.target.value === '' ? '' : parseInt(e.target.value) }
                            })}
                            className="w-12 bg-slate-100 p-0.5 rounded text-right font-bold"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Lemak (g)</span>
                        <input
                          type="number"
                          placeholder="Gram Lemak"
                          value={formPatient.dietaryHistory.recallFat}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            dietaryHistory: { ...formPatient.dietaryHistory, recallFat: e.target.value === '' ? '' : parseFloat(e.target.value) }
                          })}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 focus:bg-white"
                        />
                        <div className="flex justify-between items-center text-[10px] font-sans">
                          <span className="text-slate-400">Kecukupan:</span>
                          <input
                            type="number"
                            placeholder="%"
                            value={formPatient.dietaryHistory.recallFatPercent}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              dietaryHistory: { ...formPatient.dietaryHistory, recallFatPercent: e.target.value === '' ? '' : parseInt(e.target.value) }
                            })}
                            className="w-12 bg-slate-100 p-0.5 rounded text-right font-bold"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Karbohidrat (g)</span>
                        <input
                          type="number"
                          placeholder="Gram Karbo"
                          value={formPatient.dietaryHistory.recallCarbo}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            dietaryHistory: { ...formPatient.dietaryHistory, recallCarbo: e.target.value === '' ? '' : parseFloat(e.target.value) }
                          })}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 focus:bg-white"
                        />
                        <div className="flex justify-between items-center text-[10px] font-sans">
                          <span className="text-slate-400">Kecukupan:</span>
                          <input
                            type="number"
                            placeholder="%"
                            value={formPatient.dietaryHistory.recallCarboPercent}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              dietaryHistory: { ...formPatient.dietaryHistory, recallCarboPercent: e.target.value === '' ? '' : parseInt(e.target.value) }
                            })}
                            className="w-12 bg-slate-100 p-0.5 rounded text-right font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === WIZARD STEP 4: DIAGNOSIS GIZI (PES) === */}
              {activeStep === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-sm">Langkah 5: Perumusan Diagnosis Gizi (PES Table)</h3>
                    <p className="text-xs text-slate-400 mt-1">Rancang satu atau lebih diagnosis gizi terstandar berdasarkan data E-NCPT klinis.</p>
                  </div>

                  {/* PES builder component */}
                  <PESDiagnosisBuilder
                    diagnoses={formPatient.diagnoses}
                    onChange={(diagnoses) => setFormPatient({
                      ...formPatient,
                      diagnoses: diagnoses
                    })}
                  />
                </div>
              )}

              {/* === WIZARD STEP 5: INTERVENSI GIZI === */}
              {activeStep === 5 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-sm">Langkah 6: Perencanaan Intervensi Gizi & Kalkulator Energi</h3>
                    <p className="text-xs text-slate-400 mt-1">Rancang tujuan asuhan, jenis diet, bentuk porsi sajian, serta pemicu kalori.</p>
                  </div>

                  {/* Harris-Benedict live calculator embed */}
                  <CalculatorZatGizi
                    gender={formPatient.gender}
                    age={formPatient.age}
                    height={formPatient.anthropometry.height || 160}
                    currentWeight={formPatient.anthropometry.currentWeight || 60}
                    idealWeight={formPatient.anthropometry.idealWeight || 55}
                    imt={formPatient.anthropometry.imt || 21.0}
                    activityFactor={formPatient.intervention.activityFactor}
                    stressFactor={formPatient.intervention.stressFactor}
                    initialTargetFluid={formPatient.intervention.targetFluid}
                    onUpdate={(calValues) => {
                      // Save calculated attributes to forms
                      setFormPatient({
                        ...formPatient,
                        intervention: {
                          ...formPatient.intervention,
                          ...calValues
                        }
                      });
                    }}
                  />

                  {/* Prescription textboxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-700">
                    <div className="space-y-4 bg-white border border-slate-100 p-5 rounded-2xl">
                      <span className="font-bold text-slate-800 text-xs block uppercase border-b border-slate-100 pb-1">Preskripsi Diet PAGT</span>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600 block">Kategori / Jenis Diet</label>
                          <input
                            type="text"
                            placeholder="Contoh: Diet Rendah Protein CKD"
                            value={formPatient.intervention.dietType}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              intervention: { ...formPatient.intervention, dietType: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600 block">Bentuk Konsistensi Pangan</label>
                          <input
                            type="text"
                            placeholder="Contoh: Makanan Lunak / Bubur"
                            value={formPatient.intervention.foodTexture}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              intervention: { ...formPatient.intervention, foodTexture: e.target.value }
                            })}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-600 block">Tujuan Terapi Diet</label>
                        <textarea
                          rows={2.5}
                          value={formPatient.intervention.dietGoal}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            intervention: { ...formPatient.intervention, dietGoal: e.target.value }
                          })}
                          placeholder="Membantu menurunkan kadar urea, mempertahankan BB normal..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-600 block">Prinsip & Syarat Diet</label>
                        <textarea
                          rows={2}
                          value={formPatient.intervention.dietPrinciple}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            intervention: { ...formPatient.intervention, dietPrinciple: e.target.value }
                          })}
                          placeholder="Sajian rendah garam, pembatasan natrium <2000mg..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 bg-white border border-slate-100 p-5 rounded-2xl">
                      <span className="font-bold text-slate-800 text-xs block uppercase border-b border-slate-100 pb-1">Edukasi & Advokasi Gizi</span>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-600 block">Rencana Rujukan Terapan Edukasi Gizi</label>
                        <textarea
                          rows={2.5}
                          value={formPatient.intervention.nutritionCounseling}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            intervention: { ...formPatient.intervention, nutritionCounseling: e.target.value }
                          })}
                          placeholder="Sediakan lembar balik diet rendah protein, diskusikan bahan masakan dengan keluarga..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-hidden focus:border-teal-500 text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-600 block">Rekomendasi Bahan Pangan Sehat</label>
                        <textarea
                          rows={2}
                          value={formPatient.intervention.foodRecommendation}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            intervention: { ...formPatient.intervention, foodRecommendation: e.target.value }
                          })}
                          placeholder="Putih telur, tim beras merah, pir kukus, brokoli rebus..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-600 block">Target Perubahan Kelakuan Pasien</label>
                        <input
                          type="text"
                          placeholder="Mampu memilih lauk tanpa digoreng, meningkatkan sayuran..."
                          value={formPatient.intervention.behaviorChangeTarget}
                          onChange={(e) => setFormPatient({
                            ...formPatient,
                            intervention: { ...formPatient.intervention, behaviorChangeTarget: e.target.value }
                          })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === WIZARD STEP 6: MONITORING & EVALUASI === */}
              {activeStep === 6 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-sm">Langkah 7: Rencana Monitoring dan Evaluasi</h3>
                    <p className="text-xs text-slate-400 mt-1">Rancang indikator pengawasan klinis untuk mengukur kesuksesan terapi gizi Anda.</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4 text-xs text-slate-700">
                    <span className="font-bold text-slate-800 text-xs block uppercase border-b border-slate-200 pb-1 flex justify-between">
                      <span>Rencana Pengawasan 5 Parameter Terstandar</span>
                      <span className="text-teal-600 font-mono">PAGT MONEV</span>
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      
                      {/* Antropometri Monev */}
                      <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3">
                        <span className="font-bold text-teal-800 font-mono text-[11px] uppercase block border-b border-slate-50 pb-0.5">1. Sektor Antropometri</span>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Target Terapi BB:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.anthropometryTarget}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, anthropometryTarget: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Metode Pengawasan:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.anthropometryAction}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, anthropometryAction: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Evaluasi / Hasil Kelanjutan:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.anthropometryEvaluation}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, anthropometryEvaluation: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                      </div>

                      {/* Biokimia Monev */}
                      <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3">
                        <span className="font-bold text-teal-800 font-mono text-[11px] uppercase block border-b border-slate-50 pb-0.5">2. Sektor Biokimia</span>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Target Indeks Lab:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.biochemistryTarget}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, biochemistryTarget: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Metode Pengawasan:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.biochemistryAction}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, biochemistryAction: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Evaluasi / Hasil Kelanjutan:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.biochemistryEvaluation}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, biochemistryEvaluation: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                      </div>

                      {/* Fisik Monev */}
                      <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3">
                        <span className="font-bold text-teal-800 font-mono text-[11px] uppercase block border-b border-slate-50 pb-0.5">3. Sektor Fisik / Klinis</span>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Target Keluhan Vital:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.clinicalTarget}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, clinicalTarget: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Metode Pengawasan:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.clinicalAction}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, clinicalAction: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Evaluasi / Hasil Kelanjutan:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.clinicalEvaluation}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, clinicalEvaluation: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                      </div>

                      {/* Dietary Monev */}
                      <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3">
                        <span className="font-bold text-teal-800 font-mono text-[11px] uppercase block border-b border-slate-50 pb-0.5">4. Sektor Asupan Makanan</span>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Target Porsi Asupan:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.dietaryTarget}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, dietaryTarget: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Metode Pengawasan:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.dietaryAction}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, dietaryAction: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Evaluasi / Hasil Kelanjutan:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.dietaryEvaluation}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, dietaryEvaluation: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                      </div>

                      {/* Compliance Monev */}
                      <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3">
                        <span className="font-bold text-teal-800 font-mono text-[11px] uppercase block border-b border-slate-50 pb-0.5">5. Sektor Kepatuhan Diet</span>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Target Kepatuhan Perilaku:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.complianceTarget}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, complianceTarget: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Metode Pengawasan:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.complianceAction}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, complianceAction: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-semibold block">Evaluasi / Hasil Kelanjutan:</span>
                          <input
                            type="text"
                            value={formPatient.monitoring.complianceEvaluation}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, complianceEvaluation: e.target.value }
                            })}
                            className="w-full p-2 bg-slate-50 rounded border border-slate-200"
                          />
                        </div>
                      </div>

                      {/* Next directions */}
                      <div className="bg-teal-50/40 p-4 border border-teal-100 rounded-xl space-y-3">
                        <span className="font-bold text-teal-900 font-mono text-[11px] uppercase block border-b border-teal-200 pb-0.5">Lanjutan Pasca Monev</span>
                        <div className="space-y-1.5">
                          <span className="text-teal-700 font-bold block">Kemungkinan Diagnosis Baru:</span>
                          <input
                            type="text"
                            placeholder="Contoh: Belum diperlukan diagnosis baru"
                            value={formPatient.monitoring.newDiagnosis}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, newDiagnosis: e.target.value }
                            })}
                            className="w-full p-2 bg-white rounded border border-teal-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-teal-700 font-bold block">Intervensi Gizi Lanjutan:</span>
                          <input
                            type="text"
                            placeholder="Contoh: Terapi dijalankan tanpa revisi"
                            value={formPatient.monitoring.nextIntervention}
                            onChange={(e) => setFormPatient({
                              ...formPatient,
                              monitoring: { ...formPatient.monitoring, nextIntervention: e.target.value }
                            })}
                            className="w-full p-2 bg-white rounded border border-teal-200"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Automatic Stage Summary block (as requested in the PAGT Indonesian prompt) */}
              <div className="bg-sky-50/50 rounded-2xl border border-sky-100 p-4.5 text-xs text-sky-950 space-y-1 animate-pulse">
                <span className="font-extrabold text-sky-900 block uppercase text-[10px] tracking-wider">RINGKASAN OTOMATIS TAHAP INI</span>
                {activeStep === 0 && (
                  <p className="italic">
                    Identitas pasien <strong>{formPatient.name || 'Belum diisi'} ({formPatient.gender})</strong> telah terekam. Skrining Awal asuhan mendeteksi 
                    {' '}<span className="font-bold text-rose-700">
                      {Object.values(formPatient.screening).filter(v => v).length} indikator keluhan kelainan
                    </span>.
                  </p>
                )}
                {activeStep === 1 && (
                  <p className="italic">
                    Fisik tubuh pasien: Berat {formPatient.anthropometry.currentWeight || '--'} kg, Tinggi {formPatient.anthropometry.height || '--'} cm. 
                    Calculated IMT: <strong>{formPatient.anthropometry.imt ? formPatient.anthropometry.imt.toFixed(1) : '--'} kg/m²</strong> (Status: {formPatient.anthropometry.nutritionalStatus || 'Belum terklasifikasi'}). 
                    BBI: <strong>{formPatient.anthropometry.idealWeight || '--'} kg</strong>. 
                    {formPatient.anthropometry.isChild && ` Status pertumbuhan kurva anak balita: ${formPatient.anthropometry.childInterpretation || '--'}`}.
                  </p>
                )}
                {activeStep === 2 && (
                  <p className="italic">
                    Tingkat asupan biokimia darah terekam. 
                    {' '}<strong className="text-teal-800">
                      {Object.values(formPatient.biochemistry).filter(v => v !== '').length} parameter lab dimasukkan
                    </strong>. Gunakan tabel di atas untuk memantau status normal/abnormal secara instan.
                  </p>
                )}
                {activeStep === 3 && (
                  <p className="italic">
                    Klinis: Suhu drajat {formPatient.physicalClinical.temperature || '--'}°C, TD {formPatient.physicalClinical.systolic || '--'}/{formPatient.physicalClinical.diastolic || '--'} mmHg. 
                    Keluhan GI pencernaan terekam. Food recall asupan gizi hari lalu mencakup 
                    {' '}<strong>Energi {formPatient.dietaryHistory.recallEnergyPercent || '--'}%</strong> kecukupan.
                  </p>
                )}
                {activeStep === 4 && (
                  <p className="italic">
                    Rangkaian diagnosis medis PAGT terstandar: Terpilih <strong>{formPatient.diagnoses.length} Diagnosis berbasis PES</strong> di dalam rekam asuhan pasien.
                  </p>
                )}
                {activeStep === 5 && (
                  <p className="italic">
                    Target metabolic harian disusun: <strong>BMR dasar: {formPatient.intervention.bmr} kkal</strong> dan berkontribusi terhadap 
                    {' '}<strong>TEE harian: {formPatient.intervention.tee} kkal</strong>. Target Gizi makro: Protein {formPatient.intervention.targetProtein}g, Lemak {formPatient.intervention.targetFat}g, Karbohidrat {formPatient.intervention.targetCarbo}g.
                  </p>
                )}
                {activeStep === 6 && (
                  <p className="italic">
                    Monev tersusun: Rencana monitoring mencakup 5 parameter vital kesehatan pangan, siap disimpan untuk dicetak.
                  </p>
                )}
              </div>

              {/* Wizard Navigations Bar */}
              <div className="flex justify-between items-center border-t border-slate-150 pt-5 print:hidden">
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 disabled:cursor-not-allowed text-slate-700 text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </button>

                {activeStep < 6 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (formPatient.name.trim() === '') {
                        alert('Silahkan isi nama pasien pada langkah 1 terlebih dahulu!');
                        return;
                      }
                      setActiveStep(activeStep + 1);
                    }}
                    className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white text-xs font-bold py-2 px-5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSavePatient}
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs font-bold py-2.5 px-6 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    Simpan & Rampungkan ADIME
                  </button>
                )}
              </div>

            </div>
          </div>
        )}
        </div>

        {/* Modern bottom footer - integrated inside main container to prevent sidebar horizontal alignment issues */}
        <footer className="bg-slate-50 border-t border-slate-100 py-5 text-center text-[11px] text-slate-400 print:hidden mt-auto md:rounded-b-[2rem] w-full shrink-0">
          <div className="max-w-4xl mx-auto px-4 space-y-1.5">
            <p className="font-bold text-slate-500">
              ADIMEKU v1.2 — Developed by <span className="text-[#e52e2e] font-extrabold">Eva Yulia Rahma</span>
            </p>
            <p className="leading-relaxed text-slate-400">
              Alat bantu kalkulasi terstruktur asuhan gizi klinis berdasarkan Pedoman Proses Asuhan Gizi Terstandar (PAGT) Kemenkes RI.
            </p>
            <p className="text-[10px] text-slate-300">
              Sistem database offline-first demi penegakan etika medis kerahasiaan personal rekam pasien.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
