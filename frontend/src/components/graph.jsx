import { useEffect, useRef } from "react";

const Graph = ({ tasks }) => {
  const graph = useRef(null);

  const totalTasks = tasks.length;

  /* -------- LOCAL DATE FORMATTER -------- */
  const formatDate = (date) =>
    date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0");

  /* -------- ACTIVITY MAP -------- */
  const activityMap = {};
  tasks.forEach(task => {
    task.dailyStatus.forEach(s => {
      if (s.completed) {
        const d = formatDate(new Date(s.date));
        activityMap[d] = (activityMap[d] || 0) + 1;
      }
    });
  });

  const year = new Date().getFullYear();
  const weeks = [];

  /* -------- BUILD MONTHS -------- */
  for (let month = 0; month < 12; month++) {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    const start = new Date(monthStart);
    start.setDate(start.getDate() - start.getDay());

    const end = new Date(monthEnd);
    end.setDate(end.getDate() + (6 - end.getDay()));

    let current = new Date(start);

    while (current <= end) {
      const week = [];

      for (let i = 0; i < 7; i++) {
        const dateStr = formatDate(current);

        week.push({
          date: dateStr,
          value: activityMap[dateStr] || 0,
          visible:
            current.getMonth() === month &&
            current.getFullYear() === year
        });

        current.setDate(current.getDate() + 1);
      }

      weeks.push(week);
    }

    // 14-block month gap
    if (month !== 11) {
      weeks.push(Array(7).fill(null));
    }
  }

  useEffect(() => {
    const todayStr = formatDate(new Date());
    const el = graph.current?.querySelector(`[data-date="${todayStr}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [tasks]);

  return (
    <div ref={graph} className="w-5xl mx-auto bg-[#242424] p-3 rounded-xl overflow-x-auto">
      <div className="grid grid-flow-col gap-3">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-rows-7 gap-1">
            {week.map((day, dIdx) => {
              if (!day || !day.visible) {
                return <div key={dIdx} className="w-3 h-3 bg-transparent" />;
              }
              let bg = "#333333";
              if (day.value >= 1 && day.value <= totalTasks / 3) {
                bg = "#FFEFA1";
              } else if (day.value > totalTasks / 3 && day.value <= (2 * totalTasks) / 3) {
                bg = "#FFD84D";
              } else if (day.value > (2 * totalTasks) / 3 && day.value <= totalTasks) {
                bg = "#FFBF00";
              }
              const date = day.date.split("-").reverse().join("/");
              return (
                <div
                  key={dIdx}
                  data-date={day.date}
                  title={`${date} — ${day.value} completed`}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: bg }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Graph;
