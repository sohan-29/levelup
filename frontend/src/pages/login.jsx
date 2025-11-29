import Header from "../components/header";

const LoginPage = () => {
    return (
        <div className="relative flex flex-col items-center min-w-screen min-h-screen bg-gray-800">
            <Header />
            <div>
                <h1 className="text-4xl text-amber-200 font-bold mt-20 mb-6">Login</h1>
            </div>
        </div>
    );
};
export default LoginPage;