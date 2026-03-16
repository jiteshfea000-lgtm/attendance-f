import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';

export function Splash() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-violet-900 text-white">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/10 p-6 rounded-3xl backdrop-blur-lg shadow-2xl border border-white/20 mb-8"
        >
          <GraduationCap size={80} className="text-indigo-300" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl font-bold tracking-tight mb-2"
        >
          SmartAttend <span className="text-indigo-400">AI</span>
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-indigo-200 text-lg font-medium"
        >
          Premium Attendance Management
        </motion.p>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
          className="h-1 bg-indigo-500 mt-12 rounded-full overflow-hidden relative"
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
