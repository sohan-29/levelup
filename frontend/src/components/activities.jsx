import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Popup = ({ message, del, cancel }) => {
    const popup = useRef();
    useEffect(() => {
        const handlePopupClose = (e) => {
            if (popup.current && !popup.current.contains(e.target)) {
                cancel();
            }
        }
        document.addEventListener("mousedown", handlePopupClose)
        return () => {
            document.removeEventListener("mousedown", handlePopupClose)
        }
    }, [cancel])
    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div ref={popup} className="relative bg-white p-6 rounded shadow-md text-center mb-4 text-black font-mono">
                <svg className="w-4 h-4 absolute right-4 top-3.5 cursor-pointer" onClick={cancel} fill="#000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 465.519 465.519" xml:space="preserve" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M455.175,69.675c-23.979-19.573-46.104-40.883-68.771-61.703c-6.159-5.657-13.67-5.527-19.474-2.432 c-5.062,2.702-10.496,10.59-14.335,14.866c-33.85,37.62-68.659,74.362-107.531,107.6c-4.362,3.732-11.058,3.225-14.815-1.117 c-32.847-37.942-61.629-78.543-89.593-119.649c-3.776-5.548-9.456-7.571-14.97-7.196c-5.735,0.388-11.56,3.633-13.604,4.565 c-1.19,0.536-2.356,1.222-3.488,2.08C84.231,25.146,58.861,42.376,33.418,59.55c-0.381,0.254-0.729,0.53-1.056,0.808 c-0.562,0.477-5.553,2.968-8.501,7.896c-3.194,5.337-3.48,12.22,1.933,18.093c41.588,45.092,80.755,92,122.176,137.217 c3.88,4.232,3.438,10.593-0.924,14.325c-47.642,40.775-86.709,89.402-137.9,126.832c-3.006,2.199-4.738,4.697-5.461,7.257 c-1.386,4.921,1.265,11.542,2.773,14.213c0.82,1.458,1.995,2.874,3.582,4.215c23.583,19.972,45.286,41.645,67.524,62.83 c6.053,5.769,13.574,5.758,19.438,2.752c5.106-2.62,10.679-10.404,14.602-14.599c34.599-37.064,70.134-73.23,109.674-105.83 c4.43-3.656,11.1-3.032,14.782,1.386c32.093,38.481,60.057,79.552,87.209,121.109c3.666,5.606,9.308,7.724,14.832,7.439 c5.738-0.294,11.619-3.442,13.69-4.337c1.193-0.522,2.377-1.183,3.524-2.021c24.725-18.058,50.435-34.855,76.215-51.607 c0.381-0.254,0.736-0.518,1.077-0.792c0.563-0.468,5.591-2.874,8.638-7.739c3.306-5.281,3.732-12.167-1.574-18.134 c-41.132-46.27-79.755-94.354-120.76-140.71c-3.809-4.302-3.347-10.771,0.965-14.566c47.438-41.792,85.787-91.612,136.699-130.242 c2.966-2.25,4.651-4.778,5.316-7.346c1.29-4.94-1.498-11.514-3.057-14.165C457.988,72.395,456.79,70.996,455.175,69.675z M413.083,89.507c-46.936,40.398-84.594,89.073-133.281,127.988c-2.112,1.696-3.55,3.526-4.408,5.413 c-1.609,3.542-1.812,10.191-0.726,14.035c0.594,2.118,1.747,4.215,3.564,6.221c40.771,44.772,78.633,91.658,118.165,137.339 c3.763,4.342,2.925,10.396-1.869,13.543c-14.355,9.436-28.619,18.981-42.675,28.782c-4.713,3.285-11.075,2.098-14.27-2.676 c-25.248-37.771-51.709-74.758-81.466-109.705c-3.723-4.372-8.557-12.558-13.299-15.797c-5.947-4.058-14.485-5.18-21.754,0.314 c-46.207,34.906-86.562,75.007-125.52,116.433c-3.936,4.189-10.461,4.353-14.607,0.381c-9.478-9.095-19.009-18.144-28.764-26.994 c-4.248-3.854-4.083-9.821,0.338-13.487c47.735-39.618,86.348-87.661,135.8-125.767c1.975-1.518,3.369-3.168,4.283-4.88 c1.706-3.184,2.163-9.579,0.982-13.302c-0.655-2.049-1.831-4.077-3.638-5.994c-41.657-44.095-80.438-90.348-120.866-135.369 c-3.839-4.273-3.115-10.336,1.627-13.576c14.16-9.666,28.224-19.438,42.071-29.467c4.654-3.369,11.04-2.298,14.32,2.417 c25.994,37.351,53.189,73.905,83.647,108.359c3.801,4.306,8.788,12.393,13.581,15.554c6.022,3.968,14.594,4.951,21.754-0.66 c45.503-35.66,85.051-76.424,123.176-118.484c3.859-4.253,10.385-4.545,14.604-0.646c9.658,8.945,19.383,17.837,29.311,26.525 C417.496,79.793,417.445,85.757,413.083,89.507z"></path> </g> </g> </g></svg>
                <p >Are you sure you want to delete <span className="text-red-600">{message}</span> !</p>
                <p className="text-gray-700 text-sm">you can't get back the data of {message} after deleting</p>
                <button onClick={del} className="w-full flex justify-center items-center mt-2 cursor-pointer">
                    Delete<svg fill="#a91721" className="w-5 h-5" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 470.713 470.714" xml:space="preserve" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M96.01,133.456c3.884,2.676,8.163,4.332,12.619,5.292c-5.324,99.039-15.803,202.436,20.416,296.978 c1.742,4.545,4.938,7.389,8.604,8.846c1.26,1.762,3.052,3.326,5.637,4.479c64.729,28.746,133.522,27.487,199.892,4.459 c8.674-3.012,11.314-11.243,9.735-18.256c12.604-95.928,24.562-194.694,14.67-291.43c7.83-1.725,15.147-5.027,20.586-11.075 c10.745-11.959,8.679-27.345,3.387-41.068c0.011-3.816-1.787-7.467-5.87-9.973c-1.62-1.254-3.544-2.127-5.596-2.59 c-29.727-12.703-61.367-19.342-93.734-22.427c0.569-2.892,0.32-6.058-1.081-9.308C275.168,24.077,255.044-3.4,226.105,0.345 c-27.863,3.603-41.365,30.793-47.007,55.726c-18.611,0.978-37.039,2.207-55.035,3.245c-0.125,0.005-0.236,0.048-0.36,0.058 c-0.854-0.109-1.722-0.163-2.61-0.058c-19.291,2.267-35.53,11.491-43.975,29.609c-1.123,2.407-1.678,4.948-1.737,7.439 c-0.749,2.455-0.8,5.278,0.239,8.444C79.532,116.676,85.656,126.312,96.01,133.456z M324.105,428.545 c-54.888,16.904-112.16,18.712-165.844-5.129c-0.815-0.36-1.623-0.579-2.422-0.802c-32.966-90.754-22.635-189.447-17.514-284.177 c65.534-4.644,131.547-5.657,196.814,2.567c0.771,0.812,1.655,1.518,2.646,2.138C347.57,237.831,336.404,334.526,324.105,428.545z M228.662,29.693c12.937-1.676,22.006,13.327,27.591,25.111c-15.449-0.536-30.97-0.447-46.445,0 C212.948,43.419,218.445,31.013,228.662,29.693z M110.845,92.726c-1.826,1.579,4.918-2.508,2.775-1.617 c1.498-0.625,3.075-1.046,4.639-1.478c-0.358,0.099,4.903-0.879,2.833-0.64c0.183-0.021,0.355-0.074,0.536-0.1 c0.785,0.074,1.567,0.152,2.43,0.1c77.348-4.481,167.339-15.376,240.798,15.658c0.233,0.69,0.533,1.356,0.746,2.059 c0.295,1.018,0.538,2.054,0.746,3.093c0.016,0.23,0.031,0.475,0.057,0.833c0.02,0.536-0.021,1.077-0.041,1.612 c-0.01,0.045-0.035,0.15-0.051,0.203c-0.314-0.053-2.468,1.498-1.59,1.331c-1.63,0.604-3.326,1.03-5.017,1.409 c-0.808,0.183-1.874,0.312-3.082,0.406c-1.574-1.141-3.529-1.993-6.038-2.336c-75.291-10.336-150.897-9.422-226.528-3.499 c-1.364,0.109-2.595,0.406-3.761,0.779c-7.373-0.104-12.075-3.682-15.157-11.263C106.564,96.885,108.057,95.138,110.845,92.726z"></path> <path d="M186.387,186.935c-0.178-19.128-29.853-19.144-29.681,0c0.437,47.81,5.949,95.075,11.873,142.453 c2.338,18.732,32.044,18.961,29.681,0C192.332,282.005,186.824,234.744,186.387,186.935z"></path> <path d="M248.712,183.967c-1.026-19.032-30.709-19.136-29.681,0c2.829,52.483,4.723,105.01,10.39,157.293 c2.039,18.819,31.738,19.017,29.681,0C253.434,288.977,251.536,236.45,248.712,183.967z"></path> <path d="M284.857,186.427c7.993,58.711,4.169,118.058,3.92,177.089c-0.081,19.139,29.595,19.134,29.681,0 c0.26-61.896,3.393-123.445-4.98-184.983C310.902,159.648,282.308,167.723,284.857,186.427z"></path> </g> </g> </g></svg>
                </button>
            </div>
        </div >
    );
};

const AddActivity = ({ setNewActivity, parentSetNewActivity }) => {
    const [title, setTitle] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/activities/activity", {
                "title": title,
                "createdDate": new Date().toISOString()
            }, { withCredentials: true });
            setTitle("");
            setNewActivity(prev => !prev);
            parentSetNewActivity(prev => !prev); // Trigger dashboard refresh
            toast.success(response.data.message)
        } catch (error) {
            toast.error("something went wrong while adding acitvity")
            console.error("Error adding activity:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex justify-center mt-3 items-center mb-4 w-full">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New activity"
                className="border rounded-sm p-2 h-9 mr-2"
            />
            <button type="submit" className={" h-6 w-6 " + (title != "" ? "cursor-pointer" : "cursor-not-allowed")}><svg className="w-6 h-6" fill={title != "" ? "#fff" : "#626262"} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 70 70" enable-background="new 0 0 70 70" xml:space="preserve" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M58.582,11.456c0.979,0,1.967,0.333,2.779,1.015c1.823,1.527,2.073,4.231,0.56,6.038l-30.5,36.383 c-0.833,0.993-3.233,3.652-3.233,3.652s-2.053-2.032-3.191-3.309L8.394,39.479c-1.703-1.63-1.753-4.344-0.11-6.064 c0.852-0.892,1.991-1.342,3.128-1.342c1.058,0,2.113,0.389,2.934,1.174l13.361,12.661l27.611-32.935 C56.156,11.972,57.362,11.456,58.582,11.456 M58.582,7.456c-2.453,0-4.761,1.075-6.331,2.948L27.373,40.081l-10.276-9.737 c-1.525-1.46-3.549-2.271-5.684-2.271c-2.261,0-4.456,0.939-6.021,2.579C2.23,33.964,2.337,39.22,5.628,42.369l16.497,15.657 c1.22,1.351,3.163,3.276,3.247,3.36c0.75,0.742,1.762,1.157,2.814,1.157c0.037,0,0.074-0.001,0.112-0.002 c1.093-0.03,2.125-0.507,2.856-1.317c0.101-0.111,2.46-2.726,3.329-3.763l30.501-36.384c1.423-1.698,2.094-3.851,1.889-6.062 c-0.203-2.198-1.249-4.191-2.945-5.612C62.433,8.148,60.533,7.456,58.582,7.456L58.582,7.456z"></path> </g> <g> <path d="M54.491,20.763c-0.225,0-0.45-0.075-0.637-0.23c-0.426-0.353-0.484-0.982-0.132-1.407l2.063-2.488 c0.352-0.425,0.982-0.485,1.407-0.132c0.426,0.353,0.484,0.982,0.132,1.407L55.262,20.4C55.064,20.64,54.779,20.763,54.491,20.763 z"></path> </g> <g> <path d="M42.292,34.891c-0.236,0-0.474-0.083-0.664-0.253c-0.413-0.366-0.45-0.999-0.083-1.411l9.834-11.063 c0.366-0.414,0.999-0.451,1.411-0.083c0.413,0.366,0.45,0.999,0.083,1.411l-9.834,11.063 C42.842,34.777,42.567,34.891,42.292,34.891z"></path> </g> </g> </g></svg></button>
        </form>
    );
}

const Activities = ({ setNewActivity: parentSetNewActivity }) => {
    const [tasks, setTasks] = useState([]);
    const [newActivity, setNewActivity] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [addActivity, setAddActivity] = useState(false);
    const showAddFeature = useRef();

    const calculateStreak = (dailyStatus, taskCreatedDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let streakCount = 0;
        let currentDate = new Date(today);
        currentDate.setDate(currentDate.getDate() - 1);

        while (currentDate >= new Date(taskCreatedDate)) {
            const isCompleted = dailyStatus?.some(
                (status) =>
                    new Date(status.date).toDateString() === currentDate.toDateString() &&
                    status.completed
            );
            if (isCompleted) {
                streakCount++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        const todayCompleted = dailyStatus?.some(
            (status) =>
                new Date(status.date).toDateString() === today.toDateString() &&
                status.completed
        );
        if (todayCompleted) {
            streakCount++;
        }
        return streakCount;
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showAddFeature.current && !showAddFeature.current.contains(event.target)) {
                setAddActivity(false);
            }
        };
        const fetchActivities = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/activities/", { withCredentials: true });
                setTasks(response.data);
                setNewActivity(false);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        }
        fetchActivities();
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [newActivity, addActivity]);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/activities/${id}`, { withCredentials: true });
            setNewActivity(prev => !prev);
            parentSetNewActivity(prev => !prev);
            toast.success(response.data.message)
        } catch (error) {
            toast.error("something went while deleting activity")
            console.error("Error deleting activity:", error);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 lg:mb-7">Your Daily Activities</h1>
            {tasks.length == 0 ? (
                <div>
                    <p className="text-xl md:text-2xl text-yellow-200">No activities found.</p>
                </div>
            ) : (
                <ul>
                    {Array.isArray(tasks) &&
                        tasks.map((task, index) => {
                            const taskCreatedDate = new Date(task.createdDate);
                            taskCreatedDate.setHours(0, 0, 0, 0);
                            const streak = calculateStreak(task.dailyStatus, taskCreatedDate);
                            return (
                                <li key={index} className="relative lg:mb-2 flex justify-between items-center text-white h-10">
                                    <span className="flex-1 text-sm sm:text-md md:text-lg font-semibold truncate">{task.title}</span>
                                    <span className="flex items-center gap-1 ml-2 text-xs text-yellow-200 shrink-0">
                                        🔥 {streak}
                                    </span>
                                    <span className="ml-4 text-sm text-gray-400 cursor-pointer" onClick={() => {
                                        setSelectedTask(task);
                                        setShowPopup(true);
                                    }}>
                                        <svg className="w-4 h-4 fill-[#777777] hover:fill-white" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 465.519 465.519" xml:space="preserve" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M455.175,69.675c-23.979-19.573-46.104-40.883-68.771-61.703c-6.159-5.657-13.67-5.527-19.474-2.432 c-5.062,2.702-10.496,10.59-14.335,14.866c-33.85,37.62-68.659,74.362-107.531,107.6c-4.362,3.732-11.058,3.225-14.815-1.117 c-32.847-37.942-61.629-78.543-89.593-119.649c-3.776-5.548-9.456-7.571-14.97-7.196c-5.735,0.388-11.56,3.633-13.604,4.565 c-1.19,0.536-2.356,1.222-3.488,2.08C84.231,25.146,58.861,42.376,33.418,59.55c-0.381,0.254-0.729,0.53-1.056,0.808 c-0.562,0.477-5.553,2.968-8.501,7.896c-3.194,5.337-3.48,12.22,1.933,18.093c41.588,45.092,80.755,92,122.176,137.217 c3.88,4.232,3.438,10.593-0.924,14.325c-47.642,40.775-86.709,89.402-137.9,126.832c-3.006,2.199-4.738,4.697-5.461,7.257 c-1.386,4.921,1.265,11.542,2.773,14.213c0.82,1.458,1.995,2.874,3.582,4.215c23.583,19.972,45.286,41.645,67.524,62.83 c6.053,5.769,13.574,5.758,19.438,2.752c5.106-2.62,10.679-10.404,14.602-14.599c34.599-37.064,70.134-73.23,109.674-105.83 c4.43-3.656,11.1-3.032,14.782,1.386c32.093,38.481,60.057,79.552,87.209,121.109c3.666,5.606,9.308,7.724,14.832,7.439 c5.738-0.294,11.619-3.442,13.69-4.337c1.193-0.522,2.377-1.183,3.524-2.021c24.725-18.058,50.435-34.855,76.215-51.607 c0.381-0.254,0.736-0.518,1.077-0.792c0.563-0.468,5.591-2.874,8.638-7.739c3.306-5.281,3.732-12.167-1.574-18.134 c-41.132-46.27-79.755-94.354-120.76-140.71c-3.809-4.302-3.347-10.771,0.965-14.566c47.438-41.792,85.787-91.612,136.699-130.242 c2.966-2.25,4.651-4.778,5.316-7.346c1.29-4.94-1.498-11.514-3.057-14.165C457.988,72.395,456.79,70.996,455.175,69.675z M413.083,89.507c-46.936,40.398-84.594,89.073-133.281,127.988c-2.112,1.696-3.55,3.526-4.408,5.413 c-1.609,3.542-1.812,10.191-0.726,14.035c0.594,2.118,1.747,4.215,3.564,6.221c40.771,44.772,78.633,91.658,118.165,137.339 c3.763,4.342,2.925,10.396-1.869,13.543c-14.355,9.436-28.619,18.981-42.675,28.782c-4.713,3.285-11.075,2.098-14.27-2.676 c-25.248-37.771-51.709-74.758-81.466-109.705c-3.723-4.372-8.557-12.558-13.299-15.797c-5.947-4.058-14.485-5.18-21.754,0.314 c-46.207,34.906-86.562,75.007-125.52,116.433c-3.936,4.189-10.461,4.353-14.607,0.381c-9.478-9.095-19.009-18.144-28.764-26.994 c-4.248-3.854-4.083-9.821,0.338-13.487c47.735-39.618,86.348-87.661,135.8-125.767c1.975-1.518,3.369-3.168,4.283-4.88 c1.706-3.184,2.163-9.579,0.982-13.302c-0.655-2.049-1.831-4.077-3.638-5.994c-41.657-44.095-80.438-90.348-120.866-135.369 c-3.839-4.273-3.115-10.336,1.627-13.576c14.16-9.666,28.224-19.438,42.071-29.467c4.654-3.369,11.04-2.298,14.32,2.417 c25.994,37.351,53.189,73.905,83.647,108.359c3.801,4.306,8.788,12.393,13.581,15.554c6.022,3.968,14.594,4.951,21.754-0.66 c45.503-35.66,85.051-76.424,123.176-118.484c3.859-4.253,10.385-4.545,14.604-0.646c9.658,8.945,19.383,17.837,29.311,26.525 C417.496,79.793,417.445,85.757,413.083,89.507z"></path> </g> </g> </g></svg>
                                    </span>
                                </li>
                            );
                        })}
                </ul>
            )}
            {showPopup && selectedTask && (
                <Popup
                    message={selectedTask.title}
                    del={() => {
                        handleDelete(selectedTask._id);
                        setShowPopup(false);
                        setSelectedTask(null);
                    }}
                    cancel={() => {
                        setShowPopup(false);
                        setSelectedTask(null);
                    }}
                />
            )}
            <div ref={showAddFeature} onClick={(e) => { e.stopPropagation(); }}>
                <div onClick={(e) => { e.stopPropagation(); setAddActivity(true); }} className={"flex justify-center cursor-pointer text-2xl font-bold text-yellow-200 hover:text-yellow-300 mt-4 " + (addActivity ? "hidden" : "")}>
                    <svg className="w-7 h-7 border text-white p-1 rounded-full" fill="#fff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 70 70" enable-background="new 0 0 70 70" xml:space="preserve" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M34.583,7c2.209,0,4,1.773,4,3.962v19.999l20.305,0.038c2.189,0,4.098,1.791,4.098,4c0,2.208-1.976,4-4.164,4 l-20.238-0.038v20.076c0,2.188-1.791,3.963-4,3.963s-4-1.774-4-3.963V38.961l-19.77,0.038c-2.188,0-3.828-1.792-3.828-4 c0-2.209,1.572-4,3.761-4l19.837-0.038V10.962C30.583,8.773,32.374,7,34.583,7 M34.583,3c-4.411,0-8,3.571-8,7.962v16.007 l-15.777,0.03c-4.383,0-7.82,3.589-7.82,8s3.37,8,7.761,8l15.837-0.03v16.068c0,4.391,3.589,7.963,8,7.963s8-3.572,8-7.963V42.969 l16.297,0.03c4.398,0,8.105-3.589,8.105-8s-3.773-8-8.164-8l-16.238-0.03V10.962C42.583,6.571,38.994,3,34.583,3L34.583,3z"></path> </g> <g> <path d="M35.583,15.136c-0.553,0-1-0.447-1-1v-3c0-0.553,0.447-1,1-1s1,0.447,1,1v3C36.583,14.688,36.136,15.136,35.583,15.136z"></path> </g> <g> <path d="M35.583,29.136c-0.553,0-1-0.447-1-1v-10c0-0.553,0.447-1,1-1s1,0.447,1,1v10C36.583,28.688,36.136,29.136,35.583,29.136z "></path> </g> </g> </g></svg>
                </div>
                {addActivity && <AddActivity setNewActivity={setNewActivity} parentSetNewActivity={parentSetNewActivity} />}
            </div>
        </div>
    );
}

export default Activities;
