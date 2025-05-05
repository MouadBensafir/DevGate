<template>
  <div
    class="dashboard-container d-flex flex-column px-md-5 px-3"
    style="
      min-height: 100vh;
      background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);
    "
  >
    <!-- Login State -->
    <div
      v-if="!loggedIn"
      class="text-center d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5"
    >
      <i
        class="bi bi-box-arrow-in-right"
        style="font-size: 4rem; color: #5b86e5"
      ></i>
      <h2 class="mt-3 text-white fw-bold">Welcome to Your Dashboard</h2>
      <p class="text-white-50 mb-4">
        Sign in to unlock personalized insights and track your progress.
      </p>
      <router-link to="/login" class="btn btn-outline-light px-4 py-2">
        <i class="bi bi-person-circle me-2"></i>Log In
      </router-link>
    </div>

    <div v-else>
      <!-- Loading State -->
      <div
        v-if="loading"
        class="loading-state d-flex flex-column justify-content-center align-items-center py-5 flex-grow-1"
      >
        <div class="spinner-container mb-4">
          <div
            class="spinner-border text-light"
            role="status"
            style="width: 3rem; height: 3rem"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <h2 class="text-white mb-2">Loading your dashboard...</h2>
        <p class="text-white-50 text-center">
          Please wait while we prepare your insights
        </p>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="dashboard-content py-4 flex-grow-1">
        <div
          class="d-flex justify-content-between align-items-center pt-4 mb-4"
        >
          <h1 class="mb-0 text-white fw-bold">
            <i class="bi bi-speedometer2 me-2"></i>Development Dashboard
          </h1>
          <div>
            <button
              @click="showModal = true"
              class="btn btn-outline-light px-4 py-2 me-2"
            >
              <i class="bi bi-clock-history me-2"></i>Log Coding Hours
            </button>
            <button
              v-if="!userInfo.githubUsername"
              @click="linkGitHubAccount"
              :disabled="isLoading"
              class="github-button"
            >
              <i class="bi bi-github me-2"></i>
              {{ isLoading ? "Connecting..." : "Link GitHub Account" }}
            </button>
          </div>
        </div>

        <!-- Modal for Logging Coding Hours -->
        <div v-if="showModal" class="modal-overlay">
          <div class="modal-content">
            <h2 class="modal-title">Log Coding Hours</h2>
            <form @submit.prevent="submitCodedHours">
              <div class="form-group">
                <label for="date">Date</label>
                <input
                  type="date"
                  id="date"
                  v-model="form.date"
                  class="form-control"
                  required
                />
              </div>
              <div class="form-group d-flex gap-3">
                <div class="flex-grow-1">
                  <label for="hours">Hours</label>
                  <input
                    type="number"
                    id="hours"
                    v-model="form.hours"
                    class="form-control"
                    min="0"
                    step="1"
                    required
                  />
                </div>
                <div class="flex-grow-1">
                  <label for="minutes">Minutes</label>
                  <input
                    type="number"
                    id="minutes"
                    v-model="form.minutes"
                    class="form-control"
                    min="0"
                    max="59"
                    step="1"
                    required
                  />
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Submit</button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="showModal = false"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="successMessage" class="success-message">
          <p>{{ successMessage }}</p>
        </div>

        <!-- Main Content Area -->
        <div class="main-content">
          <!-- Top Section - Projects and Info -->
          <div class="top-section mb-5">
            <div class="row g-4">
              <!-- Projects Section - Left -->
              <div class="col-lg-8">
                <div class="section-container projects-section h-100">
                  <div class="section-header">
                    <h2 class="text-white">
                      <i class="bi bi-kanban me-2"></i>Current Projects
                    </h2>
                    <router-link
                      :to="`users/${userInfo?.uid}/projects`"
                      class="view-more"
                    >
                      View All<i class="bi bi-arrow-right ms-2"></i>
                    </router-link>
                  </div>

                  <div class="projects-grid">
                    <div
                      v-for="project in projectsData.filter(project => !project.completed)"
                      :key="project.id"
                      class="project-item"
                    >
                      <div class="project-image">
                        <img
                          :src="project.image"
                          alt="project-image"
                          class="img-fluid"
                        />
                      </div>
                      <div class="project-details">
                        <h3>{{ project.name }}</h3>
                        <p class="project-description">
                          {{ project.description }}
                        </p>
                        <div class="project-meta">
                          <span class="project-date">
                            <i class="bi bi-calendar3 me-1"></i
                            >{{ project.date.toDate().toLocaleDateString() }}
                          </span>
                          <a
                            v-if="project.github"
                            :href="project.github"
                            class="github-link"
                            target="_blank"
                          >
                            <i class="bi bi-github me-1"></i>View on GitHub
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Side - Skills and Objectives -->
              <div class="col-lg-4">
                <!-- Skills Section -->
                <!-- GitHub Timeline -->
                <div class="section-container github-timeline-section mb-4">
                  <div class="section-header">
                    <h2 class="text-white">
                      <i class="bi bi-git me-2"></i>GitHub Activity
                    </h2>
                  </div>
                  <div class="github-timeline-content">
                    <TimeLine :username="userInfo.githubUsername" />
                    <div v-if="error" class="error-message">
                      <p>{{ error }}</p>
                    </div>
                  </div>
                </div>
                <!-- Skills Section -->
                <div class="section-container skills-section mb-4">
                  <div class="section-header">
                    <h2 class="text-white">
                      <i class="bi bi-lightning-charge me-2"></i>Skill Levels
                    </h2>
                    <router-link
                      :to="`users/${userInfo?.uid}/skill-tracker`"
                      class="view-more"
                    >
                      View All<i class="bi bi-arrow-right ms-2"></i>
                    </router-link>
                  </div>

                  <div class="skills-list p-3">
                    <div class="skill-items-container">
                      <div v-if="skillsData.length > 0">
                        <div
                          v-for="skill in skillsData"
                          :key="skill.name"
                          class="skill-item"
                          :class="{
                            'skill-beginner': skill.level === 'beginner',
                            'skill-intermediate': skill.level === 'intermediate',
                            'skill-advanced': skill.level === 'advanced',
                            'skill-expert': skill.level === 'expert',
                          }"
                        >
                          <div class="skill-info">
                            <span class="skill-name">{{ skill.name }}</span>
                            <span class="skill-level text-capitalize">{{
                              skill.level
                            }}</span>
                          </div>
                          <div class="progress" style="height: 10px">
                            <div
                              class="progress-bar"
                              :class="{
                                'bg-info': skill.level === 'beginner',
                                'bg-primary': skill.level === 'intermediate',
                                'bg-success': skill.level === 'advanced',
                                'bg-danger': skill.level === 'expert',
                              }"
                              :style="{
                                width:
                                  skill.level === 'beginner'
                                    ? '25%'
                                    : skill.level === 'intermediate'
                                    ? '50%'
                                    : skill.level === 'advanced'
                                    ? '75%'
                                    : '100%',
                              }"
                              role="progressbar"
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <span>Add A new Skill</span>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Objectives Section -->
                <div class="section-container objectives-section">
                  <div class="section-header">
                    <h2 class="text-white">
                      <i class="bi bi-check2-circle me-2"></i>Current Objectives
                    </h2>
                    <router-link :to="`users/${userInfo?.uid}/objectives`" class="view-more">
                      View All<i class="bi bi-arrow-right ms-2"></i>
                    </router-link>
                  </div>
                  
                  <div class="objectives-list">
                    <div v-for="objective in objectivesData.filter(o => !o.completed).slice(0, 5)" :key="objective.description" class="objective-item">
                      <div class="objective-icon">
                        <i class="bi bi-circle"></i>
                      </div>
                      <div class="objective-details">
                        <span class="objective-description">{{ objective.description }}</span>
                      </div>
                    </div>
                    <div v-if="objectivesData.filter(o => !o.completed).length === 0" class="no-objectives">
                      <p>No active objectives. Create some goals!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="charts-section">
            <div class="row g-4">
              <!-- Row 1 -->
              <div class="col-md-6" v-if="projectsData.length > 0">
                <div class="section-container chart-container">
                  <div class="section-header">
                    <h2 class="text-white">
                      <i class="bi bi-check2-circle me-2"></i>Projects Status
                    </h2>
                  </div>
                  <div class="chart-content">
                    <PieChartProjects :projects="projectsData" />
                  </div>
                </div>
              </div>
              <div class="col-md-6" v-if="skillsData.length > 0">
                <div class="section-container chart-container">
                  <div class="section-header">
                    <h2 class="text-white">
                      <i class="bi bi-pie-chart-fill me-2"></i>Skills Distribution
                    </h2>
                  </div>
                  <div class="chart-content">
                    <SkillLevelChart :skills="skillsData" />
                  </div>
                </div>
              </div>

              <!-- Row 2 -->
              <div class="col-md-6" v-if="objectivesData.length > 0">
                <div class="section-container chart-container">
                  <div class="section-header">
                    <h2 class="text-white">
                      <i class="bi bi-check2-circle me-2"></i>Objectives Status
                    </h2>
                  </div>
                  <div class="chart-content">
                    <PieChartObjectives :objectives="objectivesData" />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="section-container chart-container">
                  <div class="section-header">
                    <h2 class="text-white">
                      <i class="bi bi-clock-history me-2"></i>Coded Hours (Last 4 Months)
                    </h2>
                  </div>
                  <div class="chart-content">
                    <CodedHoursPerMonth />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Objectives Timeline -->
          <div class="col-12" v-if="objectivesData.length > 0">
            <div class="section-container chart-container">
              <div class="section-header">
                <h2 class="text-white">
                  <i class="bi bi-calendar3 me-2"></i>Objectives Timeline
                </h2>
              </div>
              <div class="chart-content" >
                <GanttChart :tasks="objectivesData" />
              </div>
            </div>
          </div>

          <!-- Activity Timeline -->
          <div class="col-12">
            <div class="section-container chart-container">
              <div class="section-header">
                <h2 class="text-white">
                  <i class="bi bi-activity me-2"></i>Recent Activity
                </h2>
              </div>
              <div class="chart-content">
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
import { ref, onMounted, watch, inject, reactive } from "vue";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import SkillLevelChart from "@/components/PieChartSkill.vue";
import GanttChart from "@/components/GanttChart.vue";
import getUser from "@/composables/getUser";
import PieChartObjectives from "@/components/PieChartOjectives.vue";
import PieChartProjects from "@/components/PieChartProjects.vue";
import RealTimeLine from "@/components/RealTimeLine.vue";
import useLinkGitHub from "@/composables/useLinkGitHub";
import TimeLine from "@/components/TimeLine.vue";
import CodedHoursPerMonth from "@/components/CodedHoursPerMonth.vue"


const { linkGitHubAccount, error, isLoading } = useLinkGitHub();
const skillsData = ref([]);
const objectivesData = ref([]);
const projectsData = ref([]);
const loading = ref(true);
const { user } = getUser();
const userInfo = inject("userDoc");
const loggedIn = inject("logged_in");

const showModal = ref(false);
const form = reactive({ date: "", hours: "", minutes: "" });
const successMessage = ref("");

const submitCodedHours = async () => {
  const today = new Date().toISOString().split("T")[0];
  if (
    !form.date ||
    (!form.hours && !form.minutes) ||
    isNaN(form.hours) ||
    isNaN(form.minutes) ||
    form.date > today
  ) {
    successMessage.value =
      "Invalid input. Please ensure the date is in the past and values are valid.";
    setTimeout(() => (successMessage.value = ""), 3000);
    return;
  }

  try {
    const totalHours = parseFloat(form.hours) + parseFloat(form.minutes) / 60;
    await addDoc(collection(db, "users", user.value.uid, "codedhours"), {
      date: form.date,
      hours: totalHours,
      timestamp: new Date(),
    });
    successMessage.value = "Coding hours logged successfully!";
    setTimeout(() => (successMessage.value = ""), 3000);
    showModal.value = false;
    form.date = "";
    form.hours = "";
    form.minutes = "";
  } catch (error) {
    console.error("Error logging coding hours:", error);
    successMessage.value = "Failed to log coding hours. Please try again.";
    setTimeout(() => (successMessage.value = ""), 3000);
  }
};

// Fetch skills
const fetchSkills = async () => {
  const querySnapshot = await getDocs(
    collection(db, "users", user.value.uid, "skills")
  );
  skillsData.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Fetch objectives
const fetchObjectives = async () => {
  const querySnapshot = await getDocs(
    collection(db, "users", user.value.uid, "objectives")
  );
  objectivesData.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Fetch Projects
const fetchProjects = async () => {
  loading.value = true;
  try {
    const querySnapshot = await getDocs(
      collection(db, "users", user.value.uid, "projects")
    );
    projectsData.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Projects fetched: ", projectsData.value);
  } catch (error) {
    console.error("Error fetching projects: ", error);
  } finally {
    loading.value = false;
  }
};

// Fetch both
const fetchData = async () => {
  try {
    if (!user.value?.uid) return;
    loading.value = true;
    await Promise.all([fetchSkills(), fetchObjectives(), fetchProjects()]);
    console.log(skillsData.value.length > 0)
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

// Watch user and fetch data
watch(
  user,
  (newUser) => {
    if (newUser) fetchData();
  },
  { immediate: true }
);

onMounted(() => {
  if (user.value) fetchData();
});


</script>

<style scoped>
/* Ocean theme base */
.dashboard-container {
  color: #fff;
  min-height: 100vh;
}

/* Sections styling */
.section-container {
  background: #ffffff; /* White background */
  border-radius: 12px;
  border-left: 3px solid rgba(91, 134, 229, 0.7);
  padding: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.section-container:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #1a3c5e; /* Ocean blue header */
  border-bottom: 1px solid rgba(91, 134, 229, 0.3);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.section-header h2 {
  font-size: 1.3rem;
  margin: 0;
  font-weight: 600;
}

.view-more {
  color: #5b86e5;
  font-size: 0.9rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.view-more:hover {
  color: #36d1dc;
}

/* Projects styling */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* Keep the projects section with the original styling */
.projects-section {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.projects-section:hover {
  background: rgba(255, 255, 255, 0.2);
}

.projects-section .section-header {
  background: rgba(35, 80, 120, 0.6);
}

.project-item {
  background: rgba(30, 60, 90, 0.5);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.project-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.project-image {
  height: 160px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.project-item:hover .project-image img {
  transform: scale(1.05);
}

.project-details {
  padding: 15px;
}

.project-details h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #fff;
}

.project-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9); /* More visible text */
  margin-bottom: 12px;
  overflow: hidden;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.project-date {
  color: rgba(255, 255, 255, 0.8); /* More visible date */
}

.github-link {
  color: #5b86e5;
  text-decoration: none;
  transition: color 0.2s;
}

.github-link:hover {
  color: #36d1dc;
}

/* Skills styling */
.skills-list {
  padding: 15px;
}

.skill-item {
  margin-bottom: 12px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.skill-name {
  font-weight: 500;
  color: #333; /* Dark text for white background */
}

.skill-level {
  color: #666; /* Medium gray text for white background */
  font-size: 0.9rem;
}

.skill-progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.2); /* Lighter progress background */
  border-radius: 3px;
}

.skill-progress-bar {
  height: 100%;
  background: linear-gradient(to right, #36d1dc, #5b86e5);
  border-radius: 3px;
}

/* Objectives styling */
.objectives-list {
  padding: 15px;
}

.objective-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* Light gray border */
}

.objective-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.objective-icon {
  margin-right: 12px;
  color: #5b86e5;
  font-size: 1.1rem;
}

.objective-description {
  font-size: 0.95rem;
  color: #333; /* Dark text for white background */
}

.no-objectives {
  text-align: center;
  padding: 20px;
  color: #666; /* Medium gray text for white background */
}

/* GitHub timeline */
.github-timeline-content {
  padding: 20px;
}

.error-message {
  color: #e74c3c;
  padding: 10px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 6px;
  text-align: center;
  margin-top: 15px;
}

/* Charts section */
.chart-container {
  height: 100%;
}

.chart-content {
  padding: 20px;
  height: calc(100% - 56px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff; /* Ensure white background in chart areas */
  color: #333; /* Dark text in chart content */
}

/* GitHub button */
.github-button {
  background-color: rgba(60, 70, 80, 0.8); /* Lighter button */
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.github-button:hover:not(:disabled) {
  background-color: #24292e;
  transform: translateY(-2px);
}

.github-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes color-change {
  0% {
    border-color: #36d1dc;
    border-right-color: transparent;
  }
  50% {
    border-color: #5b86e5;
    border-right-color: transparent;
  }
  100% {
    border-color: #36d1dc;
    border-right-color: transparent;
  }
}

/* Mobile responsiveness */
@media (max-width: 992px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .section-container {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .section-header h2 {
    font-size: 1.1rem;
  }

  .chart-content {
    min-height: 250px;
  }
}

/* Modal styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-primary {
  background: #5b86e5;
  color: #fff;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #36d1dc;
}

.btn-secondary {
  background: #ccc;
  color: #333;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #bbb;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Success message styling */
.success-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #2a9cbf; /* Darker shade of blue */
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Slightly darker shadow */
  animation: fadeInOut 3s ease-in-out;
  z-index: 1001;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  10%,
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>