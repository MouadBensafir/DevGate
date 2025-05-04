<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount, defineProps } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
console.log("je SUIS UN CHAT MWAHAHAHAHA");
const props = defineProps({
  projects: {
    type: Array,
    default: () => [],
    required: true,
  }
});
console.log("Here are the Projects YAY", props.projects);
const chartCanvas = ref(null);
let chartInstance = null;

// Color scheme - completed (green), in progress (yellow)
const chartData = ref({
  labels: ['Completed', 'In Progress'],
  datasets: [{
    data: [0, 0],
    backgroundColor: [
      '#198754', // Completed - Green
      '#ffc107'  // In Progress - Yellow
    ],
    borderColor: '#ffffff',
    borderWidth: 2,
    hoverOffset: 10
  }]
});

const processProjects = (projects) => {
  if (!Array.isArray(projects)) return [0, 0];
  
  const completed = projects.filter(project => project.completed).length;
  const inProgress = projects.length - completed;
  
  return [completed, inProgress]; // Completed first
};

const initChart = () => {
  if (!chartCanvas.value) return;
  
  chartInstance = new Chart(chartCanvas.value.getContext('2d'), {
    type: 'pie',
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: {
              size: 14
            },
            generateLabels: (chart) => {
              // Show completed first in legend too
              const original = Chart.overrides.pie.plugins.legend.labels.generateLabels(chart);
              return [original[0], original[1]]; // Keep original order
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        },
        title: {
          display: true,
          text: 'Project Completion Status',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        }
      },
      // Ensure consistent ordering in the pie chart
      rotation: -90, // Start from top
      circumference: 360
    }
  });
};

const updateChartData = (projects) => {
  const newData = processProjects(projects);
  chartData.value.datasets[0].data = newData;
  
  if (chartInstance) {
    chartInstance.data.datasets[0].data = newData;
    chartInstance.update();
  }
};

watch(() => props.projects, (newProjects) => {
  if (newProjects) {
    nextTick(() => {
      updateChartData(newProjects);
    });
  }
}, { immediate: true, deep: true });

onMounted(() => {
  nextTick(() => {
    initChart();
    if (props.projects?.length) {
      updateChartData(props.projects);
    }
  });
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 300px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>