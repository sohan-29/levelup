import { useState } from "react";
import Header from "../components/header";

const SignupForm = () => {
    const [view, setview] = useState("🤫");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const viewPassword = (id) => {
        const passwordInput = document.getElementById(id);
        if (view === "🤫") {
            passwordInput.value = "·".repeat(passwordInput.value.length);
            setview("🫣");
        } else {
            passwordInput.value = password;
            setview("🤫")
        };
    }
    const submitData = (e) => {
        e.preventDefault();
        console.log({ email, password });
    }
    return (
        <form className="flex flex-col md:w-lg lg:w-xl gap-4 bg-gray-700 p-8 rounded-lg shadow-lg" onSubmit={submitData}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label className="text-white text-lg font-medium w-1/4" htmlFor="mail">Mail:</label>
                <input className="p-2 rounded-md text-white bg-gray-600 sm:w-sm md:w-xs lg:w-sm" type="email" id="mail" name="mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label className="text-white text-lg font-medium w-1/4" htmlFor="password">Password:</label>
                <input className="p-2 rounded-md text-white bg-gray-600 sm:w-sm md:w-xs lg:w-sm" type="text" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <span className="absolute top-8.5 right-2 sm:top-2 sm:right-3 cursor-pointer" onClick={() => viewPassword("password")}>{view}</span>
            </div>
            <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label className="text-white text-lg font-medium w-1/4" htmlFor="password">Confirm Password:</label>
                <input className="p-2 rounded-md text-white bg-gray-600 sm:w-sm md:w-xs lg:w-sm" type="text" id="confirmPassword" name="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <span className="absolute top-8.5 right-2 sm:top-4 sm:right-3 cursor-pointer" onClick={() => viewPassword("confirmPassword")}>{view}</span>
                {password != confirmPassword && <span className="text-red-600 absolute top-14 text-center w-full">password not matched !</span>}
            </div>
            <button className={`bg-[#fee369] text-gray-800 font-bold py-2 px-4 rounded-md mt-5 ${password != confirmPassword ? "cursor-not-allowed" : "hover:bg-amber-300"}`} type="submit">Signup</button>
            <p className="px-6 text-sm text-center dark:text-white">already have an account?
                <a rel="noopener noreferrer" href="/login" className="hover:underline dark:text-amber-200"> Login</a>.
            </p>
        </form>
    )
}

const SignupPage = () => {
    return (
        <div className="relative flex flex-col items-center min-w-screen min-h-screen bg-gray-800">
            <Header />
            <div className="flex flex-col justify-center items-center mt-20">
                <h1 className="text-4xl md:text-5xl text-amber-200 mt-20 mb-6">Signup</h1>
                <SignupForm />
            </div>
        </div>
    );
};
export default SignupPage;