import { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const Graph = ({ tasks }) => {
  useEffect(() => {
    if (!tasks?.length) return;

    // Find earliest date across all tasks
    const earliestDate = new Date(
      Math.min(...tasks.map(task => new Date(task.createdDate).getTime()))
    );
    earliestDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate all dates from earliest to today
    const allDates = [];
    let currentDate = new Date(earliestDate);
    while (currentDate <= today) {
      allDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const series = tasks.map(task => {
      let completedDays = 0;
      const data = allDates.map(date => {
        const status = task.dailyStatus?.find(
          s => new Date(s.date).toDateString() === date.toDateString()
        );

        if (status?.completed) {
          completedDays++; // increase cumulative count
        }

        return {
          x: date.toISOString().split('T')[0], // date only
          y: completedDays
        };
      });

      return { name: task.title, data };
    });

    const chart = new ApexCharts(document.querySelector("#chart"), {
      series,
      chart: { type: 'line', height: 350, toolbar: { show: false } },
      stroke: { curve: 'smooth' },
      title: { text: 'Completed Days Over Time', align: 'left' },
      xaxis: { type: 'category', title: { text: 'Date' } },
      yaxis: { title: { text: 'Total Completed Days' }, min: 0 },
      markers: { size: 4, color: ['#000'] },
      legend: { show: true },
      tooltip: { theme: 'dark' },
      dataLabels: { enabled: false, color: ["#000"] },
      zoom: { enabled: false }
    });

    chart.render();
    return () => chart.destroy();
  }, [tasks]);

  return <div id="chart" style={{ width: '90%', margin: 'auto' }} />;
};

export default Graph;
