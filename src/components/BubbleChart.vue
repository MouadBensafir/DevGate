<template>
  <canvas ref="chartRef"></canvas>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, defineProps } from "vue";
import {
  Chart,
  BubbleController,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(BubbleController, LinearScale, PointElement, Tooltip, Legend, Title);

const props = defineProps({
  skills: {
    type: Array,
    required: true,
  },
});

const chartRef = ref(null);
let chartInstance = null;

// Map level to color
const getColorByLevel = (level) => {
  switch (level) {
    case "beginner":
      return "cyan";
    case "intermediate":
      return "blue";
    case "advanced":
      return "green";
    case "expert":
      return "red";
    default:
      return "gray";
  }
};

// Map level to numeric score (used for y and bubble size)
const getNumericLevel = (level) => {
  switch (level) {
    case "beginner":
      return 1;
    case "intermediate":
      return 2;
    case "advanced":
      return 3;
    case "expert":
      return 4;
    default:
      return 0;
  }
};

const initChart = () => {
  chartInstance = new Chart(chartRef.value, {
    type: "bubble",
    data: {
      datasets: [],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Skills Bubble Chart',
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 10,
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
};

const updateChart = () => {
  if (!chartInstance) return;

  chartInstance.data.datasets = props.skills.map((skill, index) => {
    const numericLevel = getNumericLevel(skill.level);
    return {
      label: skill.name,
      data: [{
        x: index * 10,           // spread on X axis
        y: numericLevel * 20,    // scale Y by level
        r: numericLevel * 5 + 5, // scale size by level
      }],
      backgroundColor: getColorByLevel(skill.level),
    };
  });

  chartInstance.update();
};

watch(
  () => props.skills,
  () => {
    updateChart();
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  initChart();
  updateChart();
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>
