import React from "react";
import { Suspense, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import Header from "../components/header";
import axios from "axios";
import Loader from "../components/loader";
import Activities from "../components/activities";
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
    const Graph = React.lazy(() => import('../components/graph'));

    return (
        <div className="relative min-h-screen min-w-screen bg-[#242424]">
            <Header />
            <h1 className="w-full text-center text-amber-200 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mt-6">
                Build your future by making history !!
            </h1>
            {user && (
                <div className="mt-6 text-white mx-auto sm:px-3 md:mx-auto lg:mx-0 w-sm sm:w-lg md:w-2xl lg:w-5xl xl:w-screen">
                    <h2 className="text-center text-xl sm:text-2xl mb-4">Welcome, {user.username}!</h2>
                    <Suspense fallback={<Loader />}>
                        <div className="flex flex-col gap-2 w-full md:gap-6 my-6 px-3 md:px-4 lg:px-11">
                            <div className="flex flex-row gap-6 sm:gap-10 overflow-x-auto">
                                <Activities setNewActivity={setNewActivity} />
                                <GridChart tasks={tasks} setNewActivity={setNewActivity} />
                            </div>
                            <Graph key={newActivity} tasks={tasks} />
                        </div>
                    </Suspense>
                </div>
            )}
            <Footer />
        </div>
    )
};
export default Dashboard;
