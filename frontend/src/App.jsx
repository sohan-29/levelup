import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import LoginPage from './pages/login'
import SignupPage from './pages/signup'
import { Toaster } from 'react-hot-toast'
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Dashboard from './pages/dashboard'

// Firebase imports
import { messaging } from './firebase'
import { getToken, onMessage } from 'firebase/messaging'

const api = import.meta.env.VITE_API_URL;

export const AuthContext = createContext(null);

const NotificationPermissionBanner = ({ permission }) => {
  if (permission !== 'denied') return null;

  return (
    <div className="bg-red-600 text-white p-4 text-center">
      <p className="mb-2">
        Notifications are blocked. To receive notifications, please reset notification permissions in your browser settings.
      </p>
      <p className="text-sm">
        Go to browser settings → Site permissions → Notifications → Allow for this site.
      </p>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { authenticated } = useContext(AuthContext);
  return authenticated ? children : <Navigate to="/login" />;
};

const AuthRedirect = ({ children }) => {
  const { authenticated } = useContext(AuthContext);
  return authenticated ? <Navigate to="/dashboard" /> : children;
};

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState('default');

  const handleSetAuthenticated = (value) => {
    setAuthenticated(value);
    localStorage.setItem('authenticated', value);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const localToken = localStorage.getItem('authToken');
        if (localToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${localToken}`;
        }
        const response = await axios.get(`${api}/auth/verify`, { withCredentials: true });
        if (response.data && response.data.authenticated) {
          handleSetAuthenticated(true);
        } else {
          handleSetAuthenticated(false);
        }
      } catch (error) {
        handleSetAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 🔹 Setup Firebase Push Notifications
  useEffect(() => {
    let messagingUnsubscribe = null;

    const setupNotifications = async () => {
      try {
        console.log('Setting up notifications...');

        // Register service worker first
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered successfully:', registration);

          // Pass Firebase config to service worker
          const firebaseConfig = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID,
          };

          // Send config to service worker
          if (registration.active) {
            registration.active.postMessage({
              type: 'FIREBASE_CONFIG',
              config: firebaseConfig
            });
          }
        }

        // Check current permission status
        let permission = Notification.permission;
        console.log('Current notification permission:', permission);

        // Only request permission if not already granted
        if (permission !== 'granted') {
          permission = await Notification.requestPermission();
          console.log('Notification permission after request:', permission);
        }

        setNotificationPermission(permission);

        if (permission === "granted") {
          // Wait for service worker to be ready
          const serviceWorkerRegistration = await navigator.serviceWorker.ready;
          console.log('Service worker ready:', serviceWorkerRegistration);

          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: serviceWorkerRegistration
          });

          if (token) {
            console.log("FCM Token obtained:", token);
            // Send token to backend to store for this user
            if (authenticated) {
              console.log('Registering token with backend...');
              const response = await axios.post(`${api}/notifications/register`, { token }, { withCredentials: true });
              console.log('Token registration response:', response.data);
            } else {
              console.log('User not authenticated, skipping token registration');
            }
          } else {
            console.log('No registration token available. Check Firebase configuration.');
          }
        } else {
          console.log('Notification permission denied.');
        }
      } catch (err) {
        console.error("Notification setup error:", err);
      }
    };

    // Listen for foreground messages
    messagingUnsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      // Show browser notification for foreground messages
      if (Notification.permission === "granted") {
        const notification = new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/vite.svg",
          badge: "/vite.svg",
          tag: payload.data?.tag || "default",
          requireInteraction: true,
          silent: false,
        });

        // Handle click on foreground notification
        notification.onclick = () => {
          notification.close();
          window.focus();
        };
      } else {
        // Fallback to alert if permission not granted
        alert(`${payload.notification.title}: ${payload.notification.body}`);
      }
    });

    // Only setup notifications if we haven't already
    if (!('notificationSetup' in window)) {
      window.notificationSetup = true;
      setupNotifications();
    }

    // Cleanup
    return () => {
      if (messagingUnsubscribe) {
        messagingUnsubscribe();
      }
    };
  }, []); // Remove authenticated dependency

  // Separate effect for token registration when user becomes authenticated
  useEffect(() => {
    const registerToken = async () => {
      if (!authenticated) return;

      try {
        console.log('User authenticated, checking for existing token...');
        const serviceWorkerRegistration = await navigator.serviceWorker.ready;
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: serviceWorkerRegistration
        });

        if (token) {
          console.log('Registering token for authenticated user...');
          const response = await axios.post(`${api}/notifications/register`, { token }, { withCredentials: true });
          console.log('Token registration response:', response.data);
        }
      } catch (err) {
        console.error("Token registration error:", err);
      }
    };

    registerToken();
  }, [authenticated]);

  const logout = async () => {
    try {
      // Unregister FCM token before logout
      await axios.post(`${api}/notifications/unregister`, {}, { withCredentials: true });
      await axios.post(`${api}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthenticated(false);
      localStorage.removeItem('authenticated');
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated: handleSetAuthenticated, logout, notificationPermission }}>
      <NotificationPermissionBanner permission={notificationPermission} />
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={authenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
          <Route path="/signup" element={<AuthRedirect><SignupPage /></AuthRedirect>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
