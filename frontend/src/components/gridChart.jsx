import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import NoteViewer from "./NoteViewer";
const api = import.meta.env.VITE_API_URL;

function GridChart({ tasks, setNewActivity, setTasks }) {
  const [updatingDate, setUpdatingDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const gridchart = useRef();
  const scrollContainerRef = useRef();

  // Calculate dates even when tasks is empty to maintain hook order
  const earliestDate = tasks && tasks.length > 0
    ? new Date(Math.min(...tasks.map(task => new Date(task.createdDate).getTime())))
    : new Date();
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

  useEffect(() => {
    if (!selectedDate && allDates.length > 0) setSelectedDate(today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDates]);



  useEffect(() => {
    if (scrollContainerRef.current && tasks && tasks.length > 0) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [allDates]);



  if (!tasks || tasks.length === 0) {
    return <div className="text-gray-400 p-4">No activities yet. Start building your streak!</div>;
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

    const isCompleted = task.dailyStatus?.some(
      (status) => new Date(status.date).toDateString() === clickedDate.toDateString() && status.completed
    );

    const updatedDailyStatus = isCompleted
      ? task.dailyStatus.filter(status => new Date(status.date).toDateString() !== clickedDate.toDateString())
      : [...(task.dailyStatus || []), { date: clickedDate, completed: true }];

    const newStreak = calculateStreak(updatedDailyStatus, taskCreatedDate);

    // Optimistically update the task in local state
    const updatedTask = {
      ...task,
      dailyStatus: updatedDailyStatus,
      streak: newStreak,
      completed: !isCompleted
    };
    setTasks(prev => prev.map(t => t._id === task._id ? updatedTask : t));

    try {
      const response = await axios.put(
        `${api}/activities/${task._id}`,
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
      setNewActivity(prev => prev + 1);
    } catch (error) {
      // Revert the optimistic update on error
      setTasks(prev => prev.map(t => t._id === task._id ? task : t));
      console.log(error)
      toast.error("Unable to update activity")
    } finally {
      setUpdatingDate(null);
    }
  };

  return (
    <>
    <div ref={gridchart} gridChart="gc" className="flex-1 p-0.5 overflow-x-auto hide-scrollbar mt-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* Calendar Header */}
      <div ref={scrollContainerRef} className="overflow-x-auto">
        {/* Date Header Row */}
        <div className="flex sticky top-0 z-10 items-center justify-between">
          {/* Date Headers */}
          <div className="flex gap-0.5 md:gap-1">
            {allDates.map((date, idx) => {
              const isToday = date.toDateString() === today.toDateString();
              const dayOfMonth = date.getDate();
              const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
              const isSelected = selectedDate && new Date(selectedDate).toDateString() === date.toDateString();

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedDate(date);
                    if (window.innerWidth < 768) setShowMobileModal(true);
                    else setShowSidePanel(true);
                  }}
                  className={`w-7 md:w-9 lg:w-12 xl:w-13 shrink-0 flex flex-col items-center justify-center py-1 md:py-2 text-center transition-all ${
                    isToday ? "bg-yellow-200 text-black rounded" : ""
                  } ${isSelected ? 'ring-2 ring-yellow-300' : ''}`}
                >
                  <div className={`text-xs font-semibold ${isToday ? "" : "text-gray-400"}`}>
                    {dayName}
                  </div>
                  <div className={`text-xs md:text-sm font-bold ${isToday ? "" : "text-white"}`}>
                    {dayOfMonth}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile: open note popup */}
          <div className="md:hidden pr-1">
            <button onClick={() => setShowMobileModal(true)} className="p-1 rounded hover:bg-gray-100" title="Open note">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 13.5V18h4.5l9.356-9.356-4.5-4.5L2 13.5z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Activity Rows - Just Calendar Boxes */}
        <div className="mt-2 md:mt-4 space-y-1 md:space-y-1.5">
          {tasks.map((task) => {
            const taskCreatedDate = new Date(task.createdDate);
            taskCreatedDate.setHours(0, 0, 0, 0);

            return (
              <div key={task._id} className="flex gap-0.5 md:gap-1">
                {/* Date Status Boxes */}
                <div className="flex gap-0.5 md:gap-1">
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

                    let boxClasses = "w-7 h-5 md:w-9 md:h-7 lg:w-12 lg:h-8 xl:w-13 xl:h-10 flex items-center justify-center rounded text-xs md:text-sm font-medium transition-all cursor-default my-0.5 md:my-1 xl:my-0.5";

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
                        title={`${task.title} - ${date.toLocaleDateString()}`}
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

  {/* Desktop side panel */}
  <div className="hidden md:block w-80 p-4 border-l border-gray-200">
    {selectedDate ? <NoteViewer date={selectedDate} /> : <div className="text-gray-500">Select a date to view note</div>}
  </div>

  {/* Mobile modal */}
  {showMobileModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:hidden">
      <div className="absolute inset-0 bg-black/30" onClick={() => setShowMobileModal(false)} />
      <div className="bg-white rounded p-4 w-11/12 max-h-[80vh] overflow-auto relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={() => setShowMobileModal(false)}>✕</button>
        {selectedDate ? <NoteViewer date={selectedDate} /> : <div className="text-gray-500">Select a date</div>}
      </div>
    </div>
  )}

    </>
  );
}

export default GridChart;