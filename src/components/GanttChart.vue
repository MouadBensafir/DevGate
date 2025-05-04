<template>
  <div class="gantt-chart-container">
    <canvas ref="chartCanvas" height="400"></canvas>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted, watch, onBeforeUnmount, defineProps } from 'vue';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
    default: () => []
  }
});

const chartCanvas = ref(null);
let chart = null;

// Normalize date to start of day in UTC (returns seconds)
const normalizeToStartOfDay = (seconds) => {
  const date = new Date(seconds * 1000); // Convert seconds to milliseconds
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000; // Return seconds
};

// Generate a color for each task
const getTaskColor = (index, isCompleted) => {
  const colors = [
    'rgba(54, 162, 235, 0.7)',   // blue
    'rgba(255, 99, 132, 0.7)',   // red
    'rgba(75, 192, 192, 0.7)',   // green
    'rgba(255, 206, 86, 0.7)',   // yellow
    'rgba(153, 102, 255, 0.7)',  // purple
    'rgba(255, 159, 64, 0.7)'    // orange
  ];
  return isCompleted ? 'rgba(75, 192, 75, 0.7)' : colors[index % colors.length];
};

// Format seconds to date string (using UTC)
const formatDateFromSeconds = (seconds) => {
  const date = new Date(seconds * 1000);
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
};

// Create and render the chart
const renderChart = () => {
  if (chart) {
    chart.destroy();
  }
  
  if (!chartCanvas.value || props.tasks.length === 0) return;
  
  const ctx = chartCanvas.value.getContext('2d');
  
  // Prepare data for the chart
  const labels = props.tasks.map(task => task.description || 'Unnamed Task');
  
  // Calculate start and end dates as milliseconds
  const taskData = props.tasks.map(task => {
    // Normalize start and end times to start of day in UTC
    let start = normalizeToStartOfDay(task.startAt) * 1000;
    let end = normalizeToStartOfDay(task.finishAt) * 1000;
    
    // For single-day tasks, extend end to next day (midnight)
    if (start === end) {
      end = end + (24 * 60 * 60 * 1000); // Add 1 day in milliseconds
    }
    
    // Optional: Debug timestamps
    // console.log(`Task: ${task.description}, Start: ${new Date(start).toUTCString()}, End: ${new Date(end).toUTCString()}`);
    
    return {
      start,
      end
    };
  });
  
  // Find min and max dates (in milliseconds)
  const allTimes = [];
  taskData.forEach(task => {
    allTimes.push(task.start);
    allTimes.push(task.end);
  });
  
  const minTime = Math.min(...allTimes);
  const maxTime = Math.max(...allTimes);
  
  // Add padding to the range (fallback to 1 day if range is zero)
  const rangeBuffer = (maxTime - minTime) * 0.1 || 24 * 60 * 60 * 1000; // 10% padding or 1 day
  const minDate = minTime - rangeBuffer;
  const maxDate = maxTime + rangeBuffer;
  
  // Create datasets for the chart
  const datasets = props.tasks.map((task, index) => {
    return {
      label: task.description || `Task ${index + 1}`,
      backgroundColor: getTaskColor(index, task.completed),
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      borderRadius: 4,
      barPercentage: 0.6,
      barThickness: 20,
      data: [
        {
          x: taskData[index].start,
          y: labels.length - index - 1,
          x2: taskData[index].end,
        }
      ]
    };
  });
  
  // Register a new chart type for horizontal bars
  Chart.defaults.set('elements.horizontalBar', {
    borderWidth: 1,
    borderRadius: 0,
    borderSkipped: 'bottom'
  });
  
  // Create plugin to draw horizontal bars
  const horizontalBarPlugin = {
    id: 'horizontalBar',
    beforeDraw: function(chart) {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;
      
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        
        dataset.data.forEach((data, index) => {
          const startX = xAxis.getPixelForValue(data.x);
          const endX = xAxis.getPixelForValue(data.x2);
          const y = yAxis.getPixelForValue(data.y);
          const height = dataset.barThickness || 20;
          
          // Draw the bar
          ctx.save();
          ctx.fillStyle = dataset.backgroundColor;
          ctx.beginPath();
          ctx.roundRect(startX, y - height/2, endX - startX, height, 4);
          ctx.fill();
          
          // Draw border if specified
          if (dataset.borderWidth > 0) {
            ctx.strokeStyle = dataset.borderColor || 'rgba(0,0,0,0.1)';
            ctx.lineWidth = dataset.borderWidth;
            ctx.stroke();
          }
          
          ctx.restore();
        });
      });
    }
  };
  
  // Create the chart
  chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500
      },
      scales: {
        x: {
          position: 'top',
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM d'
            },
            // Ensure UTC is used for rendering
            parser: (value) => new Date(value).toISOString(),
            tooltipFormat: 'MMM d, yyyy'
          },
          min: minDate,
          max: maxDate,
          title: {
            display: true,
            text: 'Timeline'
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          labels: labels,
          type: 'category',
          reverse: true,
          title: {
            display: true,
            text: 'Timeline'
          },
          ticks: {
            callback: function(value) {
              return labels[labels.length - value - 1];
            }
          }
        }
      },
      plugins: {
        tooltip: {
          enabled: true,
          callbacks: {
            title: function(context) {
              return context[0].dataset.label;
            },
            label: function(context) {
              const dataPoint = context[0].dataset.data[0];
              const start = dataPoint.x;
              const end = dataPoint.x2;
              
              // Convert milliseconds back to seconds for formatting
              const startSecs = Math.floor(start / 1000);
              const endSecs = Math.floor(end / 1000);
              
              // Calculate duration in days
              const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
              
              return [
                `Start: ${formatDateFromSeconds(startSecs)}`,
                `End: ${formatDateFromSeconds(endSecs)}`,
                `Duration: ${duration} days`
              ];
            }
          }
        },
        legend: {
          display: false
        }
      }
    },
    plugins: [horizontalBarPlugin]
  });
};

// Initialize the chart when the component is mounted
onMounted(() => {
  if (props.tasks && props.tasks.length > 0) {
    setTimeout(() => {
      renderChart();
    }, 100);
  }
});

// Re-render the chart when the tasks change
watch(() => props.tasks, () => {
  setTimeout(() => {
    renderChart();
  }, 100);
}, { deep: true });

// Clean up the chart when the component is unmounted
onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>

<style scoped>
.gantt-chart-container {
  width: 100%;
  height: 400px;
  padding: 10px;
  box-sizing: border-box;
}
</style>