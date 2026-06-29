import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Activity, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import api from '../lib/api';

const barData = [
  { name: 'Mon', tasks: 4 },
  { name: 'Tue', tasks: 3 },
  { name: 'Wed', tasks: 7 },
  { name: 'Thu', tasks: 5 },
  { name: 'Fri', tasks: 8 },
  { name: 'Sat', tasks: 2 },
  { name: 'Sun', tasks: 1 },
];

const pieData = [
  { name: 'To Do', value: 12, color: '#FACC15' },
  { name: 'In Progress', value: 8, color: '#3B82F6' },
  { name: 'Review', value: 4, color: '#FF1CF7' },
  { name: 'Done', value: 15, color: '#10B981' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, done: 0, inProgress: 0, upcoming: 0 });
  const [dbStatus, setDbStatus] = useState<'checking'|'connected'|'disconnected'>('checking');

  useEffect(() => {
    // Check if the backend is fully connected to MongoDB
    api.get('/health').then(res => {
      setDbStatus(res.data.database);
    }).catch(() => {
      setDbStatus('disconnected');
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-16 md:pb-0"
    >
      {dbStatus === 'disconnected' && (
        <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)] text-white p-4 rounded-xl flex items-center justify-between text-sm md:text-base">
          <div>
            <h3 className="font-bold">Database Not Configured</h3>
            <p className="opacity-90">Please set your MONGODB_URI in the Secrets panel to persist data, otherwise this app will not function correctly.</p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm md:text-base">Here's an overview of your projects and productivity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: '39', icon: ListTodo, color: 'text-white' },
          { label: 'In Progress', value: '8', icon: Activity, color: 'text-[var(--color-info)]' },
          { label: 'Completed', value: '15', icon: CheckCircle2, color: 'text-[var(--color-success)]' },
          { label: 'Upcoming', value: '4', icon: Clock, color: 'text-[var(--color-warning)]' },
        ].map((stat, i) => (
          <Card key={i} className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <span className="text-xs md:text-sm text-[var(--color-text-muted)] font-medium truncate pr-2">{stat.label}</span>
              <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color} shrink-0`} />
            </div>
            <div className="text-2xl md:text-3xl font-heading font-bold">{stat.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <Card className="p-4 md:p-6 col-span-1 lg:col-span-2">
          <h3 className="font-heading font-semibold mb-6">Weekly Productivity</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--color-hover)' }}
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                />
                <Bar dataKey="tasks" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut Chart */}
        <Card className="p-4 md:p-6 col-span-1">
          <h3 className="font-heading font-semibold mb-6">Task Distribution</h3>
          <div className="h-[200px] md:h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-text-main)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-2xl md:text-3xl font-heading font-bold">39</span>
              <span className="text-xs text-[var(--color-text-muted)]">Tasks</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-xs md:text-sm">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[var(--color-text-muted)] truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
