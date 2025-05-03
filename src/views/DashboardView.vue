<template>
  <div class="dashboard-container d-flex flex-column px-md-5 px-3" style="min-height: 100vh; background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);">
    <div v-if="!loggedIn" class="text-center mt-4">
      <h4 class="alert-heading">Welcome to your dashboard!</h4>
      <p>Please log in to view your data.</p>
    </div>

    <div v-else>
      <!-- Loading State -->
      <div
        v-if="loading"
        class="loading-state d-flex flex-column justify-content-center align-items-center py-5 flex-grow-1"
      >
        <div class="spinner-container mb-4">
          <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <h2 class="text-white mb-2">Loading your dashboard...</h2>
        <p class="text-white-50 text-center">Please wait while we prepare your insights</p>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="dashboard-content py-4 flex-grow-1">
        <div class="d-flex justify-content-between align-items-center pt-4 mb-3">
          <h1 class="mb-0 text-white fw-bold">
            <i class="bi bi-speedometer2 me-2"></i>My Dashboard
          </h1>
          <button
            v-if="!userInfo.githubUsername"
            @click="linkGitHubAccount"
            :disabled="isLoading"
            class="github-button"
          >
            <i class="bi bi-github me-2"></i>
            {{ isLoading ? 'Connecting...' : 'Link GitHub Account' }}
          </button>
        </div>

        <!-- Dashboard Grid -->
        <div class="row g-4">
           <!-- Skills Bubble Chart -->
           <div class="col-md-5">
            <div class="dashboard-card h-60">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="m-0">
                  <i class="bi bi-grid-3x3-gap me-2"></i>Skills Bubble Map
                </h5>
              </div>
              <div class="card-body d-flex align-items-center justify-content-center">
                <BubbleChart :skills="skillsData" />
              </div>
            </div>
          </div>

          <div class="col-md-7">
            <!--- Github Timeline -------->
            <div class="dashboard-card h-60 mb-4">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="m-0">
                  <i class="bi bi-list me-2"></i>GitHub Timeline
                </h5>
              </div>
              <div class="card-body d-flex align-items-center justify-content-center">
                <div>
                  <TimeLine :username="userInfo.githubUsername" />
                  <div v-if="error" class="error">
                    <p>{{ error }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills Overview -->
          <div class="col-md-6">
            <div class="dashboard-card h-60">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="m-0">
                  <i class="bi bi-pie-chart-fill me-2"></i>Skills Distribution
                </h5>
              </div>
              <div class="card-body d-flex align-items-center justify-content-center">
                <SkillLevelChart :skills="skillsData" />
              </div>
            </div>
          </div>

          <!-- Objectives Progress -->
          <div class="col-md-6">
            <div class="dashboard-card h-100">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="m-0">
                  <i class="bi bi-check2-circle me-2"></i>Objectives Status
                </h5>
              </div>
              <div class="card-body d-flex align-items-center justify-content-center">
                <PieChartObjectives :objectives="objectivesData" />
              </div>
            </div>
          </div>

          <!-- Project Timeline -->
          <div class="col-12">
            <div class="dashboard-card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="m-0">
                  <i class="bi bi-calendar3 me-2"></i>Objectives Timeline
                </h5>
              </div>
              <div class="card-body">
                <GanttChart :tasks="objectivesData" />
              </div>
            </div>
          </div>

          <!-- Activity Timeline -->
          <div>
            <div class="dashboard-card h-80">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="m-0">
                  <i class="bi bi-activity me-2"></i>Recent Activity
                </h5>
              </div>
              <div class="card-body">
                <RealTimeLine :userId="user?.uid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, inject } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import SkillLevelChart from "@/components/PieChartSkill.vue";
import GanttChart from "@/components/GanttChart.vue";
import getUser from "@/composables/getUser";
import PieChartObjectives from "@/components/PieChartOjectives.vue";
import BubbleChart from "@/components/BubbleChart.vue";
import RealTimeLine from "@/components/RealTimeLine.vue";
import useLinkGitHub from '@/composables/useLinkGitHub';
import TimeLine from "@/components/TimeLine.vue";

const { linkGitHubAccount, error, isLoading } = useLinkGitHub()
const skillsData = ref([]);
const objectivesData = ref([]);
const loading = ref(true);
const { user } = getUser();
const userInfo = inject('userDoc');
const loggedIn = inject('logged_in');

// Fetch skills
const fetchSkills = async () => {
  const querySnapshot = await getDocs(collection(db, "users", user.value.uid, "skills"));
  skillsData.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch objectives
const fetchObjectives = async () => {
  const querySnapshot = await getDocs(collection(db, "users", user.value.uid, "objectives"));
  objectivesData.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch both
const fetchData = async () => {
  try {
    if (!user.value?.uid) return;
    loading.value = true;
    await Promise.all([fetchSkills(), fetchObjectives()]);
    console.log("Data loaded:", { skills: skillsData.value, objectives: objectivesData.value });
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

// Watch user and fetch data
watch(user, (newUser) => {
  if (newUser) fetchData();
}, { immediate: true });

onMounted(() => {
  if (user.value) fetchData();
});
</script>

<style scoped>
/* GitHub button */
.github-button {
  background-color: #24292e;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.github-button:hover:not(:disabled) {
  background-color: #1a1f23;
}

.github-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Ocean theme */
.dashboard-container {
  background-color: #0f2942;
  color: #fff;
}

/* Card styling */
.dashboard-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 5px solid #5b86e5;
}

.dashboard-card:hover {
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
}

.card-header {
  background: linear-gradient(to right, rgba(54, 209, 220, 0.1), rgba(91, 134, 229, 0.1));
  padding: 15px 20px;
  border-bottom: 1px solid rgba(91, 134, 229, 0.2);
}

.card-header h5 {
  color: #1a3c5e;
  font-weight: 600;
}

.card-header .btn {
  color: #5b86e5;
  border: none;
}

.card-header .dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header .dropdown-item i {
  color: #5b86e5;
}

.card-body {
  padding: 20px;
  height: calc(100% - 56px); /* Subtract header height */
  min-height: 250px;
}

/* Button styling */
.btn-outline-light {
  border-radius: 50px;
  padding: 6px 15px;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  border-color: transparent;
}

/* Loading animation */
.spinner-container {
  display: flex;
  justify-content: center;
}

.spinner-border {
  color: #36d1dc;
  animation: spin 1.2s linear infinite, color-change 3s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes color-change {
  0% { border-color: #36d1dc; border-right-color: transparent; }
  50% { border-color: #5b86e5; border-right-color: transparent; }
  100% { border-color: #36d1dc; border-right-color: transparent; }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .dashboard-card {
    margin-bottom: 20px;
  }
  
  .card-body {
    min-height: 200px;
  }
}
</style>