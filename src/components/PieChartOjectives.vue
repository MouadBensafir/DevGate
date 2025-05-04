<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount, defineProps } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const props = defineProps({
  objectives: {
    type: Array,
    default: () => [],
    required: true,
    validator: (value) => {
      return Array.isArray(value) && value.every(obj => 
        typeof obj === 'object' && 
        'completed' in obj
      );
    }
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

// Updated color scheme - completed first (green), not completed (gray)
const chartData = ref({
  labels: ['Completed', 'Not Completed'],
  datasets: [{
    data: [0, 0],
    backgroundColor: [
      '#198754', // Completed - Green
      '#6c757d'  // Not Completed - Gray
    ],
    borderColor: '#ffffff',
    borderWidth: 2,
    hoverOffset: 10
  }]
});

const processObjectives = (objectives) => {
  if (!Array.isArray(objectives)) return [0, 0];
  
  const completed = objectives.filter(obj => obj.completed).length;
  const notCompleted = objectives.length - completed;
  
  return [completed, notCompleted]; // Completed first
};

const initChart = () => {
  if (!chartCanvas.value) return;
  
  chartInstance = new Chart(chartCanvas.value.getContext('2d'), {
    type: 'pie',
    data: chartData.value,
    options: {
      responsive: false,
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
          text: 'Objective Completion Status',
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

const updateChartData = (objectives) => {
  const newData = processObjectives(objectives);
  chartData.value.datasets[0].data = newData;
  
  if (chartInstance) {
    chartInstance.data.datasets[0].data = newData;
    chartInstance.update();
  }
};

watch(() => props.objectives, (newObjectives) => {
  if (newObjectives) {
    nextTick(() => {
      updateChartData(newObjectives);
    });
  }
}, { immediate: true, deep: true });

onMounted(() => {
  nextTick(() => {
    initChart();
    if (props.objectives?.length) {
      updateChartData(props.objectives);
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px; /* Fixed width */
  height: 300px; /* Fixed height */
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>