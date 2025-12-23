import React from "react";
import { Suspense, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import Header from "../components/header";
import axios from "axios";
import Loader from "../components/loader";
import Activities from "../components/activities";
import Graph from "../components/graph";
import Footer from "../components/footer";

const Dashboard = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [newActivity, setNewActivity] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/users/profile', { withCredentials: true });
                setUser(res.data);
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
                const response = await axios.get("http://localhost:3000/api/activities/", { withCredentials: true });
                setTasks(response.data);
                setNewActivity(false);
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
    }, [authenticated, newActivity]);

    if (loading) return <div className="min-w-screen"><Loader /></div>
    const GridChart = React.lazy(() => import('../components/gridChart'));

    return (
        <div className="relative min-h-screen min-w-screen bg-[#242424]">
            <Header />
            <h1 className="w-full text-center text-amber-200 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mt-6">
                Build your future by making history !!
            </h1>
            {user && (
                <div className="mt-6 text-white">
                    <h2 className="text-center text-2xl mb-4">Welcome, {user.username}!</h2>
                    <Suspense fallback={<Loader />}>
                        <div className="flex flex-row gap-2 md:gap-6 my-6 px-3">
                            <Activities setNewActivity={setNewActivity} />
                            <div className="flex-1 flex flex-col gap-2">
                                <GridChart tasks={tasks} setNewActivity={setNewActivity} />
                                <Graph key={newActivity} tasks={tasks} />
                            </div>
                        </div>
                    </Suspense>
                </div>
            )}
            <Footer />
        </div>
    )
};
export default Dashboard;
