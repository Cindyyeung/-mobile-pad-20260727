import { motion } from 'motion/react';
import { getPlantStage } from '../moodsData';

interface AnimatedPlantProps {
  key?: string;
  progress: number; // 0 to 100
  stageIndex?: 1 | 2 | 3 | 4 | 5 | 6; // Explicit 1-6 stage override
  moodLabel?: string; // Optional: change visual based on mood
  isWatering?: boolean; // Hydration animation trigger
  heightCm?: number;
  isStatic?: boolean;
  theme?: 'original' | 'sunflower' | 'rose';
  companions?: {
    bee?: number;
    butterfly?: number;
    cat?: number;
    beeDisplay?: number;
    butterflyDisplay?: number;
    catDisplay?: number;
  };
  showBloomingEffect?: boolean;
}

export default function AnimatedPlant({
  progress,
  stageIndex,
  moodLabel = '平靜',
  isWatering = false,
  heightCm = 10,
  isStatic = false,
  theme = 'original',
  companions,
  showBloomingEffect = false
}: AnimatedPlantProps) {
  // Derive stage index (1 to 6) if not explicitly passed
  const currentStageIndex: 1 | 2 | 3 | 4 | 5 | 6 = stageIndex || (() => {
    if (progress < 20) return 1; // 種子期 (0-1/10)
    if (progress < 40) return 2; // 發芽期 (2-3/10)
    if (progress < 50) return 3; // 幼苗期 (4/10)
    if (progress < 70) return 4; // 花蕾期 (5-6/10)
    if (progress < 90) return 5; // 含苞期 (7-8/10)
    return 6; // 盛開期 (9-10/10)
  })();

  const legacyStage = getPlantStage(progress);

  // Companion counts
  const beeCount = Math.min(5, companions?.beeDisplay ?? companions?.bee ?? 0);
  const butterflyCount = Math.min(3, companions?.butterflyDisplay ?? companions?.butterfly ?? 0);
  const catCount = Math.min(1, companions?.catDisplay ?? companions?.cat ?? 0);

  // Set colors & mood atmosphere
  let glowColor = 'rgba(109, 160, 111, 0.3)'; // Sage #6da06f
  let leavesColor = '#6da06f'; // Warm organic green
  let bloomColor = '#fefaf0'; // Cream white
  let swaySpeed = 4; // seconds for full sway cycle

  if (moodLabel === '開心') {
    glowColor = 'rgba(255, 179, 71, 0.45)'; // Warm gold yellow
    leavesColor = '#7cb37d'; // Bright happy green
    bloomColor = '#fefaf0';
    swaySpeed = 3;
  } else if (moodLabel === '焦慮') {
    glowColor = 'rgba(255, 179, 71, 0.25)';
    leavesColor = '#8ba38d';
    swaySpeed = 6;
  } else if (moodLabel === '憤怒') {
    glowColor = 'rgba(223, 122, 94, 0.35)';
    leavesColor = '#5e7d5f';
    bloomColor = '#fefaf0';
    swaySpeed = 2.5;
  } else if (moodLabel === '睏') {
    glowColor = 'rgba(100, 116, 139, 0.2)';
    leavesColor = '#7fa081';
    swaySpeed = 7;
  } else if (moodLabel === '平靜') {
    glowColor = 'rgba(109, 160, 111, 0.3)';
    leavesColor = '#6da06f';
    bloomColor = '#fefaf0';
    swaySpeed = 5;
  }

  // Theme override colors
  if (theme === 'sunflower') {
    bloomColor = '#ffd700';
    glowColor = 'rgba(255, 215, 0, 0.35)';
  } else if (theme === 'rose') {
    bloomColor = '#e63946';
    glowColor = 'rgba(230, 57, 70, 0.3)';
  } else if (theme === 'original') {
    bloomColor = '#e1bee7';
    glowColor = 'rgba(225, 190, 231, 0.35)';
  }

  const particles = Array.from({ length: 6 });

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-64 select-none">
      {/* Background Glow Halo */}
      <motion.div
        className="absolute rounded-full filter blur-xl"
        style={{
          width: '180px',
          height: '180px',
          backgroundColor: glowColor,
          zIndex: 0,
        }}
        animate={isStatic ? undefined : {
          scale: [1, 1.12, 1],
          opacity: [0.6, 0.85, 0.6],
        }}
        transition={isStatic ? undefined : {
          duration: swaySpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Watering droplets & Watering Can animation */}
      {isWatering && !isStatic && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
          {/* Animated Watering Can (細細嘅水壺) beside the plant */}
          <motion.div
            className="absolute top-2 right-6"
            initial={{ opacity: 0, scale: 0.6, rotate: 0, x: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: -28, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <svg className="w-16 h-16 filter drop-shadow-md" viewBox="0 0 100 100" fill="none">
              {/* Can Body */}
              <path d="M25 45 C25 35 35 32 50 32 C65 32 75 35 75 45 L70 75 C70 80 62 82 50 82 C38 82 30 80 30 75 Z" fill="#94d2bd" stroke="#0a9396" strokeWidth="2.5" />
              {/* Handle */}
              <path d="M26 48 C12 48 12 70 28 72" fill="none" stroke="#0a9396" strokeWidth="3" strokeLinecap="round" />
              {/* Spout */}
              <path d="M72 52 L92 38" stroke="#0a9396" strokeWidth="4" strokeLinecap="round" />
              {/* Rose head */}
              <ellipse cx="93" cy="37" rx="3.5" ry="6" fill="#ee9b00" transform="rotate(-30 93 37)" />
            </svg>
          </motion.div>

          {/* 3 to 5 Water Droplets falling down from spout to soil */}
          <div className="absolute top-10 right-10 flex space-x-1.5">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={`drop-${i}`}
                className="w-2 h-4 bg-sky-400 rounded-full opacity-0"
                initial={{ y: 0, opacity: 0, scaleY: 1 }}
                animate={{
                  y: [0, 85],
                  opacity: [0, 1, 1, 0],
                  scaleY: [1, 1.4, 0.8],
                }}
                transition={{
                  duration: 0.85,
                  delay: 0.15 + i * 0.12,
                  repeat: 2,
                  ease: 'easeIn',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Floating sparkles/particles on blooming or high stages */}
      {!isStatic && (currentStageIndex >= 5 || showBloomingEffect) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {particles.map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${4 + (i % 3) * 3}px`,
                height: `${4 + (i % 3) * 3}px`,
                backgroundColor: theme === 'sunflower' ? '#ffe066' : theme === 'rose' ? '#ff85a1' : '#fefaf0',
                bottom: '50px',
                left: `${30 + i * 12}%`,
                opacity: 0.8,
              }}
              animate={{
                y: [0, -110 - i * 10],
                x: [0, Math.sin(i) * 18, Math.cos(i) * -18],
                opacity: [0, 0.9, 0],
                scale: [0.5, 1.2, 0],
              }}
              transition={{
                duration: 2.8 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Companions */}
      {!isStatic && beeCount > 0 && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {Array.from({ length: beeCount }).map((_, i) => (
            <div
              key={`bee-${i}`}
              className="absolute text-xl drop-shadow-md"
              style={{ left: '50%', bottom: '50%' }}
            >
              <motion.div
                animate={{ x: [-40 - i * 15, 40 + i * 15, -40 - i * 15] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  animate={{ y: [-20 - i * 10, 30 + i * 10, -20 - i * 10] }}
                  transition={{ duration: 3.3 + i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.div
                    animate={{ rotate: [-15, 15, -15] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🐝
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {!isStatic && butterflyCount > 0 && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {Array.from({ length: butterflyCount }).map((_, i) => (
            <div
              key={`butterfly-${i}`}
              className="absolute text-xl drop-shadow-md"
              style={{ left: '50%', bottom: '50%' }}
            >
              <motion.div
                animate={{ x: [50 + i * 15, -50 - i * 15, 50 + i * 15] }}
                transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  animate={{ y: [-40 - i * 10, 40 + i * 10, -40 - i * 10] }}
                  transition={{ duration: 4.1 + i * 0.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.div
                    animate={{ rotate: [10, -10, 10] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🦋
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {/* Relaxed Cat Companion (🐱 小貓) sitting next to the pot */}
      {!isStatic && catCount > 0 && (
        <div className="absolute bottom-6 right-6 pointer-events-none z-20">
          <motion.div
            animate={{
              y: [0, -1.8, 0],
              scaleY: [1, 1.02, 1],
              scaleX: [1, 0.99, 1],
            }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <svg className="w-16 h-16 filter drop-shadow-xs" viewBox="0 0 100 100" fill="none">
              {/* Tail swaying gently */}
              <motion.path
                d="M72 75 C82 72 88 62 82 52 C78 46 72 50 74 56"
                stroke="#e0a96d"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '72px 75px' }}
              />
              {/* Cat Body */}
              <ellipse cx="50" cy="70" rx="22" ry="18" fill="#fdf6e2" stroke="#d9a05b" strokeWidth="1.5" />
              <path d="M38 60 Q50 55 62 60 Q65 78 50 82 Q35 78 38 60 Z" fill="#f4c483" opacity="0.5" />

              {/* Paws */}
              <ellipse cx="40" cy="82" rx="5" ry="3" fill="#fff" stroke="#d9a05b" strokeWidth="1" />
              <ellipse cx="52" cy="82" rx="5" ry="3" fill="#fff" stroke="#d9a05b" strokeWidth="1" />

              {/* Head */}
              <circle cx="46" cy="46" r="15" fill="#fdf6e2" stroke="#d9a05b" strokeWidth="1.5" />

              {/* Left Ear */}
              <path d="M34 37 L30 22 L42 33 Z" fill="#f4c483" stroke="#d9a05b" strokeWidth="1.2" />
              <path d="M35 35 L32 25 L40 33 Z" fill="#f8b195" opacity="0.6" />

              {/* Right Ear */}
              <path d="M58 37 L62 22 L50 33 Z" fill="#f4c483" stroke="#d9a05b" strokeWidth="1.2" />
              <path d="M57 35 L60 25 L52 33 Z" fill="#f8b195" opacity="0.6" />

              {/* Cheeks */}
              <circle cx="36" cy="50" r="3.5" fill="#f8a5c2" opacity="0.5" />
              <circle cx="56" cy="50" r="3.5" fill="#f8a5c2" opacity="0.5" />

              {/* Nose */}
              <path d="M46 48 L44 46 L48 46 Z" fill="#e84393" />
              <path d="M46 48 Q42 52 40 50 M46 48 Q50 52 52 50" stroke="#7f8c8d" strokeWidth="1" strokeLinecap="round" />

              {/* Blinking Eyes */}
              <motion.g
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.9, 0.92, 0.94, 1] }}
                style={{ transformOrigin: '46px 44px' }}
              >
                <path d="M38 44 Q41 40 44 44" fill="none" stroke="#57606f" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M48 44 Q51 40 54 44" fill="none" stroke="#57606f" strokeWidth="1.8" strokeLinecap="round" />
              </motion.g>

              {/* Whiskers */}
              <path d="M32 48 L22 46 M32 50 L20 51 M60 48 L70 46 M60 50 L72 51" stroke="#a4b0be" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>
      )}

      {/* Central SVG Plant rendering */}
      <svg
        className="w-48 h-56 relative z-10 filter drop-shadow-md"
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Deeper Lush Green Gradient for Teardrop Flower Bud */}
          <linearGradient id="tenderBudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8cc63f" />
            <stop offset="35%" stopColor="#55a630" />
            <stop offset="70%" stopColor="#2b9348" />
            <stop offset="100%" stopColor="#10451d" />
          </linearGradient>

          {/* Calyx / Sepal Gradient */}
          <linearGradient id="sepalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#40916c" />
            <stop offset="100%" stopColor="#1b4332" />
          </linearGradient>

          {/* Inner Petal Glow Gradient for bud opening */}
          <linearGradient id="budInnerCoral" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffb703" />
            <stop offset="60%" stopColor="#df7a5e" />
            <stop offset="100%" stopColor="#c85a3e" />
          </linearGradient>

          {/* Lavender Wildflower Gradients for Original Theme */}
          <linearGradient id="lavenderBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e1bee7" />
            <stop offset="50%" stopColor="#ce93d8" />
            <stop offset="100%" stopColor="#ab47bc" />
          </linearGradient>

          <linearGradient id="lavenderFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f3e5f5" />
            <stop offset="40%" stopColor="#e1bee7" />
            <stop offset="80%" stopColor="#ce93d8" />
            <stop offset="100%" stopColor="#ba68c8" />
          </linearGradient>

          <linearGradient id="lavenderBudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f3e5f5" />
            <stop offset="60%" stopColor="#e1bee7" />
            <stop offset="100%" stopColor="#ce93d8" />
          </linearGradient>

          {/* Rose Bud Green to Red Gradient for Stage 5 */}
          <linearGradient id="roseBudGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#4a704b" />
            <stop offset="35%" stopColor="#8c424e" />
            <stop offset="70%" stopColor="#c62828" />
            <stop offset="100%" stopColor="#e53935" />
          </linearGradient>

          {/* Rose Petal Outer Gradient */}
          <linearGradient id="rosePetalGradOuter" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef5350" />
            <stop offset="50%" stopColor="#e53935" />
            <stop offset="100%" stopColor="#b71c1c" />
          </linearGradient>

          {/* Rose Petal Inner Gradient */}
          <linearGradient id="rosePetalGradInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff8a80" />
            <stop offset="60%" stopColor="#e53935" />
            <stop offset="100%" stopColor="#c62828" />
          </linearGradient>
        </defs>

        {/* Soil inside the terracotta pot */}
        <ellipse cx="100" cy="180" rx="35" ry="8" fill="#5c443c" />

        {/* ========================================================= */}
        {/* 🌻 SUNFLOWER (向日葵) - 6 STAGES                          */}
        {/* ========================================================= */}
        {theme === 'sunflower' && (
          <g>
            {/* 階段 1：一粒啡色種子，沉睡喺土壤入面 */}
            {currentStageIndex === 1 && (
              <motion.g
                animate={isStatic ? undefined : { scale: [1, 1.04, 1], y: [0, 1, 0] }}
                transition={isStatic ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Underground soil mound */}
                <path d="M78,180 Q100,168 122,180 Z" fill="#4e342e" />
                {/* Seed resting softly */}
                <path
                  d="M100,166 C92,166 91,178 100,178 C109,178 108,166 100,166 Z"
                  fill="#8d6e63"
                  stroke="#5d4037"
                  strokeWidth="1.5"
                />
                {/* Seed stripes */}
                <path d="M100,168 Q97,172 100,176" stroke="#bcaaa4" strokeWidth="1" strokeLinecap="round" />
                {/* Sleeping Zzz pulse */}
                {!isStatic && (
                  <motion.text
                    x="112"
                    y="160"
                    fill="#a78bfa"
                    fontSize="11"
                    fontWeight="bold"
                    animate={{ opacity: [0.3, 0.9, 0.3], y: [-2, -8, -2], x: [0, 2, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    zzz
                  </motion.text>
                )}
              </motion.g>
            )}

            {/* 階段 2：嫩芽破土而出，帶住兩塊小葉 */}
            {currentStageIndex === 2 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                {/* Tiny green stem breaking soil */}
                <path d="M100,180 Q98,162 100,148" stroke="#6da06f" strokeWidth="4.5" strokeLinecap="round" />
                {/* Left Cotyledon Leaf */}
                <path d="M100,152 Q82,148 85,138 Q96,142 100,152 Z" fill="#7cb37d" stroke="#5b8f5c" strokeWidth="1" />
                {/* Right Cotyledon Leaf */}
                <path d="M100,150 Q118,144 115,134 Q104,140 100,150 Z" fill="#7cb37d" stroke="#5b8f5c" strokeWidth="1" />
                {/* Cracked soil detail */}
                <path d="M92,180 L97,178 M103,178 L108,180" stroke="#795548" strokeWidth="2" strokeLinecap="round" />
              </motion.g>
            )}

            {/* 階段 3：長出更多葉，莖向上生長 */}
            {currentStageIndex === 3 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-2, 2, -2] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                {/* Stem growing upward */}
                <path d="M100,180 Q96,140 100,105" stroke="#6da06f" strokeWidth="7" strokeLinecap="round" />
                {/* Lower Left Leaf */}
                <path d="M98,155 Q72,140 68,148 Q82,158 98,155 Z" fill="#6da06f" stroke="#4f7550" strokeWidth="1" />
                {/* Lower Right Leaf */}
                <path d="M101,145 Q128,130 132,138 Q118,148 101,145 Z" fill="#6da06f" stroke="#4f7550" strokeWidth="1" />
                {/* Upper Left Leaf */}
                <path d="M99,122 Q78,108 76,115 Q88,124 99,122 Z" fill="#7cb37d" stroke="#4f7550" strokeWidth="1" />
                {/* Upper Right Leaf */}
                <path d="M100,115 Q122,102 124,109 Q112,117 100,115 Z" fill="#7cb37d" stroke="#4f7550" strokeWidth="1" />
                {/* Emerging top leaf shoots */}
                <path d="M100,105 Q94,92 100,88 Q103,96 100,105 Z" fill="#88c087" />
              </motion.g>
            )}

            {/* 階段 4：植株長高，頂端出現小花苞 */}
            {currentStageIndex === 4 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-2, 2, -2] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                {/* Sturdy stem */}
                <path d="M100,180 Q95,130 100,75" stroke="#6da06f" strokeWidth="8" strokeLinecap="round" />
                {/* Broad sunflower leaves */}
                <path d="M97,150 Q65,130 62,142 Q82,152 97,150 Z" fill="#6da06f" stroke="#4f7550" strokeWidth="1" />
                <path d="M102,135 Q135,115 138,128 Q118,138 102,135 Z" fill="#6da06f" stroke="#4f7550" strokeWidth="1" />
                <path d="M98,110 Q72,92 72,102 Q88,112 98,110 Z" fill="#7cb37d" stroke="#4f7550" strokeWidth="1" />
                <path d="M101,95 Q128,78 128,88 Q112,98 101,95 Z" fill="#7cb37d" stroke="#4f7550" strokeWidth="1" />

                {/* Unopened green flower bud wrapped in sepals */}
                <g transform="translate(100, 70)">
                  <circle cx="0" cy="0" r="14" fill="#5b8c5a" />
                  <path d="M-10,-5 Q0,-18 10,-5" fill="none" stroke="#466e45" strokeWidth="2" />
                  {/* Sepal leaves wrapping bud */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <path
                      key={i}
                      d={`M0,0 Q${Math.cos(i) * 16},${Math.sin(i) * 16 - 8} 0,-16`}
                      fill="#7cb37d"
                      stroke="#466e45"
                      strokeWidth="1"
                    />
                  ))}
                </g>
              </motion.g>
            )}

            {/* 階段 5：花苞變大，露出金黃色花瓣 */}
            {currentStageIndex === 5 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-2.2, 2.2, -2.2] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                {/* Tall stem */}
                <path d="M100,180 Q95,120 100,65" stroke="#6da06f" strokeWidth="8" strokeLinecap="round" />
                {/* Leaves */}
                <path d="M97,140 Q65,120 62,132 Q82,142 97,140 Z" fill="#6da06f" />
                <path d="M102,125 Q135,105 138,118 Q118,128 102,125 Z" fill="#6da06f" />
                <path d="M98,98 Q72,80 72,90 Q88,100 98,98 Z" fill="#7cb37d" />
                <path d="M101,85 Q128,68 128,78 Q112,88 101,85 Z" fill="#7cb37d" />

                {/* Swelling bud showing golden petals peeking out */}
                <g transform="translate(100, 60)">
                  {/* Outer green sepals parting */}
                  <circle cx="0" cy="0" r="18" fill="#5b8c5a" />
                  {/* Golden yellow petal tips emerging */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-14"
                      rx="4"
                      ry="10"
                      fill="#ffd700"
                      stroke="#ffab00"
                      strokeWidth="0.8"
                      transform={`rotate(${i * 36})`}
                    />
                  ))}
                  {/* Inner green/brown core */}
                  <circle cx="0" cy="0" r="11" fill="#6d4c41" />
                </g>
              </motion.g>
            )}

            {/* 階段 6：金黃色花瓣完全展開，盛開 */}
            {currentStageIndex === 6 && (
              <motion.g
                initial={showBloomingEffect ? { scale: 0.82 } : undefined}
                animate={isStatic ? undefined : {
                  rotate: [-2.5, 2.5, -2.5],
                  scale: showBloomingEffect ? [0.85, 1.06, 1] : [1, 1.02, 1]
                }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                {/* Sturdy green stem */}
                <path d="M100,180 C95,130 105,90 100,58" stroke="#6da06f" strokeWidth="8" strokeLinecap="round" />

                {/* Leaves */}
                <path d="M97,135 Q60,115 58,128 Q80,138 97,135 Z" fill="#6da06f" stroke="#4a704b" strokeWidth="1" />
                <path d="M102,118 Q140,98 142,112 Q120,122 102,118 Z" fill="#6da06f" stroke="#4a704b" strokeWidth="1" />
                <path d="M98,90 Q70,72 70,82 Q86,92 98,90 Z" fill="#7cb37d" stroke="#4a704b" strokeWidth="1" />
                <path d="M101,78 Q130,60 130,70 Q114,80 101,78 Z" fill="#7cb37d" stroke="#4a704b" strokeWidth="1" />

                {/* FULLY BLOOMED SUNFLOWER HEAD */}
                <g transform="translate(100, 52)">
                  {/* Outer Petals Layer 1 */}
                  {Array.from({ length: 14 }).map((_, i) => (
                    <ellipse
                      key={`p1-${i}`}
                      cx="0"
                      cy="-24"
                      rx="7"
                      ry="18"
                      fill="#ffd700"
                      stroke="#ffab00"
                      strokeWidth="1"
                      transform={`rotate(${i * 25.7})`}
                    />
                  ))}
                  {/* Inner Petals Layer 2 */}
                  {Array.from({ length: 14 }).map((_, i) => (
                    <ellipse
                      key={`p2-${i}`}
                      cx="0"
                      cy="-20"
                      rx="5"
                      ry="15"
                      fill="#ffb347"
                      transform={`rotate(${i * 25.7 + 12.8})`}
                    />
                  ))}
                  {/* Dark seed disc center */}
                  <circle cx="0" cy="0" r="16" fill="#8b4513" stroke="#5d3a1a" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="12" fill="#5d3a1a" strokeDasharray="2,2" stroke="#ffb347" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="6" fill="#3e2723" />
                </g>
              </motion.g>
            )}
          </g>
        )}

        {/* ========================================================= */}
        {/* 🌹 ROSE (玫瑰花) - 6 STAGES                                */}
        {/* ========================================================= */}
        {theme === 'rose' && (
          <g>
            {/* 階段 1：一粒啡色種子，沉睡喺土壤入面 */}
            {currentStageIndex === 1 && (
              <motion.g
                animate={isStatic ? undefined : { scale: [1, 1.04, 1], y: [0, 1, 0] }}
                transition={isStatic ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path d="M78,180 Q100,168 122,180 Z" fill="#4e342e" />
                <path
                  d="M100,166 C92,166 91,178 100,178 C109,178 108,166 100,166 Z"
                  fill="#795548"
                  stroke="#4e342e"
                  strokeWidth="1.5"
                />
                <path d="M100,168 Q97,172 100,176" stroke="#d7ccc8" strokeWidth="1" />
                {!isStatic && (
                  <motion.text
                    x="112"
                    y="160"
                    fill="#f43f5e"
                    fontSize="11"
                    fontWeight="bold"
                    animate={{ opacity: [0.3, 0.9, 0.3], y: [-2, -8, -2], x: [0, 2, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    zzz
                  </motion.text>
                )}
              </motion.g>
            )}

            {/* 階段 2：嫩芽破土而出，長出嫩葉 */}
            {currentStageIndex === 2 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                <path d="M100,180 Q102,162 100,148" stroke="#5e8c5d" strokeWidth="4" strokeLinecap="round" />
                {/* Tender young leaves with reddish-pink tips */}
                <path d="M100,152 Q82,146 85,136 Q98,142 100,152 Z" fill="#88b04b" stroke="#c97b84" strokeWidth="1" />
                <path d="M100,150 Q118,142 115,132 Q102,140 100,150 Z" fill="#88b04b" stroke="#c97b84" strokeWidth="1" />
                <path d="M92,180 L97,178 M103,178 L108,180" stroke="#6d4c41" strokeWidth="2" strokeLinecap="round" />
              </motion.g>
            )}

            {/* 階段 3：長出複葉，莖長高，出現小刺 */}
            {currentStageIndex === 3 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-1.8, 1.8, -1.8] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                {/* Stem extending upward */}
                <path d="M100,180 Q106,140 100,102" stroke="#5e8c5d" strokeWidth="5" strokeLinecap="round" />

                {/* Small rose thorns (小刺) */}
                <path d="M102,155 L108,150 L103,147" fill="#8c5e5d" />
                <path d="M98,135 L92,130 L97,127" fill="#8c5e5d" />
                <path d="M102,118 L107,113 L103,110" fill="#8c5e5d" />

                {/* Serrated Compound Rose Leaves (複葉) */}
                <g transform="translate(100, 142)">
                  <path d="M0,0 Q-20,-10 -25,2 Q-10,8 0,0" fill="#6da06f" stroke="#486e49" strokeWidth="0.8" />
                  <path d="M-12,-4 Q-22,-20 -28,-10 Q-18,2 -12,-4" fill="#6da06f" stroke="#486e49" strokeWidth="0.8" />
                  <path d="M-12,-4 Q-5,-22 -15,-22 Q-18,-10 -12,-4" fill="#6da06f" stroke="#486e49" strokeWidth="0.8" />
                </g>
                <g transform="translate(100, 122) scale(-1, 1)">
                  <path d="M0,0 Q-20,-10 -25,2 Q-10,8 0,0" fill="#6da06f" stroke="#486e49" strokeWidth="0.8" />
                  <path d="M-12,-4 Q-22,-20 -28,-10 Q-18,2 -12,-4" fill="#6da06f" stroke="#486e49" strokeWidth="0.8" />
                  <path d="M-12,-4 Q-5,-22 -15,-22 Q-18,-10 -12,-4" fill="#6da06f" stroke="#486e49" strokeWidth="0.8" />
                </g>
              </motion.g>
            )}

            {/* 階段 4：花蕾期 (5-7/10) - 2-3枝錯落有致的枝條，頂端形成綠色小花苞，由花萼包裹 */}
            {currentStageIndex === 4 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-1.8, 1.8, -1.8] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                {/* 3 Staggered Stems */}
                {/* Secondary Left Stem */}
                <path d="M100,180 Q86,138 76,96" stroke="#5e8c5d" strokeWidth="4.5" strokeLinecap="round" />
                {/* Tertiary Right Stem */}
                <path d="M100,180 Q114,142 124,112" stroke="#5e8c5d" strokeWidth="4" strokeLinecap="round" />
                {/* Primary Central Stem */}
                <path d="M100,180 Q104,125 100,72" stroke="#5e8c5d" strokeWidth="5.5" strokeLinecap="round" />

                {/* Thorns */}
                <path d="M103,155 L110,150 L104,147" fill="#8c5e5d" />
                <path d="M96,138 L89,133 L95,130" fill="#8c5e5d" />
                <path d="M103,115 L109,110 L104,107" fill="#8c5e5d" />
                <path d="M98,92 L92,87 L97,84" fill="#8c5e5d" />

                {/* Rich Serrated Leaves */}
                <g transform="translate(100, 142)">
                  <path d="M0,0 Q-22,-12 -28,0 Q-12,10 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                  <path d="M-14,-5 Q-25,-22 -30,-10 Q-18,4 -14,-5" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>
                <g transform="translate(100, 122) scale(-1, 1)">
                  <path d="M0,0 Q-22,-12 -28,0 Q-12,10 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>
                <g transform="translate(82, 118)">
                  <path d="M0,0 Q-18,-10 -22,2 Q-8,8 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>
                <g transform="translate(112, 130) scale(-1, 1)">
                  <path d="M0,0 Q-18,-10 -22,2 Q-8,8 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>

                {/* Bud 1: Central Main Green Rose Bud */}
                <g transform="translate(100, 68)">
                  <path d="M-8,12 Q-14,-4 -6,-14 Q0,-2 0,14" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path d="M8,12 Q14,-4 6,-14 Q0,-2 0,14" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path
                    d="M 0,-18 C -9,-8 -9,8 0,12 C 9,8 9,-8 0,-18 Z"
                    fill="#6da06f"
                    stroke="#3b5c3c"
                    strokeWidth="0.9"
                  />
                  <path d="M 0,12 L 0,-16" fill="none" stroke="#a3cfbb" strokeWidth="0.8" opacity="0.8" />
                </g>

                {/* Bud 2: Left Secondary Green Rose Bud */}
                <g transform="translate(76, 92) scale(0.82) rotate(-14)">
                  <path d="M-8,12 Q-14,-4 -6,-14 Q0,-2 0,14" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path d="M8,12 Q14,-4 6,-14 Q0,-2 0,14" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path
                    d="M 0,-18 C -9,-8 -9,8 0,12 C 9,8 9,-8 0,-18 Z"
                    fill="#6da06f"
                    stroke="#3b5c3c"
                    strokeWidth="0.9"
                  />
                </g>

                {/* Bud 3: Right Tertiary Green Rose Bud */}
                <g transform="translate(124, 108) scale(0.7) rotate(16)">
                  <path d="M-8,12 Q-14,-4 -6,-14 Q0,-2 0,14" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path d="M8,12 Q14,-4 6,-14 Q0,-2 0,14" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path
                    d="M 0,-18 C -9,-8 -9,8 0,12 C 9,8 9,-8 0,-18 Z"
                    fill="#6da06f"
                    stroke="#3b5c3c"
                    strokeWidth="0.9"
                  />
                </g>
              </motion.g>
            )}

            {/* 階段 5：含苞期 (7-9/10) - 2-3枝錯落有致的含苞玫瑰，水滴形狀，綠轉紅漸變，底部花萼托住 */}
            {currentStageIndex === 5 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-2, 2, -2] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                {/* 3 Staggered Stems */}
                {/* Secondary Left Stem */}
                <path d="M100,180 Q84,132 74,84" stroke="#5e8c5d" strokeWidth="4.8" strokeLinecap="round" />
                {/* Tertiary Right Stem */}
                <path d="M100,180 Q116,140 126,100" stroke="#5e8c5d" strokeWidth="4.2" strokeLinecap="round" />
                {/* Primary Central Stem */}
                <path d="M100,180 Q104,120 100,58" stroke="#5e8c5d" strokeWidth="5.8" strokeLinecap="round" />

                {/* Thorns */}
                <path d="M103,150 L110,145 L104,142" fill="#8c5e5d" />
                <path d="M95,130 L88,125 L94,122" fill="#8c5e5d" />
                <path d="M103,102 L109,97 L104,94" fill="#8c5e5d" />

                {/* Compound leaves */}
                <g transform="translate(100, 138)">
                  <path d="M0,0 Q-24,-12 -30,0 Q-14,10 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>
                <g transform="translate(100, 115) scale(-1, 1)">
                  <path d="M0,0 Q-24,-12 -30,0 Q-14,10 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>
                <g transform="translate(80, 108)">
                  <path d="M0,0 Q-20,-10 -24,2 Q-10,8 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>
                <g transform="translate(114, 118) scale(-1, 1)">
                  <path d="M0,0 Q-20,-10 -24,2 Q-10,8 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>

                {/* Central Main Teardrop Rose Bud */}
                <g transform="translate(100, 58)">
                  <path d="M-10,14 Q-18,2 -14,-10 Q-4,2 0,16" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path d="M10,14 Q18,2 14,-10 Q4,2 0,16" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path d="M-4,16 Q0,8 0,0 Q0,8 4,16 Z" fill="#3b5c3c" />
                  <path
                    d="M 0,-24 C -15,-10 -13,8 0,14 C 13,8 15,-10 0,-24 Z"
                    fill="url(#roseBudGrad)"
                    stroke="#b71c1c"
                    strokeWidth="1"
                  />
                  <path d="M 0,-24 C -8,-10 -6,6 0,14" fill="none" stroke="#e53935" strokeWidth="0.9" opacity="0.8" />
                  <path d="M 0,-24 C 8,-10 6,6 0,14" fill="none" stroke="#e53935" strokeWidth="0.9" opacity="0.8" />
                  <circle cx="0" cy="-22" r="2" fill="#e53935" />
                </g>

                {/* Left Secondary Teardrop Rose Bud */}
                <g transform="translate(74, 82) scale(0.8) rotate(-16)">
                  <path d="M-10,14 Q-18,2 -14,-10 Q-4,2 0,16" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path d="M10,14 Q18,2 14,-10 Q4,2 0,16" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path
                    d="M 0,-24 C -15,-10 -13,8 0,14 C 13,8 15,-10 0,-24 Z"
                    fill="url(#roseBudGrad)"
                    stroke="#b71c1c"
                    strokeWidth="1"
                  />
                  <circle cx="0" cy="-22" r="2" fill="#e53935" />
                </g>

                {/* Right Tertiary Teardrop Rose Bud */}
                <g transform="translate(126, 98) scale(0.68) rotate(18)">
                  <path d="M-10,14 Q-18,2 -14,-10 Q-4,2 0,16" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path d="M10,14 Q18,2 14,-10 Q4,2 0,16" fill="#4a704b" stroke="#2d482e" strokeWidth="0.9" />
                  <path
                    d="M 0,-24 C -15,-10 -13,8 0,14 C 13,8 15,-10 0,-24 Z"
                    fill="url(#roseBudGrad)"
                    stroke="#b71c1c"
                    strokeWidth="1"
                  />
                  <circle cx="0" cy="-22" r="2" fill="#e53935" />
                </g>
              </motion.g>
            )}

            {/* 階段 6：盛開期 (9-10/10) - 2-3朵錯落有致的紅色玫瑰花束，高低呼應，立體豐富，淡粉紅花蕊(#f8bbd0) */}
            {currentStageIndex === 6 && (
              <motion.g
                initial={showBloomingEffect ? { scale: 0.82 } : undefined}
                animate={isStatic ? undefined : {
                  rotate: [-2, 2, -2],
                  scale: showBloomingEffect ? [0.85, 1.08, 1] : [1, 1.02, 1]
                }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                {/* 3 Staggered Stems with Natural Curves */}
                {/* Left Secondary Stem */}
                <path d="M100,180 Q82,126 72,78" stroke="#5e8c5d" strokeWidth="5" strokeLinecap="round" />
                {/* Right Tertiary Stem */}
                <path d="M100,180 Q118,136 128,95" stroke="#5e8c5d" strokeWidth="4.5" strokeLinecap="round" />
                {/* Primary Central Stem */}
                <path d="M100,180 Q105,115 100,48" stroke="#5e8c5d" strokeWidth="6" strokeLinecap="round" />

                {/* Thorns along stems */}
                <path d="M103,150 L111,144 L104,141" fill="#8c5e5d" />
                <path d="M94,124 L86,118 L93,115" fill="#8c5e5d" />
                <path d="M103,98 L110,92 L104,89" fill="#8c5e5d" />
                <path d="M118,120 L125,114 L119,111" fill="#8c5e5d" />

                {/* Rich Layered Leaves Staggered Throughout */}
                <g transform="translate(100, 142)">
                  <path d="M0,0 Q-26,-14 -32,0 Q-15,12 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                  <path d="M-15,-6 Q-28,-24 -34,-10 Q-20,5 -15,-6" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>
                <g transform="translate(100, 115) scale(-1, 1)">
                  <path d="M0,0 Q-26,-14 -32,0 Q-15,12 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                  <path d="M-15,-6 Q-28,-24 -34,-10 Q-20,5 -15,-6" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>
                <g transform="translate(78, 102) rotate(-10)">
                  <path d="M0,0 Q-22,-12 -28,0 Q-12,10 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>
                <g transform="translate(122, 116) scale(-1, 1) rotate(-15)">
                  <path d="M0,0 Q-22,-12 -28,0 Q-12,10 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>
                <g transform="translate(90, 80) rotate(-18)">
                  <path d="M0,0 Q-18,-10 -22,2 Q-8,8 0,0" fill="#6da06f" stroke="#3b5c3c" strokeWidth="0.8" />
                </g>

                {/* ROSE 2: LEFT SIDE-PROFILE ROSE (側面玫瑰 - 左側) */}
                <g transform="translate(72, 78) scale(0.85) rotate(-22)">
                  {/* Soft Red Ambient Glow */}
                  <ellipse cx="0" cy="-10" rx="20" ry="24" fill="#ff8a80" opacity="0.25" filter="blur(3px)" />

                  {/* Green Calyx & Sepals at Base */}
                  <path d="M -6,12 C -10,18 10,18 6,12 C 8,4 -8,4 -6,12 Z" fill="#4a704b" stroke="#2d482e" strokeWidth="0.8" />
                  <path d="M -5,8 Q -14,14 -12,24 Q -4,16 -3,10" fill="#3b5c3c" stroke="#2d482e" strokeWidth="0.7" />
                  <path d="M 5,8 Q 14,14 12,24 Q 4,16 3,10" fill="#3b5c3c" stroke="#2d482e" strokeWidth="0.7" />
                  <path d="M 0,10 Q -2,20 0,26 Q 2,20 0,10" fill="#5e8c5d" />

                  {/* --- SIDE PROFILE PETALS (側面花瓣堆疊) --- */}
                  {/* Back/Far Side Petals (Deep Velvet Shadow) */}
                  <path
                    d="M -16,4 C -22,-12 -12,-28 0,-30 C 12,-28 22,-12 16,4 Z"
                    fill="#9a0007"
                    stroke="#700000"
                    strokeWidth="0.8"
                  />

                  {/* Outer Side Guard Petals - Left Wing */}
                  <path
                    d="M -4,6 C -18,8 -26,-6 -22,-18 C -18,-26 -8,-22 -3,-12 Z"
                    fill="url(#rosePetalGradOuter)"
                    stroke="#b71c1c"
                    strokeWidth="0.8"
                  />
                  <path d="M -22,-18 C -24,-12 -18,-2 -10,2" fill="none" stroke="#ff8a80" strokeWidth="0.9" opacity="0.8" />

                  {/* Outer Side Guard Petals - Right Wing */}
                  <path
                    d="M 4,6 C 18,8 26,-6 22,-18 C 18,-26 8,-22 3,-12 Z"
                    fill="url(#rosePetalGradOuter)"
                    stroke="#b71c1c"
                    strokeWidth="0.8"
                  />
                  <path d="M 22,-18 C 24,-12 18,-2 10,2" fill="none" stroke="#ff8a80" strokeWidth="0.9" opacity="0.8" />

                  {/* Middle Goblet Petal Body (Central Side Cup) */}
                  <path
                    d="M -14,2 C -20,-10 -14,-24 0,-26 C 14,-24 20,-10 14,2 C 8,8 -8,8 -14,2 Z"
                    fill="#e53935"
                    stroke="#c62828"
                    strokeWidth="0.8"
                  />

                  {/* Overlapping Front Cup Petals */}
                  <path
                    d="M -12,4 C -16,-4 -10,-16 0,-18 C 10,-16 16,-4 12,4 C 6,10 -6,10 -12,4 Z"
                    fill="url(#rosePetalGradInner)"
                    stroke="#b71c1c"
                    strokeWidth="0.8"
                  />

                  {/* Inner Velvet Spiral / Side Core */}
                  <path d="M -6,-12 C -10,-20 0,-24 6,-20 C 10,-16 4,-10 -2,-12 C -6,-14 -2,-18 2,-18" fill="none" stroke="#f8bbd0" strokeWidth="1.2" strokeLinecap="round" />
                  <ellipse cx="0" cy="-16" rx="5" ry="3" fill="#b71c1c" />
                  <path d="M -4,-16 C -4,-21 4,-21 4,-16 C 4,-12 -4,-12 -4,-16" fill="#e53935" stroke="#f8bbd0" strokeWidth="0.8" />

                  {/* Highlights on Front Petal Fold Edges */}
                  <path d="M -12,4 C -6,9 6,9 12,4" fill="none" stroke="#ff8a80" strokeWidth="1" />
                  <path d="M -10,-6 C -4,-2 4,-2 10,-6" fill="none" stroke="#ff8a80" strokeWidth="0.8" opacity="0.8" />
                </g>

                {/* ROSE 3: RIGHT SIDE-PROFILE ROSE (側面玫瑰 - 右側) */}
                <g transform="translate(128, 93) scale(0.75) rotate(24)">
                  {/* Soft Red Ambient Glow */}
                  <ellipse cx="0" cy="-8" rx="18" ry="22" fill="#ff8a80" opacity="0.22" filter="blur(3px)" />

                  {/* Green Calyx & Sepals at Base */}
                  <path d="M -5,10 C -9,16 9,16 5,10 C 7,3 -7,3 -5,10 Z" fill="#4a704b" stroke="#2d482e" strokeWidth="0.8" />
                  <path d="M -4,7 Q -12,12 -10,20 Q -3,14 -2,8" fill="#3b5c3c" stroke="#2d482e" strokeWidth="0.7" />
                  <path d="M 4,7 Q 12,12 10,20 Q 3,14 2,8" fill="#3b5c3c" stroke="#2d482e" strokeWidth="0.7" />

                  {/* --- SIDE PROFILE PETALS (側面右傾花瓣) --- */}
                  {/* Back Shadow Petals */}
                  <path
                    d="M -14,2 C -18,-12 -8,-25 3,-26 C 14,-25 20,-10 14,2 Z"
                    fill="#9a0007"
                    stroke="#700000"
                    strokeWidth="0.8"
                  />

                  {/* Flaring Side Outer Petal - Right Side drooping slightly */}
                  <path
                    d="M 2,5 C 16,6 25,-4 20,-16 C 15,-22 6,-18 2,-10 Z"
                    fill="url(#rosePetalGradOuter)"
                    stroke="#b71c1c"
                    strokeWidth="0.8"
                  />
                  <path d="M 20,-16 C 22,-10 16,0 8,3" fill="none" stroke="#ff8a80" strokeWidth="0.8" opacity="0.85" />

                  {/* Flaring Side Outer Petal - Left Side */}
                  <path
                    d="M -2,5 C -16,6 -22,-4 -18,-16 C -14,-22 -6,-18 -2,-10 Z"
                    fill="url(#rosePetalGradOuter)"
                    stroke="#b71c1c"
                    strokeWidth="0.8"
                  />
                  <path d="M -18,-16 C -20,-10 -14,0 -6,3" fill="none" stroke="#ff8a80" strokeWidth="0.8" opacity="0.85" />

                  {/* Main Central Goblet Petal Body */}
                  <path
                    d="M -12,2 C -17,-8 -12,-22 1,-23 C 13,-22 17,-8 12,2 C 6,7 -6,7 -12,2 Z"
                    fill="#e53935"
                    stroke="#c62828"
                    strokeWidth="0.8"
                  />

                  {/* Front Overlapping Petal Fold */}
                  <path
                    d="M -10,3 C -14,-3 -8,-14 1,-15 C 9,-14 14,-3 10,3 C 5,8 -5,8 -10,3 Z"
                    fill="url(#rosePetalGradInner)"
                    stroke="#b71c1c"
                    strokeWidth="0.8"
                  />

                  {/* Inner Swirl & Stamen Accent */}
                  <ellipse cx="0" cy="-14" rx="4.5" ry="2.5" fill="#b71c1c" />
                  <path d="M -3,-14 C -3,-18 3,-18 3,-14 C 3,-11 -3,-11 -3,-14" fill="#e53935" stroke="#f8bbd0" strokeWidth="0.8" />

                  {/* Highlights on Front Petal Fold Rim */}
                  <path d="M -10,3 C -5,7 5,7 10,3" fill="none" stroke="#ff8a80" strokeWidth="0.9" />
                </g>

                {/* ROSE 1: PRIMARY CENTRAL BLOOM (Tallest, Scale 1.0) */}
                <g transform="translate(100, 48)">
                  {/* Subtle Red Halo Glow */}
                  <circle cx="0" cy="0" r="28" fill="#ff8a80" opacity="0.3" filter="blur(4px)" />

                  {/* Sepal Base Cup */}
                  <path d="M-8,12 Q0,18 8,12 Q4,4 0,0 Q-4,4 -8,12 Z" fill="#4a704b" stroke="#2d482e" strokeWidth="0.8" />

                  {/* LAYER 1: OUTER SHADOW PETALS */}
                  {[
                    { r: 0, sx: 1, sy: 1 },
                    { r: 60, sx: 0.98, sy: 1.02 },
                    { r: 120, sx: 1.02, sy: 0.97 },
                    { r: 180, sx: 0.96, sy: 1.03 },
                    { r: 240, sx: 1.01, sy: 0.98 },
                    { r: 300, sx: 0.97, sy: 1.01 }
                  ].map((p, i) => (
                    <g key={`rose-outer-${i}`} transform={`rotate(${p.r}) scale(${p.sx}, ${p.sy})`}>
                      <path
                        d="M 0,0 C -16,-12 -22,-28 -6,-32 C 4,-34 20,-24 0,0 Z"
                        fill="url(#rosePetalGradOuter)"
                        stroke="#b71c1c"
                        strokeWidth="0.8"
                      />
                    </g>
                  ))}

                  {/* LAYER 2: MAIN MID PETALS (#e53935) */}
                  {[
                    { r: 30, sx: 0.92, sy: 0.92 },
                    { r: 90, sx: 0.88, sy: 0.94 },
                    { r: 150, sx: 0.94, sy: 0.90 },
                    { r: 210, sx: 0.90, sy: 0.93 },
                    { r: 270, sx: 0.93, sy: 0.89 },
                    { r: 330, sx: 0.91, sy: 0.92 }
                  ].map((p, i) => (
                    <g key={`rose-mid-${i}`} transform={`rotate(${p.r}) scale(${p.sx}, ${p.sy})`}>
                      <path
                        d="M 0,0 C -14,-10 -18,-24 -4,-28 C 3,-30 16,-20 0,0 Z"
                        fill="#e53935"
                        stroke="#c62828"
                        strokeWidth="0.8"
                      />
                      <path d="M 0,0 Q -2,-14 0,-24" stroke="#ff8a80" strokeWidth="0.7" opacity="0.6" fill="none" />
                    </g>
                  ))}

                  {/* LAYER 3: INNER PETAL CUP & FOLDS */}
                  {[
                    { r: 15, scale: 0.72 },
                    { r: 75, scale: 0.68 },
                    { r: 135, scale: 0.74 },
                    { r: 195, scale: 0.70 },
                    { r: 255, scale: 0.73 },
                    { r: 315, scale: 0.69 }
                  ].map((p, i) => (
                    <g key={`rose-inner-${i}`} transform={`rotate(${p.r}) scale(${p.scale})`}>
                      <path
                        d="M 0,0 C -10,-8 -14,-18 -3,-22 C 3,-24 13,-14 0,0 Z"
                        fill="url(#rosePetalGradInner)"
                        stroke="#b71c1c"
                        strokeWidth="0.7"
                      />
                    </g>
                  ))}

                  {/* LAYER 4: SOFT PALE PINK STAMEN & CORE (#f8bbd0) */}
                  <circle cx="0" cy="0" r="7.5" fill="#f8bbd0" stroke="#f48fb1" strokeWidth="0.9" />
                  <circle cx="0" cy="0" r="4.8" fill="#fce4ec" opacity="0.9" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <g key={`rose-stamen-${i}`} transform={`rotate(${angle})`}>
                      <line x1="0" y1="0" x2="0" y2="-4.2" stroke="#f48fb1" strokeWidth="0.7" />
                      <circle cx="0" cy="-4.2" r="1.1" fill="#f8bbd0" stroke="#f06292" strokeWidth="0.4" />
                    </g>
                  ))}
                  <circle cx="-1.5" cy="-1.5" r="2.2" fill="#ffffff" opacity="0.85" />
                </g>
              </motion.g>
            )}
          </g>
        )}

        {/* ========================================================= */}
        {/* ORIGINAL THEME                                            */}
        {/* ========================================================= */}

        {theme === 'original' && (
          <g>
            {/* 階段 1：種子期 (0-1/10) - 沉睡的小種子，微紫韻味 */}
            {currentStageIndex === 1 && (
              <motion.g
                animate={isStatic ? undefined : { scale: [1, 1.04, 1], y: [0, 1, 0] }}
                transition={isStatic ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path d="M78,180 Q100,168 122,180 Z" fill="#4e342e" />
                <ellipse cx="100" cy="172" rx="7" ry="5" fill="#8d6e63" stroke="#5d4037" strokeWidth="1" />
                <path d="M100,174 Q96,177 100,180" stroke="#ce93d8" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                {!isStatic && (
                  <motion.text
                    x="112"
                    y="160"
                    fill="#ce93d8"
                    fontSize="11"
                    fontWeight="bold"
                    animate={{ opacity: [0.3, 0.9, 0.3], y: [-2, -8, -2], x: [0, 2, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    zzz
                  </motion.text>
                )}
              </motion.g>
            )}

            {/* 階段 2：發芽期 (1-3/10) - 嫩芽破土，帶微紫嫩葉邊 */}
            {currentStageIndex === 2 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                <path d="M100,180 Q98,160 100,146" stroke={leavesColor} strokeWidth="3.8" strokeLinecap="round" />
                <path d="M100,152 Q86,144 88,135 Q98,142 100,152 Z" fill={leavesColor} stroke="#e1bee7" strokeWidth="0.8" />
                <path d="M100,148 Q114,140 112,131 Q102,138 100,148 Z" fill={leavesColor} stroke="#e1bee7" strokeWidth="0.8" />
                <path d="M92,180 L97,178 M103,178 L108,180" stroke="#6d4c41" strokeWidth="2" strokeLinecap="round" />
              </motion.g>
            )}

            {/* 階段 3：幼苗期 (3-5/10) - 莖葉生長，紋理延伸 */}
            {currentStageIndex === 3 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-1.8, 1.8, -1.8] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                <path d="M100,180 Q98,145 100,120" stroke="#5e8c5d" strokeWidth="4.8" strokeLinecap="round" />
                <path d="M100,160 Q80,152 83,140 Q96,148 100,160 Z" fill={leavesColor} stroke="#4a704b" strokeWidth="0.8" />
                <path d="M100,155 Q120,147 117,135 Q104,143 100,155 Z" fill={leavesColor} stroke="#4a704b" strokeWidth="0.8" />
                <path d="M100,135 Q82,124 86,114 Q98,122 100,135 Z" fill={leavesColor} stroke="#4a704b" strokeWidth="0.8" />
                <path d="M100,130 Q118,119 114,109 Q102,117 100,130 Z" fill={leavesColor} stroke="#4a704b" strokeWidth="0.8" />
              </motion.g>
            )}

            {/* 階段 4：花蕾期 (5-7/10) - 頂端出現淡紫精緻花苞 */}
            {currentStageIndex === 4 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-1.8, 1.8, -1.8] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                <path d="M100,180 Q98,135 100,90" stroke="#5e8c5d" strokeWidth="5.2" strokeLinecap="round" />
                <path d="M100,155 Q80,147 84,135 Q96,143 100,155 Z" fill={leavesColor} stroke="#4a704b" strokeWidth="0.8" />
                <path d="M100,150 Q120,142 116,130 Q104,138 100,150 Z" fill={leavesColor} stroke="#4a704b" strokeWidth="0.8" />
                <path d="M100,125 Q82,115 86,105 Q98,113 100,125 Z" fill={leavesColor} stroke="#4a704b" strokeWidth="0.8" />
                <path d="M100,120 Q118,110 114,100 Q102,108 100,120 Z" fill={leavesColor} stroke="#4a704b" strokeWidth="0.8" />

                {/* Delicate Young Lavender Bud */}
                <g transform="translate(100, 72)">
                  <path d="M-8,12 Q-14,-2 -6,-10 Q-2,2 0,14" fill="#5a8a58" stroke="#3b5c3c" strokeWidth="0.8" />
                  <path d="M8,12 Q14,-2 6,-10 Q2,2 0,14" fill="#5a8a58" stroke="#3b5c3c" strokeWidth="0.8" />
                  <path
                    d="M 0,-18 C -10,-8 -10,8 0,12 C 10,8 10,-8 0,-18 Z"
                    fill="url(#lavenderBudGrad)"
                    stroke="#ab47bc"
                    strokeWidth="0.9"
                  />
                  <path d="M 0,12 L 0,-16" fill="none" stroke="#f3e5f5" strokeWidth="0.8" opacity="0.8" />
                </g>
              </motion.g>
            )}

            {/* 階段 5：含苞期 (7-9/10) - 淡紫花苞展開初綻 */}
            {currentStageIndex === 5 && (
              <motion.g
                animate={isStatic ? undefined : { rotate: [-1.8, 1.8, -1.8] }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                <path d="M100,180 Q98,130 100,82" stroke="#5e8c5d" strokeWidth="5.8" strokeLinecap="round" />
                <path d="M100,145 Q78,137 82,125 Q96,132 100,145 Z" fill={leavesColor} stroke="#3b5c3c" strokeWidth="0.8" />
                <path d="M100,140 Q122,132 118,120 Q104,127 100,140 Z" fill={leavesColor} stroke="#3b5c3c" strokeWidth="0.8" />
                <path d="M100,115 Q80,105 84,95 Q98,103 100,115 Z" fill={leavesColor} stroke="#3b5c3c" strokeWidth="0.8" />
                <path d="M100,110 Q120,100 116,90 Q102,98 100,110 Z" fill={leavesColor} stroke="#3b5c3c" strokeWidth="0.8" />

                <g transform="translate(100, 64)">
                  <path d="M-10,14 Q-18,-4 -12,-14 Q-3,0 0,16" fill="#5a8a58" stroke="#3b5c3c" strokeWidth="0.9" />
                  <path d="M10,14 Q18,-4 12,-14 Q3,0 0,16" fill="#5a8a58" stroke="#3b5c3c" strokeWidth="0.9" />
                  <path d="M -12,0 C -18,-18 -4,-26 0,-24 C 4,-26 18,-18 12,0 C 8,10 -8,10 -12,0 Z" fill="url(#lavenderBackGrad)" opacity="0.9" />
                  <path d="M -8,8 C -14,-10 -6,-22 0,-22 C 6,-22 14,-10 8,8 Z" fill="url(#lavenderFrontGrad)" stroke="#ab47bc" strokeWidth="0.8" />
                  <path d="M -4,6 C -8,-6 0,-18 0,-18 C 0,-18 8,-6 4,6 Z" fill="#f3e5f5" stroke="#ce93d8" strokeWidth="0.7" />
                  <circle cx="0" cy="-8" r="2.2" fill="#fff176" />
                </g>
              </motion.g>
            )}

            {/* 階段 6：盛開期 (9-10/10) - 立體自然淡紫野花 (Soft Lavender Wildflower) */}
            {currentStageIndex === 6 && (
              <motion.g
                initial={showBloomingEffect ? { scale: 0.82 } : undefined}
                animate={isStatic ? undefined : {
                  rotate: [-1.8, 1.8, -1.8],
                  scale: showBloomingEffect ? [0.85, 1.06, 1] : [1, 1.02, 1]
                }}
                transition={isStatic ? undefined : { duration: swaySpeed, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '100px 180px' }}
              >
                <path d="M100,180 Q98,125 100,70" stroke="#5e8c5d" strokeWidth="6" strokeLinecap="round" />
                <path d="M100,140 Q76,132 80,120 Q96,127 100,140 Z" fill={leavesColor} stroke="#3b5c3c" strokeWidth="0.8" />
                <path d="M100,135 Q124,127 120,115 Q104,122 100,135 Z" fill={leavesColor} stroke="#3b5c3c" strokeWidth="0.8" />
                <path d="M100,110 Q78,100 82,90 Q98,98 100,110 Z" fill={leavesColor} stroke="#3b5c3c" strokeWidth="0.8" />
                <path d="M100,105 Q122,95 118,85 Q102,93 100,105 Z" fill={leavesColor} stroke="#3b5c3c" strokeWidth="0.8" />

                {/* SOFT LAVENDER WILDFLOWER HEAD */}
                <g transform="translate(100, 58)">
                  {/* Soft Watercolor Halo */}
                  <circle cx="0" cy="0" r="28" fill="#f3e5f5" opacity="0.45" filter="blur(4px)" />

                  {/* Sepal Base */}
                  <path d="M-6,14 Q0,18 6,14 Q4,6 0,2 Q-4,6 -6,14 Z" fill="#5a8a58" stroke="#3b5c3c" strokeWidth="0.8" />

                  {/* LAYER 1: BACK PETALS (後層深色陰影花瓣，呈現前後立體層次) */}
                  {[
                    { r: 18, scaleX: 1, scaleY: 1 },
                    { r: 90, scaleX: 0.95, scaleY: 1.05 },
                    { r: 162, scaleX: 1.02, scaleY: 0.96 },
                    { r: 234, scaleX: 0.98, scaleY: 1.02 },
                    { r: 306, scaleX: 1.05, scaleY: 0.97 }
                  ].map((p, i) => (
                    <g key={`lavender-back-${i}`} transform={`rotate(${p.r}) scale(${p.scaleX}, ${p.scaleY})`}>
                      <path
                        d="M 0,0 C -13,-9 -18,-24 -5,-29 C 2,-32 16,-22 0,0 Z"
                        fill="url(#lavenderBackGrad)"
                        stroke="#9c27b0"
                        strokeWidth="0.7"
                        opacity="0.9"
                      />
                    </g>
                  ))}

                  {/* LAYER 2: FRONT MAIN PETALS (前層主花瓣 - 淡紫 #e1bee7 / #ce93d8，非幾何圓形) */}
                  {[
                    { r: 0, scaleX: 1, scaleY: 1.02 },
                    { r: 72, scaleX: 0.97, scaleY: 0.98 },
                    { r: 144, scaleX: 1.03, scaleY: 1 },
                    { r: 216, scaleX: 0.96, scaleY: 1.04 },
                    { r: 288, scaleX: 1.01, scaleY: 0.96 }
                  ].map((p, i) => (
                    <g key={`lavender-front-${i}`} transform={`rotate(${p.r}) scale(${p.scaleX}, ${p.scaleY})`}>
                      <path
                        d="M 0,0 C -12,-10 -16,-26 -3,-30 C 1,-31 5,-29 8,-28 C 18,-20 12,-10 0,0 Z"
                        fill="url(#lavenderFrontGrad)"
                        stroke="#ba68c8"
                        strokeWidth="0.8"
                      />
                      <path
                        d="M 0,0 Q 0,-15 2,-25"
                        fill="none"
                        stroke="#ab47bc"
                        strokeWidth="0.7"
                        opacity="0.65"
                      />
                    </g>
                  ))}

                  {/* LAYER 3: INNER PETAL FOLDS (心部微捲立體花瓣層) */}
                  {[
                    { r: 36, scale: 0.72 },
                    { r: 108, scale: 0.68 },
                    { r: 180, scale: 0.74 },
                    { r: 252, scale: 0.70 }
                  ].map((p, i) => (
                    <g key={`lavender-inner-${i}`} transform={`rotate(${p.r}) scale(${p.scale})`}>
                      <path
                        d="M 0,0 C -9,-8 -12,-18 -2,-22 C 3,-24 12,-15 0,0 Z"
                        fill="#f3e5f5"
                        stroke="#ce93d8"
                        strokeWidth="0.7"
                      />
                    </g>
                  ))}

                  {/* LAYER 4: STAMEN & CORE (溫柔淡黃色花蕊) */}
                  <circle cx="0" cy="0" r="8" fill="#fff9c4" stroke="#fbc02d" strokeWidth="0.9" />
                  <circle cx="0" cy="0" r="5" fill="#fff176" opacity="0.85" />
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <g key={`stamen-${i}`} transform={`rotate(${angle})`}>
                      <line x1="0" y1="0" x2="0" y2="-4.8" stroke="#fbc02d" strokeWidth="0.8" />
                      <circle cx="0" cy="-4.8" r="1.1" fill="#f57f17" />
                    </g>
                  ))}
                  <circle cx="-1.5" cy="-1.5" r="2.5" fill="#ffffff" opacity="0.75" />
                </g>
              </motion.g>
            )}
          </g>
        )}

        {/* The Terracotta Flower Pot (花盆) */}
        <path
          d="M60,180 L140,180 L130,225 L70,225 Z"
          fill="#df7a5e"
          stroke="#b85a3f"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <rect
          x="54"
          y="172"
          width="92"
          height="10"
          rx="3"
          fill="#e78b72"
          stroke="#b85a3f"
          strokeWidth="3.5"
        />
        <line x1="62" y1="186" x2="68" y2="218" stroke="#f0a390" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="100" cy="177" rx="42" ry="3" fill="#8d5b4c" opacity="0.4" />
      </svg>

      {/* Stylized Badge Label positioned below pot without overlapping */}
      <div className="mt-1 font-mono text-[10px] text-brand-moss/70 text-center leading-normal pointer-events-none select-none">
        🌱 {theme === 'sunflower' ? '向日葵' : theme === 'rose' ? '玫瑰花' : '心晴盆栽'} (盛開期)
      </div>
    </div>
  );
}
