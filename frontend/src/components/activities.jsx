import axios from "axios";
import { useEffect, useState } from "react";

const Activities = ({newActivity, setNewActivity}) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/activities");
                setTasks(response.data);
                setNewActivity(false);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        }
        fetchActivities();
    }, [newActivity]);

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

const AddActivity = ({setNewActivity}) => {
    const [title, setTitle] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/api/activities/activity", { 
                "title":title,
                "createdDate": new Date().toISOString()
            }, { withCredentials: true });
            setTitle("");
            setNewActivity(true);
        } catch (error) {
            console.error("Error adding activity:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New activity"
                className="border p-2 mr-2"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Add Activity
            </button>
        </form>
    );
}
Activities.AddActivity = AddActivity;

export default Activities;
