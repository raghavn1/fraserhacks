import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Clock, AlertCircle, Flame } from 'lucide-react'
import { cn } from '../lib/utils'
import type { SessionData } from '../store/useStore'

interface SessionAnalyticsProps {
  data: SessionData[]
}

export function SessionAnalytics({ data }: SessionAnalyticsProps) {
  const totalFocus = data.reduce((acc, d) => acc + d.focusTime, 0)
  const totalDistraction = data.reduce((acc, d) => acc + d.distractionTime, 0)
  const totalDistractions = data.reduce((acc, d) => acc + d.distractions, 0)
  const streak = 7 // Mock streak

  const pieData = [
    { name: 'Focus', value: totalFocus, color: 'hsl(142, 76%, 36%)' },
    { name: 'Distraction', value: totalDistraction, color: 'hsl(0, 84%, 60%)' },
  ]

  return (
    <div className="glass rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        Session Analytics
      </h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard
          icon={Clock}
          label="Focus Time"
          value={`${Math.round(totalFocus / 60)}h`}
          color="text-success"
          bgColor="bg-success/10"
        />
        <StatCard
          icon={AlertCircle}
          label="Distractions"
          value={totalDistractions.toString()}
          color="text-destructive"
          bgColor="bg-destructive/10"
        />
        <StatCard
          icon={Flame}
          label="Streak"
          value={`${streak} days`}
          color="text-warning"
          bgColor="bg-warning/10"
        />
      </div>

      {/* Bar Chart */}
      <div className="mb-5">
        <p className="text-xs text-muted-foreground mb-2">Weekly Overview</p>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar
                dataKey="focusTime"
                fill="hsl(142, 76%, 36%)"
                radius={[4, 4, 0, 0]}
                name="Focus (min)"
              />
              <Bar
                dataKey="distractionTime"
                fill="hsl(0, 84%, 60%)"
                radius={[4, 4, 0, 0]}
                name="Distraction (min)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={35}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Focus</span>
            </div>
            <span className="text-xs font-medium text-foreground">
              {Math.round((totalFocus / (totalFocus + totalDistraction)) * 100)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">Distraction</span>
            </div>
            <span className="text-xs font-medium text-foreground">
              {Math.round((totalDistraction / (totalFocus + totalDistraction)) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string
  color: string
  bgColor: string
}

function StatCard({ icon: Icon, label, value, color, bgColor }: StatCardProps) {
  return (
    <div className={cn('p-3 rounded-xl', bgColor)}>
      <Icon className={cn('w-4 h-4 mb-1', color)} />
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
