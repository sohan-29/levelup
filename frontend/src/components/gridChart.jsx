import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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
      const isCompleted = task.dailyStatus?.some(
        (status) => new Date(status.date).toDateString() === clickedDate.toDateString() && status.completed
      );

      const updatedDailyStatus = isCompleted
        ? task.dailyStatus.filter(status => new Date(status.date).toDateString() !== clickedDate.toDateString())
        : [...(task.dailyStatus || []), { date: clickedDate, completed: true }];

      const newStreak = calculateStreak(updatedDailyStatus, taskCreatedDate);
      const response = await axios.put(
        `http://localhost:3000/api/activities/${task._id}`,
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
      toast.success(response.data.message)
      setNewActivity(prev => !prev);
    } catch (error) {
      console.log(error)
      toast.error("Unable to update activity")
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

                    let boxClasses = "w-10 h-10 flex items-center justify-center rounded text-xs font-medium transition-all shrink-0";

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
                        boxClasses += " bg-green-500 border-2 border-green-600 shadow-md cursor-pointer text-white font-bold";
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
                        title={`${date.toLocaleDateString()}`}
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