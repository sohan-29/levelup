import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import Header from "../components/header";
import axios from "axios";

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
                // if unauthorized, clear auth and redirect to login
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

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <Header />
            <h1 className="text-white text-3xl mt-20">Welcome to the Dashboard</h1>
            {user && (
                <div className="mt-6 text-white">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            )}
        </div>
    )
};
export default Dashboard;
