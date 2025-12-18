import React from "react";
import { Suspense, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import Header from "../components/header";
import axios from "axios";
import Loader from "../components/loader";
import Activities from "../components/activities";

const Dashboard = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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
        if (authenticated) fetchProfile();
        else {
            setLoading(false);
        }
    }, [authenticated]);

    if (loading) return <div className="min-w-screen"><Loader /></div>
    const GridChart = React.lazy(() => import('../components/gridChart'));

    return (
        <div className="min-h-screen min-w-screen bg-[#242424]">
            <Header />
            <h1 className="w-full text-center text-amber-200 bold text-lg sm:text-xl md:text-2xl lg:text-3xl mt-6">Build your future by making history !!</h1>
            {user && (
                <div className="mt-6 text-white">
                    <h2 className="text-center text-2xl mb-4">Welcome, {user.username}!</h2>
                    <Suspense fallback={<Loader />}>
                        <div className="flex text-center mb-6">
                            <div>
                            <Activities />
                            </div>
                            <GridChart />
                        </div>
                    </Suspense>
                </div>
            )}
        </div>
    )
};
export default Dashboard;
