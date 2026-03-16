import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Bell, Shield, Palette, Cloud, Smartphone } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 800);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup & Sync', icon: Cloud },
    { id: 'devices', label: 'Devices', icon: Smartphone },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium disabled:opacity-70"
        >
          <Save size={18} />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <nav className="flex flex-col p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
          >
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">School Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">School Name</label>
                      <input type="text" defaultValue="Springfield High School" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Academic Year</label>
                      <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option>2023-2024</option>
                        <option>2024-2025</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Attendance Rules</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Auto-mark Absent</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Automatically mark unmarked students as absent after cutoff time</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Late Mark Cutoff</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Time after which attendance is marked as late</p>
                      </div>
                      <input type="time" defaultValue="09:15" className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">App Security</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Shield size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">App Lock</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Require PIN or Biometrics to open app</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400">
                        <Shield size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Auto-lock Timeout</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Lock app after period of inactivity</p>
                      </div>
                    </div>
                    <select className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option>1 minute</option>
                      <option>5 minutes</option>
                      <option>15 minutes</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { title: 'Absentee Alerts', desc: 'Notify parents immediately when student is marked absent' },
                    { title: 'AI Insights', desc: 'Receive alerts about irregular attendance patterns' },
                    { title: 'Daily Summary', desc: 'Get a daily attendance report at the end of the day' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'backup' || activeTab === 'devices') && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                  {activeTab === 'backup' ? <Cloud size={48} className="text-slate-400" /> : <Smartphone size={48} className="text-slate-400" />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Premium Feature</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                  {activeTab === 'backup' 
                    ? 'Upgrade to Premium to enable automatic cloud backups and cross-device sync.' 
                    : 'Manage multiple devices and active sessions with a Premium subscription.'}
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Upgrade to Premium
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
