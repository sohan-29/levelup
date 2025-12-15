import { useContext, useState } from "react";
import Header from "../components/header";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../App";

const LoginForm = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    const [view, setview] = useState("🤫");
    const [passwordType, setPasswordType] = useState("password");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const viewPassword = () => {
        if (view === "🤫") {
            setPasswordType("text");
            setview("🫣");
        } else {
            setPasswordType("password");
            setview("🤫");
        }
    }
    const submitData = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email: email.trim(),
                password
            }, { withCredentials: true });
            if (response.data && response.data.token) {
                const token = response.data.token;
                localStorage.setItem('authToken', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthenticated(true);
                toast.success("Successfully logged in!");
            } else if (response.data === "successfully logged in!") {
                setAuthenticated(true);
                toast.success("Successfully logged in!");
            }
        } catch (error) {
            const msg = error?.response?.data?.error || error?.message || 'Login failed';
            toast.error(msg);
            return;
        }
    }
    return (
        <form className="flex flex-col md:w-lg lg:w-xl gap-4 bg-[#292929] p-8 rounded-lg shadow-lg" onSubmit={submitData}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label className="text-white text-lg font-medium w-1/4" htmlFor="mail">Mail:</label>
                <input className="p-2 rounded-md text-white bg-[#333333] sm:w-sm md:w-xs lg:w-sm" type="email" id="mail" name="mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label className="text-white text-lg font-medium w-1/4" htmlFor="password">Password:</label>
                <input className="p-2 rounded-md text-white bg-[#333333] sm:w-sm md:w-xs lg:w-sm" type={passwordType} id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <span className="absolute top-8 right-1.5 sm:top-1 sm:right-1.5 cursor-pointer text-2xl" onClick={viewPassword}>{view}</span>
                <a rel="noopener noreferrer" href="#" className="hover:underline dark:text-amber-200 text-sm absolute top-18 sm:top-11 right-0">forgetpassword?</a>
            </div>
            <button
                className={`bg-[#fee369] text-gray-800 font-bold py-2 px-4 rounded-md mt-5 ${password && email ? "hover:bg-amber-300" : "opacity-60 cursor-not-allowed"}`}
                type="submit"
                disabled={!email || !password}
            >
                Login
            </button>
            <p className="px-6 text-sm text-center dark:text-white">Don't have an account yet?
                <a rel="noopener noreferrer" href="/signup" className="hover:underline dark:text-amber-200"> Sign up</a>.
            </p>
        </form>
    )
}

const LoginPage = () => {
    return (
        <div className="relative flex flex-col items-center min-w-screen min-h-screen bg-[#242424] text-white">
            <Header />
            <div className="flex flex-col justify-center items-center mt-20">
                <h1 className="text-4xl md:text-5xl text-amber-200 mt-20 mb-6">Login</h1>
                <LoginForm />
            </div>
        </div>
    );
};
export default LoginPage;