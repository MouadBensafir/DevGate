<template>
  <div class="skill-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount, defineProps } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  skills: {
    type: Array,
    default: () => [],
    required: true
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

const chartData = ref({
  labels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  datasets: [{
    data: [0, 0, 0, 0],
    backgroundColor: [
      '#0dcaf0', // Beginner - Light Blue
      '#0d6efd', // Intermediate - Blue
      '#198754', // Advanced - Green
      '#dc3545'  // Expert - Red
    ],
    borderColor: '#ffffff',
    borderWidth: 2,
    hoverOffset: 15
  }]
});

const processSkills = (skills) => {
  const counts = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    expert: 0
  };

  skills.forEach(skill => {
    const level = skill.level?.toLowerCase();
    if (level && Object.hasOwn(counts, level)) {
      counts[level]++;
    }
  });

  return [
    counts.beginner,
    counts.intermediate,
    counts.advanced,
    counts.expert
  ];
};

const initChart = () => {
  if (chartCanvas.value) {
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
                size: 14,
                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              },
              color: '#212529'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(33, 37, 41, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#dee2e6',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label}: ${value} skill${value !== 1 ? 's' : ''} (${percentage}%)`;
              }
            }
          },
          title: {
            display: true,
            text: 'Skills mastery distribution',
            font: {
              size: 16,
              weight: 'bold',
              family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            },
            padding: {
              top: 10,
              bottom: 20
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }
};

const updateChartData = (skills) => {
  const newData = processSkills(skills);
  chartData.value.datasets[0].data = newData;
  
  if (chartInstance) {
    chartInstance.data.datasets[0].data = newData;
    chartInstance.update();
  }
};

watch(() => props.skills, (newSkills) => {
  if (newSkills?.length) {
    nextTick(() => {
      updateChartData(newSkills);
    });
  }
}, { immediate: true, deep: true });

onMounted(() => {
  nextTick(initChart);
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.skill-chart-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 300px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}
</style>