import { useState } from "react";
import Header from "../components/header";
import axios from "axios";

const SignupForm = () => {
    const [view, setview] = useState("🤫");
    const [confirmView, setConfirmView] = useState("🤫");
    const [passwordType, setPasswordType] = useState("password");
    const [confirmPasswordType, setConfirmPasswordType] = useState("password");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const viewPassword = (id) => {
        if (id === "password") {
            if (view === "🤫") {
                setPasswordType("text");
                setview("🫣");
            } else {
                setPasswordType("password");
                setview("🤫");
            }
        } else {
            if (confirmView === "🤫") {
                setConfirmPasswordType("text");
                setConfirmView("🫣");
            } else {
                setConfirmPasswordType("password");
                setConfirmView("🤫");
            }
        }
    }
    const submitData = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:3000/api/auth/signup', {
            username,
            email,
            password
        }).then((response) => {
            alert(response.data.message);
            sessionStorage.setItem("authToken", );
            window.location.href = "/login";
        }).catch((error) => {
            alert(error.response.data.error);
        });
    }
    return (
        <form className="flex flex-col md:w-lg lg:w-xl gap-4 bg-[#292929] p-8 rounded-lg shadow-lg" onSubmit={submitData}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label className="text-white text-lg font-medium w-1/4" htmlFor="mail">Username:</label>
                <input className="p-2 rounded-md text-white bg-[#333333] sm:w-sm md:w-xs lg:w-sm" type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label className="text-white text-lg font-medium w-1/4" htmlFor="mail">Mail:</label>
                <input className="p-2 rounded-md text-white bg-[#333333] sm:w-sm md:w-xs lg:w-sm" type="email" id="mail" name="mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label className="text-white text-lg font-medium w-1/4" htmlFor="password">Password:</label>
                <input className="p-2 rounded-md text-white bg-[#333333] sm:w-sm md:w-xs lg:w-sm" type={passwordType} id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <span className="absolute top-8 right-1.5 sm:top-1 sm:right-1.5 cursor-pointer text-2xl" onClick={() => viewPassword("password")}>{view}</span>
            </div>
            <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label className="text-white text-lg font-medium w-1/4" htmlFor="password">Confirm Password:</label>
                <input className="p-2 rounded-md text-white bg-[#333333] sm:w-sm md:w-xs lg:w-sm" type={confirmPasswordType} id="confirmPassword" name="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <span className="absolute top-15 right-1.5 sm:top-3 sm:right-1.5 cursor-pointer text-2xl" onClick={() => viewPassword("confirmPassword")}>{confirmView}</span>
                {password != confirmPassword && <span className="text-red-600 absolute top-25 sm:top-14 text-center w-full">password not matched !</span>}
            </div>
            <button className={`bg-[#fee369] text-[#333333] font-bold py-2 px-4 rounded-md mt-5 ${password != confirmPassword ? "cursor-not-allowed" : "hover:bg-amber-300"}`} type="submit">Signup</button>
            <p className="px-6 text-sm text-center dark:text-white">already have an account?
                <a rel="noopener noreferrer" href="/login" className="hover:underline dark:text-amber-200"> Login</a>.
            </p>
        </form>
    )
}

const SignupPage = () => {
    return (
        <div className="relative flex flex-col items-center min-w-screen min-h-screen bg-[#242424] text-white">
            <Header />
            <div className="flex flex-col justify-center items-center mt-20">
                <h1 className="text-4xl md:text-5xl text-amber-200 mt-20 mb-6">Signup</h1>
                <SignupForm />
            </div>
        </div>
    );
};
export default SignupPage;