import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { format } from 'date-fns';
import { FiClock, FiMapPin, FiUser } from 'react-icons/fi';

const StudentDashboard = () => {
  const [todaySchedule, setTodaySchedule] = useState({ dayOrder: null, timetable: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const [timetableRes, dayOrderRes] = await Promise.all([
           api.get('/timetable/today'),
           api.get('/dayorder/current')
        ]);
        
        // Ensure dayOrder from the standalone endpoint is captured even if timetable is empty
        setTodaySchedule({
           timetable: timetableRes.data.timetable || [],
           dayOrder: dayOrderRes.data?.currentDayOrder || null
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchToday();
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header section with Day Order */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
            <p className="text-gray-500 text-sm mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
          </div>
          <div className="bg-primary-50 px-6 py-3 rounded-xl border border-primary-100 flex items-center shadow-sm w-max md:w-auto">
             <span className="text-primary-700 font-medium mr-2">Today's Day Order:</span>
             <span className="text-2xl font-bold text-primary-600">
               {todaySchedule.dayOrder || 'None'}
             </span>
          </div>
        </div>

        {/* Timetable List Component */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900">Today's Classes</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>)}
              </div>
            ) : todaySchedule.timetable.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FiClock className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                <p>No classes scheduled for today. Enjoy your day off!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySchedule.timetable.map((slot) => (
                  <div key={slot._id} className="group relative flex items-center p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all bg-white hover:bg-primary-50/30">
                     <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg mr-4 shrink-0 shadow-inner">
                        P{slot.period}
                     </div>
                     <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{slot.subject}</h3>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                           <span className="flex items-center"><FiUser className="mr-1.5 opacity-70" /> {slot.teacher?.name}</span>
                           <span className="flex items-center"><FiMapPin className="mr-1.5 opacity-70" /> {slot.classroom}</span>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
