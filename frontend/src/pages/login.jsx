import Header from "../components/header";

const LoginForm = () => {
    return (
        <form className="flex flex-col md:w-lg lg:w-xl gap-4 bg-gray-700 p-8 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <label className="text-white text-lg font-medium" for="mail">Mail:</label>
            <input className="p-2 rounded-md text-white bg-gray-600 sm:w-sm md:w-xs lg:w-sm" type="email" id="mail" name="mail" required />
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <label className="text-white text-lg font-medium" for="password">Password:</label>
            <input className="p-2 rounded-md text-white bg-gray-600 sm:w-sm md:w-xs lg:w-sm" type="password" id="password" name="password" required />
            </div>
            <button className="bg-amber-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-amber-300 mt-4" type="submit">Login</button>
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