'use client';

import { motion } from 'framer-motion';

interface TrustRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function TrustRing({ score, size = 56, strokeWidth = 4 }: TrustRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'stroke-(--emerald-400)';
  if (score < 50) colorClass = 'stroke-(--red-500)';
  else if (score < 80) colorClass = 'stroke-(--amber-500)';

  return (
    <div className="trust-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-(--border) fill-none"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${colorClass} fill-none`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <div className="score">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {score}
        </motion.span>
      </div>
    </div>
  );
}
