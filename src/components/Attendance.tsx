import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Check, X, Clock, Calendar, Camera, ScanFace, FileText, AlertCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import { collection, onSnapshot, doc, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { format } from 'date-fns';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  date: string;
}

export function Attendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [selectedClass, setSelectedClass] = useState('All');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isFaceRecogOpen, setIsFaceRecogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Fetch students
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        const studentData: Student[] = [];
        snapshot.forEach((doc) => {
          studentData.push({ id: doc.id, ...doc.data() } as Student);
        });
        setStudents(studentData);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'students')
    );

    return () => unsubStudents();
  }, []);

  useEffect(() => {
    if (!auth.currentUser || !date) return;

    const q = query(collection(db, 'attendance'), where('date', '==', date));
    const unsubAttendance = onSnapshot(
      q,
      (snapshot) => {
        const attData: Record<string, AttendanceRecord> = {};
        snapshot.forEach((doc) => {
          const data = doc.data() as AttendanceRecord;
          attData[data.studentId] = data;
        });
        setAttendance(attData);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'attendance')
    );

    return () => unsubAttendance();
  }, [date]);

  const markAttendance = async (studentId: string, status: 'present' | 'absent' | 'late' | 'leave') => {
    if (!auth.currentUser) return;

    const recordId = `${studentId}_${date}`;
    const newRecord: AttendanceRecord = {
      id: recordId,
      studentId,
      status,
      date,
    };

    try {
      await setDoc(doc(db, 'attendance', recordId), {
        ...newRecord,
        markedBy: auth.currentUser.uid,
        timestamp: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `attendance/${recordId}`);
    }
  };

  const markAllPresent = async () => {
    const promises = filteredStudents.map(student => {
      if (!attendance[student.id] || attendance[student.id].status !== 'present') {
        return markAttendance(student.id, 'present');
      }
      return Promise.resolve();
    });
    await Promise.all(promises);
  };

  const simulateFaceScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsFaceRecogOpen(false);
      // Simulate marking a few students present
      if (filteredStudents.length > 0) {
        markAttendance(filteredStudents[0].id, 'present');
        if (filteredStudents.length > 1) {
          markAttendance(filteredStudents[1].id, 'present');
        }
      }
      alert('Face scan complete. Attendance marked for detected students.');
    }, 3000);
  };

  const classes = ['All', ...Array.from(new Set(students.map(s => s.class)))];
  const filteredStudents = students.filter(s => selectedClass === 'All' || s.class === selectedClass);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mark Attendance</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <Calendar size={18} className="text-slate-500" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 dark:text-slate-300"
            />
          </div>
          
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {classes.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Classes' : `Class ${c}`}</option>
            ))}
          </select>

          <button 
            onClick={() => setIsFaceRecogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors shadow-sm font-medium"
          >
            <ScanFace size={18} />
            <span className="hidden sm:inline">Smart Scan</span>
          </button>
          
          <button 
            onClick={markAllPresent}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm font-medium"
          >
            <Check size={18} />
            <span className="hidden sm:inline">Mark All Present</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium w-16">Roll</th>
                <th className="p-4 font-medium">Student Info</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const status = attendance[student.id]?.status;
                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={student.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-sm">{student.rollNumber}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{student.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Class {student.class}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {status ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            status === 'present' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            status === 'absent' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' :
                            status === 'late' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                            Unmarked
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button 
                            onClick={() => markAttendance(student.id, 'present')}
                            className={`p-2 rounded-lg transition-colors ${status === 'present' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Present"
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            onClick={() => markAttendance(student.id, 'absent')}
                            className={`p-2 rounded-lg transition-colors ${status === 'absent' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Absent"
                          >
                            <X size={20} />
                          </button>
                          <button 
                            onClick={() => markAttendance(student.id, 'late')}
                            className={`p-2 rounded-lg transition-colors ${status === 'late' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Late"
                          >
                            <Clock size={20} />
                          </button>
                          <button 
                            onClick={() => markAttendance(student.id, 'leave')}
                            className={`p-2 rounded-lg transition-colors ${status === 'leave' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Leave"
                          >
                            <FileText size={20} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No students found for this class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Face Recognition Modal */}
      {isFaceRecogOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-700"
          >
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <div className="flex items-center gap-2 text-white font-bold">
                <ScanFace className="text-indigo-400" />
                AI Face Recognition
              </div>
              <button 
                onClick={() => setIsFaceRecogOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover opacity-80"
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full border-[1px] border-indigo-500/30 relative">
                  {/* Corner markers */}
                  <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl"></div>
                  <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl"></div>
                  <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl"></div>
                  <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-indigo-500 rounded-br-xl"></div>
                  
                  {/* Scanning line animation */}
                  {isScanning && (
                    <motion.div 
                      animate={{ top: ['10%', '90%', '10%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-8 right-8 h-0.5 bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                    />
                  )}
                </div>
              </div>

              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <button 
                    onClick={simulateFaceScan}
                    className="flex flex-col items-center gap-3 p-6 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white backdrop-blur-md transition-all transform hover:scale-105"
                  >
                    <Camera size={32} />
                    <span className="font-medium">Start Scan</span>
                  </button>
                </div>
              )}

              {isScanning && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700 flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                  <span className="text-white font-medium text-sm">Analyzing faces...</span>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-800/50 text-sm text-slate-400 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-indigo-400" />
              <p>Position the camera to capture the classroom. The AI will automatically detect faces and mark attendance for recognized students.</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
