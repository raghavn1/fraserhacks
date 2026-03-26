import { Camera, Monitor, Eye, EyeOff, Smartphone, Globe } from 'lucide-react'
import { cn } from '../lib/utils'
import type { AIMonitoringState } from '../store/useStore'

interface AIMonitoringPanelProps {
  monitoring: AIMonitoringState
  onToggleCamera: () => void
  onToggleScreen: () => void
}

export function AIMonitoringPanel({
  monitoring,
  onToggleCamera,
  onToggleScreen,
}: AIMonitoringPanelProps) {
  return (
    <div className="space-y-4">
      {/* Camera Preview */}
      <div className="glass rounded-2xl p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">Camera Monitor</h3>
          </div>
          <button
            onClick={onToggleCamera}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
              monitoring.cameraEnabled
                ? 'bg-success/10 text-success'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {monitoring.cameraEnabled ? 'Active' : 'Disabled'}
          </button>
        </div>

        {/* Mock Camera Preview */}
        <div className="relative aspect-video rounded-xl bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
          {monitoring.cameraEnabled ? (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-xs text-muted-foreground">LIVE</span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <EyeOff className="w-8 h-8 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Detection Status */}
        {monitoring.cameraEnabled && (
          <div className="mt-3 space-y-2">
            <StatusItem
              icon={Eye}
              label="Eye Contact"
              active={monitoring.eyeContactDetected}
              activeText="Detected"
              inactiveText="Not detected"
            />
            <StatusItem
              icon={EyeOff}
              label="Looking Away"
              active={monitoring.lookingAway}
              activeText="Yes"
              inactiveText="No"
              invertColors
            />
            <StatusItem
              icon={Smartphone}
              label="Phone"
              active={monitoring.phoneDetected}
              activeText="Detected"
              inactiveText="Not detected"
              invertColors
            />
          </div>
        )}
      </div>

      {/* Screen Activity */}
      <div className="glass rounded-2xl p-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">Screen Activity</h3>
          </div>
          <button
            onClick={onToggleScreen}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
              monitoring.screenMonitoringEnabled
                ? 'bg-success/10 text-success'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {monitoring.screenMonitoringEnabled ? 'Active' : 'Disabled'}
          </button>
        </div>

        {monitoring.screenMonitoringEnabled && (
          <>
            {/* Current Tab */}
            <div className="bg-secondary/50 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Current Tab</span>
              </div>
              <p className={cn(
                'text-sm font-medium truncate',
                monitoring.isDistractedTab ? 'text-destructive' : 'text-foreground'
              )}>
                {monitoring.currentTab}
              </p>
            </div>

            {/* Confidence Score */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">AI Confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      monitoring.confidenceScore >= 80 ? 'bg-success' :
                      monitoring.confidenceScore >= 50 ? 'bg-warning' : 'bg-destructive'
                    )}
                    style={{ width: `${monitoring.confidenceScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {monitoring.confidenceScore}%
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface StatusItemProps {
  icon: React.ElementType
  label: string
  active: boolean
  activeText: string
  inactiveText: string
  invertColors?: boolean
}

function StatusItem({
  icon: Icon,
  label,
  active,
  activeText,
  inactiveText,
  invertColors = false,
}: StatusItemProps) {
  const isPositive = invertColors ? !active : active

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span
        className={cn(
          'text-xs font-medium',
          isPositive ? 'text-success' : 'text-destructive'
        )}
      >
        {active ? activeText : inactiveText}
      </span>
    </div>
  )
}
