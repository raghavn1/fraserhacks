import { Cpu, Wifi, WifiOff, Bell, BellOff, ToggleLeft, ToggleRight, RefreshCw, Volume2 } from 'lucide-react'
import { cn } from '../lib/utils'
import type { AlarmState, DeviceConnection } from '../store/useStore'

interface AlarmPanelProps {
  alarm: AlarmState
  onToggleSwitch: (index: number) => void
  onOverrideAlarm: () => void
  onReconnect: () => void
}

export function AlarmPanel({
  alarm,
  onToggleSwitch,
  onOverrideAlarm,
  onReconnect,
}: AlarmPanelProps) {
  const connectionConfig: Record<DeviceConnection, { color: string; bg: string; icon: typeof Wifi; label: string }> = {
    connected: { color: 'text-success', bg: 'bg-success/10', icon: Wifi, label: 'Connected' },
    disconnected: { color: 'text-destructive', bg: 'bg-destructive/10', icon: WifiOff, label: 'Disconnected' },
    connecting: { color: 'text-warning', bg: 'bg-warning/10', icon: Wifi, label: 'Connecting...' },
  }

  const connStatus = connectionConfig[alarm.deviceConnection]
  const ConnIcon = connStatus.icon

  return (
    <div className="glass rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Physical Alarm System</h3>
        </div>
        <div className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium', connStatus.bg)}>
          <ConnIcon className={cn('w-3 h-3', connStatus.color, alarm.deviceConnection === 'connecting' && 'animate-pulse')} />
          <span className={connStatus.color}>{connStatus.label}</span>
        </div>
      </div>

      {/* Alarm State */}
      <div className={cn(
        'relative rounded-xl p-4 mb-4 transition-all duration-300',
        alarm.alarmActive 
          ? 'bg-destructive/10 border border-destructive/30' 
          : 'bg-secondary/50'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {alarm.alarmActive ? (
              <div className="relative">
                <Bell className="w-6 h-6 text-destructive animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full animate-ping" />
              </div>
            ) : (
              <BellOff className="w-6 h-6 text-muted-foreground" />
            )}
            <div>
              <p className={cn(
                'text-sm font-medium',
                alarm.alarmActive ? 'text-destructive' : 'text-foreground'
              )}>
                {alarm.alarmActive ? 'Alarm Active' : 'Alarm Inactive'}
              </p>
              <p className="text-xs text-muted-foreground">
                {alarm.alarmActive ? 'Distraction detected!' : 'Monitoring your focus'}
              </p>
            </div>
          </div>
          
          {alarm.alarmActive && (
            <button
              onClick={onOverrideAlarm}
              className="px-3 py-1.5 bg-destructive text-destructive-foreground text-xs font-medium rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Override
            </button>
          )}
        </div>
        
        {alarm.alarmActive && (
          <div className="absolute inset-0 rounded-xl animate-pulse-glow pointer-events-none" />
        )}
      </div>

      {/* Hardware Switches */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Breadboard Switches</p>
        <div className="flex items-center gap-3">
          {alarm.switches.map((isOn, index) => (
            <button
              key={index}
              onClick={() => onToggleSwitch(index)}
              className={cn(
                'flex-1 p-3 rounded-xl border transition-all duration-200',
                isOn 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-secondary/50 border-border'
              )}
            >
              <div className="flex flex-col items-center gap-1">
                {isOn ? (
                  <ToggleRight className="w-5 h-5 text-primary" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                )}
                <span className={cn(
                  'text-xs font-medium',
                  isOn ? 'text-primary' : 'text-muted-foreground'
                )}>
                  SW{index + 1}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Volume Indicator */}
      <div className="flex items-center gap-3 mb-4">
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${alarm.volume}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground w-8">{alarm.volume}%</span>
      </div>

      {/* Reconnect Button */}
      {alarm.deviceConnection === 'disconnected' && (
        <button
          onClick={onReconnect}
          className="w-full py-2 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Reconnect Device
        </button>
      )}
    </div>
  )
}
