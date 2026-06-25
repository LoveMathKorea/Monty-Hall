import React, { useState } from 'react';
import { BookOpen, Table, Compass, History, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ExplanationSection() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'intuition' | 'history'>('matrix');

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden" id="explanation-container">
      {/* Header */}
      <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold italic tracking-tighter text-slate-800 uppercase">THEOREM INSIGHTS</h2>
          <p className="text-xs text-slate-500">확률의 고정관념을 깨는 수학 증명과 세계사 비하인드</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-[#f8fafc]">
        <button
          id="tab-matrix"
          onClick={() => setActiveTab('matrix')}
          className={`flex-1 py-3.5 px-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'matrix'
              ? 'border-slate-900 text-slate-900 bg-white font-black'
              : 'border-transparent text-slate-400 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          Cases Matrix
        </button>
        <button
          id="tab-intuition"
          onClick={() => setActiveTab('intuition')}
          className={`flex-1 py-3.5 px-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'intuition'
              ? 'border-slate-900 text-slate-900 bg-white font-black'
              : 'border-transparent text-slate-400 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          100 Doors Concept
        </button>
        <button
          id="tab-history"
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3.5 px-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'border-slate-900 text-slate-900 bg-white font-black'
              : 'border-transparent text-slate-400 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Historical Paradox
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'matrix' && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                사회자가 항상 <span className="font-semibold text-emerald-600">염소가 있는 문을 공개</span>한다는 규칙 하에, 참가자가 선택을 유지할 때와 바꿀 때의 모든 경우의 수를 비교해 봅시다. (자동차가 1번 문에 있는 상황 가정)
              </p>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="p-4 font-black">참가자 초기 선택</th>
                      <th className="p-4 font-black">사회자가 여는 문 (염소)</th>
                      <th className="p-4 font-black text-rose-700">선택 유지 (Stay) 결과</th>
                      <th className="p-4 font-black text-emerald-700">선택 변경 (Switch) 결과</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900">1번 문 (자동차)</td>
                      <td className="p-4 text-slate-500">2번 또는 3번 문</td>
                      <td className="p-4 font-bold text-emerald-600 bg-emerald-50/20">CAR (WIN)</td>
                      <td className="p-4 font-bold text-rose-600 bg-rose-50/10">GOAT (LOSE)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900">2번 문 (염소)</td>
                      <td className="p-4 text-slate-500">3번 문 (염소)</td>
                      <td className="p-4 font-bold text-rose-600 bg-rose-50/10">GOAT (LOSE)</td>
                      <td className="p-4 font-bold text-emerald-600 bg-emerald-50/20">CAR (WIN)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900">3번 문 (염소)</td>
                      <td className="p-4 text-slate-500">2번 문 (염소)</td>
                      <td className="p-4 font-bold text-rose-600 bg-rose-50/10">GOAT (LOSE)</td>
                      <td className="p-4 font-bold text-emerald-600 bg-emerald-50/20">CAR (WIN)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl p-5 space-y-3">
                <h4 className="text-[10px] font-black tracking-widest text-emerald-800 uppercase flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  PROBABILITY INSIGHTS (핵심 요약)
                </h4>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2 leading-relaxed">
                  <li>
                    <span className="font-bold text-slate-800">선택 유지(Stay) 시 승률:</span> 처음에 자동차를 골랐을 확률인 <span className="font-bold text-emerald-600 font-mono">1/3 (약 33.3%)</span>로 고정됩니다.
                  </li>
                  <li>
                    <span className="font-bold text-slate-800">선택 변경(Switch) 시 승률:</span> 처음에 염소를 골랐을 확률인 <span className="font-bold text-emerald-600 font-mono">2/3 (약 66.7%)</span>가 됩니다. 왜냐하면 처음에 염소를 고르면, 사회자는 남은 두 문 중 다른 염소 문을 열어야 하므로, 선택을 바꾸면 반드시 자동차를 얻게 되기 때문입니다!
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'intuition' && (
            <motion.div
              key="intuition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-bold italic tracking-tight text-slate-950">"문이 100개라면 어떻게 될까요?"</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    3개의 문에서는 50대 50의 직관적 착각에 빠지기 쉽습니다. 하지만 문을 <span className="font-semibold text-emerald-600">100개</span>로 늘려 생각해보면 매우 명확해집니다.
                  </p>
                  <ol className="list-decimal pl-5 text-xs text-slate-600 space-y-2.5 leading-relaxed">
                    <li>
                      운동장에 문이 <span className="font-semibold text-slate-800">100개</span> 늘어서 있습니다. 단 하나의 문 뒤에만 진짜 스포츠카가 있습니다.
                    </li>
                    <li>
                      당신은 임의로 <span className="font-semibold text-slate-800">하나의 문</span>을 찍습니다. 이 문이 정답일 확률은 겨우 <span className="font-bold text-emerald-600 font-mono">1/100 (1%)</span>입니다.
                    </li>
                    <li>
                      정답이 아닐 확률(나머지 99개 문에 차가 있을 확률)은 무려 <span className="font-bold text-slate-800 font-mono">99%</span>입니다.
                    </li>
                    <li>
                      이제 모든 것을 알고 있는 사회자(몬티)가 나타나, 당신이 선택하지 않은 99개의 문 중 <span className="font-semibold text-emerald-600">98개의 문을 활짝 열어 염소를 공개</span>합니다.
                    </li>
                    <li>
                      그리고 단 하나의 문과 당신이 고른 문만 남겨둔 채 묻습니다. <span className="italic font-medium text-slate-800">"바꾸시겠습니까?"</span>
                    </li>
                  </ol>
                </div>
                <div className="w-full md:w-64 bg-[#f8fafc] rounded-2xl p-5 border border-slate-200 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-mono font-black mb-2">
                    100
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">100개 문 시각적 대비</div>
                  <div className="mt-4 w-full space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-mono">
                        <span className="text-slate-500">INITIAL CHOICE</span>
                        <span className="font-bold text-slate-700">1%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-slate-400 h-full rounded-full" style={{ width: '1%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-mono">
                        <span className="text-emerald-600 font-semibold">REMAINING (SWITCH)</span>
                        <span className="font-bold text-emerald-600">99%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99%' }}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-4 leading-relaxed font-light">
                    사회자는 99%의 영역에서 정답만 남겨두고 쓰레기(염소)를 모두 치워준 셈입니다!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 text-xs text-slate-600 leading-relaxed font-light"
            >
              <h3 className="text-lg font-bold italic tracking-tight text-slate-950">세계에서 가장 IQ가 높은 여성이 만든 해프닝</h3>
              <p>
                미국의 주간지 <em>'Parade'</em>에서 IQ 228로 기네스북에 오른 칼럼니스트 <span className="font-semibold text-slate-800">마릴린 보스 사반트(Marilyn vos Savant)</span>가 1990년 독자의 질문에 대답하면서 이 사건은 시작되었습니다.
              </p>
              <p>
                그녀는 <span className="font-semibold text-emerald-600">"선택을 무조건 바꾸는 것이 유리하며, 승률은 2배가 된다"</span>고 단언했습니다. 그러자 미국 전역의 수학과 교수와 박사학위 소지자를 포함하여 약 <span className="font-semibold text-rose-600">1만 명 이상</span>의 독자들이 비난과 조롱의 편지를 보냈습니다.
              </p>
              <div className="bg-[#f8fafc] rounded-2xl p-5 border-l-4 border-slate-900 italic text-[11px] space-y-2 leading-relaxed">
                <p>"당신은 완전히 틀렸습니다! 문 두 개 중 하나인데 50%가 아닌 66.7%라니 수학의 기본도 모르는군요."</p>
                <p className="text-right text-slate-400 font-bold uppercase tracking-wider text-[9px]">- 어느 대학의 기하학 교수 -</p>
              </div>
              <p>
                심지어 20세기 가장 위대한 수학자 중 한 명인 <span className="font-semibold text-slate-800">폴 에르되시(Paul Erdős)</span> 조차 처음에는 그녀의 논리를 거부하고 격렬히 비난했으나, 동료가 직접 수행한 <span className="font-semibold text-emerald-600 font-mono">컴퓨터 시뮬레이션 결과</span>를 확인한 뒤에야 비로소 사과하고 오류를 인정했습니다.
              </p>
              <p>
                결국 마릴린 보스 사반트의 주장은 컴퓨터 실험과 이론을 통해 완벽히 참임이 드러났으며, 직관과 확률이 얼마나 동떨어질 수 있는지를 보여주는 역사적인 사례로 과학계에 기록되었습니다.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
