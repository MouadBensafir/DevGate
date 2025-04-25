<template>
  <div>
    <form @submit.prevent="addSkill">
      <h2 class="text-center">Add a Skill</h2>
      <div class="mb-3">
        <label for="skill" class="form-label">Skill</label>
        <input type="text" class="form-control" id="skill" placeholder="Enter your skill" v-model="new_skill" required />
      </div>
      <div class="mb-3">
        <label for="level" class="form-label">Level</label>
        <select class="form-select" id="level" required>
          <option value="" disabled selected>Select your level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <button type="submit">Add a skill</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getFirestore, doc, setDoc, arrayUnion } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const new_skill = ref('')
const db = getFirestore()
const user = ref(getAuth().currentUser)

async function addSkill() {
  if (!new_skill.value.trim()) {
    alert("No skill entered")
    return
  }

  if (!user.value) {
    alert("User not authenticated")
    return
  }

  try {
    await setDoc(doc(db, "users", user.value.uid), {
      skills: arrayUnion(new_skill.value.trim())
    }, { merge: true })

    console.log(`Skill added: ${new_skill.value} successfully`)
    new_skill.value = '' // Clear input after adding
  } catch (err) {
    console.error("Error adding skill:", err.message)
  }
}
</script>



<style scoped>

</style>