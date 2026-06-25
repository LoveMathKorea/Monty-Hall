import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Settings2, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Flame,
  DoorClosed
} from 'lucide-react';
import { Door, GameStage, UserStats } from '../types';

interface GameSectionProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onResetStats: () => void;
}

export default function GameSection({ stats, onUpdateStats, onResetStats }: GameSectionProps) {
  // Game Setup State
  const [doorCount, setDoorCount] = useState<number>(3);
  const [stage, setStage] = useState<GameStage>('INITIAL');
  const [doors, setDoors] = useState<Door[]>([]);
  const [initialPick, setInitialPick] = useState<number | null>(null);
  const [finalPick, setFinalPick] = useState<number | null>(null);
  const [hostRevealedIds, setHostRevealedIds] = useState<number[]>([]);
  const [lastGameResult, setLastGameResult] = useState<{
    won: boolean;
    decision: 'STAY' | 'SWITCH';
  } | null>(null);

  // Initialize a new game
  const initGame = (customDoorCount = doorCount) => {
    const carIndex = Math.floor(Math.random() * customDoorCount);
    const newDoors: Door[] = Array.from({ length: customDoorCount }, (_, i) => ({
      id: i,
      content: i === carIndex ? 'CAR' : 'GOAT',
      isOpened: false,
      isInitiallySelected: false,
      isFinallySelected: false,
    }));

    setDoors(newDoors);
    setInitialPick(null);
    setFinalPick(null);
    setHostRevealedIds([]);
    setStage('INITIAL');
  };

  // Run on mount or when doorCount changes
  useEffect(() => {
    initGame();
  }, [doorCount]);

  // Step 1: User initially picks a door
  const handleInitialPick = (doorId: number) => {
    if (stage !== 'INITIAL') return;

    setInitialPick(doorId);

    // Host reveals N-2 doors containing goats, leaving only the picked door and 1 other door unopened
    const pickedDoor = doors[doorId];
    
    // Find all goat door IDs that are NOT the picked door
    const goatIdsNotPicked = doors
      .filter((d) => d.content === 'GOAT' && d.id !== doorId)
      .map((d) => d.id);

    // Find car door ID if it's NOT picked
    const carIdNotPicked = doors
      .filter((d) => d.content === 'CAR' && d.id !== doorId)
      .map((d) => d.id)[0]; // undefined if car is picked

    let idsToReveal: number[] = [];

    if (pickedDoor.content === 'CAR') {
      // User picked the car door!
      // All other N-1 doors are goats. We need to reveal N-2 of them at random, leaving 1 closed.
      // Shuffle goat IDs and pick N-2 of them to reveal.
      const shuffledGoats = [...goatIdsNotPicked].sort(() => Math.random() - 0.5);
      idsToReveal = shuffledGoats.slice(0, doorCount - 2);
    } else {
      // User picked a goat door.
      // There is exactly 1 car door (not picked), and N-2 goat doors (one of which is picked).
      // The other N-2 doors consist of the car door and N-2 goat doors (excluding the picked one).
      // We MUST keep the car door closed, and keep the picked door closed.
      // Thus, we must open ALL other goat doors.
      // That means we open all goat doors except the picked one, which leaves exactly the picked goat door and the car door closed.
      idsToReveal = goatIdsNotPicked;
    }

    // Mark those doors as revealed/opened
    setHostRevealedIds(idsToReveal);
    setStage('HOST_REVEALED');
  };

  // Step 2 & 3: Make final choice (Switch or Stay)
  const handleFinalChoice = (decision: 'STAY' | 'SWITCH') => {
    if (stage !== 'HOST_REVEALED' || initialPick === null) return;

    let finalSelectedId = initialPick;

    if (decision === 'SWITCH') {
      // Switch to the other unopened door
      const otherUnopenedDoor = doors.find(
        (d) => d.id !== initialPick && !hostRevealedIds.includes(d.id)
      );
      if (otherUnopenedDoor) {
        finalSelectedId = otherUnopenedDoor.id;
      }
    }

    setFinalPick(finalSelectedId);

    // Reveal ALL doors
    const finalDoors = doors.map((d) => ({
      ...d,
      isOpened: true,
      isInitiallySelected: d.id === initialPick,
      isFinallySelected: d.id === finalSelectedId,
    }));

    setDoors(finalDoors);
    setStage('FINISHED');

    const won = finalDoors[finalSelectedId].content === 'CAR';
    setLastGameResult({ won, decision });

    // Update Statistics
    const newStats = { ...stats };
    if (decision === 'STAY') {
      newStats.stayPlayCount += 1;
      if (won) newStats.stayWinCount += 1;
    } else {
      newStats.switchPlayCount += 1;
      if (won) newStats.switchWinCount += 1;
    }
    onUpdateStats(newStats);
  };

  // Calculate percentages
  const stayWinRate = stats.stayPlayCount > 0 
    ? ((stats.stayWinCount / stats.stayPlayCount) * 100).toFixed(1) 
    : '0.0';

  const switchWinRate = stats.switchPlayCount > 0 
    ? ((stats.switchWinCount / stats.switchPlayCount) * 100).toFixed(1) 
    : '0.0';

  const totalPlays = stats.stayPlayCount + stats.switchPlayCount;
  const totalWins = stats.stayWinCount + stats.switchWinCount;
  const overallWinRate = totalPlays > 0 
    ? ((totalWins / totalPlays) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Play Area */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[580px] overflow-hidden">
        {/* Play Area Header */}
        <div>
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold italic tracking-tighter text-slate-800 uppercase">INTERACTIVE GAME</h2>
              <p className="text-xs text-slate-500">직접 문을 선택하고 확률의 역설을 확인해보세요</p>
            </div>

            {/* Config Gate Count */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-xs">
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doors Count:</span>
              <select
                id="door-count-select"
                value={doorCount}
                disabled={stage !== 'INITIAL'}
                onChange={(e) => setDoorCount(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-emerald-600 focus:outline-none cursor-pointer"
              >
                <option value={3}>3 Doors (기본)</option>
                <option value={4}>4 Doors</option>
                <option value={5}>5 Doors</option>
                <option value={7}>7 Doors</option>
                <option value={10}>10 Doors</option>
              </select>
            </div>
          </div>

          {/* Guidelines */}
          <div className="mt-6 px-6 text-center">
            {stage === 'INITIAL' && (
              <p className="text-sm font-semibold text-slate-700 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl py-3 px-4">
                행운의 문을 하나 선택해 주세요! 뒤에 <span className="text-emerald-600 font-bold">스포츠카(🚗)</span>가 숨겨진 문은 무엇일까요?
              </p>
            )}
            {stage === 'HOST_REVEALED' && (
              <p className="text-sm font-semibold text-slate-700 bg-emerald-50 border border-emerald-100 rounded-2xl py-3 px-4">
                사회자가 염소(🐐) 문을 열어 제거했습니다. 이제 선택을 다른 닫힌 문으로 바꾸시겠습니까?
              </p>
            )}
            {stage === 'FINISHED' && lastGameResult && (
              <div className="flex flex-col items-center justify-center">
                {lastGameResult.won ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl py-4 px-6 w-full text-center"
                  >
                    <div className="flex items-center gap-2 font-black text-lg">
                      <Sparkles className="w-5 h-5 text-emerald-500 animate-bounce" />
                      우승을 축하합니다! 자동차를 찾았습니다! 🚗
                    </div>
                    <span className="text-xs text-emerald-600">선택 변경/유지 예측이 완벽히 맞아떨어졌습니다!</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-1.5 text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 w-full text-center"
                  >
                    <div className="flex items-center gap-2 font-semibold text-lg">
                      아쉽게도 염소를 뽑았습니다... 🐐
                    </div>
                    <span className="text-xs text-slate-500">하지만 괜찮습니다. 확률 실험 통계는 누적됩니다.</span>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Doors Grid container */}
        <div className="my-8 px-6 flex justify-center items-center">
          <div 
            className={`grid gap-4 w-full justify-center`}
            style={{
              gridTemplateColumns: `repeat(${doorCount <= 5 ? doorCount : Math.ceil(doorCount / 2)}, minmax(85px, 120px))`
            }}
          >
            {doors.map((door) => {
              const isSelected = initialPick === door.id;
              const isFinal = finalPick === door.id;
              const isRevealedByHost = hostRevealedIds.includes(door.id);
              
              // Apply Editorial doors style guidelines
              let doorStyle = '';
              let insideOverlay = null;

              if (isRevealedByHost || (stage === 'FINISHED' && door.isOpened && door.content === 'GOAT' && isFinal)) {
                // Opened Goat Door: dark theme with absolute white border overlay
                doorStyle = 'bg-slate-800 border-2 border-slate-900 text-white rounded-xl relative';
                insideOverlay = <div className="absolute inset-1.5 border border-white/10 rounded-lg pointer-events-none"></div>;
              } else if (stage === 'FINISHED' && door.isOpened && door.content === 'CAR' && isFinal) {
                // Winning Opened door: luxury gold/emerald
                doorStyle = 'border-4 border-emerald-500 bg-emerald-50/50 rounded-xl relative shadow-inner ring-4 ring-emerald-100 ring-offset-2';
              } else if (stage === 'FINISHED' && door.isOpened && door.content === 'CAR') {
                // Other car revealed
                doorStyle = 'border-2 border-emerald-400 bg-emerald-50/20 rounded-xl relative';
              } else if (isSelected && stage === 'HOST_REVEALED') {
                // Picked selected door: luxury emerald border + ring
                doorStyle = 'border-4 border-emerald-500 bg-emerald-50 rounded-xl relative shadow-inner ring-4 ring-emerald-100 ring-offset-2';
              } else if (isSelected && stage === 'INITIAL') {
                doorStyle = 'border-4 border-emerald-400 bg-emerald-50 rounded-xl relative ring-2 ring-emerald-100';
              } else {
                // Normal closed door: dashed elegant slate border
                doorStyle = 'border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-300 rounded-xl opacity-90';
              }

              return (
                <motion.button
                  key={door.id}
                  id={`door-${door.id}`}
                  whileHover={stage === 'INITIAL' ? { y: -4, scale: 1.02 } : {}}
                  whileTap={stage === 'INITIAL' ? { scale: 0.98 } : {}}
                  onClick={() => handleInitialPick(door.id)}
                  disabled={stage !== 'INITIAL'}
                  className={`relative flex flex-col items-center justify-center h-44 cursor-pointer transition-all ${doorStyle} ${
                    stage !== 'INITIAL' && !isSelected && !isFinal && !isRevealedByHost ? 'opacity-40' : ''
                  }`}
                >
                  {insideOverlay}

                  {/* Door Number badge */}
                  <div className={`absolute top-2 left-2 w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-black ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {String(door.id + 1).padStart(2, '0')}
                  </div>

                  {/* Indicator labels */}
                  {isSelected && stage === 'HOST_REVEALED' && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap uppercase tracking-wider">
                      Selected
                    </div>
                  )}

                  {isFinal && stage === 'FINISHED' && (
                    <div className={`absolute top-2 right-2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap uppercase tracking-wider ${
                      door.content === 'CAR' ? 'bg-emerald-600' : 'bg-slate-600'
                    }`}>
                      {lastGameResult?.decision === 'SWITCH' ? 'SWITCH' : 'STAY'}
                    </div>
                  )}

                  {/* Inside content */}
                  <div className="flex flex-col items-center justify-center gap-1 z-10">
                    {door.isOpened || isRevealedByHost ? (
                      <motion.div
                        initial={{ scale: 0.5, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-4xl"
                      >
                        {door.content === 'CAR' ? '🚗' : '🐐'}
                      </motion.div>
                    ) : (
                      <DoorClosed className={`w-14 h-14 ${
                        isSelected ? 'text-emerald-500' : 'text-slate-400'
                      }`} />
                    )}

                    <span className={`text-[10px] font-bold tracking-widest uppercase mt-2 ${
                      isRevealedByHost || (stage === 'FINISHED' && door.isOpened && door.content === 'GOAT') ? 'text-white/40' : 'text-slate-400'
                    }`}>
                      {door.isOpened || isRevealedByHost 
                        ? (door.content === 'CAR' ? 'CAR' : 'GOAT')
                        : 'CLOSED'}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-center gap-4">
          <AnimatePresence mode="wait">
            {stage === 'INITIAL' && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center"
              >
                ◀ 위의 문을 직접 클릭해서 첫 번째 선택을 확정하세요 ▶
              </motion.div>
            )}

            {stage === 'HOST_REVEALED' && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
              >
                <button
                  id="btn-switch"
                  onClick={() => handleFinalChoice('SWITCH')}
                  className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors uppercase tracking-widest shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  선택 변경 (Switch)
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
                <button
                  id="btn-stay"
                  onClick={() => handleFinalChoice('STAY')}
                  className="flex-1 py-3.5 bg-white text-slate-900 border-2 border-slate-200 rounded-xl font-bold text-sm hover:border-slate-400 transition-colors uppercase tracking-widest shadow-sm cursor-pointer"
                >
                  선택 유지 (Stay)
                </button>
              </motion.div>
            )}

            {stage === 'FINISHED' && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
              >
                <button
                  id="btn-restart"
                  onClick={() => initGame()}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs tracking-[0.2em] uppercase shadow-lg shadow-emerald-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  NEXT GAME (다음 판 하기)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between" id="user-stats-panel">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold italic tracking-tighter text-slate-800 uppercase flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Live Stats
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">직접 체험 전적</p>
            </div>
            <button
              id="btn-reset-stats"
              onClick={onResetStats}
              className="text-xs text-slate-400 hover:text-rose-500 transition-all flex items-center gap-1 py-1.5 px-2.5 hover:bg-rose-50 rounded border border-slate-200 hover:border-rose-100 cursor-pointer"
              title="전적 초기화"
            >
              <RotateCcw className="w-3 h-3" />
              초기화
            </button>
          </div>

          {/* Cumulative Stats Boxes */}
          <div className="space-y-4 mt-5">
            {/* Total play summary */}
            <div className="bg-[#f8fafc] rounded-2xl p-4 flex justify-between items-center border border-slate-100">
              <div>
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Total Trials</span>
                <p className="text-2xl font-extrabold text-slate-950 font-mono">{totalPlays} <span className="text-xs font-normal text-slate-500 uppercase">Plays</span></p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Overall Win %</span>
                <p className="text-2xl font-black text-emerald-600 font-mono">{overallWinRate}%</p>
              </div>
            </div>

            {/* Stay Stats */}
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Stay (유지)</span>
                <span className="text-xs font-mono font-bold text-slate-500">{stats.stayWinCount}W / {stats.stayPlayCount}T</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-slate-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${stats.stayPlayCount > 0 ? (stats.stayWinCount / stats.stayPlayCount) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-black text-slate-700 w-12 text-right font-mono">{stayWinRate}%</span>
              </div>
              <p className="text-[9px] text-slate-400 font-medium mt-1.5">이론적 수렴 확률: 33.3% (문 3개 기준)</p>
            </div>

            {/* Switch Stats */}
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Switch (변경)</span>
                <span className="text-xs font-mono font-bold text-emerald-600">{stats.switchWinCount}W / {stats.switchPlayCount}T</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${stats.switchPlayCount > 0 ? (stats.switchWinCount / stats.switchPlayCount) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-black text-emerald-600 w-12 text-right font-mono">{switchWinRate}%</span>
              </div>
              <p className="text-[9px] text-emerald-600 font-semibold mt-1.5">이론적 수렴 확률: 66.7% (문 3개 기준)</p>
            </div>
          </div>
        </div>

        {/* Fun info card */}
        <div className="mt-6 p-4 bg-[#f8fafc] rounded-2xl border border-slate-200/50 flex items-start gap-2.5">
          <Flame className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800 block mb-0.5">ESTIMATION TIP</span>
            직접 플레이 횟수가 증가할수록, <span className="font-bold text-emerald-600 underline">선택 변경(Switch)</span>의 실제 승률이 <span className="font-bold text-emerald-600 underline">선택 유지(Stay)</span>보다 약 <span className="font-extrabold text-slate-800 text-sm font-mono">2배</span> 높게 수렴하게 됩니다!
          </div>
        </div>
      </div>
    </div>
  );
}
