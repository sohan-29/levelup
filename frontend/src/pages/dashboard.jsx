import { useContext } from "react";
import { AuthContext } from "../App";
import Header from "../components/header";

const Dashboard = () => {
    const { authenticated, setAuthenticated } = useContext(AuthContext);
    return (
         <div>
            <Header />
            {
                console.log("Authenticated User:", authenticated)
            }
            <h1 className="text-white text-3xl mt-20">Welcome to the Dashboard</h1>
        </div>
    )
};
export default Dashboard;
