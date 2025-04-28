<template>
  <div class="skills-container d-flex flex-column px-md-5 px-3" style="min-height: 100vh; background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);">
    <!-- Skill list -->
    <div v-if="skillList.length" class="skills-content py-5 flex-grow-1">
      <h1 class="text-white mb-4 fw-bold"><i class="bi bi-stars me-2"></i>My Skills</h1>
      
      <div class="skill-board bg-white rounded-4 shadow p-4">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Skill Name</th>
                <th scope="col">Level</th>
                <th scope="col">Progress Bar</th>
                <th scope="col">Acquisition Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="skill in skillList" :key="skill.id" 
                  :class="{
                    'skill-beginner': skill.level === 'beginner', 
                    'skill-intermediate': skill.level === 'intermediate', 
                    'skill-advanced': skill.level === 'advanced',
                    'skill-expert': skill.level === 'expert'
                  }">
                <td class="fw-bold">{{ skill.name }}</td>
                <td>
                  <span class="badge" :class="{
                    'bg-info': skill.level === 'beginner',
                    'bg-primary': skill.level === 'intermediate',
                    'bg-success': skill.level === 'advanced',
                    'bg-danger': skill.level === 'expert'
                  }">{{ skill.level }}</span>
                </td>
                <td class="align-middle" style="width: 25%">
                  <div class="progress" style="height: 8px;">
                    <div class="progress-bar" :class="{
                      'bg-info w-25': skill.level === 'beginner',
                      'bg-primary w-50': skill.level === 'intermediate',
                      'bg-success w-75': skill.level === 'advanced',
                      'bg-danger w-100': skill.level === 'expert'
                    }" role="progressbar"></div>
                  </div>
                </td>
                <td>
                  <small class="text-muted d-flex align-items-center">
                    <i class="bi bi-clock me-2"></i>
                    {{ getTimeAgo(skill.createdAt) }}
                  </small>
                </td>
                <td>
                  <div class="d-flex">
                    <button class="btn btn-sm btn-outline-primary me-2" @click="upgradeLevel(skill.id)" 
                           :disabled="skill.level === 'expert'">
                      <i class="bi bi-arrow-up-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning me-2" @click="downgradeLevel(skill.id)"
                           :disabled="skill.level === 'beginner'">
                      <i class="bi bi-arrow-down-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteSkill(skill.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
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
      <h2 class="text-white mb-3">Commencez à suivre vos compétences</h2>
      <p class="text-white-50 mb-4 text-center">Ajoutez vos premières compétences pour visualiser votre progression</p>
      <button @click="showCreateForm = true" class="btn add-skill-btn">
        <i class="bi bi-plus-circle-fill me-2"></i> Ajouter une compétence
      </button>
    </div>

    <!-- Form Overlay -->
    <div v-if="showCreateForm" class="form-overlay position-fixed top-0 start-0 w-100 h-100" style="background-color: rgba(15, 41, 66, 0.85); z-index: 1050;">
      <div class="container py-5 d-flex align-items-center justify-content-center h-100">
        <form @submit.prevent="skillUpdate" class="skill-form card p-4 shadow-lg border-0 rounded-4 mx-auto" style="max-width: 500px;">
          <div class="text-end mb-2">
            <button type="button" class="btn-close" @click="showCreateForm = false"></button>
          </div>
          <h2 class="text-center mb-4 fw-bold">Ajouter une nouvelle compétence</h2>

          <div class="mb-3">
            <label for="skill" class="form-label fw-semibold">Compétence</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-code-slash"></i></span>
              <input type="text" id="skill" class="form-control" placeholder="Nom de la compétence" v-model="newSkill" required />
            </div>
          </div>

          <div class="mb-4">
            <label for="level" class="form-label fw-semibold">Niveau</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-bar-chart-fill"></i></span>
              <select id="level" class="form-select" v-model="level" required>
                <option value="" disabled>Sélectionnez un niveau</option>
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label for="aquisition" class="form-label fw-semibold">Date d'acquisition</label>
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
import { Timestamp, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore'
import { useAddSkill } from '@/composables/useAddSkill'
import { useFetchSkills } from '@/composables/useFetchSkills'
import { db } from '@/firebase'

const showCreateForm = ref(false)
const route = useRoute()
const userId = route.params.userId

const { newSkill, level, aquDate, addSkill } = useAddSkill()
const { skillList, fetchSkills } = useFetchSkills(userId)

onMounted(fetchSkills)

async function skillUpdate() {
  await addSkill(userId, newSkill.value, level.value, aquDate.value)
  showCreateForm.value = false
  await fetchSkills()
}

async function deleteSkill(skillId) {
  try {
    await deleteDoc(doc(db, 'users', userId, 'skills', skillId))
    await fetchSkills()
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
      await fetchSkills()
    }
  } catch (error) {
    console.error("Erreur lors de la dégradation de la compétence:", error)
  }
}

function getTimeAgo(timestamp) {
  const now = new Date()
  const createdAt = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp)

  const diffInMs = now - createdAt
  const diffInSec = Math.floor(diffInMs / 1000)
  const diffInMin = Math.floor(diffInSec / 60)
  const diffInHours = Math.floor(diffInMin / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInMonths = Math.floor(diffInDays / 30)

  if (diffInMonths > 0) {
    return `${diffInMonths} mois`
  } else if (diffInDays > 0) {
    return `${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
  } else if (diffInHours > 0) {
    return `${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
  } else if (diffInMin > 0) {
    return `${diffInMin} minute${diffInMin > 1 ? 's' : ''}`
  } else {
    return `${diffInSec} seconde${diffInSec > 1 ? 's' : ''}`
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

/* Table row styling */
tbody tr {
  border-left: 5px solid transparent;
  transition: all 0.3s ease;
}

tr.skill-beginner {
  border-left-color: #17a2b8;
}

tr.skill-intermediate {
  border-left-color: #0d6efd;
}

tr.skill-advanced {
  border-left-color: #198754;
}

tr.skill-expert {
  border-left-color: #dc3545;
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

/* Action buttons hover effect */
.btn-outline-primary:hover, .btn-outline-warning:hover, .btn-outline-danger:hover {
  transform: scale(1.1);
}

.btn-outline-primary, .btn-outline-warning, .btn-outline-danger {
  transition: all 0.2s ease;
}
</style>