import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, CheckCircle, XCircle, Percent, AlertTriangle, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { format } from 'date-fns';

const data = [
  { name: 'Mon', present: 120, absent: 10 },
  { name: 'Tue', present: 125, absent: 5 },
  { name: 'Wed', present: 118, absent: 12 },
  { name: 'Thu', present: 122, absent: 8 },
  { name: 'Fri', present: 115, absent: 15 },
];

export function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch all students
    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'students'));

    // Fetch today's attendance
    const today = format(new Date(), 'yyyy-MM-dd');
    const q = query(collection(db, 'attendance'), where('date', '==', today));
    const unsubAttendance = onSnapshot(q, (snapshot) => {
      setAttendance(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'attendance'));

    return () => {
      unsubStudents();
      unsubAttendance();
    };
  }, []);

  const totalStudents = students.length;
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const attendancePercentage = totalStudents === 0 ? 0 : Math.round((presentCount / totalStudents) * 100);

  const stats = [
    { id: 'total', label: 'Total Students', value: totalStudents.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 'present', label: 'Present Today', value: presentCount.toString(), icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { id: 'absent', label: 'Absent Today', value: absentCount.toString(), icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' },
    { id: 'percentage', label: 'Attendance %', value: `${attendancePercentage}%`, icon: Percent, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  ];

  const getFilteredStudents = () => {
    if (selectedCategory === 'total') return students;
    if (selectedCategory === 'present') {
      const presentIds = attendance.filter(a => a.status === 'present').map(a => a.studentId);
      return students.filter(s => presentIds.includes(s.id));
    }
    if (selectedCategory === 'absent') {
      const absentIds = attendance.filter(a => a.status === 'absent').map(a => a.studentId);
      return students.filter(s => absentIds.includes(s.id));
    }
    if (selectedCategory === 'percentage') {
      const attendedIds = attendance.filter(a => a.status === 'present' || a.status === 'late').map(a => a.studentId);
      return students.filter(s => attendedIds.includes(s.id));
    }
    return [];
  };

  const filteredStudents = getFilteredStudents();
  
  const categoryTitles: Record<string, string> = {
    total: 'All Students',
    present: 'Students Present Today',
    absent: 'Students Absent Today',
    percentage: 'Students Attended Today'
  };

  const alerts = attendance
    .filter(a => a.status === 'absent' || a.status === 'late')
    .map(record => {
      const student = students.find(s => s.id === record.studentId);
      return {
        name: student ? student.name : 'Unknown Student',
        issue: record.status === 'absent' ? 'Marked absent today' : 'Marked late today',
        severity: record.status === 'absent' ? 'high' : 'medium'
      };
    });

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedCategory(stat.id)}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Weekly Attendance Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                <Area type="monotone" dataKey="absent" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorAbsent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Alerts</h2>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {alerts.length > 0 ? alerts.map((alert, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white">{alert.name}</span>
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${
                    alert.severity === 'high' ? 'bg-rose-500' : 
                    alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{alert.issue}</p>
              </div>
            )) : (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                No alerts at this time. All good!
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Students Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {categoryTitles[selectedCategory]} ({filteredStudents.length})
              </h2>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {filteredStudents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredStudents.map(student => (
                    <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Roll: {student.rollNumber} | Class: {student.class}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No students found in this category.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
