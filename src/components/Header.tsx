import { Brain, Focus, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'

interface HeaderProps {
  focusMode: boolean
  onToggleFocusMode: () => void
  quote: string
}

export function Header({ focusMode, onToggleFocusMode, quote }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-success rounded-full border-2 border-background" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">TeroFlow</h1>
                <p className="text-xs text-muted-foreground -mt-0.5">Smart Focus Timer</p>
              </div>
            </div>

            {/* Quote - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 max-w-md">
              <Sparkles className="w-4 h-4 text-warning flex-shrink-0" />
              <p className="text-sm text-muted-foreground italic truncate">
                {`"${quote}"`}
              </p>
            </div>

            {/* Focus Mode Toggle */}
            <button
              onClick={onToggleFocusMode}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                focusMode
                  ? 'bg-primary text-primary-foreground shadow-lg glow-primary'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              <Focus className="w-4 h-4" />
              <span className="hidden sm:inline">Focus Mode</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
