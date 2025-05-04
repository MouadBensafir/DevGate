<template>
  <div class="profile-container">
    <!-- Header Section -->
    <div class="profile-header text-center mb-5">
      <h1 class="profile-title">Profile Page</h1>
      <div class="title-divider"></div>
    </div>

    <!-- Main Profile Content -->
    <div class="container profile-content">
      <div class="row">
        <!-- Left Column - Profile Picture & Basic Info -->
        <div class="col-lg-4">
          <div class="profile-card shadow-sm rounded-4 p-4 mb-4">
            <!-- Edit Button -->
            <div v-if="user.id === connectedUser?.uid" class="text-end mb-3">
              <button
                class="btn btn-edit"
                @click="changingProfile = !changingProfile"
              >
                <i class="bi" :class="changingProfile ? 'bi-x-lg' : 'bi-pencil-fill'"></i>
                {{ changingProfile ? "Cancel" : "Edit Profile" }}
              </button>
            </div>

            <!-- Profile Picture Section -->
            <div class="profile-picture-section text-center mb-4">
              <div v-if="changingProfile">
                <label class="form-label">Profile Picture</label>
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
                    <i class="bi bi-person-plus-fill fs-1"></i>
                    <p class="mt-2 mb-0">Click or drag to upload</p>
                  </div>
                  <div v-else class="position-relative">
                    <img
                      :src="pdp"
                      alt="Profile Picture"
                      class="img-fluid rounded-circle shadow"
                      style="width: 180px; height: 180px; object-fit: cover"
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
                  class="img-fluid rounded-circle shadow mb-3"
                  style="width: 180px; height: 180px; object-fit: cover"
                />
                <h2 class="profile-name">{{ user?.firstname }} {{ user?.lastname }}</h2>
                <p class="text-muted">{{ user?.email }}</p>
                <p class="text-muted small">
                  <i class="bi bi-calendar me-1"></i>
                  Joined: {{ formatDate(user?.createdAt) }}
                </p>
              </div>
            </div>

            <!-- Edit Form Fields -->
            <div v-if="changingProfile" class="profile-edit-fields">
              <div class="mb-3">
                <label class="form-label">First Name</label>
                <input
                  type="text"
                  v-model="user.firstname"
                  class="form-control"
                  placeholder="First name"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Last Name</label>
                <input
                  type="text"
                  v-model="user.lastname"
                  class="form-control"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Bio & Additional Info -->
        <div class="col-lg-8">
          <div class="profile-card shadow-sm rounded-4 p-4 mb-4 h-100">
            <h3 class="section-title">
              <i class="bi bi-person-lines-fill me-2"></i>About
            </h3>
            <div v-if="changingProfile">
              <textarea
                class="form-control profile-bio"
                v-model="user.bio"
                rows="6"
                placeholder="Tell us about yourself..."
              ></textarea>
              <button
                class="btn btn-save mt-3"
                @click="saveChanges"
              >
                <i class="bi bi-save me-2"></i>Save Changes
              </button>
            </div>
            <p v-else class="profile-bio-text">
              {{ user?.bio || "No bio provided" }}
            </p>

            <!-- Send Message Button -->
            <div v-if="connectedUser?.uid !== user.id" class="mt-3">
              <button class="btn btn-secondary" @click="sendMessage">Send Message</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects Section -->
      <div class="profile-section mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="section-title">
            <i class="bi bi-collection me-2"></i>Projects
            <router-link
              :to="{ name: 'projects', params: { userId: userId } }"
              class="btn btn-view-all"
          >
            View All <i class="bi bi-arrow-right ms-1"></i>
          </router-link>
          </h2>
        </div>

        <div class="row g-4">
          <div v-for="project in projects.slice(0, 3)" :key="project.id" class="col-md-4">
            <ProjectItem :user-id="userId" :project-id="project.id"/>
          </div>
        </div>
      </div>

      <!-- Skills Section -->
      <div class="profile-section mt-5">
        <h2 class="section-title mb-4">
          <i class="bi bi-tools me-2"></i>Skills
          <router-link
              :to="{ name: 'skill-tracker', params: { userId: userId } }"
              class="btn btn-view-all"
          >
            View All <i class="bi bi-arrow-right ms-1"></i>
          </router-link>
        </h2>
      </div>
      <div class="skills-container">
          <div v-for="skill in skills" :key="skill.id" class="badge bg-primary me-2 mb-2">
            <SkillItem :skill="skill"/>
          </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {doc, getDoc, getDocs, collection, updateDoc, setDoc} from "firebase/firestore";
import {auth, db} from "@/firebase";
import ProjectItem from "@/components/ProjectItem.vue";
import SkillItem from "@/components/SkillItem.vue";
import getUser from "@/composables/getUser";
import { onAuthStateChanged } from "firebase/auth";

const connectedUser = getUser().user;

onAuthStateChanged(auth, (user) => {
  connectedUser.value = user;
  console.log("updated");
})
const route = useRoute();
const router = useRouter();
const user = ref({
  firstname: "",
  lastname: "",
  pdp: "",
  bio: "",
  birthday: null,
  createdAt: null,
});
let userId = route.params.userId;
const pdp = ref("");
const changingProfile = ref(false);
const projects = ref([]);
const skills = ref([]);
const fileInput = ref(null);

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
  await fetchUser();
  await fetchProjectsAndSkills();
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

// Send message logic (extracted from your original)
async function sendMessage() {
  console.log(connectedUser.value.uid);
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
.profile-container {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 0;
}

.profile-header {
  position: relative;
  padding-bottom: 1rem;
}

.profile-title {
  color: #2c3e50;
  font-weight: 700;
  font-size: 2.5rem;
}

.title-divider {
  height: 4px;
  width: 100px;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  margin: 0 auto;
  border-radius: 2px;
}

.profile-card {
  background-color: white;
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.profile-name {
  color: #2c3e50;
  font-weight: 600;
  margin-top: 1rem;
}

.btn-edit {
  background-color: transparent;
  color: #3498db;
  border: 1px solid #3498db;
  border-radius: 50px;
  padding: 0.5rem 1.25rem;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  background-color: #3498db;
  color: white;
}

.upload-box {
  border: 2px dashed #e0e0e0;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-box:hover {
  border-color: #3498db;
  background-color: #f1f8fe;
}

.upload-placeholder {
  color: #7f8c8d;
}

.profile-bio {
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  resize: none;
}

.profile-bio-text {
  color: #34495e;
  line-height: 1.8;
  white-space: pre-line;
}

.btn-save {
  background-color: #2ecc71;
  color: white;
  border-radius: 50px;
  padding: 0.75rem 2rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-save:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(46, 204, 113, 0.3);
}

.section-title {
  color: #2c3e50;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  border-radius: 3px;
}

.btn-view-all {
  color: #3498db;
  background-color: transparent;
  border: 1px solid #3498db;
  border-radius: 50px;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-view-all:hover {
  background-color: #3498db;
  color: white;
}

@media (max-width: 992px) {
  .profile-title {
    font-size: 2rem;
  }

  .profile-card {
    margin-bottom: 1.5rem;
  }
}
</style>