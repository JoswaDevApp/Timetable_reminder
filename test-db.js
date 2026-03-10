const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const User = require('./models/User');

const run = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/timetable-system');
        console.log('Connected to DB');

        const allNotifs = await Notification.find({});
        console.log('Total Notifications in DB:', allNotifs.length);
        console.dir(allNotifs, { depth: null });

        const users = await User.find({});
        console.log('\nUsers in DB:', users.length);
        users.forEach(u => {
            console.log(`- ${u.name} | Role: ${u.role} | Dept: ${u.department} | Year: ${u.year} | ID: ${u._id}`);
        });

    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

run();
