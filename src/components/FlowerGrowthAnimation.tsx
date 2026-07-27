import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AnimatedPlant from './AnimatedPlant';
import { playClickSound, playSuccessChime, speakText } from '../utils/audio';
import { Play, Pause, SkipBack, SkipForward, Volume2, Sparkles, RefreshCw, X, Heart, Info, Flower2 } from 'lucide-react';

interface FlowerGrowthAnimationProps {
  onClose?: () => void;
  userProgressStage?: 1 | 2 | 3 | 4 | 5 | 6;
  isIpad?: boolean;
}

type Species = 'sunflower' | 'rose';
type BgTheme = 'cream-yellow' | 'soft-pink' | 'linen-white';

interface StageDetails {
  index: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  desc: string;
  narration: string;
}

const SUNFLOWER_STAGES: StageDetails[] = [
  {
    index: 1,
    title: '階段 1：種子期（0-1/10）',
    desc: '一粒啡色種子，沉睡喺土壤入面 🌰',
    narration: '一粒啡色種子，正沉睡喺溫暖的土壤入面，靜靜累積生命的力量。'
  },
  {
    index: 2,
    title: '階段 2：發芽期（2-3/10）',
    desc: '嫩芽破土而出，帶住兩塊小葉 🌱',
    narration: '看！嫩芽破土而出，帶住兩塊軟軟的小葉子，向世界打個招呼！'
  },
  {
    index: 3,
    title: '階段 3：幼苗期（4/10）',
    desc: '長出更多葉，莖向上生長 🌿',
    narration: '吸收了溫暖的陽光，莖不斷向上伸展，長出了更多綠油油的葉子！'
  },
  {
    index: 4,
    title: '階段 4：花蕾期（5-6/10）',
    desc: '植株長高，頂端出現小花苞 🌸',
    narration: '向日葵越長越高了！頂端冒出了一個可愛的小花苞，裡面藏著什麼驚喜呢？'
  },
  {
    index: 5,
    title: '階段 5：含苞期（7-8/10）',
    desc: '花苞變大，露出金黃色花瓣 🌼',
    narration: '花苞漸漸變大，露出了金黃色的花瓣，準備展現最燦爛的笑臉！'
  },
  {
    index: 6,
    title: '階段 6：盛開期（9-10/10）',
    desc: '金黃色花瓣完全展開，盛開 🌻',
    narration: '太棒了！金黃色的花瓣完全展開，盛開綻放！就像太陽一樣溫暖人心！'
  }
];

const ROSE_STAGES: StageDetails[] = [
  {
    index: 1,
    title: '階段 1：種子期（0-1/10）',
    desc: '一粒啡色種子，沉睡喺土壤入面 🌰',
    narration: '一粒啡色種子，沉睡喺土壤入面，準備孵化美麗的夢想。'
  },
  {
    index: 2,
    title: '階段 2：發芽期（2-3/10）',
    desc: '嫩芽破土而出，長出嫩葉 🌱',
    narration: '嫩芽勇敢地破土而出，長出了帶著些許粉紅暈彩的嫩葉。'
  },
  {
    index: 3,
    title: '階段 3：幼苗期（4/10）',
    desc: '長出複葉，莖長高，出現小刺 🌿',
    narration: '莖向上長高，長出了精緻的複葉，還有保護自己的小刺喔！'
  },
  {
    index: 4,
    title: '階段 4：花蕾期（5-6/10）',
    desc: '枝條頂端出現小花苞 🌹',
    narration: '枝條頂端悄悄出現了一個圓滾滾的小花苞，被綠色的花萼溫柔包裹著。'
  },
  {
    index: 5,
    title: '階段 5：含苞期（7-8/10）',
    desc: '花苞變大，顏色由綠轉紅 🌷',
    narration: '花苞漸漸變大，萼片悄悄舒展，顏色由綠轉為濃郁的玫瑰紅色！'
  },
  {
    index: 6,
    title: '階段 6：盛開期（9-10/10）',
    desc: '紅色花瓣層層展開，盛開 🌹',
    narration: '哇！美麗的紅色花瓣層層展開，燦爛盛開！散發著優雅溫暖的光彩！'
  }
];

export default function FlowerGrowthAnimation({
  onClose,
  userProgressStage = 6,
  isIpad = false
}: FlowerGrowthAnimationProps) {
  const [species, setSpecies] = useState<Species>('sunflower');
  const [bgTheme, setBgTheme] = useState<BgTheme>('cream-yellow');
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4 | 5 | 6>(6); // App defaults to full bloom (stage 6)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [isBloomingEffect, setIsBloomingEffect] = useState(false);
  const [useUserStageMode, setUseUserStageMode] = useState(false);

  const stagesList = species === 'sunflower' ? SUNFLOWER_STAGES : ROSE_STAGES;
  const currentStageDetails = stagesList[currentStage - 1];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 2200 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= 6) {
          setIsPlaying(false);
          setIsBloomingEffect(true);
          playSuccessChime();
          setTimeout(() => setIsBloomingEffect(false), 2500);
          return 6;
        }
        const next = (prev + 1) as 1 | 2 | 3 | 4 | 5 | 6;
        if (next === 6) {
          setIsBloomingEffect(true);
          playSuccessChime();
          setTimeout(() => setIsBloomingEffect(false), 2500);
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const handleStageSelect = (stageIdx: 1 | 2 | 3 | 4 | 5 | 6) => {
    playClickSound(480 + stageIdx * 40, 'sine');
    setIsPlaying(false);
    setCurrentStage(stageIdx);
    if (stageIdx === 6) {
      setIsBloomingEffect(true);
      playSuccessChime();
      setTimeout(() => setIsBloomingEffect(false), 2500);
    }
  };

  const handleSpeakDescription = () => {
    speakText(currentStageDetails.narration);
  };

  const handleTogglePlay = () => {
    playClickSound(580, 'sine');
    if (currentStage === 6 && !isPlaying) {
      // Loop back to stage 1 if at end
      setCurrentStage(1);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeciesChange = (newSpecies: Species) => {
    playClickSound(520, 'sine');
    setSpecies(newSpecies);
    if (newSpecies === 'rose' && bgTheme === 'cream-yellow') {
      setBgTheme('soft-pink');
    } else if (newSpecies === 'sunflower' && bgTheme === 'soft-pink') {
      setBgTheme('cream-yellow');
    }
  };

  // Get background gradient CSS based on selected warm theme
  const getBgGradient = () => {
    if (bgTheme === 'cream-yellow') {
      return 'from-[#fefcf3] via-[#fff8e1] to-[#fef3d6] border-amber-200/80 text-amber-950';
    } else if (bgTheme === 'soft-pink') {
      return 'from-[#fff5f6] via-[#ffeef1] to-[#fde2e7] border-rose-200/80 text-rose-950';
    } else {
      return 'from-[#faf8f5] via-[#f3efe6] to-[#eae5d9] border-stone-200/80 text-stone-900';
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-between space-y-3 py-1 px-1 h-full max-w-xl mx-auto select-none">
      {/* Header bar with controls */}
      <div className="w-full flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-xs p-2.5 px-3.5 rounded-2xl border-2 border-brand-sand shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-lg shadow-2xs">
            {species === 'sunflower' ? '🌻' : '🌹'}
          </div>
          <div>
            <h2 className="text-sm font-black text-brand-moss font-sans flex items-center gap-1.5">
              <span>花卉生長動畫</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-sage/15 text-brand-moss border border-brand-sage/30">
                治癒系 6 階段
              </span>
            </h2>
            <p className="text-[10px] font-bold text-gray-400">由沉睡種子到盛開綻放的視覺躍遷</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition cursor-pointer border-0"
            title="關閉動畫賞"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Showcase Stage Area with Soft Warm Gradient */}
      <div
        className={`w-full flex-1 min-h-[280px] sm:min-h-[320px] rounded-3xl border-2 p-4 shadow-sm relative overflow-hidden flex flex-col items-center justify-between transition-all duration-500 bg-gradient-to-b ${getBgGradient()}`}
      >
        {/* Top Floating Badges */}
        <div className="w-full flex items-center justify-between z-20">
          {/* Flower Species Selector Pills */}
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-gray-200/80 shadow-2xs">
            <button
              onClick={() => handleSpeciesChange('sunflower')}
              className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                species === 'sunflower'
                  ? 'bg-amber-400 text-amber-950 shadow-2xs font-black'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>🌻 向日葵</span>
            </button>
            <button
              onClick={() => handleSpeciesChange('rose')}
              className={`px-3 py-1 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                species === 'rose'
                  ? 'bg-rose-500 text-white shadow-2xs font-black'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>🌹 玫瑰花</span>
            </button>
          </div>

          {/* Warm Background Theme Selector */}
          <div className="flex items-center gap-1 bg-white/70 p-1 rounded-full border border-gray-200/60 text-[11px] font-bold">
            <span className="text-[10px] text-gray-400 px-1">背景：</span>
            <button
              onClick={() => setBgTheme('cream-yellow')}
              className={`w-5 h-5 rounded-full bg-[#fef3d6] border transition cursor-pointer ${
                bgTheme === 'cream-yellow' ? 'border-amber-600 ring-2 ring-amber-300' : 'border-gray-300'
              }`}
              title="淡黃色背景"
            />
            <button
              onClick={() => setBgTheme('soft-pink')}
              className={`w-5 h-5 rounded-full bg-[#fde2e7] border transition cursor-pointer ${
                bgTheme === 'soft-pink' ? 'border-rose-600 ring-2 ring-rose-300' : 'border-gray-300'
              }`}
              title="淡粉色背景"
            />
            <button
              onClick={() => setBgTheme('linen-white')}
              className={`w-5 h-5 rounded-full bg-[#f3efe6] border transition cursor-pointer ${
                bgTheme === 'linen-white' ? 'border-stone-600 ring-2 ring-stone-300' : 'border-gray-300'
              }`}
              title="奶油白背景"
            />
          </div>
        </div>

        {/* Central Animated Plant Renderer */}
        <div className="relative w-full flex-1 flex flex-col items-center justify-center my-2">
          {/* Gentle breeze sway halo */}
          <AnimatedPlant
            key={`${species}-${currentStage}`}
            progress={(currentStage / 6) * 100}
            stageIndex={currentStage}
            theme={species}
            moodLabel="開心"
            showBloomingEffect={isBloomingEffect}
          />

          {/* Celebration Bloom Sparkles */}
          <AnimatePresence>
            {isBloomingEffect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute text-center z-30 pointer-events-none"
              >
                <div className="bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full border-2 border-amber-300 shadow-lg text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>輕柔綻放盛開！美麗滿載 ✨</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stage Description Box & Speech Narration */}
        <div className="w-full bg-white/85 backdrop-blur-xs p-3 rounded-2xl border border-white/80 shadow-2xs z-20 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/60">
                {currentStageDetails.title}
              </span>
            </div>
            <button
              onClick={handleSpeakDescription}
              className="px-2.5 py-1 rounded-xl bg-brand-sand hover:bg-brand-sage/20 text-brand-moss text-xs font-bold transition flex items-center gap-1 cursor-pointer border-0 active:scale-95"
              title="語音解說 (SEN 友善)"
            >
              <Volume2 className="w-3.5 h-3.5 text-brand-sage" />
              <span>語音解說</span>
            </button>
          </div>
          <p className="text-xs font-extrabold text-gray-700 leading-relaxed text-left pl-1">
            {currentStageDetails.desc}
          </p>
        </div>
      </div>

      {/* Interactive Player Controls & Stage Timeline Stepper */}
      <div className="w-full bg-white p-3.5 rounded-2xl border-2 border-brand-sand shadow-2xs space-y-3 shrink-0 text-left">
        {/* Playback Controls Row */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className={`px-4 py-2 rounded-xl text-xs font-black text-white flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs border-0 ${
                isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand-sage hover:bg-brand-moss'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? '暫停播放' : '生長動態播放'}</span>
            </button>

            {/* Playback Speed selector */}
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl text-[11px] font-bold">
              {[0.5, 1, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    playClickSound(400, 'sine');
                    setPlaybackSpeed(speed);
                  }}
                  className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-white font-black text-brand-moss shadow-2xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Replay or user stage link button */}
          <button
            onClick={() => {
              playClickSound(450, 'sine');
              setCurrentStage(1);
              setIsPlaying(true);
            }}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer border-0 flex items-center gap-1 text-xs font-bold"
            title="重頭開始演繹 1->6 階段"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>重頭播放</span>
          </button>
        </div>

        {/* 6-Stage Timeline Stepper Buttons */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-black text-gray-600">
            <span>生長 6 階段導航：</span>
            <span className="text-[11px] font-bold text-gray-400">點擊切換階段觀賞</span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {([1, 2, 3, 4, 5, 6] as const).map((s) => {
              const isActive = currentStage === s;
              return (
                <button
                  key={s}
                  onClick={() => handleStageSelect(s)}
                  className={`py-2 rounded-xl text-xs font-black transition cursor-pointer flex flex-col items-center justify-center gap-0.5 border-2 ${
                    isActive
                      ? species === 'sunflower'
                        ? 'border-amber-400 bg-amber-100 text-amber-950 shadow-2xs scale-105'
                        : 'border-rose-400 bg-rose-100 text-rose-950 shadow-2xs scale-105'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-gray-400 leading-none">P{s}</span>
                  <span className="text-[11px] font-black leading-none">
                    {s === 1 ? '種子期' : s === 2 ? '發芽期' : s === 3 ? '幼苗期' : s === 4 ? '花蕾期' : s === 5 ? '含苞期' : '盛開期'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
