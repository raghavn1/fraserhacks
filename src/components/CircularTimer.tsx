import { useEffect, useMemo } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { cn, formatTime } from '../lib/utils'
import type { FocusStatus } from '../store/useStore'

interface CircularTimerProps {
  currentTime: number
  totalTime: number
  isRunning: boolean
  isPaused: boolean
  focusStatus: FocusStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
  sessionLength: number
  onSessionLengthChange: (minutes: number) => void
}

const sessionOptions = [15, 25, 45, 60]

export function CircularTimer({
  currentTime,
  totalTime,
  isRunning,
  isPaused,
  focusStatus,
  onStart,
  onPause,
  onReset,
  sessionLength,
  onSessionLengthChange,
}: CircularTimerProps) {
  const progress = useMemo(() => {
    return ((totalTime - currentTime) / totalTime) * 100
  }, [currentTime, totalTime])

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const statusConfig = {
    focused: {
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30',
      glowClass: 'glow-success',
      strokeColor: 'stroke-success',
      label: 'Focused',
    },
    distracted: {
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
      glowClass: 'glow-destructive',
      strokeColor: 'stroke-destructive',
      label: 'Distracted',
    },
    idle: {
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      borderColor: 'border-muted',
      glowClass: '',
      strokeColor: 'stroke-muted-foreground/30',
      label: 'Idle',
    },
  }

  const status = statusConfig[focusStatus]

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Session Length Selector */}
      <div className="flex items-center gap-2">
        {sessionOptions.map((mins) => (
          <button
            key={mins}
            onClick={() => !isRunning && onSessionLengthChange(mins)}
            disabled={isRunning}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              sessionLength === mins
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              isRunning && 'opacity-50 cursor-not-allowed'
            )}
          >
            {mins}m
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative">
        <svg
          className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="4"
            className="stroke-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            className={cn(
              'transition-all duration-300',
              status.strokeColor
            )}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground font-mono">
            {formatTime(currentTime)}
          </span>
          
          {/* Status Indicator */}
          <div
            className={cn(
              'mt-4 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300',
              status.bgColor,
              status.borderColor,
              'border'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                focusStatus === 'focused' && 'bg-success',
                focusStatus === 'distracted' && 'bg-destructive animate-pulse',
                focusStatus === 'idle' && 'bg-muted-foreground'
              )}
            />
            <span className={status.color}>{status.label}</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onReset}
          className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        
        <button
          onClick={isRunning && !isPaused ? onPause : onStart}
          className={cn(
            'p-5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg',
            'bg-primary text-primary-foreground',
            isRunning && !isPaused && 'glow-primary'
          )}
          aria-label={isRunning && !isPaused ? 'Pause timer' : 'Start timer'}
        >
          {isRunning && !isPaused ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-1" />
          )}
        </button>
        
        <div className="w-11 h-11" /> {/* Spacer for balance */}
      </div>
    </div>
  )
}
