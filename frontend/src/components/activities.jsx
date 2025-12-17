import axios from "axios";
import { useEffect, useState } from "react";

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
            setNewActivity(prev => !prev);
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

const Activities = () => {
    const [tasks, setTasks] = useState([]);
    const [newActivity, setNewActivity] = useState(false);

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

    const handleDelete = async (id) => {
        try{
            console.log("Deleting activity with id:", id);
            const response = await axios.delete(`http://localhost:3000/api/activities/${id}`, { withCredentials: true });
            setNewActivity(prev => !prev);
        } catch (error) {
            console.error("Error deleting activity:", error);
        }
    };

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
                                <span className="ml-4 text-sm text-gray-400" onClick={()=>handleDelete(task._id)}>X</span>
                            </li>
                        ))}
                </ul>
            )}
            <AddActivity setNewActivity={setNewActivity} />
        </div>
    );
}

export default Activities;
