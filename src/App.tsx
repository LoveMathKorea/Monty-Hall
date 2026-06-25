/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, GraduationCap, Percent, HelpCircle } from 'lucide-react';
import { UserStats } from './types';
import GameSection from './components/GameSection';
import SimulationSection from './components/SimulationSection';
import ExplanationSection from './components/ExplanationSection';

export default function App() {
  // Load stats from localStorage or fall back to zeros
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('monty_hall_user_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed.stayPlayCount === 'number' &&
          typeof parsed.stayWinCount === 'number' &&
          typeof parsed.switchPlayCount === 'number' &&
          typeof parsed.switchWinCount === 'number'
        ) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading local stats', e);
    }
    return {
      stayPlayCount: 0,
      stayWinCount: 0,
      switchPlayCount: 0,
      switchWinCount: 0,
    };
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('monty_hall_user_stats', JSON.stringify(stats));
  }, [stats]);

  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
  };

  const handleResetStats = () => {
    const cleared = {
      stayPlayCount: 0,
      stayWinCount: 0,
      switchPlayCount: 0,
      switchWinCount: 0,
    };
    setStats(cleared);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 pb-12 font-sans">
      {/* Decorative top header line */}
      <div className="h-1.5 w-full bg-emerald-500"></div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Navigation / Header Brand */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-emerald-950 md:text-2xl uppercase font-sans">
                  몬티홀 <span className="font-light text-slate-500 uppercase text-xs tracking-widest ml-1">연구소</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 rounded">
                  Experimental Probability
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                직접 문을 선택하고 대량 시뮬레이션을 돌리며 수학의 비밀을 파헤치는 공간
              </p>
            </div>
          </div>

          {/* Quick Stats Summary badges on top right */}
          <div className="flex items-center gap-3 self-start md:self-auto text-xs">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Accumulated Plays</span>
              <span className="font-semibold text-slate-700 font-mono">
                {stats.stayPlayCount + stats.switchPlayCount} TRIALS
              </span>
            </div>
            <div className="flex h-9 items-center justify-center rounded-lg bg-white border border-slate-200 px-4 py-1.5 shadow-xs">
              <span className="text-xs font-black tracking-widest text-emerald-700 uppercase">KOREAN UI</span>
            </div>
          </div>
        </header>

        {/* Dynamic introduction card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Cognitive Illusion Paradox
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold italic tracking-tight leading-tight text-white">
              당신의 선택을 바꾸시겠습니까?
            </h2>
            
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              3개의 문 중 하나를 선택하면 사회자가 다른 염소 문을 열어 보여줍니다.<br />
              이때, <span className="font-bold text-white underline decoration-emerald-500 decoration-2">처음 선택을 그대로 유지하는 것(Stay)</span>과 <span className="font-bold text-emerald-400 underline decoration-emerald-500 decoration-2">남은 문으로 바꾸는 것(Switch)</span> 중 어느 쪽이 승률이 더 높을까요? 
              놀랍게도 바꿀 때의 승률이 정확히 <span className="text-emerald-300 font-extrabold text-md font-mono">2배(66.7%)</span> 높아집니다. 직관을 깨부수는 수학의 세계로 안내합니다!
            </p>
          </div>
        </div>

        {/* Section 1: Interactive Game experience & play stats */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <div className="p-1 bg-emerald-50 text-emerald-700 rounded">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Phase 01 / 1:1 직접 게임 체험</h2>
          </div>
          <GameSection 
            stats={stats} 
            onUpdateStats={handleUpdateStats} 
            onResetStats={handleResetStats} 
          />
        </section>

        {/* Section 2: Large automation simulator & visualization */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <div className="p-1 bg-emerald-50 text-emerald-700 rounded">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Phase 02 / 대량 자동 시뮬레이션</h2>
          </div>
          <SimulationSection />
        </section>

        {/* Section 3: In-depth mathematical explanation & Marilyn history */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <div className="p-1 bg-emerald-50 text-emerald-700 rounded">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Phase 03 / 수학적 해설 & 비하인드</h2>
          </div>
          <ExplanationSection />
        </section>

        {/* Page Footer */}
        <footer className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p className="font-bold uppercase tracking-wider text-slate-600">Monty Hall Interactive Labs</p>
            <p className="mt-0.5">이론적 수렴 확률과 대수의 법칙 자동화 검증 시뮬레이터</p>
          </div>
          <p className="font-mono text-[10px]">© 2026 MONTY HALL LABS. ALL RIGHTS RESERVED.</p>
        </footer>

      </div>
    </div>
  );
}
