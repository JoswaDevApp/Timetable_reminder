import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { format } from 'date-fns';
import { FiBell } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, timetables: 0 });
  const [dayOrder, setDayOrder] = useState(null);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    // Fetch dashboard summary
    const fetchDashboard = async () => {
      try {
        const [usersRes, dOrderRes, teachersRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/dayorder/current'),
          api.get('/admin/teachers')
        ]);
        
        setStats(prev => ({ ...prev, users: usersRes.data.length }));
        setDayOrder(dOrderRes.data);
        setTeachers(teachersRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-500 text-sm mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <div className="relative">
               <p className="text-sm font-medium text-gray-500">Today's Day Order</p>
               <h3 className="text-4xl font-bold text-primary-600 mt-2">
                 {dayOrder?.currentDayOrder ? `Day ${dayOrder.currentDayOrder}` : 'Not Set'}
               </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</h3>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <p className="text-sm font-medium text-gray-500">Active Schedules</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.timetables || '--'}</h3>
          </div>
        </div>
        
        {/* Forms for Testing Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Set Day Order Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Set Today's Day Order</h2>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const val = e.target.dayOrder.value;
                  try {
                    await api.post('/admin/dayorder', {
                      date: new Date(),
                      currentDayOrder: parseInt(val),
                      isOverride: true
                    });
                    alert('Day order updated successfully!');
                    window.location.reload();
                  } catch (err) {
                    alert('Error updating Day Order');
                  }
                }} className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Day Order (1-6)</label>
                     <input type="number" name="dayOrder" min="1" max="6" required className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500" />
                   </div>
                   <button type="submit" className="w-full bg-primary-600 text-white rounded-lg py-2 hover:bg-primary-700">Update Current Day Order</button>
                </form>
            </div>

            {/* Create Timetable Entry Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Timetable Entry</h2>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  const data = Object.fromEntries(fd.entries());
                  try {
                    await api.post('/admin/timetable', data);
                    alert('Timetable created!');
                    e.target.reset();
                  } catch (err) {
                    alert(err.response?.data?.message || 'Error creating timetable');
                  }
                }} className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" name="department" placeholder="Department" required className="px-3 py-2 border rounded-lg w-full" />
                      <input type="number" name="year" placeholder="Year (1-4)" min="1" max="4" required className="px-3 py-2 border rounded-lg w-full" />
                      <input type="number" name="dayOrder" placeholder="Day Order (1-6)" min="1" max="6" required className="px-3 py-2 border rounded-lg w-full" />
                      <input type="number" name="period" placeholder="Period" required className="px-3 py-2 border rounded-lg w-full" />
                      <input type="text" name="subject" placeholder="Subject Name" required className="px-3 py-2 border rounded-lg w-full col-span-2" />
                      <select name="teacher" required className="px-3 py-2 border rounded-lg w-full col-span-2 bg-white">
                         <option value="">Select Teacher...</option>
                         {teachers.map(t => (
                           <option key={t._id} value={t._id}>{t.name} ({t.department})</option>
                         ))}
                      </select>
                      <input type="text" name="classroom" placeholder="Classroom" required className="px-3 py-2 border rounded-lg w-full col-span-2" />
                   </div>
                   <button type="submit" className="w-full bg-primary-600 text-white rounded-lg py-2 hover:bg-primary-700">Create Timetable Slot</button>
                </form>
            </div>
        </div>

        {/* Quick Actions Placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Tools</h2>
            <div className="flex flex-col md:flex-row gap-4">
               <button 
                 onClick={async () => {
                    try {
                      await api.post('/admin/trigger-reminders');
                      alert('Morning Schedule Reminders Triggered Successfully to all Users!');
                    } catch (err) {
                      alert(err.response?.data?.message || 'Error triggering reminders');
                    }
                 }}
                 className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center shadow-sm">
                 <FiBell className="mr-2 text-primary-500" /> Broadcast Morning Schedule Notification
               </button>

               <button 
                 onClick={async () => {
                    try {
                      await api.post('/admin/trigger-upcoming');
                      alert('Upcoming Class Alerts Sent Successfully!');
                    } catch (err) {
                      alert(err.response?.data?.message || 'Error triggering upcoming class alerts');
                    }
                 }}
                 className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center shadow-sm">
                 <FiBell className="mr-2 text-indigo-500" /> Trigger Upcoming Class Alert (10 mins)
               </button>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
