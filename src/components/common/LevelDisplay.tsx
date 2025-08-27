'use client'

import { getLevelInfo, getLevelDisplayName, getLevelColor, getProgressToNextLevel, getNextLevelInfo } from '@/lib/levelSystem'
import { Crown, TrendingUp } from 'lucide-react'

interface LevelDisplayProps {
  level: number;
  xp: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function LevelDisplay({ 
  level, 
  xp, 
  showProgress = false, 
  size = 'md',
  showIcon = false 
}: LevelDisplayProps) {
  const levelInfo = getLevelInfo(level);
  const nextLevelInfo = getNextLevelInfo(level);
  const progress = getProgressToNextLevel(xp, level);
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center space-x-2">
      {showIcon && (
        <div 
          className={`${iconSizes[size]} rounded-full flex items-center justify-center`}
          style={{ backgroundColor: levelInfo.color }}
        >
          <Crown className="w-2 h-2 text-white" />
        </div>
      )}
      
      <div className="flex flex-col">
        <div className={`font-semibold ${sizeClasses[size]}`} style={{ color: levelInfo.color }}>
          {levelInfo.name}
        </div>
        
        <div className={`text-gray-500 ${sizeClasses[size]}`}>
          Level {level}
        </div>
        
        {showProgress && nextLevelInfo && (
          <div className="mt-1">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{xp} XP</span>
              <span>{nextLevelInfo.xpRequired} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: levelInfo.color 
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {nextLevelInfo.name} in {nextLevelInfo.xpRequired - xp} XP
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function LevelBadge({ level, size = 'md' }: { level: number; size?: 'sm' | 'md' | 'lg' }) {
  const levelInfo = getLevelInfo(level);
  const levelDisplayName = getLevelDisplayName(level);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: `${levelInfo.color}20`,
        color: levelInfo.color,
        border: `1px solid ${levelInfo.color}40`
      }}
    >
      <Crown className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} mr-1`} />
      {levelInfo.name}
    </span>
  );
}
