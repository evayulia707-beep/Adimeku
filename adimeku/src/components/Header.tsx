/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, Award, Sparkles, User, FileText } from 'lucide-react';

interface HeaderProps {
  onBackToDashboard?: () => void;
  currentView?: string;
}

export default function Header({ onBackToDashboard, currentView }: HeaderProps) {
  return (
    <header className="bg-white border-b border-sky-100 shadow-xs sticky top-0 z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={onBackToDashboard}
          >
            <div className="p-2.5 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Activity className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-1.5 leading-none">
                ADIME<span className="text-teal-600 font-extrabold text-xl font-sans text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">KU</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium font-sans mt-1">
                Asuhan Gizi Terstandar (PAGT)
              </p>
            </div>
          </div>

          {/* Center tagline for deskview */}
          <div className="hidden lg:flex flex-col items-center text-center">
            <span className="text-sm font-semibold text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-100 flex items-center gap-1.5 animate-pulse">
              <Sparkles className="h-3.5 w-3.5 text-teal-500" />
              “Asuhan Gizi Terstandar Lebih Mudah, Cepat, dan Sistematis”
            </span>
          </div>

          {/* Developer & Action Metadata */}
          <div className="flex items-center space-x-4">
            <div className="text-right flex flex-col justify-center">
              <span className="text-xs text-slate-400 block leading-tight font-mono">DEVELOPER</span>
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-cyan-500" />
                Eva Yulia Rahma
              </span>
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="bg-sky-50 text-sky-800 font-semibold px-3 py-1.5 rounded-lg text-xs border border-sky-100 hidden sm:flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-sky-500" />
              Kemenkes RI Compliant
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
