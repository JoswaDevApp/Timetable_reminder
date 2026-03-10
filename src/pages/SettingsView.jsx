import React from 'react';
import Layout from '../components/Layout';
import { FiSettings, FiUser, FiBell, FiShield, FiDatabase } from 'react-icons/fi';

const SettingsView = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage global application preferences and configurations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
                {/* Profile Settings */}
                <div className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
                  <div className="mt-1">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                       <FiUser className="text-xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">Admin Profile</h3>
                    <p className="text-gray-500 mt-1 text-sm">Update your administrator details, email address, and security credentials.</p>
                    <button className="mt-4 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-white text-gray-700 shadow-sm transition-all hover:border-primary-300">
                        Manage Profile
                    </button>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
                  <div className="mt-1">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                       <FiBell className="text-xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">Notification Preferences</h3>
                    <p className="text-gray-500 mt-1 text-sm">Configure how and when the system generates automated alerts for scheduled classes.</p>
                    <button className="mt-4 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-white text-gray-700 shadow-sm transition-all hover:border-primary-300">
                        Configure Alerts
                    </button>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
                  <div className="mt-1">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                       <FiShield className="text-xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">Security & Access Control</h3>
                    <p className="text-gray-500 mt-1 text-sm">Manage robust token authentication policies and user role permissions securely.</p>
                    <button className="mt-4 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-white text-gray-700 shadow-sm transition-all hover:border-primary-300">
                        Security Tools
                    </button>
                  </div>
                </div>

                {/* Database Settings */}
                <div className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
                  <div className="mt-1">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                       <FiDatabase className="text-xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">System Data Management</h3>
                    <p className="text-gray-500 mt-1 text-sm">Safely purge old timetable records, clear notification logs, and manage the MongoDB instance.</p>
                    <button className="mt-4 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-white text-gray-700 shadow-sm transition-all hover:border-primary-300 text-red-600 hover:text-red-700">
                        Advanced Data Options
                    </button>
                  </div>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsView;
