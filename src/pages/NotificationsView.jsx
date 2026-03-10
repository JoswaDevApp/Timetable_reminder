import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { format } from 'date-fns';
import { FiBell } from 'react-icons/fi';

const NotificationsView = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Your recent alerts and announcements</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-6 animate-pulse space-y-4">
              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
               <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                 <FiBell className="h-8 w-8 text-gray-300" />
               </div>
               <p className="font-medium text-gray-500">You're all caught up!</p>
               <p className="text-sm mt-1">No new notifications at this time.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map(notif => (
                <div key={notif._id} className="p-6 hover:bg-gray-50 transition-colors flex gap-4">
                  <div className="mt-1">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                       <FiBell />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    <p className="text-gray-600 mt-1">{notif.message}</p>
                    <div className="mt-2 text-xs text-gray-400 font-medium">
                      {format(new Date(notif.sentAt), 'PPp')} • {notif.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsView;
