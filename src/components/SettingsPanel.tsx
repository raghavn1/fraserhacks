import { Settings, Camera, Monitor, Gauge, Sun, Moon, Volume2, Timer } from 'lucide-react'
import { cn } from '../lib/utils'
import type { Settings as SettingsType } from '../store/useStore'

interface SettingsPanelProps {
  settings: SettingsType
  onUpdateSettings: (settings: Partial<SettingsType>) => void
  onToggleDarkMode: () => void
  alarmVolume: number
  alarmDelay: number
  onVolumeChange: (volume: number) => void
  onDelayChange: (delay: number) => void
}

export function SettingsPanel({
  settings,
  onUpdateSettings,
  onToggleDarkMode,
  alarmVolume,
  alarmDelay,
  onVolumeChange,
  onDelayChange,
}: SettingsPanelProps) {
  const sensitivityOptions: Array<{ value: 'low' | 'medium' | 'high'; label: string }> = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ]

  return (
    <div className="glass rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '0.5s' }}>
      <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
        <Settings className="w-4 h-4 text-primary" />
        Settings
      </h3>

      <div className="space-y-4">
        {/* Tracking Toggles */}
        <div className="space-y-3">
          <ToggleRow
            icon={Camera}
            label="Camera Tracking"
            description="Monitor eye contact & phone usage"
            enabled={settings.cameraTracking}
            onToggle={() => onUpdateSettings({ cameraTracking: !settings.cameraTracking })}
          />
          <ToggleRow
            icon={Monitor}
            label="Screen Monitoring"
            description="Track active tabs & applications"
            enabled={settings.screenMonitoring}
            onToggle={() => onUpdateSettings({ screenMonitoring: !settings.screenMonitoring })}
          />
        </div>

        <hr className="border-border" />

        {/* Sensitivity */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Sensitivity Level</span>
          </div>
          <div className="flex items-center gap-2">
            {sensitivityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdateSettings({ sensitivity: opt.value })}
                className={cn(
                  'flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                  settings.sensitivity === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        {/* Alarm Settings */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Alarm Volume</span>
              </div>
              <span className="text-xs text-muted-foreground">{alarmVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={alarmVolume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Trigger Delay</span>
              </div>
              <span className="text-xs text-muted-foreground">{alarmDelay}s</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={alarmDelay}
              onChange={(e) => onDelayChange(Number(e.target.value))}
              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>
        </div>

        <hr className="border-border" />

        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.darkMode ? (
              <Moon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Sun className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm text-foreground">Dark Mode</span>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={cn(
              'relative w-11 h-6 rounded-full transition-colors duration-200',
              settings.darkMode ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200',
                settings.darkMode ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

interface ToggleRowProps {
  icon: React.ElementType
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
}

function ToggleRow({ icon: Icon, label, description, enabled, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn(
          'p-2 rounded-lg',
          enabled ? 'bg-primary/10' : 'bg-muted'
        )}>
          <Icon className={cn(
            'w-4 h-4',
            enabled ? 'text-primary' : 'text-muted-foreground'
          )} />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors duration-200',
          enabled ? 'bg-primary' : 'bg-muted'
        )}
      >
        <span
          className={cn(
            'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200',
            enabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  )
}
