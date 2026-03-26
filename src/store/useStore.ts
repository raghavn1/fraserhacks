import { useState, useCallback } from 'react'

export type FocusStatus = 'focused' | 'distracted' | 'idle'
export type DeviceConnection = 'connected' | 'disconnected' | 'connecting'

export interface SessionData {
  date: string
  focusTime: number
  distractionTime: number
  distractions: number
}

export interface TimerState {
  isRunning: boolean
  isPaused: boolean
  currentTime: number
  sessionLength: number
  focusStatus: FocusStatus
}

export interface AIMonitoringState {
  cameraEnabled: boolean
  screenMonitoringEnabled: boolean
  eyeContactDetected: boolean
  lookingAway: boolean
  phoneDetected: boolean
  currentTab: string
  isDistractedTab: boolean
  confidenceScore: number
}

export interface AlarmState {
  deviceConnection: DeviceConnection
  alarmActive: boolean
  switches: boolean[]
  volume: number
  triggerDelay: number
}

export interface Settings {
  cameraTracking: boolean
  screenMonitoring: boolean
  sensitivity: 'low' | 'medium' | 'high'
  darkMode: boolean
  focusMode: boolean
}

export function useTimerStore() {
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    currentTime: 25 * 60,
    sessionLength: 25,
    focusStatus: 'idle',
  })

  const startTimer = useCallback(() => {
    setTimer(prev => ({ ...prev, isRunning: true, isPaused: false, focusStatus: 'focused' }))
  }, [])

  const pauseTimer = useCallback(() => {
    setTimer(prev => ({ ...prev, isPaused: true }))
  }, [])

  const resetTimer = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentTime: prev.sessionLength * 60,
      focusStatus: 'idle',
    }))
  }, [])

  const setSessionLength = useCallback((minutes: number) => {
    setTimer(prev => ({
      ...prev,
      sessionLength: minutes,
      currentTime: minutes * 60,
    }))
  }, [])

  const tick = useCallback(() => {
    setTimer(prev => {
      if (prev.currentTime <= 0) {
        return { ...prev, isRunning: false, currentTime: 0 }
      }
      return { ...prev, currentTime: prev.currentTime - 1 }
    })
  }, [])

  const setFocusStatus = useCallback((status: FocusStatus) => {
    setTimer(prev => ({ ...prev, focusStatus: status }))
  }, [])

  return {
    timer,
    startTimer,
    pauseTimer,
    resetTimer,
    setSessionLength,
    tick,
    setFocusStatus,
  }
}

export function useAIMonitoringStore() {
  const [monitoring, setMonitoring] = useState<AIMonitoringState>({
    cameraEnabled: true,
    screenMonitoringEnabled: true,
    eyeContactDetected: true,
    lookingAway: false,
    phoneDetected: false,
    currentTab: 'YouTube - Study Lecture',
    isDistractedTab: false,
    confidenceScore: 94,
  })

  const toggleCamera = useCallback(() => {
    setMonitoring(prev => ({ ...prev, cameraEnabled: !prev.cameraEnabled }))
  }, [])

  const toggleScreenMonitoring = useCallback(() => {
    setMonitoring(prev => ({ ...prev, screenMonitoringEnabled: !prev.screenMonitoringEnabled }))
  }, [])

  const updateDetection = useCallback((data: Partial<AIMonitoringState>) => {
    setMonitoring(prev => ({ ...prev, ...data }))
  }, [])

  return {
    monitoring,
    toggleCamera,
    toggleScreenMonitoring,
    updateDetection,
  }
}

export function useAlarmStore() {
  const [alarm, setAlarm] = useState<AlarmState>({
    deviceConnection: 'connected',
    alarmActive: false,
    switches: [false, false, false],
    volume: 70,
    triggerDelay: 3,
  })

  const triggerAlarm = useCallback(() => {
    setAlarm(prev => ({ ...prev, alarmActive: true }))
  }, [])

  const stopAlarm = useCallback(() => {
    setAlarm(prev => ({ ...prev, alarmActive: false }))
  }, [])

  const toggleSwitch = useCallback((index: number) => {
    setAlarm(prev => ({
      ...prev,
      switches: prev.switches.map((s, i) => (i === index ? !s : s)),
    }))
  }, [])

  const reconnectDevice = useCallback(() => {
    setAlarm(prev => ({ ...prev, deviceConnection: 'connecting' }))
    setTimeout(() => {
      setAlarm(prev => ({ ...prev, deviceConnection: 'connected' }))
    }, 2000)
  }, [])

  const setVolume = useCallback((volume: number) => {
    setAlarm(prev => ({ ...prev, volume }))
  }, [])

  const setTriggerDelay = useCallback((delay: number) => {
    setAlarm(prev => ({ ...prev, triggerDelay: delay }))
  }, [])

  return {
    alarm,
    triggerAlarm,
    stopAlarm,
    toggleSwitch,
    reconnectDevice,
    setVolume,
    setTriggerDelay,
  }
}

export function useSettingsStore() {
  const [settings, setSettings] = useState<Settings>({
    cameraTracking: true,
    screenMonitoring: true,
    sensitivity: 'medium',
    darkMode: true,
    focusMode: false,
  })

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const toggleDarkMode = useCallback(() => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))
  }, [])

  const toggleFocusMode = useCallback(() => {
    setSettings(prev => ({ ...prev, focusMode: !prev.focusMode }))
  }, [])

  return {
    settings,
    updateSettings,
    toggleDarkMode,
    toggleFocusMode,
  }
}

// Mock session data for analytics
export const mockSessionData: SessionData[] = [
  { date: 'Mon', focusTime: 120, distractionTime: 15, distractions: 3 },
  { date: 'Tue', focusTime: 90, distractionTime: 25, distractions: 5 },
  { date: 'Wed', focusTime: 150, distractionTime: 10, distractions: 2 },
  { date: 'Thu', focusTime: 80, distractionTime: 30, distractions: 6 },
  { date: 'Fri', focusTime: 180, distractionTime: 8, distractions: 1 },
  { date: 'Sat', focusTime: 60, distractionTime: 20, distractions: 4 },
  { date: 'Sun', focusTime: 200, distractionTime: 5, distractions: 1 },
]

export const motivationalQuotes = [
  "The secret of getting ahead is getting started.",
  "Focus on being productive instead of busy.",
  "Small daily improvements lead to staggering long-term results.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Discipline is choosing between what you want now and what you want most.",
  "The only way to do great work is to love what you do.",
  "Your future is created by what you do today, not tomorrow.",
]
