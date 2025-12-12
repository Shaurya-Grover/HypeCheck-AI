import React from 'react';

interface GaugeProps {
  score: number;
  label?: string;
}

export const Gauge: React.FC<GaugeProps> = ({ score, label }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  // Color based on score
  let colorClass = "stroke-red-500";
  if (score >= 60) colorClass = "stroke-yellow-400";
  if (score >= 80) colorClass = "stroke-neon-green";

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-32 h-32 md:w-48 md:h-48">
        <circle
          className="text-charcoal-700"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl md:text-5xl font-bold font-mono ${score >= 80 ? 'text-neon-green' : 'text-white'}`}>
          {score}
        </span>
        {label && <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">{label}</span>}
      </div>
    </div>
  );
};
