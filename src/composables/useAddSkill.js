import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'

export function useAddSkill() {
  const newSkill = ref('')
  const level = ref('')
  const aquDate = ref('') 
  const db = getFirestore()

  const route = useRoute()
  const userId = route.params.userId

  async function addSkill() {
    if (!newSkill.value.trim() || !level.value) {
      alert("Please enter a skill and select a level")
      return
    }

    try {
      const skillsCollectionRef = collection(db, "users", userId, "skills")

      // If no date is selected, use the current date
      const aquDateToStore = aquDate.value ? new Date(aquDate.value) : new Date()
      const aquDateTimestamp = Timestamp.fromDate(aquDateToStore)

      await addDoc(skillsCollectionRef, {
        name: newSkill.value.trim(),
        level: level.value,
        createdAt: aquDateTimestamp
      })

      console.log(`Skill "${newSkill.value}" added successfully`)
      newSkill.value = ''
      level.value = ''
      aquDate.value = '' // Reset aquDate after adding skill
    } catch (err) {
      console.error("Error adding skill:", err.message)
    }
  }

  return {
    newSkill,
    level,
    aquDate,
    addSkill
  }
}
