const cron = require('node-cron');
const admin = require('firebase-admin');
const Activities = require('./models/Activities');
const User = require('./models/User');

class NotificationScheduler {
  constructor() {
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('Notification scheduler is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting notification scheduler...');

    // Schedule to run daily at 8 PM (20:00)
    cron.schedule('0 20 * * *', async () => {
      console.log('Running daily streak reminder check...');
      await this.sendStreakReminders();
    }, {
      timezone: "UTC" // You can change this to your preferred timezone
    });

    console.log('Notification scheduler started - will run daily at 8 PM UTC');
  }

  async sendStreakReminders() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      console.log('Checking for activities at risk of breaking streaks...');

      // Find activities that:
      // 1. Have a streak > 0
      // 2. Were not completed yesterday (to avoid breaking streak)
      // 3. Were not completed today
      const atRiskActivities = await Activities.find({
        streak: { $gt: 0 },
        $or: [
          // Activities that were completed yesterday but not today
          {
            'dailyStatus.date': yesterday,
            'dailyStatus.completed': true,
            'dailyStatus.date': { $ne: today },
            'dailyStatus.completed': { $ne: true }
          },
          // Activities that have never been completed today
          {
            'dailyStatus.date': { $ne: today }
          }
        ]
      }).populate('createdBy');

      console.log(`Found ${atRiskActivities.length} activities at risk of breaking streaks`);

      // Group activities by user
      const userNotifications = {};

      atRiskActivities.forEach(activity => {
        const userId = activity.createdBy._id.toString();

        if (!userNotifications[userId]) {
          userNotifications[userId] = {
            user: activity.createdBy,
            activities: []
          };
        }

        // Check if this activity was completed yesterday but not today
        const completedYesterday = activity.dailyStatus.some(
          status => new Date(status.date).toDateString() === yesterday.toDateString() && status.completed
        );

        const completedToday = activity.dailyStatus.some(
          status => new Date(status.date).toDateString() === today.toDateString() && status.completed
        );

        if (completedYesterday && !completedToday) {
          userNotifications[userId].activities.push(activity);
        }
      });

      // Send notifications to users
      for (const [userId, data] of Object.entries(userNotifications)) {
        if (data.activities.length > 0) {
          await this.sendStreakReminderNotification(data.user, data.activities);
        }
      }

      console.log('Streak reminder check completed');

    } catch (error) {
      console.error('Error in sendStreakReminders:', error);
    }
  }

  async sendStreakReminderNotification(user, activities) {
    try {
      if (!user.fcmToken) {
        console.log(`User ${user._id} has no FCM token, skipping notification`);
        return;
      }

      const activityTitles = activities.map(activity => activity.title).join(', ');
      const streakCount = activities[0].streak; // Assuming all activities have the same streak for simplicity

      const message = {
        notification: {
          title: '🔥 Streak Alert!',
          body: `Don't break your ${streakCount}-day streak! Complete: ${activityTitles}`,
        },
        data: {
          type: 'streak_reminder',
          activities: JSON.stringify(activities.map(a => ({ id: a._id, title: a.title, streak: a.streak })))
        },
        token: user.fcmToken,
      };

      const response = await admin.messaging().send(message);
      console.log(`Streak reminder sent to user ${user._id}:`, response);

    } catch (error) {
      console.error(`Error sending streak reminder to user ${user._id}:`, error);
    }
  }

  // Method to manually trigger streak reminders for testing
  async triggerStreakReminders() {
    console.log('Manually triggering streak reminders...');
    await this.sendStreakReminders();
  }
}

module.exports = new NotificationScheduler();
