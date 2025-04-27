<template>
  <div class="skills-container d-flex flex-column position-relative px-md-5 px-3" style="min-height: 100vh; background: linear-gradient(135deg, #1a3c5e 0%, #0f2942 100%);">
    <!-- Skill list -->
    <div v-if="skillList.length" class="skills-content py-5 flex-grow-1">
      <h1 class="text-white mb-4 fw-bold"><i class="bi bi-stars me-2"></i>Vos compétences</h1>
      
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="skill in skillList" :key="skill.id" class="col">
          <div class="skill-card card h-100 border-0 shadow rounded-4" 
               :class="{'skill-beginner': skill.level === 'beginner', 
                       'skill-intermediate': skill.level === 'intermediate', 
                       'skill-advanced': skill.level === 'advanced'}">
            <div class="card-header border-0 bg-transparent d-flex justify-content-between pt-3 px-3">
              <span class="badge" :class="{
                'bg-info': skill.level === 'beginner',
                'bg-primary': skill.level === 'intermediate',
                'bg-success': skill.level === 'advanced'
              }">{{ skill.level }}</span>
              <div class="dropdown">
                <button class="btn btn-sm dropdown-toggle text-muted" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><button class="dropdown-item" @click="upgradeLevel(skill.id)">
                    <i class="bi bi-arrow-up-circle me-2"></i>Améliorer
                  </button></li>
                  <li><button class="dropdown-item text-danger" @click="deleteSkill(skill.id)">
                    <i class="bi bi-trash me-2"></i>Supprimer
                  </button></li>
                </ul>
              </div>
            </div>
            <div class="card-body p-4">
              <h5 class="card-title fw-bold mb-3">{{ skill.name }}</h5>
              <div class="skill-level-progress mb-3">
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar" :class="{
                    'bg-info w-25': skill.level === 'beginner',
                    'bg-primary w-50': skill.level === 'intermediate',
                    'bg-success w-100': skill.level === 'advanced'
                  }" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
              <p class="card-text text-muted d-flex align-items-center">
                <i class="bi bi-clock me-2"></i>
                <small>Acquis il y a {{ getTimeAgo(skill.createdAt) }}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add Skill Button -->
      <button @click="showCreateForm = true" v-if="!showCreateForm" 
              class="btn add-skill-btn mt-5 d-flex align-items-center fw-bold">
        <i class="bi bi-plus-circle-fill me-2"></i> Ajouter une compétence
      </button>
    </div>
    
    <!-- Empty state -->
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
              <input
                type="text"
                id="skill"
                class="form-control"
                placeholder="Nom de la compétence"
                v-model="newSkill"
                required
              />
            </div>
          </div>

          <div class="mb-4">
            <label for="level" class="form-label fw-semibold">Niveau</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-bar-chart-fill"></i></span>
              <select
                id="level"
                class="form-select"
                v-model="level"
                required
              >
                <option value="" disabled>Sélectionnez un niveau</option>
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
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
              <i class="bi bi-plus-lg me-2"></i> Ajouter
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
  await addSkill(userId, newSkill.value, level.value)
  showCreateForm.value = false
  await fetchSkills()
}

async function deleteSkill(skillId) {
  try {
    await deleteDoc(doc(db, 'users', userId, 'skills', skillId))
    await fetchSkills()
    console.log(`Skill with ID ${skillId} deleted successfully.`)
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
      if (skillData.level === 'advanced') {
        alert("Cette compétence est déjà au niveau maximum.")
        return
      }
      const newLevel = skillData.level === 'beginner' ? 'intermediate' : 'advanced'
      await updateDoc(skillRef, { level: newLevel })
      await fetchSkills()
    } else {
      console.log("Document non trouvé !")
    }
  } catch (error) {
    console.error("Erreur lors de l'amélioration de la compétence:", error)
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
/* Thème océan */
.skills-container {
  background-color: #0f2942;
  color: #fff;
}

/* Styliser les cartes de compétence */
.skill-card {
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.95);
  overflow: hidden;
  position: relative;
}

.skill-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
}

.skill-beginner::before {
  background-color: #17a2b8; /* info */
}

.skill-intermediate::before {
  background-color: #0d6efd; /* primary */
}

.skill-advanced::before {
  background-color: #198754; /* success */
}

.skill-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
}

/* Bouton d'ajout de compétence */
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

/* Formulaire */
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

/* Animation pour l'apparition du formulaire */
.form-overlay {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .skill-card {
    margin-bottom: 15px;
  }
}
</style>