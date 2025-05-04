<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { Chart, registerables } from "chart.js";
import getUser from "@/composables/getUser";
import { onAuthStateChanged } from "firebase/auth";

Chart.register(...registerables);

const chart = ref(null);
const canvas = ref(null);
const { user } = getUser();

onAuthStateChanged(auth, (user) => {
  user.value = user;
});

const fetchCodedHours = async () => {
  if (!user.value?.uid) return [];

  const codedHoursRef = collection(db, "users", user.value.uid, "codedhours");
  const querySnapshot = await getDocs(codedHoursRef);

  const data = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    date: new Date(doc.data().date),
  }));

  return data;
};

const processCodedHours = (codedHours) => {
  const months = Array(4).fill(0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  codedHours.forEach(({ date, hours }) => {
    const monthDiff = currentMonth - date.getMonth() + (currentYear - date.getFullYear()) * 12;
    if (monthDiff >= 0 && monthDiff < 4) {
      months[3 - monthDiff] += hours;
    }
  });

  return months;
};

const getLastFourMonthsLabels = () => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const currentMonth = new Date().getMonth();
  return Array.from({ length: 4 }, (_, i) => {
    const monthIndex = (currentMonth - (3 - i) + 12) % 12;
    return monthNames[monthIndex];
  });
};

const renderChart = (data) => {
  const ctx = canvas.value.getContext("2d");

  if (chart.value) {
    chart.value.destroy();
    chart.value = null;
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  }

  chart.value = new Chart(ctx, {
    type: "line",
    data: {
      labels: getLastFourMonthsLabels(),
      datasets: [
        {
          label: "Hours Coded",
          data,
          backgroundColor: "rgba(91, 134, 229, 0.1)", // Light blue fill
          borderColor: "#5b86e5", // Blue line
          borderWidth: 3,
          pointBackgroundColor: "#5b86e5", // Blue points
          pointBorderColor: "#ffffff", // White border for points
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#333333", // Dark grey text
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#333333", // Dark grey text
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)", // Very light grid lines
          },
        },
        y: {
          ticks: {
            color: "#333333", // Dark grey text
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)", // Very light grid lines
          },
          beginAtZero: true,
        },
      },
    },
  });
};

onMounted(async () => {
  await nextTick(); // Ensure the DOM is updated before accessing canvas
  const codedHours = await fetchCodedHours();
  const processedData = processCodedHours(codedHours);
  renderChart(processedData);
});
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 600px; /* Fixed width */
  height: 400px; /* Fixed height */
  margin: 0 auto;
  background: #ffffff; /* Pure white background */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Light shadow */
}
</style>
