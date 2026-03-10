const mongoose = require('mongoose');
const { triggerReminders } = require('./controllers/adminController');
const DayOrder = require('./models/DayOrder');
const Notification = require('./models/Notification');

const run = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/timetable-system');
        console.log('Connected to DB');

        // Mock req, res
        const req = {};
        const res = {
            status: function(code) {
                console.log('Status set to', code);
                return this;
            },
            json: function(data) {
                console.log('Response JSON:', data);
            }
        };

        // Create a fake day order if missing just for test
        const today = new Date();
        today.setHours(0,0,0,0);
        let d = await DayOrder.findOne({ date: today });
        if (!d) {
           d = await DayOrder.create({ date: today, currentDayOrder: 1, isOverride: false });
        }

        console.log('Triggering daily reminder...');
        await triggerReminders(req, res);

        const notifs = await Notification.find();
        console.log('Total notifs after trigger:', notifs.length);
        
    } catch(e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
