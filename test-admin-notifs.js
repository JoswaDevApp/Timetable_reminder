const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const User = require('./models/User');

const run = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/timetable-system');
        
        // Let's get the admin user
        const adminUser = await User.findOne({ role: 'Admin' });
        console.log('Admin user found:', adminUser.name);

        let matchConditions = [
          { recipientRole: 'All' },
          { recipientUser: adminUser._id },
          { recipientRole: 'Admin' }
        ];

        const notifs = await Notification.find({ $or: matchConditions });
        console.log('Notifications Admin can see:', notifs.length);
        console.dir(notifs, { depth: null });
        
        const allNotifs = await Notification.find({});
        console.log('\nTotal Notifications in DB total:', allNotifs.length);

    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
