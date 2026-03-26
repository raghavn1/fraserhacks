import { useEffect, useState, useMemo } from 'react'
import { Header } from './components/Header'
import { CircularTimer } from './components/CircularTimer'
import { AIMonitoringPanel } from './components/AIMonitoringPanel'
import { AlarmPanel } from './components/AlarmPanel'
import { BehaviorFlow } from './components/BehaviorFlow'
import { SessionAnalytics } from './components/SessionAnalytics'
import { SettingsPanel } from './components/SettingsPanel'
import {
  useTimerStore,
  useAIMonitoringStore,
  useAlarmStore,
  useSettingsStore,
  mockSessionData,
  motivationalQuotes,
} from './store/useStore'
import { cn } from './lib/utils'

function App() {
  const { timer, startTimer, pauseTimer, resetTimer, setSessionLength, tick, setFocusStatus } = useTimerStore()
  const { monitoring, toggleCamera, toggleScreenMonitoring, updateDetection } = useAIMonitoringStore()
  const { alarm, triggerAlarm, stopAlarm, toggleSwitch, reconnectDevice, setVolume, setTriggerDelay } = useAlarmStore()
  const { settings, updateSettings, toggleDarkMode, toggleFocusMode } = useSettingsStore()

  const [quoteIndex, setQuoteIndex] = useState(0)

  // Apply dark mode class
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.darkMode])

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (timer.isRunning && !timer.isPaused && timer.currentTime > 0) {
      interval = setInterval(() => {
        tick()
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timer.isRunning, timer.isPaused, timer.currentTime, tick])

  // Simulate AI detection updates (mock behavior)
  useEffect(() => {
    if (!timer.isRunning || !settings.cameraTracking) return

    const interval = setInterval(() => {
      // Random distraction simulation
      const isDistracted = Math.random() > 0.85
      
      if (isDistracted) {
        updateDetection({
          eyeContactDetected: false,
          lookingAway: true,
          currentTab: 'Twitter - Home',
          isDistractedTab: true,
          confidenceScore: 78,
        })
        setFocusStatus('distracted')
        triggerAlarm()
      } else {
        updateDetection({
          eyeContactDetected: true,
          lookingAway: false,
          currentTab: 'YouTube - Study Lecture',
          isDistractedTab: false,
          confidenceScore: 94 + Math.floor(Math.random() * 6),
        })
        setFocusStatus('focused')
        stopAlarm()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [timer.isRunning, settings.cameraTracking, updateDetection, setFocusStatus, triggerAlarm, stopAlarm])

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const currentQuote = useMemo(() => motivationalQuotes[quoteIndex], [quoteIndex])

  const isDistracted = timer.focusStatus === 'distracted'

  return (
    <div className={cn(
      'min-h-screen bg-background transition-colors duration-300',
      settings.focusMode && 'bg-gradient-to-br from-background via-background to-primary/5'
    )}>
      <Header
        focusMode={settings.focusMode}
        onToggleFocusMode={toggleFocusMode}
        quote={currentQuote}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className={cn(
          'grid gap-6 transition-all duration-500',
          settings.focusMode
            ? 'lg:grid-cols-1 max-w-2xl mx-auto'
            : 'lg:grid-cols-[1fr_320px_320px]'
        )}>
          {/* Main Timer Section */}
          <div className={cn(
            'flex flex-col items-center justify-center glass rounded-3xl p-8 lg:p-12',
            settings.focusMode && 'min-h-[60vh]'
          )}>
            <CircularTimer
              currentTime={timer.currentTime}
              totalTime={timer.sessionLength * 60}
              isRunning={timer.isRunning}
              isPaused={timer.isPaused}
              focusStatus={timer.focusStatus}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              sessionLength={timer.sessionLength}
              onSessionLengthChange={setSessionLength}
            />
            
            {/* Mobile Quote */}
            {!settings.focusMode && (
              <div className="lg:hidden mt-8 text-center max-w-sm">
                <p className="text-sm text-muted-foreground italic">
                  {`"${currentQuote}"`}
                </p>
              </div>
            )}
          </div>

          {/* Side Panels - Hidden in Focus Mode */}
          {!settings.focusMode && (
            <>
              {/* Left Column */}
              <div className="space-y-4">
                <AIMonitoringPanel
                  monitoring={monitoring}
                  onToggleCamera={toggleCamera}
                  onToggleScreen={toggleScreenMonitoring}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <AlarmPanel
                  alarm={alarm}
                  onToggleSwitch={toggleSwitch}
                  onOverrideAlarm={stopAlarm}
                  onReconnect={reconnectDevice}
                />
                <BehaviorFlow
                  isDistracted={isDistracted}
                  alarmActive={alarm.alarmActive}
                />
              </div>
            </>
          )}
        </div>

        {/* Bottom Section - Hidden in Focus Mode */}
        {!settings.focusMode && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <SessionAnalytics data={mockSessionData} />
            <SettingsPanel
              settings={settings}
              onUpdateSettings={updateSettings}
              onToggleDarkMode={toggleDarkMode}
              alarmVolume={alarm.volume}
              alarmDelay={alarm.triggerDelay}
              onVolumeChange={setVolume}
              onDelayChange={setTriggerDelay}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-muted-foreground">
          StudyAI - Smart AI Study Timer
        </p>
      </footer>
    </div>
  )
}

export default App
