import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Delete } from 'lucide-react';

interface PinLockProps {
  onUnlock: () => void;
}

export function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const correctPin = localStorage.getItem('appPin') || '1234'; // Default if somehow enabled without setting

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === correctPin) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin, correctPin, onUnlock]);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mb-6">
          <Lock size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Enter PIN</h2>
        <p className="text-slate-400 mb-8 text-center">Please enter your PIN to access the app</p>

        <div className="flex gap-4 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-colors ${
                error ? 'bg-rose-500' : 
                i < pin.length ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="w-20 h-20 rounded-full bg-slate-800 text-white text-2xl font-medium flex items-center justify-center hover:bg-slate-700 active:bg-slate-600 transition-colors"
            >
              {num}
            </button>
          ))}
          <div /> {/* Empty space */}
          <button
            onClick={() => handleNumberClick('0')}
            className="w-20 h-20 rounded-full bg-slate-800 text-white text-2xl font-medium flex items-center justify-center hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-20 h-20 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            <Delete size={28} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
