import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { FiClock, FiMapPin, FiUsers } from 'react-icons/fi';

const WeeklyView = () => {
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const res = await api.get('/timetable/weekly');
        setWeeklySchedule(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeekly();
  }, []);

  // Group by Day Order
  const groupedSchedule = weeklySchedule.reduce((acc, slot) => {
    if (!acc[slot.dayOrder]) acc[slot.dayOrder] = [];
    acc[slot.dayOrder].push(slot);
    return acc;
  }, {});

  const [addingSlot, setAddingSlot] = useState(false);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weekly Timetable</h1>
            <p className="text-gray-500 text-sm mt-1">Full overview of your classes from Day 1 to Day 6</p>
          </div>
          <button 
             onClick={() => setAddingSlot(!addingSlot)}
             className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 transition-colors text-sm font-medium">
             {addingSlot ? 'Cancel' : '+ Add Time Slot'}
          </button>
        </div>

        {addingSlot && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-200 bg-primary-50/10 mb-6">
             <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Personal Timetable Slot</h2>
             <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const data = Object.fromEntries(fd.entries());
                try {
                  await api.post('/timetable/mine', data);
                  alert('Timetable slot added successfully!');
                  window.location.reload();
                } catch (err) {
                  alert(err.response?.data?.message || 'Error creating timetable');
                }
             }} className="space-y-4">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input type="number" name="dayOrder" placeholder="Day Order (1-6)" min="1" max="6" required className="px-3 py-2 border border-gray-300 rounded-lg w-full" />
                  <input type="number" name="period" placeholder="Period (e.g. 1)" min="1" required className="px-3 py-2 border border-gray-300 rounded-lg w-full" />
                  <input type="text" name="subject" placeholder="Subject Name" required className="px-3 py-2 border border-gray-300 rounded-lg w-full" />
                  <input type="text" name="classroom" placeholder="Classroom" required className="px-3 py-2 border border-gray-300 rounded-lg w-full" />
               </div>
               <button type="submit" className="w-full bg-primary-600 text-white rounded-lg py-2 hover:bg-primary-700 font-medium">
                  Save Slot to My Schedule
               </button>
             </form>
          </div>
        )}

        {loading ? (
           <div className="animate-pulse space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>)}
           </div>
        ) : weeklySchedule.length === 0 ? (
           <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-400 shadow-sm">
             <FiClock className="mx-auto h-12 w-12 mb-3 text-gray-300" />
             <p>No classes scheduled for the week.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(day => (
              <div key={day} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="bg-primary-50 border-b border-primary-100 px-4 py-3">
                  <h3 className="font-bold text-primary-800 text-center">Day {day}</h3>
                </div>
                <div className="p-4 flex-1 space-y-3">
                   {groupedSchedule[day] && groupedSchedule[day].length > 0 ? (
                      groupedSchedule[day].map(slot => (
                        <div key={slot._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                           <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-gray-900">P{slot.period} - {slot.subject}</span>
                              <span className="text-xs bg-white px-2 py-0.5 rounded border text-gray-500">{slot.classroom}</span>
                           </div>
                           <div className="text-gray-500 text-xs flex items-center mt-1">
                              <FiUsers className="mr-1" /> {slot.teacher?.name || slot.department}
                           </div>
                        </div>
                      ))
                   ) : (
                      <div className="flex items-center justify-center h-full min-h-[100px] text-gray-400 text-sm italic">
                         No classes
                      </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WeeklyView;
