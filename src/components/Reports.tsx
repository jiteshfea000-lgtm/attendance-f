import React from 'react';
import { motion } from 'motion/react';
import { Download, Filter, FileText, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { name: 'Week 1', present: 85, absent: 15 },
  { name: 'Week 2', present: 90, absent: 10 },
  { name: 'Week 3', present: 88, absent: 12 },
  { name: 'Week 4', present: 92, absent: 8 },
];

const pieData = [
  { name: 'Present', value: 88, color: '#10b981' },
  { name: 'Absent', value: 8, color: '#f43f5e' },
  { name: 'Late', value: 3, color: '#f59e0b' },
  { name: 'Leave', value: 1, color: '#3b82f6' },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics & Reports</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
            <Filter size={18} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
            <Download size={18} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Trend</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="present" name="Present %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="absent" name="Absent %" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Overall Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <PieChartIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Overall Distribution</h2>
          </div>
          <div className="h-64 flex items-center justify-center relative">
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
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">88%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Avg Present</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Generated Reports</h2>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {[
            { name: 'Monthly Attendance - Class 10A', date: 'Oct 1, 2023', type: 'PDF', size: '2.4 MB' },
            { name: 'Defaulters List - September', date: 'Sep 30, 2023', type: 'Excel', size: '1.1 MB' },
            { name: 'Weekly Summary - All Classes', date: 'Sep 28, 2023', type: 'PDF', size: '3.5 MB' },
          ].map((report, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{report.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{report.date} • {report.type} • {report.size}</p>
                </div>
              </div>
              <button className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                <Download size={20} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
