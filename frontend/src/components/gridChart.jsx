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
      {/* Calendar Header */}
      <div className="overflow-x-auto">
        {/* Date Header Row */}
        <div className="flex sticky top-0 z-10">
          {/* Task Title Column Header */}
          <div className="w-48 shrink-0 flex items-center px-5 py-3">
            <p className="text-xl font-bold text-white">Activities</p>
          </div>

          {/* Date Headers */}
          <div className="flex gap-1">
            {allDates.map((date, idx) => {
              const isToday = date.toDateString() === today.toDateString();
              const dayOfMonth = date.getDate();
              const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

              return (
                <div
                  key={idx}
                  className={`w-12 shrink-0 flex flex-col items-center justify-center py-2 text-center transition-all ${
                    isToday ? "bg-yellow-200 text-black rounded" : ""
                  }`}
                >
                  <div className={`text-xs font-semibold ${isToday ? "" : "text-gray-400"}`}>
                    {dayName}
                  </div>
                  <div className={`text-sm font-bold ${isToday ? "" : "text-white"}`}>
                    {dayOfMonth}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Rows */}
        <div className="mt-4 space-y-2">
          {tasks.map((task) => {
            const taskCreatedDate = new Date(task.createdDate);
            taskCreatedDate.setHours(0, 0, 0, 0);
            const streak = calculateStreak(task.dailyStatus, taskCreatedDate);

            return (
              <div key={task._id} className="flex gap-1 items-center">
                {/* Task Name and Streak */}
                <div className="w-48 shrink-0 px-5 py-2">
                  <p className="text-white text-sm font-semibold truncate">{task.title}</p>
                  <p className="text-xs text-yellow-200 mt-1">🔥 {streak}</p>
                </div>

                {/* Date Status Boxes */}
                <div className="flex gap-1">
                  {allDates.map((date, idx) => {
                    const isCompleted = task.dailyStatus?.some(
                      (status) =>
                        new Date(status.date).toDateString() === date.toDateString() &&
                        status.completed
                    );

                    const isBeforeTaskCreated = date < taskCreatedDate;
                    const isPastDate = date < today;
                    const isToday = date.toDateString() === today.toDateString();
                    const isClickable = isToday;

                    let boxClasses = "w-12 h-8 flex items-center justify-center rounded text-sm font-medium transition-all cursor-default";

                    if (isBeforeTaskCreated || isPastDate) {
                      // Before task created or past dates
                      if (isCompleted) {
                        boxClasses += " bg-white text-black font-bold";
                      } else {
                        boxClasses += " bg-gray-700 opacity-50";
                      }
                    } else if (isToday) {
                      // Today - clickable
                      if (isCompleted) {
                        boxClasses += " bg-white text-black font-bold cursor-pointer hover:opacity-80";
                      } else {
                        boxClasses += " bg-yellow-200 text-black border-2 border-yellow-300 cursor-pointer hover:bg-yellow-100";
                      }
                    } else {
                      // Future dates - disabled
                      boxClasses += " bg-gray-700 opacity-20 cursor-not-allowed";
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
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GridChart;