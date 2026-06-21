import React from "react";
import { 
  Car, 
  ShieldAlert, 
  Clock, 
  CheckCircle2,
  Calendar,
  AlertTriangle,
  BrainCircuit
} from "lucide-react";

// Mock Data
const summaryStats = [
  { label: "Total Sessions", value: "24", icon: Car },
  { label: "Total Alerts", value: "7", icon: ShieldAlert },
  { label: "Avg Session", value: "1h 12m", icon: Clock },
  { label: "Safest Session", value: "Oct 24", icon: CheckCircle2 },
];

const sessions = [
  { id: 1, date: "Today, 08:30 AM", duration: "45m 12s", events: 0, alerts: 0, status: "SAFE" },
  { id: 2, date: "Yesterday, 06:15 PM", duration: "1h 20m 05s", events: 3, alerts: 1, status: "WARNING" },
  { id: 3, date: "Oct 24, 07:00 AM", duration: "2h 15m 30s", events: 0, alerts: 0, status: "SAFE" },
  { id: 4, date: "Oct 22, 10:45 PM", duration: "3h 40m 10s", events: 12, alerts: 4, status: "DANGER" },
  { id: 5, date: "Oct 20, 09:10 AM", duration: "55m 20s", events: 1, alerts: 0, status: "SAFE" },
];

const recentEvents = [
  { id: 1, time: "Today, 06:45 PM", type: "Eyes Closed", duration: "1.2s", severity: "warning" },
  { id: 2, time: "Oct 22, 11:30 PM", type: "Head Nod", duration: "2.5s", severity: "critical" },
  { id: 3, time: "Oct 22, 11:15 PM", type: "Eyes Closed", duration: "3.1s", severity: "critical" },
  { id: 4, time: "Oct 22, 11:05 PM", type: "Eyes Closed", duration: "1.5s", severity: "warning" },
  { id: 5, time: "Oct 20, 09:45 AM", type: "Yawning", duration: "4.0s", severity: "info" },
];

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'SAFE':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-safe/10 text-safe border border-safe/20">Safe</span>;
    case 'WARNING':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">Warning</span>;
    case 'DANGER':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger border border-danger/20">Danger</span>;
    default:
      return null;
  }
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Session History</h1>
        <p className="text-text-muted mt-2">Review your past drives and drowsiness events.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-surface-1 rounded-xl p-6 border border-surface-2 shadow-sm hover:border-accent/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold font-mono">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sessions Table Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-surface-1 rounded-xl border border-surface-2 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-surface-2 bg-surface-1/50">
              <h2 className="font-bold text-lg">All Sessions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-2/30 text-text-muted uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Duration</th>
                    <th className="px-6 py-4 font-medium">Events</th>
                    <th className="px-6 py-4 font-medium">Alerts</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-2">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-surface-2/20 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-text-primary group-hover:text-accent transition-colors flex items-center gap-2">
                        <Calendar size={14} className="text-text-muted" />
                        {session.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono">{session.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{session.events}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{session.alerts}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={session.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Events Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-surface-1 rounded-xl border border-surface-2 overflow-hidden shadow-sm h-full">
            <div className="px-6 py-4 border-b border-surface-2 bg-surface-1/50 flex justify-between items-center">
              <h2 className="font-bold text-lg">Recent Events</h2>
            </div>
            <div className="p-6">
              <div className="relative border-l-2 border-surface-2 ml-3 max-h-[500px] overflow-y-auto pr-2 pb-4">
                {recentEvents.map((event, idx) => (
                  <div key={event.id} className="mb-8 ml-6 relative">
                    {/* Timeline Node */}
                    <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-[35px] ring-4 ring-surface-1 
                      ${event.severity === 'critical' ? 'bg-danger/20 text-danger' : 
                        event.severity === 'warning' ? 'bg-warning/20 text-warning' : 
                        'bg-accent/20 text-accent'}`}
                    >
                      {event.severity === 'critical' ? <AlertTriangle size={12} /> : 
                       event.severity === 'warning' ? <ShieldAlert size={12} /> : 
                       <BrainCircuit size={12} />}
                    </span>
                    
                    {/* Event Content */}
                    <div className="bg-surface-2/30 rounded-lg p-3 border border-surface-2 hover:border-surface-2/80 transition-colors">
                      <h3 className="flex items-center mb-1 text-sm font-bold text-text-primary capitalize">
                        {event.type}
                        {event.severity === 'critical' && (
                          <span className="bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded ml-2 uppercase">Critical</span>
                        )}
                      </h3>
                      <time className="block mb-2 text-xs font-normal leading-none text-text-muted">{event.time}</time>
                      <p className="text-xs text-text-muted font-mono bg-black/20 inline-block px-2 py-1 rounded">
                        Duration: {event.duration}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* End of timeline marker */}
                <div className="ml-6 relative">
                  <span className="absolute w-3 h-3 rounded-full -left-[30px] bg-surface-2 ring-4 ring-surface-1" />
                  <span className="text-xs text-text-muted italic">End of recent history</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
