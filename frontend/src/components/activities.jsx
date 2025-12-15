import axios from "axios";
import { useEffect, useState } from "react";

const Activities = () => {
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/activities");
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        }
        fetchActivities();
    }, []);
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Your Daily Activities</h1>
            {tasks.length == 0 ? (
                <div>
                <p className="text-2xl text-yellow-200">No activities found.</p>
                </div>
            ) : (
                <ul>
                    {Array.isArray(tasks) &&
                        tasks.map((task,index) => (
                            <li key={index} className="mb-2 p-4 border rounded">
                                {task.title}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}

export default Activities;
