# LevelUp - Personal Habit Tracker & Productivity App

## Project Documentation
**College Lab Submission**  
**Project Title:** LevelUp - Full-Stack Habit Tracking & Productivity Application  
**Submitted by:** [Your Name]  
**Course:** [Course Name]  
**Semester:** [Semester]  
**Date:** [Current Date]  

---

## 1. Project Overview

**LevelUp** (`the history of comeback!!`) is a comprehensive full-stack web application designed for personal habit tracking, daily productivity management, and progress visualization. 

**Tagline:** \"Build your future by making history !!\"

The application helps users build consistent habits through:
- **Streak Tracking** with visual calendars and analytics
- **Daily Activity Logging** with optimistic UI updates
- **Date-specific Journaling** (today-only editing)
- **Smart Push Notifications** for streak protection

### Key Features (Live Demo):
**Base URL:** `https://levelup-7vvn.onrender.com/api/`
- ✅ Secure JWT Authentication (signup/login/verify)
- ✅ CRUD for Activities (habits) with streak calculation
- ✅ Daily Notes with 500-char limit
- ✅ ApexCharts + Grid visualizations
- ✅ Firebase push notifications (8 PM daily streak alerts)
- ✅ Real-time optimistic updates
- ✅ Responsive Tailwind UI

**Screenshot Reference:** Dashboard shows Activities list, GridChart calendar, Graph analytics


---

## 2. Technology Stack

### Backend (package.json dependencies)
```
"express": "^5.1.0",
"mongoose": "^9.0.0",
"firebase-admin": "^13.6.0",
"jsonwebtoken": "^9.0.2",
"bcryptjs": "^3.0.3",
"node-cron": "^4.2.1",
"mongodb": "^7.0.0",
"cors": "^2.8.5",
"cookie-parser": "^1.4.7",
"dotenv": "^17.2.3"
```

### Frontend (package.json dependencies)
```
"react": "^19.2.0", "react-dom": "^19.2.0",
"react-apexcharts": "^1.9.0", "apexcharts": "^5.3.6",
"firebase": "^12.7.0",
"react-router-dom": "^7.9.6",
"react-hot-toast": "^2.6.0",
"tailwind-scrollbar": "^4.0.2"
```
**Build Tool:** Vite v7.2.4 + TailwindCSS v4.1.17

### Database Collections
- **Users**, **Activities**, **Notes** (MongoDB Atlas)


### Deployment
```
Frontend: Vite Build
Backend: Render.com
Database: MongoDB Atlas
Firebase: Cloud Messaging
```

---

## 3. System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend│◄──►│   Express API    │◄──►│   MongoDB       │
│   (Vite/Tailwind)│    │   (JWT Auth)     │    │   (Atlas)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                         ┌─────────────────┐
                         │   Firebase      │
                         │ (Notifications) │
                         └─────────────────┘
```

---

## 4. Database Schemas

### Actual Schemas (from models/*.js)

**User.js** (bcrypt pre-save hook):
```javascript
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});
```

**Activities.js**:
```javascript
const activitiesSchema = new Schema({
    title: { type: String, required: true },
    createdDate: { type: Date, required: true },
    streak: { type: Number, default: 0 },
    dailyStatus: [{ 
        date: { type: Date, required: true },
        completed: { type: Boolean, default: false }
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
```

**Note.js** (unique index):
```javascript
const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  text: { type: String, required: true, maxlength: 500 }
}, { timestamps: true });
noteSchema.index({ user: 1, date: 1 }, { unique: true });
```


---

## 5. API Endpoints

### Base URL: `https://levelup-7vvn.onrender.com/api/`

### Sample API Code (from routes/*.js)

**auth.js - Signup (POST /auth/signup)**:
```javascript
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send('Username or email already exists');
        }
    }
});
```
**Login returns JWT + cookie** (`expiresIn: '1d'`)

**activities.js - Create (POST /activities/activity)**:
```javascript
router.post('/activity', authMiddleware, async (req, res) => {
    // Validates title, createdDate
    const activity = new Activities({
        title: title.trim(),
        createdDate: parsedDate,
        createdBy: req.user.id
    });
    await activity.save();
});
```
**Full CRUD with authMiddleware**

**notes.js - Today-only PUT /notes/:date**:
```javascript
if (date.getTime() !== today.getTime()) {
    return res.status(403).json({ error: 'Notes can only be created or updated for today' });
}
```
*Upsert with 500-char validation*


---

## 6. Frontend Code Samples

**Dashboard.jsx** (Main page - React 19 + Context):
```javascript
const Dashboard = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);  // Activities state
    // Fetches profile + activities on mount
    // Passes setTasks to children for optimistic updates
    
    return (
        <div className="min-h-screen bg-[#242424]">
            <Header />
            <h1 className="text-amber-200 font-bold text-3xl">
                Build your future by making history !!
            </h1>
            <Activities tasks={tasks} setTasks={setTasks} />
            <GridChart tasks={tasks} setTasks={setTasks} />
            <Graph tasks={tasks} />
            <Footer />
        </div>
    );
};
```
**Responsive layout** (sm:hidden flex-col, lg:flex-row)

### Key Components (15+):
- **Layout**: Header/Footer/Logo
- **Core**: Activities (CRUD), GridChart (calendar toggle), Graph (ApexCharts)
- **UI**: NoteViewer, Profile, Loader, react-hot-toast


---

## 7. Key Implementation Highlights

### 1. Optimistic UI Updates
- Immediate UI feedback for check/uncheck/delete operations
- Automatic rollback on API failures
- Eliminates perceived latency

### 2. Streak Calculation Algorithm
```javascript
// Calculates consecutive completed days from dailyStatus array
function calculateStreak(dailyStatus, createdDate) {
  // Logic to count consecutive true values from today backwards
}
```

### 3. Firebase Push Notifications

**notificationScheduler.js** (runs 8 PM UTC daily):
```javascript
cron.schedule('0 20 * * *', async () => {
    // Finds activities with streak > 0 not completed yesterday/today
    const atRiskActivities = await Activities.find({
        streak: { $gt: 0 },
        // Complex $or query for streak breakers
    }).populate('createdBy');
    
    // Sends FCM: "🔥 Streak Alert! Don't break your X-day streak!"
    await admin.messaging().send(message);
});
```

### 4. Optimistic Updates (from README_OPTIMISTIC_UPDATES.md)
**GridChart.jsx handleBoxClick**:
```javascript
// Optimistic: Update local state FIRST
setTasks(prev => prev.map(t => t._id === task._id ? updatedTask : t));

// THEN API call with rollback
try {
    await axios.put(...);
} catch {
    // Revert on error
    setTasks(prev => prev.map(t => t._id === task._id ? task : t));
}
```

**Visualizations**: ApexCharts + Custom GridChart (Tailwind responsive)


---

## 8. Setup & Installation

### Backend
```bash
cd backend
npm install
# Copy serviceAccountKey.json from Firebase
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
```
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

---

## 9. Testing the Application

1. **Signup**: `POST /api/auth/signup`
2. **Login**: `POST /api/auth/login` → Get JWT token
3. **Create Activity**: `POST /api/activities/activity`
4. **View Dashboard**: Check streaks, charts, notes
5. **Toggle Activities**: Test optimistic updates
6. **Add Daily Note**: Limited to current day only

---

## 10. Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| Slow UI feedback | Implemented optimistic updates with rollback |
| State synchronization | Unified state management across components |
| Streak calculation | Custom algorithm with date normalization |
| Push notifications | Firebase + node-cron scheduler |
| Responsive charts | ApexCharts with Tailwind integration |

---

## 11. Future Enhancements

- [ ] Mobile App (React Native)
- [ ] Social Sharing ( streaks/achievements)
- [ ] AI Goal Suggestions
- [ ] Team/Challenge Mode
- [ ] PWA Installation
- [ ] Advanced Analytics Export

---

## 12. Conclusion

**LevelUp** successfully demonstrates full-stack development skills including:
- RESTful API design with authentication
- Real-time state management in React
- Database design with relationships
- Data visualization and UX optimization
- Push notification infrastructure
- Responsive modern UI/UX

The project showcases production-ready code with error handling, validation, security best practices (JWT, bcrypt), and smooth user experience through optimistic updates.

**Total Lines of Code**: ~5000+  
**API Endpoints**: 15+  
**React Components**: 15+  
**Database Collections**: 3

---

**GitHub Repository**: [Include repo link]  
**Deployed Application**: https://levelup-7vvn.onrender.com  
**API Documentation**: backend/apis.md

**Thank you for reviewing this project!** 🚀

