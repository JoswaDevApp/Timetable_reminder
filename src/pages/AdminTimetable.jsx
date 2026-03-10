import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { FiClock, FiMapPin, FiUser, FiCalendar, FiTrash2 } from 'react-icons/fi';

const AdminTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  // Group timetables by Day Order
  const groupedTimetables = timetables.reduce((acc, slot) => {
    if (!acc[slot.dayOrder]) acc[slot.dayOrder] = [];
    acc[slot.dayOrder].push(slot);
    return acc;
  }, {});

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const res = await api.get('/admin/timetable');
        setTimetables(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetables();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">College Timetable Data</h1>
            <p className="text-gray-500 text-sm mt-1">Review all active classes globally assigned across the system</p>
          </div>
          <div className="bg-primary-50 px-6 py-3 rounded-xl border border-primary-100 flex items-center shadow-sm">
             <span className="text-primary-700 font-medium mr-2">Total Managed Slots:</span>
             <span className="text-2xl font-bold text-primary-600">
               {timetables.length}
             </span>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4 pt-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>)}
          </div>
        ) : timetables.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm mt-8">
            <FiCalendar className="mx-auto h-16 w-16 mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Active Timetables</h3>
            <p className="text-gray-500">There are no classes scheduled in the system yet. Head back to the initial Dashboard to upload the curriculum.</p>
          </div>
        ) : (
          <div className="space-y-8 mt-6">
            {[1, 2, 3, 4, 5, 6].map(day => {
                const daySlots = groupedTimetables[day];
                if (!daySlots || daySlots.length === 0) return null;

                return (
                    <div key={day} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                            <div className="bg-primary-100 text-primary-600 font-bold px-3 py-1 rounded-md">
                                Day {day}
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Assigned Schedule</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-4 font-medium">Period</th>
                                        <th className="px-6 py-4 font-medium">Department</th>
                                        <th className="px-6 py-4 font-medium">Subject</th>
                                        <th className="px-6 py-4 font-medium">Teacher</th>
                                        <th className="px-6 py-4 font-medium">Room</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {daySlots.map(slot => (
                                        <tr key={slot._id} className="hover:bg-gray-50/50 transition-colors">
                                           <td className="px-6 py-4">
                                               <span className="inline-flex items-center justify-center bg-gray-100 text-gray-800 font-bold w-8 h-8 rounded-full text-sm">
                                                   {slot.period}
                                               </span>
                                           </td>
                                           <td className="px-6 py-4">
                                               <div className="font-medium text-gray-900">{slot.department}</div>
                                               <div className="text-xs text-gray-500 mt-0.5">Year {slot.year || 'N/A'}</div>
                                           </td>
                                           <td className="px-6 py-4 font-medium text-gray-900">
                                               {slot.subject}
                                           </td>
                                           <td className="px-6 py-4">
                                               {slot.teacher ? (
                                                  <div className="flex items-center text-sm text-gray-600">
                                                      <FiUser className="mr-2 text-primary-500" />
                                                      {slot.teacher.name}
                                                  </div>
                                               ) : (
                                                  <span className="text-gray-400 italic text-sm">Unassigned</span>
                                               )}
                                           </td>
                                           <td className="px-6 py-4">
                                               <div className="flex items-center text-sm text-gray-600 font-medium">
                                                   <FiMapPin className="mr-2 text-rose-400" />
                                                   {slot.classroom}
                                               </div>
                                           </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminTimetable;
