<template>
  <div v-if="skillList.length" class="show-skills px-5">
    <h1>Your skills :</h1>
    <div class="row row-cols-1">
      <div v-for="skill in skillList" :key="skill.id" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ skill.name }}</h5>
            <p class="card-text">Level: {{ skill.level }}</p>
            <p class="card-text">
              {{ getTimeAgo(skill.createdAt) }} ago
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container py-5">
    <form @submit.prevent="addSkill" class="card p-4 shadow-sm">
      <h2 class="text-center mb-4">Add a Skill</h2>

      <div class="mb-3">
        <label for="skill" class="form-label">Skill</label>
        <input
          type="text"
          id="skill"
          class="form-control"
          placeholder="Enter your skill"
          v-model="newSkill"
          required
        />
      </div>

      <div class="mb-4">
        <label for="level" class="form-label">Level</label>
        <select
          id="level"
          class="form-select"
          v-model="level"
          required
        >
          <option value="" disabled>Select your level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary w-100">
        Add Skill
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAddSkill } from '@/composables/useAddSkill'
import { getFirestore, getDocs, collection } from 'firebase/firestore'

const db = getFirestore()

const skillList = ref([])
const route = useRoute()
const userId = route.params.userId

onMounted(() => {
  const skillRef = collection(db, 'users', userId, 'skills')
  getDocs(skillRef)
    .then((querySnapshot) => {
      skillList.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      // Sort the skills by 'createdAt' in descending order
      skillList.value.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
    })
    .catch((error) => {
      console.error("Error fetching skills: ", error)
    })
})

const { newSkill, level, addSkill } = useAddSkill()

// Function to calculate how much time has passed since the skill was added
function getTimeAgo(timestamp) {
  const now = new Date()
  const createdAt = timestamp.toDate() // Firebase timestamp needs to be converted to JavaScript Date
  const diffInMs = now - createdAt
  const diffInSec = Math.floor(diffInMs / 1000)
  const diffInMin = Math.floor(diffInSec / 60)
  const diffInHours = Math.floor(diffInMin / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInMonths = Math.floor(diffInDays / 30)

  if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''}`
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`
  } else if (diffInMin > 0) {
    return `${diffInMin} minute${diffInMin > 1 ? 's' : ''}`
  } else {
    return `${diffInSec} second${diffInSec > 1 ? 's' : ''}`
  }
}
</script>

<style scoped>
/* Grid layout for the skills */
.show-skills .row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

/* Optional extra styling */
h2 {
  font-weight: bold;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>
