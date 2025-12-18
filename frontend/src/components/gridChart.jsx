import { useState } from "react";
import axios from "axios";

function GridChart({ tasks, setNewActivity }) {
  const [updatingDate, setUpdatingDate] = useState(null);

  if (!tasks || tasks.length === 0) {
    return <div className="text-gray-400 p-4">No activities yet. Start building your streak!</div>;
  }

  // Find the earliest created date across all tasks
  const earliestDate = new Date(
    Math.min(...tasks.map(task => new Date(task.createdDate).getTime()))
  );
  earliestDate.setHours(0, 0, 0, 0);

  // Generate all dates from earliest to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allDates = [];
  let currentDate = new Date(earliestDate);
  while (currentDate <= today) {
    allDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Calculate streak for a task
  const calculateStreak = (dailyStatus, taskCreatedDate) => {
    let streakCount = 0;
    let currentDate = new Date(today);
    
    while (currentDate >= new Date(taskCreatedDate)) {
      const isCompleted = dailyStatus?.some(
        (status) => new Date(status.date).toDateString() === currentDate.toDateString() && status.completed
      );
      
      if (isCompleted) {
        streakCount++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streakCount;
  };

  const handleBoxClick = async (date, task) => {
    const clickedDate = new Date(date);
    clickedDate.setHours(0, 0, 0, 0);

    const taskCreatedDate = new Date(task.createdDate);
    taskCreatedDate.setHours(0, 0, 0, 0);

    // Only allow clicking on today
    if (clickedDate.toDateString() !== today.toDateString()) {
      console.log("Can only click on today's date");
      return;
    }

    setUpdatingDate(`${task._id}-${date.toDateString()}`);
    
    try {
      // Check if this date is already completed
      const isCompleted = task.dailyStatus?.some(
        (status) => new Date(status.date).toDateString() === clickedDate.toDateString() && status.completed
      );

      console.log("Current status:", isCompleted);
      console.log("Task ID:", task._id);
      console.log("Task Object:", task);
      console.log("Clicked Date:", clickedDate);

      // Update the daily status
      const updatedDailyStatus = isCompleted
        ? task.dailyStatus.filter(status => new Date(status.date).toDateString() !== clickedDate.toDateString())
        : [...(task.dailyStatus || []), { date: clickedDate, completed: true }];

      // Calculate streak after update
      const newStreak = calculateStreak(updatedDailyStatus, taskCreatedDate);

      console.log("Updated Daily Status:", updatedDailyStatus);
      console.log("New Streak:", newStreak);

      const apiUrl = `http://localhost:3000/api/activities/${task._id}`;
      console.log("API URL:", apiUrl);
      console.log("Request Body:", {
        dailyStatus: updatedDailyStatus,
        streak: newStreak,
        completed: !isCompleted
      });

      // Send to API with streak and completion status
      const response = await axios.put(
        apiUrl,
        {
          dailyStatus: updatedDailyStatus,
          streak: newStreak,
          completed: !isCompleted
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("API Response:", response.data);

      // Trigger dashboard refresh
      setNewActivity(prev => !prev);
    } catch (error) {
      console.error("Full Error Object:", error);
      console.error("Error Status:", error.response?.status);
      console.error("Error Data:", error.response?.data);
      console.error("Error Message:", error.message);
      alert("Error updating activity: " + (error.response?.data?.error || error.message));
    } finally {
      setUpdatingDate(null);
    }
  };

  return (
    <div className="flex-1 p-4">
      <div className="space-y-4">
        {tasks.map((task) => {
          const taskCreatedDate = new Date(task.createdDate);
          taskCreatedDate.setHours(0, 0, 0, 0);
          const streak = calculateStreak(task.dailyStatus, taskCreatedDate);

          return (
            <div key={task._id} className="flex items-center gap-4">
              {/* Task Title with Streak */}
              <div className="w-48 shrink-0">
                <p className="text-white text-sm font-semibold truncate">{task.title}</p>
                <p className="text-xs text-green-400 mt-1">🔥 {streak} day streak</p>
              </div>

              {/* Date Boxes Row */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex gap-1 pb-2">
                  {allDates.map((date, idx) => {
                    const isCompleted = task.dailyStatus?.some(
                      (status) => new Date(status.date).toDateString() === date.toDateString() && status.completed
                    );

                    const isBeforeTaskCreated = date < taskCreatedDate;
                    const isPastDate = date < today;
                    const isToday = date.toDateString() === today.toDateString();
                    const isClickable = isToday; // Only allow clicking on today

                    let boxClasses = "w-10 h-10 flex items-center justify-center rounded text-xs font-medium transition-all flex-shrink-0";

                    if (isBeforeTaskCreated || isPastDate) {
                      // Before task created or past dates - empty boxes, not clickable
                      if (isCompleted) {
                        boxClasses += " bg-blue-600 border-2 border-blue-700 cursor-not-allowed";
                      } else {
                        boxClasses += " bg-gray-700 border border-gray-600 cursor-not-allowed opacity-50";
                      }
                    } else if (isToday) {
                      // Today - clickable
                      if (isCompleted) {
                        boxClasses += " bg-green-500 border-2 border-green-600 shadow-md  cursor-pointer text-white font-bold";
                      } else {
                        boxClasses += " bg-gray-700 border-2 border-yellow-500 cursor-pointer hover:bg-gray-600 hover:border-yellow-400";
                      }
                    } else {
                      // Future dates - empty boxes, not clickable
                      boxClasses += " bg-gray-800 border border-gray-700 cursor-not-allowed opacity-30";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleBoxClick(date, task)}
                        disabled={!isClickable}
                        className={boxClasses}
                        type="button"
                        title={`${date.toLocaleDateString()} ${
                          isBeforeTaskCreated ? "(Before task created)" : 
                          isPastDate ? "(Past - Locked)" : 
                          isToday ? "(Today - Clickable)" : 
                          "(Future)"
                        }`}
                      >
                        {isCompleted && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GridChart;