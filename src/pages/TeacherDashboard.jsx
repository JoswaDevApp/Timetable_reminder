import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { format } from 'date-fns';
import { FiClock, FiMapPin, FiUsers } from 'react-icons/fi';

const TeacherDashboard = () => {
  const [todaySchedule, setTodaySchedule] = useState({ dayOrder: null, timetable: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const [timetableRes, dayOrderRes] = await Promise.all([
           api.get('/timetable/today'),
           api.get('/dayorder/current')
        ]);
        
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teaching Schedule</h1>
            <p className="text-gray-500 text-sm mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
          </div>
          <div className="bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-100 flex items-center shadow-sm">
             <span className="text-emerald-700 font-medium mr-2">Today's Day Order:</span>
             <span className="text-2xl font-bold text-emerald-600">
               {todaySchedule.dayOrder || 'None'}
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 px-1">Upcoming Classes</h2>
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>)}
                  </div>
                ) : todaySchedule.timetable.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-400 shadow-sm">
                    <FiClock className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                    <p>No classes scheduled for today.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todaySchedule.timetable.map((slot) => (
                      <div key={slot._id} className="relative overflow-hidden bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-300 transition-all flex items-center">
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary-500"></div>
                          <div className="pl-4 pr-6 border-r border-gray-100 text-center">
                              <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">Period</div>
                              <div className="text-3xl font-bold text-gray-900">{slot.period}</div>
                          </div>
                          <div className="pl-6 flex-1">
                              <h3 className="text-xl font-bold text-gray-900">{slot.subject}</h3>
                              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center"><FiUsers className="mr-1.5 text-primary-500" /> Dept: {slot.department} - Yr {slot.year}</span>
                                  <span className="flex items-center"><FiMapPin className="mr-1.5 text-primary-500" /> {slot.classroom}</span>
                              </div>
                          </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 px-1">Quick Links</h2>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-2">
                   <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors border border-transparent hover:border-gray-200">
                      View Full Weekly Timetable
                   </button>
                   <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors border border-transparent hover:border-gray-200">
                      Request Schedule Change
                   </button>
                   <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors border border-transparent hover:border-gray-200">
                      My Notifications
                   </button>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
