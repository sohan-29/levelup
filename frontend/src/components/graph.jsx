import { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const Graph = ({ tasks }) => {
  useEffect(() => {
    if (!tasks?.length) return;

    const formatDate = (dateStr) => {
      const options = { day: 'numeric', month: 'short' }; // e.g., "20 Dec"
      return new Date(dateStr).toLocaleDateString('en-GB', options);
    };

    const generateRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const generateDateRange = (startDate, endDate) => {
      const dates = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    const earliestStartDate = new Date(Math.min(...tasks.map(task => new Date(task.createdDate))));
    const endDate = new Date();

    const series = tasks.map((task) => {
      const taskStartDate = new Date(task.createdDate);
      const allDates = generateDateRange(earliestStartDate, endDate);
      let cumulativeCompleted = 0;
      const statusMap = new Map(task.dailyStatus.map(status => [new Date(status.date).toDateString(), status.completed]));

      const data = allDates.map(date => {
        const isCompleted = date >= taskStartDate && (statusMap.get(date.toDateString()) || false);
        if (isCompleted) cumulativeCompleted++;
        return {
          x: formatDate(date.toISOString()), // formatted date only
          y: cumulativeCompleted
        };
      });

      return {
        name: task.title,
        color: generateRandomColor(),
        data,
        finalValue: cumulativeCompleted
      };
    }).sort((a, b) => a.finalValue - b.finalValue);

    const chart = new ApexCharts(document.querySelector("#chart"), {
      series,
      chart: { type: 'line', height: 350, toolbar: { show: false } },
      stroke: { curve: 'smooth' },
      title: { text: 'Activity Completion Over Time', align: 'left' },
      xaxis: { type: 'category', title: { text: 'Date' } },
      yaxis: { min: 0, title: { text: 'Number of Days Completed' } },
      markers: { size: 4 },
      legend: { show: true },
      dataLabels: { enabled: false },
      zoom: { enabled: false }
    });

    chart.render();
    return () => chart.destroy();
  }, [tasks]);

  return <div id="chart" style={{ width: '60%', margin: 'auto' }} />;
};

export default Graph;
