import { useContext } from "react";
import { AuthContext } from "../App";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Profile = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState("🥷");
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAuthenticated(false);
            localStorage.removeItem('authenticated');
            localStorage.removeItem('authToken');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/users/profile', { withCredentials: true });
                setUser(res.data);
                setProfile(res.data.username.charAt(0).toUpperCase());
            } catch (err) {
                setAuthenticated(false);
                localStorage.removeItem('authToken');
                delete axios.defaults.headers.common['Authorization'];
                navigate('/login');
            }
        };
        if (authenticated) fetchProfile();
    }, [authenticated]);
    return (
        user ? <div className="flex items-center justify-center gap-3 cursor-pointer" onClick={() => {
            if (authenticated) {
                logout();
                navigate('/login');
            };
        }}>
            <span className="flex items-center justify-center w-12 h-12 bg-white text-black text-xl font-semibold rounded-full">
                {profile}
            </span>

        </div> : null
    );
}
export default Profile;
