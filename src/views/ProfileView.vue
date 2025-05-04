<template>
  <div class="profile-container d-flex flex-column px-md-5 px-3" style="min-height: 100vh; background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state d-flex flex-column justify-content-center align-items-center py-5 flex-grow-1">
      <div class="spinner-container mb-4">
        <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <h2 class="text-white mb-2">Loading profile...</h2>
      <p class="text-white-50 text-center">Please wait while we fetch user data</p>
    </div>

    <!-- Main Profile Content -->
    <div v-else class="profile-content py-5 flex-grow-1">
      <h1 class="text-white mb-4 fw-bold"><i class="bi bi-person-circle me-2"></i>Profile</h1>
      
      <div class="profile-board bg-white rounded-4 shadow p-4">
        <div class="row g-4">
          <!-- Left Column - Profile Picture & Basic Info -->
          <div class="col-lg-4">
            <div class="profile-card h-100">
              <!-- Edit Button -->
              <div v-if="user.id === connectedUser?.uid" class="text-end mb-3">
                <button
                  class="btn btn-ocean-action"
                  @click="changingProfile = !changingProfile"
                >
                  <i class="bi" :class="changingProfile ? 'bi-x-lg' : 'bi-pencil-fill'"></i>
                  {{ changingProfile ? "Cancel" : "Edit Profile" }}
                </button>
              </div>

              <!-- Profile Picture Section -->
              <div class="profile-picture-section text-center mb-4">
                <div v-if="changingProfile">
                  <label class="form-label fw-bold">Profile Picture</label>
                  <div
                    class="upload-box rounded-3 p-4 text-center"
                    @dragover.prevent
                    @drop="handleFileDrop"
                    @click="triggerFileInput"
                  >
                    <input
                      type="file"
                      ref="fileInput"
                      class="d-none"
                      @change="handleFileSelect"
                    />
                    <div v-if="!pdp" class="upload-placeholder">
                      <i class="bi bi-person-plus-fill fs-1 text-ocean"></i>
                      <p class="mt-2 mb-0">Click or drag to upload</p>
                    </div>
                    <div v-else class="position-relative">
                      <img
                        :src="pdp"
                        alt="Profile Picture"
                        class="img-fluid rounded-circle profile-image shadow"
                      />
                      <button
                        type="button"
                        class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
                        @click.stop="pdp = ''"
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    class="form-control mt-3"
                    placeholder="Or enter image URL"
                    v-model="pdp"
                  />
                </div>
                <div v-else class="text-center">
                  <img
                    :src="user?.pdp || 'https://via.placeholder.com/150'"
                    alt="Profile Picture"
                    class="img-fluid rounded-circle profile-image shadow mb-3"
                  />
                  <h2 class="profile-name">{{ user?.firstname }} {{ user?.lastname }}</h2>
                  <p class="text-secondary mb-1">{{ user?.email }}</p>
                  <p class="text-muted small">
                    <i class="bi bi-calendar me-1"></i>
                    Joined: {{ formatDate(user?.createdAt) }}
                  </p>
                </div>
              </div>

              <!-- Send Message Button for other users -->
              <div v-if="connectedUser?.uid !== user.id" class="mt-3 text-center">
                <button class="btn btn-ocean-action" @click="sendMessage">
                  <i class="bi bi-chat-dots-fill me-2"></i>Send Message
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column - Bio & Additional Info -->
          <div class="col-lg-8">
            <div class="profile-card h-100">
              <!-- Edit Form Fields -->
              <div v-if="changingProfile">
                <h3 class="section-title mb-4">
                  <i class="bi bi-pencil-square me-2"></i>Edit Profile
                </h3>
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">First Name</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-person"></i></span>
                      <input
                        type="text"
                        v-model="user.firstname"
                        class="form-control"
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Last Name</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-person"></i></span>
                      <input
                        type="text"
                        v-model="user.lastname"
                        class="form-control"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold">About Me</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-file-text"></i></span>
                    <textarea
                      class="form-control profile-bio"
                      v-model="user.bio"
                      rows="6"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>
                </div>
                
                <button
                  class="btn btn-ocean-save mt-3"
                  @click="saveChanges"
                >
                  <i class="bi bi-save me-2"></i>Save Changes
                </button>
              </div>
              
              <!-- Bio Display -->
              <div v-else>
                <h3 class="section-title mb-4">
                  <i class="bi bi-person-lines-fill me-2"></i>About
                </h3>
                <div class="bio-container">
                  <p class="profile-bio-text">
                    {{ user?.bio || "No bio provided" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Section -->
      <div class="mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="text-white fw-bold">
            <i class="bi bi-stars me-2"></i>Skills
          </h2>
          <router-link
            :to="{ name: 'skill-tracker', params: { userId: userId } }"
            class="btn btn-ocean-action"
          >
            View All <i class="bi bi-arrow-right ms-1"></i>
          </router-link>
        </div>
        
        <div class="skills-board bg-white rounded-4 shadow p-4">
          <div v-if="skills.length" class="skills-container">
            <div v-for="skill in skills.slice(0, 8)" :key="skill.id" class="skill-badge">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-level" :class="'level-' + skill.level">{{ skill.level }}</span>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <i class="bi bi-clipboard-x fs-1 text-muted"></i>
            <p class="mt-3 mb-0">No skills added yet</p>
          </div>
        </div>
      </div>

      <!-- Projects Section -->
      <div class="mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="text-white fw-bold">
            <i class="bi bi-collection me-2"></i>Projects
          </h2>
          <router-link
            :to="{ name: 'projects', params: { userId: userId } }"
            class="btn btn-ocean-action"
          >
            View All <i class="bi bi-arrow-right ms-1"></i>
          </router-link>
        </div>
        
        <div class="row g-4">
          <div v-for="project in projects.slice(0, 3)" :key="project.id" class="col-md-4">
            <ProjectItem :user-id="userId" :project-id="project.id"/>
          </div>
          <div v-if="!projects.length" class="col-12">
            <div class="bg-white rounded-4 shadow p-5 text-center">
              <i class="bi bi-folder-x fs-1 text-muted"></i>
              <p class="mt-3 mb-0">No projects added yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc, getDocs, collection, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import ProjectItem from "@/components/ProjectItem.vue";
import getUser from "@/composables/getUser";
import { onAuthStateChanged } from "firebase/auth";

const connectedUser = getUser().user;
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const user = ref({
  firstname: "",
  lastname: "",
  pdp: "",
  bio: "",
  birthday: null,
  createdAt: null,
});
const userId = route.params.userId;
const pdp = ref("");
const changingProfile = ref(false);
const projects = ref([]);
const skills = ref([]);
const fileInput = ref(null);

onAuthStateChanged(auth, (user) => {
  connectedUser.value = user;
});

// Format date for display
function formatDate(date) {
  if (!date) return "Unknown";
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
}

async function fetchUser() {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      user.value = {
        id: userDoc.id,
        ...userDoc.data(),
      };
      pdp.value = user.value.pdp || "";
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

async function fetchProjectsAndSkills() {
  try {
    const projectsSnapshot = await getDocs(collection(db, "users", userId, "projects"));
    projects.value = projectsSnapshot.docs.map(doc => ({id: doc.id}));

    const skillsSnapshot = await getDocs(collection(db, "users", userId, "skills"));
    skills.value = skillsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

onMounted(async () => {
  isLoading.value = true;
  await fetchUser();
  await fetchProjectsAndSkills();
  isLoading.value = false;
});

// File upload handlers
function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file?.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      pdp.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

function handleFileDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file?.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      pdp.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

async function saveChanges() {
  if (!changingProfile.value) return;

  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      pdp: pdp.value,
      bio: user.value.bio,
    });
    changingProfile.value = false;
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}

// Send message function
async function sendMessage() {
  if (!connectedUser.value?.uid || !user.value.id) return;
  const currentUid = connectedUser.value.uid;
  const targetUid = user.value.id;

  const groupID = currentUid > targetUid ? currentUid + targetUid : targetUid + currentUid;
  const group = {
    groupMembers: [currentUid, targetUid],
    date: new Date(),
    groupID,
  };

  const groupRef = doc(db, "groups", groupID);
  const groupSnap = await getDoc(groupRef);
  if (!groupSnap.exists()) {
    await setDoc(groupRef, group);
  }

  router.push("/discussion/" + groupID);
}
</script>

<style scoped>
/* Ocean theme styling */
.profile-container {
  background-color: #0f2942;
  color: #fff;
}

.profile-board, .skills-board {
  border-left: 5px solid #5b86e5;
  transition: all 0.3s ease;
}

.profile-board:hover, .skills-board:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
}

.profile-card {
  border: none;
  transition: all 0.3s ease;
}

.profile-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border: 4px solid rgba(91, 134, 229, 0.2);
}

/* Button styling */
.btn-ocean-action {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  box-shadow: 0 4px 15px rgba(91, 134, 229, 0.4);
  transition: all 0.3s ease;
}

.btn-ocean-action:hover {
  box-shadow: 0 6px 20px rgba(91, 134, 229, 0.6);
  transform: translateY(-2px);
}

.btn-ocean-save {
  background: linear-gradient(45deg, #2ecc71, #5b86e5);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 25px;
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4);
  transition: all 0.3s ease;
}

.btn-ocean-save:hover {
  box-shadow: 0 6px 20px rgba(46, 204, 113, 0.6);
  transform: translateY(-2px);
}

/* Section styling */
.section-title {
  color: #1a3c5e;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #36d1dc, #5b86e5);
  border-radius: 3px;
}

/* Profile bio */
.bio-container {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid #5b86e5;
  min-height: 150px;
}

.profile-bio-text {
  color: #2c3e50;
  line-height: 1.8;
  white-space: pre-line;
}

.profile-name {
  color: #1a3c5e;
  font-weight: 600;
}

/* Skills styling */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(45deg, #1a3c5e, #0f2942);
  color: white;
  border-radius: 50px;
  padding: 8px 16px;
  font-size: 0.9rem;
  box-shadow: 0 3px 10px rgba(15, 41, 66, 0.2);
  transition: all 0.3s ease;
}

.skill-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(15, 41, 66, 0.3);
}

.skill-name {
  margin-right: 8px;
}

.skill-level {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.level-beginner {
  background-color: #3498db;
}

.level-intermediate {
  background-color: #2ecc71;
}

.level-advanced {
  background-color: #f39c12;
}

.level-expert {
  background-color: #e74c3c;
}

/* Upload box styling */
.upload-box {
  border: 2px dashed #36d1dc;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-box:hover {
  border-color: #5b86e5;
  background-color: #f1f8fe;
}

.upload-placeholder {
  color: #5b86e5;
}

.text-ocean {
  color: #5b86e5;
}

/* Form styling */
.form-control:focus, .input-group-text {
  border-color: #5b86e5;
  box-shadow: 0 0 0 0.2rem rgba(91, 134, 229, 0.25);
}

.input-group-text {
  background-color: #f8f9fa;
  color: #5b86e5;
}

/* Loading animation */
.spinner-container {
  display: flex;
  justify-content: center;
}

.spinner-border {
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
@media (max-width: 992px) {
  .profile-board {
    padding: 1.5rem;
  }
  
  .profile-image {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
}
</style>