import React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import Header from "../components/header";
import axios from "axios";
import Loader from "../components/loader";
import Activities from "../components/activities";
import GridChart from "../components/gridChart";
import Graph from "../components/graph";
import Footer from "../components/footer";
const api = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [newActivity, setNewActivity] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${api}/users/profile`, { withCredentials: true });
                setUser(res.data);
                console.log(res.data._id)
            } catch (err) {
                setAuthenticated(false);
                localStorage.removeItem('authToken');
                delete axios.defaults.headers.common['Authorization'];
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`${api}/activities/`, { withCredentials: true });
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        }
        if (authenticated) {
            fetchProfile();
            fetchActivities();
        }
        else {
            setLoading(false);
        }
    }, [authenticated]);

    // Separate effect for refreshing activities when newActivity changes
    useEffect(() => {
        if (authenticated && newActivity > 0) {
            const fetchActivities = async () => {
                try {
                    const response = await axios.get(`${api}/activities/`, { withCredentials: true });
                    setTasks(response.data);
                } catch (error) {
                    console.error("Error fetching activities:", error);
                }
            };
            fetchActivities();
        }
    }, [newActivity, authenticated]);

    if (loading) return <div className="min-w-screen"><Loader /></div>

    return (
        <div className="relative min-h-screen min-w-screen bg-[#242424]">
            <Header />
            <h1 className="w-full text-center text-amber-200 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mt-6">
                Build your future by making history !!
            </h1>
            {user && (
                <div className="mt-6 text-white mx-auto sm:px-3 md:mx-auto lg:mx-0 w-sm sm:w-lg md:w-2xl lg:w-5xl xl:w-screen">
                    <h2 className="text-center text-xl sm:text-2xl mb-4">Welcome, {user.username}!</h2>
                    <div className="sm:hidden flex flex-col gap-2 w-full md:gap-6 my-6 px-3 md:px-4 lg:px-11">
                        <div className="flex flex-row gap-6 sm:gap-10 overflow-x-auto">
                            <Activities setNewActivity={setNewActivity} tasks={tasks} setTasks={setTasks} />
                            <GridChart tasks={tasks} setNewActivity={setNewActivity} setTasks={setTasks} />
                        </div>
                        <Graph tasks={tasks} />
                    </div>
                    <div className="hidden sm:flex flex-row gap-2 w-full md:gap-6 my-6 px-3 md:px-4 lg:px-11">
                        <Activities setNewActivity={setNewActivity} tasks={tasks} setTasks={setTasks} />
                        <div className="flex flex-col gap-6 sm:gap-10 overflow-x-auto">
                            <GridChart tasks={tasks} setNewActivity={setNewActivity} setTasks={setTasks} />
                            <Graph tasks={tasks} />
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
};
export default Dashboard;
