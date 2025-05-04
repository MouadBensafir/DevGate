<template>
  <div class="skills-container d-flex flex-column px-md-5 px-3" style="min-height: 100vh; background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state d-flex flex-column justify-content-center align-items-center py-5 flex-grow-1">
      <div class="spinner-container mb-4">
        <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <h2 class="text-white mb-2">Loading your skills...</h2>
      <p class="text-white-50 text-center">Please wait while we fetch your skills data</p>
    </div>

    <!-- Skill list -->
    <div v-else-if="skillList.length" class="skills-content py-5 flex-grow-1">
      <h1 class="text-white mb-4 fw-bold"><i class="bi bi-stars me-2"></i>My Skills</h1>
      
      <div class="skill-board bg-white rounded-4 shadow p-4">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Skill Name</th>
                <th scope="col" width="200px">Level</th>
                <th scope="col">Progress Bar</th>
                <th scope="col">Acquisition Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <SkillItem 
                v-for="skill in skillList" 
                :key="skill.id" 
                :skill="skill"
                @upgrade="upgradeLevel"
                @downgrade="downgradeLevel"
                @delete="deleteSkill"
              />
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Skill Button -->
      <button @click="showCreateForm = true" v-if="!showCreateForm" class="btn add-skill-btn mt-4 d-flex align-items-center fw-bold">
        <i class="bi bi-plus-circle-fill me-2"></i> Add a new Skill
      </button>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state d-flex flex-column justify-content-center align-items-center py-5 flex-grow-1">
      <img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/icons/journal-code.svg" alt="No skills" class="mb-4" width="80" height="80" style="filter: invert(1);">
      <h2 class="text-white mb-3">Start tracking your skills today!</h2>
      <p class="text-white-50 mb-4 text-center">Add your first Skills to see your progess</p>
      <button @click="showCreateForm = true" class="btn add-skill-btn">
        <i class="bi bi-plus-circle-fill me-2"></i> Add a Skill
      </button>
    </div>

    <!-- Form Overlay -->
    <div v-if="showCreateForm" class="form-overlay position-fixed top-0 start-0 w-100 h-100" style="background-color: rgba(15, 41, 66, 0.85); z-index: 1050;">
      <div class="container py-5 d-flex align-items-center justify-content-center h-100">
        <form @submit.prevent="skillUpdate" class="skill-form card p-4 shadow-lg border-0 rounded-4 mx-auto" style="max-width: 500px;">
          <div class="text-end mb-2">
            <button type="button" class="btn-close" @click="showCreateForm = false"></button>
          </div>
          <h2 class="text-center mb-4 fw-bold">Add a brand new skill to your skill set !</h2>

          <div class="mb-3">
            <label for="skill" class="form-label fw-semibold">Skill Name</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-code-slash"></i></span>
              <input type="text" id="skill" class="form-control" placeholder="Name of the skill" v-model="newSkill" required />
            </div>
          </div>

          <div class="mb-4">
            <label for="level" class="form-label fw-semibold">Level</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-bar-chart-fill"></i></span>
              <select id="level" class="form-select" v-model="level" required>
                <option value="" disabled>Select a level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Avanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label for="aquisition" class="form-label fw-semibold">Acquisition Date</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-calendar-event"></i></span>
              <input type="date" id="aquisition" v-model="aquDate" class="form-control" />
            </div>
          </div>

          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg fw-bold">
              <i class="bi bi-plus-lg me-2"></i> Add
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, deleteDoc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore'
import { useAddSkill } from '@/composables/useAddSkill'
import { useFetchSkills } from '@/composables/useFetchSkills'
import { db } from '@/firebase'
import SkillItem from '@/components/SkillItem.vue'

const showCreateForm = ref(false)
const isLoading = ref(false)
const route = useRoute()
const userId = route.params.userId

const { newSkill, level, aquDate, addSkill } = useAddSkill()
const { skillList, fetchSkills } = useFetchSkills(userId)

onMounted(async () => {
  isLoading.value = true
  await fetchSkills()
  isLoading.value = false
})

async function skillUpdate() {
  await addSkill(userId, newSkill.value, level.value, aquDate.value)
  showCreateForm.value = false
  await fetchSkills()
}

async function deleteSkill(skillId) {
  try {
    const skillRef = doc(db, 'users', userId, 'skills', skillId)
    const skillDoc = await getDoc(skillRef)
    const skillData = skillDoc.data()
    if (!skillData) return

    await deleteDoc(doc(db, 'users', userId, 'skills', skillId))
    await fetchSkills()

    // Adding action to the actions collection
    const actionCollectionRef = collection(db, "users", userId, "actions")
      await addDoc(actionCollectionRef, {
        title: skillData.name,
        type: "skill",
        action: "delete",
        date: new Date(),
        description: `Deleted skill "${skillData.name}"`
      })
  } catch (error) {
    console.error("Error deleting skill:", error)
  }
}

async function upgradeLevel(skillId) {
  try {
    const skillRef = doc(db, 'users', userId, 'skills', skillId)
    const skillDoc = await getDoc(skillRef)

    if (skillDoc.exists()) {
      const skillData = skillDoc.data()
      const levels = ['beginner', 'intermediate', 'advanced', 'expert']
      const currentIndex = levels.indexOf(skillData.level)

      if (currentIndex === -1 || currentIndex === levels.length - 1) {
        alert("Cette compétence est déjà au niveau maximum.")
        return
      }

      const newLevel = levels[currentIndex + 1]
      await updateDoc(skillRef, { level: newLevel })

      // Adding action to the actions collection
      const actionCollectionRef = collection(db, "users", userId, "actions")
      await addDoc(actionCollectionRef, {
        title: skillData.name,
        type: "skill",
        action: "level up",
        date: new Date(),
        description: `Level Up skill "${skillData.name}" to level "${newLevel}"`
      })

      await fetchSkills()
    }
  } catch (error) {
    console.error("Erreur lors de l'amélioration de la compétence:", error)
  }
}

async function downgradeLevel(skillId) {
  try {
    const skillRef = doc(db, 'users', userId, 'skills', skillId)
    const skillDoc = await getDoc(skillRef)

    if (skillDoc.exists()) {
      const skillData = skillDoc.data()
      const levels = ['beginner', 'intermediate', 'advanced', 'expert']
      const currentIndex = levels.indexOf(skillData.level)

      if (currentIndex === -1 || currentIndex === 0) {
        alert("Cette compétence est déjà au niveau minimum.")
        return
      }

      const newLevel = levels[currentIndex - 1]
      await updateDoc(skillRef, { level: newLevel })
      // Adding action to the actions collection
      const actionCollectionRef = collection(db, "users", userId, "actions")
      await addDoc(actionCollectionRef, {
        title: skillData.name,
        type: "skill",
        action: "level down",
        date: new Date(),
        description: `Level Down skill "${skillData.name}" to level "${newLevel}"`
      })

      await fetchSkills()
    }
  } catch (error) {
    console.error("Erreur lors de la dégradation de la compétence:", error)
  }
}
</script>

<style scoped>
/* Ocean theme */
.skills-container {
  background-color: #0f2942;
  color: #fff;
}

.skill-board {
  border-left: 5px solid #5b86e5;
  transition: all 0.3s ease;
}

/* Button styling */
.add-skill-btn {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 25px;
  box-shadow: 0 4px 15px rgba(91, 134, 229, 0.4);
  transition: all 0.3s ease;
}

.add-skill-btn:hover {
  box-shadow: 0 6px 20px rgba(91, 134, 229, 0.6);
  transform: translateY(-2px);
}

/* Form styling */
.skill-form {
  background: white;
}

.skill-form .btn-primary {
  background: linear-gradient(45deg, #36d1dc, #5b86e5);
  border: none;
}

.skill-form .input-group-text {
  background-color: #f8f9fa;
  color: #5b86e5;
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

/* Animation for form appearance */
.form-overlay {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
}
</style>