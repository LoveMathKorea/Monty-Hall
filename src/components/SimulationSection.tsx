import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Sliders, 
  Activity, 
  HelpCircle, 
  TrendingUp, 
  BarChart2, 
  Gauge,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { SimDataPoint, SimSpeed } from '../types';

export default function SimulationSection() {
  // Config state
  const [doorCount, setDoorCount] = useState<number>(3);
  const [totalTrials, setTotalTrials] = useState<number>(1000);
  const [speed, setSpeed] = useState<SimSpeed>('FAST');

  // Simulation run state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentTrial, setCurrentTrial] = useState<number>(0);
  const [stayWins, setStayWins] = useState<number>(0);
  const [switchWins, setSwitchWins] = useState<number>(0);
  const [chartData, setChartData] = useState<SimDataPoint[]>([]);

  // Simulation loop refs to prevent closure issues in async callbacks
  const isRunningRef = useRef<boolean>(false);
  const currentTrialRef = useRef<number>(0);
  const stayWinsRef = useRef<number>(0);
  const switchWinsRef = useRef<number>(0);
  const chartDataRef = useRef<SimDataPoint[]>([]);
  const timeoutIdRef = useRef<number | null>(null);

  // Stop simulation on unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const handleStop = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  const handleStart = () => {
    if (isRunning) {
      handleStop();
      return;
    }

    // Reset stats before starting
    setCurrentTrial(0);
    setStayWins(0);
    setSwitchWins(0);
    setChartData([]);

    currentTrialRef.current = 0;
    stayWinsRef.current = 0;
    switchWinsRef.current = 0;
    chartDataRef.current = [];

    setIsRunning(true);
    isRunningRef.current = true;

    // Start simulation loop
    runSimulationStep();
  };

  // Simulate a single trial
  const simulateSingleTrial = (nDoors: number): { stayWon: boolean; switchWon: boolean } => {
    // 1. Placement of car
    const carDoor = Math.floor(Math.random() * nDoors);
    
    // 2. Initial choice
    const initialPick = Math.floor(Math.random() * nDoors);

    // 3. Staying with original choice wins if initially picked car
    const stayWon = initialPick === carDoor;

    // 4. Switching wins if initially picked a goat
    // Since N-2 doors containing goats are opened, switching to the other remaining door
    // guarantees a win if the initial choice was a goat (which has probability (N-1)/N).
    const switchWon = initialPick !== carDoor;

    return { stayWon, switchWon };
  };

  const runSimulationStep = () => {
    if (!isRunningRef.current) return;

    const nDoors = doorCount;
    const maxTrials = totalTrials;
    const currentSpeed = speed;

    // Determine how many trials to run in this single execution tick
    let trialsInThisTick = 1;
    let delay = 0;

    if (currentSpeed === 'WATCH') {
      trialsInThisTick = 1;
      delay = 200; // 200ms pause
    } else if (currentSpeed === 'FAST') {
      // Run in moderate batches
      trialsInThisTick = Math.max(1, Math.floor(maxTrials / 150));
      delay = 25; // short delay
    } else if (currentSpeed === 'INSTANT') {
      // Run in huge batches to complete instantly without freezing
      trialsInThisTick = Math.max(100, Math.floor(maxTrials / 10));
      delay = 0; // immediate next tick
    }

    let localTrial = currentTrialRef.current;
    let localStayWins = stayWinsRef.current;
    let localSwitchWins = switchWinsRef.current;

    for (let i = 0; i < trialsInThisTick; i++) {
      if (localTrial >= maxTrials) break;

      const { stayWon, switchWon } = simulateSingleTrial(nDoors);
      localTrial++;
      if (stayWon) localStayWins++;
      if (switchWon) localSwitchWins++;
    }

    // Update Refs
    currentTrialRef.current = localTrial;
    stayWinsRef.current = localStayWins;
    switchWinsRef.current = localSwitchWins;

    // Calculate win rates
    const stayWinRate = localTrial > 0 ? (localStayWins / localTrial) * 100 : 0;
    const switchWinRate = localTrial > 0 ? (localSwitchWins / localTrial) * 100 : 0;

    // Chart downsampling logic: collect up to 100 points
    const samplingInterval = Math.max(1, Math.floor(maxTrials / 100));
    const shouldAddChartPoint = 
      localTrial % samplingInterval === 0 || 
      localTrial === 1 || 
      localTrial === maxTrials;

    if (shouldAddChartPoint) {
      const newPoint: SimDataPoint = {
        trial: localTrial,
        stayWinRate: Number(stayWinRate.toFixed(1)),
        switchWinRate: Number(switchWinRate.toFixed(1)),
      };
      
      // Update chart reference
      chartDataRef.current = [...chartDataRef.current, newPoint];
    }

    // Sync state for rendering
    setCurrentTrial(localTrial);
    setStayWins(localStayWins);
    setSwitchWins(localSwitchWins);
    setChartData([...chartDataRef.current]);

    if (localTrial < maxTrials && isRunningRef.current) {
      // Continue loop
      timeoutIdRef.current = window.setTimeout(runSimulationStep, delay);
    } else {
      // Finish
      setIsRunning(false);
      isRunningRef.current = false;
      timeoutIdRef.current = null;
    }
  };

  // Theoretical Probabilities
  const theoreticalStay = Number(((1 / doorCount) * 100).toFixed(1));
  const theoreticalSwitch = Number((((doorCount - 1) / doorCount) * 100).toFixed(1));

  // Current Live Probabilities
  const currentStayRate = currentTrial > 0 ? ((stayWins / currentTrial) * 100).toFixed(1) : '0.0';
  const currentSwitchRate = currentTrial > 0 ? ((switchWins / currentTrial) * 100).toFixed(1) : '0.0';

  const progressPercentage = Math.min(100, Math.floor((currentTrial / totalTrials) * 100));

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden" id="simulation-container">
      {/* Header */}
      <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold italic tracking-tighter text-slate-800 uppercase">BATCH SIMULATION</h2>
          <p className="text-xs text-slate-500">대수의 법칙(Law of Large Numbers)으로 밝히는 진짜 확률</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="space-y-4">
          <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100 space-y-4">
            <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-600" />
              SIMULATOR PARAMETERS
            </h3>

            {/* Door Count Selector */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-600">문의 개수 (N)</span>
                <span className="font-mono text-emerald-600 font-bold">{doorCount} Doors</span>
              </div>
              <input
                id="input-sim-doors"
                type="range"
                min="3"
                max="100"
                value={doorCount}
                disabled={isRunning}
                onChange={(e) => setDoorCount(Number(e.target.value))}
                className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>03</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            {/* Trial Count Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-600">총 시도 횟수</span>
                <span className="font-mono text-emerald-600 font-bold">{totalTrials.toLocaleString()} TRIALS</span>
              </div>
              <select
                id="select-sim-trials"
                value={totalTrials}
                disabled={isRunning}
                onChange={(e) => setTotalTrials(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value={100}>100 TRIALS</option>
                <option value={500}>500 TRIALS</option>
                <option value={1000}>1,000 TRIALS</option>
                <option value={3000}>3,000 TRIALS</option>
                <option value={5000}>5,000 TRIALS</option>
                <option value={10000}>10,000 TRIALS</option>
              </select>
            </div>

            {/* Speed Selector */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-600">진행 속도</span>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {(['WATCH', 'FAST', 'INSTANT'] as SimSpeed[]).map((s) => {
                  const labelMap = { WATCH: '감상', FAST: '고속', INSTANT: '즉시완료' };
                  const isSelected = speed === s;
                  return (
                    <button
                      key={s}
                      id={`btn-speed-${s}`}
                      type="button"
                      onClick={() => setSpeed(s)}
                      disabled={isRunning && speed === 'INSTANT'} // Disable speed changes to Instant once running to prevent frame locks
                      className={`text-[10px] font-black tracking-wider uppercase py-2 px-2 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-slate-900 text-white bg-slate-900 font-black shadow-xs'
                          : 'border-slate-200 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {labelMap[s]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex gap-2">
            <button
              id="btn-toggle-sim"
              onClick={handleStart}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isRunning
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-100'
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-white" />
                  STOP EXPERIMENT
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  RUN EXPERIMENT
                </>
              )}
            </button>
          </div>

          {/* Current Live Stats Display */}
          <div className="bg-slate-50/20 rounded-2xl p-4 border border-slate-100 space-y-2.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-500">진행도:</span>
              <span className="font-mono text-slate-800">
                {currentTrial.toLocaleString()} / {totalTrials.toLocaleString()} ({progressPercentage}%)
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
              <div>
                <span className="text-[9px] font-black tracking-widest text-slate-400 block uppercase">Stay Wins</span>
                <span className="text-sm font-black text-slate-700 font-mono">{stayWins}W</span>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{currentStayRate}%</span>
              </div>
              <div className="border-l border-slate-100">
                <span className="text-[9px] font-black tracking-widest text-slate-400 block uppercase">Switch Wins</span>
                <span className="text-sm font-black text-emerald-600 font-mono">{switchWins}W</span>
                <span className="text-[10px] text-emerald-600 font-mono block mt-0.5">{currentSwitchRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Convergence Graph Column */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/20 h-full flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Real-time Convergence Curve
                </h3>
                <p className="text-[11px] text-slate-400">대수의 법칙: 실험 횟수가 늘어날수록 점선(이론적 확률)에 완벽히 수렴합니다.</p>
              </div>

              {/* Legend Summary */}
              <div className="flex gap-2.5 text-[10px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-1.5 bg-emerald-500 rounded-sm"></span>
                  <span className="text-slate-600 font-bold">SWITCH ({currentSwitchRate}%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-1.5 bg-slate-400 rounded-sm"></span>
                  <span className="text-slate-600 font-bold">STAY ({currentStayRate}%)</span>
                </div>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="w-full h-72">
              {chartData.length === 0 ? (
                <div className="w-full h-full border-2 border-dashed border-slate-200 bg-white rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
                  <BarChart2 className="w-8 h-8 text-slate-300 stroke-1 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">WAITING FOR EXPERIMENT RUN...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="trial" 
                      tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                      stroke="#cbd5e1"
                      label={{ value: 'Trials', position: 'insideBottomRight', offset: -5, fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                      stroke="#cbd5e1"
                      label={{ value: 'Win Rate %', angle: -90, position: 'insideLeft', offset: 10, fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }}
                    />
                    <Tooltip 
                      contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                      labelFormatter={(label) => `시도 횟수: ${label}회`}
                    />
                    
                    {/* Reference Lines for Theoretical Probability */}
                    <ReferenceLine 
                      y={theoreticalSwitch} 
                      stroke="#10b981" 
                      strokeDasharray="4 4" 
                      strokeWidth={1.5}
                      label={{ 
                        value: `Theory: Switch (${theoreticalSwitch}%)`, 
                        position: 'insideBottomRight', 
                        fontSize: 8, 
                        fill: '#059669',
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                      }} 
                    />
                    <ReferenceLine 
                      y={theoreticalStay} 
                      stroke="#94a3b8" 
                      strokeDasharray="4 4" 
                      strokeWidth={1.5}
                      label={{ 
                        value: `Theory: Stay (${theoreticalStay}%)`, 
                        position: 'insideTopRight', 
                        fontSize: 8, 
                        fill: '#64748b',
                        fontWeight: 'bold',
                        fontFamily: 'monospace'
                      }} 
                    />
 
                    {/* Simulation Win Rates lines */}
                    <Line 
                      type="monotone" 
                      dataKey="switchWinRate" 
                      stroke="#10b981" 
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                      name="변경 승률"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stayWinRate" 
                      stroke="#94a3b8" 
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                      name="유지 승률"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Sub-note */}
            <div className="text-[10px] text-slate-400 italic text-center mt-3 flex items-center justify-center gap-1 font-mono uppercase font-semibold">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>
                N={doorCount}: Theory Switch <span className="font-bold text-emerald-600">{theoreticalSwitch}%</span> vs Theory Stay <span className="font-bold text-slate-500">{theoreticalStay}%</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
