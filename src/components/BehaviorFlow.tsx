import { Eye, AlertTriangle, BookOpen, Bell, BellOff, ToggleRight, ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils'

interface BehaviorFlowProps {
  isDistracted: boolean
  alarmActive: boolean
}

export function BehaviorFlow({ isDistracted, alarmActive }: BehaviorFlowProps) {
  return (
    <div className="glass rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        Behavior Logic
      </h3>

      <div className="space-y-3">
        {/* Flow Item 1: Distraction triggers alarm */}
        <FlowItem
          icon={AlertTriangle}
          label="User distracted"
          resultIcon={Bell}
          result="Alarm triggers"
          active={isDistracted && alarmActive}
          variant="destructive"
        />

        {/* Flow Item 2: Return to study stops alarm */}
        <FlowItem
          icon={BookOpen}
          label="Returns to study"
          resultIcon={BellOff}
          result="Alarm stops"
          active={!isDistracted && !alarmActive}
          variant="success"
        />

        {/* Flow Item 3: Manual override */}
        <FlowItem
          icon={ToggleRight}
          label="Switch toggled"
          resultIcon={BellOff}
          result="Manual override"
          active={false}
          variant="neutral"
        />
      </div>
    </div>
  )
}

interface FlowItemProps {
  icon: React.ElementType
  label: string
  resultIcon: React.ElementType
  result: string
  active: boolean
  variant: 'destructive' | 'success' | 'neutral'
}

function FlowItem({ icon: Icon, label, resultIcon: ResultIcon, result, active, variant }: FlowItemProps) {
  const variantStyles = {
    destructive: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      iconColor: 'text-destructive',
      arrowColor: 'text-destructive',
    },
    success: {
      bg: 'bg-success/10',
      border: 'border-success/30',
      iconColor: 'text-success',
      arrowColor: 'text-success',
    },
    neutral: {
      bg: 'bg-secondary/50',
      border: 'border-border',
      iconColor: 'text-muted-foreground',
      arrowColor: 'text-muted-foreground',
    },
  }

  const styles = active ? variantStyles[variant] : variantStyles.neutral

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-3 rounded-xl border transition-all duration-300',
        styles.bg,
        styles.border,
        active && 'shadow-sm'
      )}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className={cn('w-4 h-4 flex-shrink-0', styles.iconColor)} />
        <span className={cn(
          'text-xs truncate',
          active ? 'text-foreground font-medium' : 'text-muted-foreground'
        )}>
          {label}
        </span>
      </div>

      <ArrowRight className={cn('w-3 h-3 flex-shrink-0', styles.arrowColor)} />

      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className={cn(
          'text-xs truncate',
          active ? 'text-foreground font-medium' : 'text-muted-foreground'
        )}>
          {result}
        </span>
        <ResultIcon className={cn('w-4 h-4 flex-shrink-0', styles.iconColor)} />
      </div>
    </div>
  )
}
