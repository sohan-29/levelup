import { useState } from "react";
import Header from "../components/header";

const LoginForm = () => {
    const [view, setview] = useState("🤫");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const viewPassword = () => {
        const passwordInput = document.getElementById("password");
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
                <label className="text-white text-lg font-medium" htmlFor="mail">Mail:</label>
                <input className="p-2 rounded-md text-white bg-gray-600 sm:w-sm md:w-xs lg:w-sm" type="email" id="mail" name="mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <label className="text-white text-lg font-medium" htmlFor="password">Password:</label>
                <input className="p-2 rounded-md text-white bg-gray-600 sm:w-sm md:w-xs lg:w-sm" type="text" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <span className="absolute top-8.5 right-2 sm:top-2 sm:right-3 cursor-pointer" onClick={viewPassword}>{view}</span>
            <a rel="noopener noreferrer" href="#" className="hover:underline dark:text-amber-200 text-sm absolute top-18 sm:top-11 right-0">forgetpassword?</a>
            </div>
            <button className="bg-amber-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-amber-300 mt-5" type="submit">Login</button>
            <p className="px-6 text-sm text-center dark:text-white">Don't have an account yet?
                <a rel="noopener noreferrer" href="/signup" className="hover:underline dark:text-amber-200"> Sign up</a>.
            </p>
        </form>
    )
}

const LoginPage = () => {
    return (
        <div className="relative flex flex-col items-center min-w-screen min-h-screen bg-gray-800">
            <Header />
            <div className="flex flex-col justify-center items-center mt-20">
                <h1 className="text-4xl md:text-5xl text-amber-200 mt-20 mb-6">Login</h1>
                <LoginForm />
            </div>
        </div>
    );
};
export default LoginPage;