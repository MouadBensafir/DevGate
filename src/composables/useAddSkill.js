import { ref, inject } from 'vue'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

export function useAddSkill() {
  const newSkill = ref('')
  const level = ref('')
  const db = getFirestore()
  const user = inject('userDoc')

  async function addSkill() {
    if (!newSkill.value.trim() || !level.value) {
      alert("Please enter a skill and select a level")
      return
    }

    try {
      const skillsCollectionRef = collection(db, "users", user.value.uid, "skills")
      await addDoc(skillsCollectionRef, {
        name: newSkill.value.trim(),
        level: level.value,
        createdAt: new Date()
      })

      console.log(`Skill "${newSkill.value}" added successfully`)
      newSkill.value = ''
      level.value = ''
    } catch (err) {
      console.error("Error adding skill:", err.message)
    }
  }

  return {
    newSkill,
    level,
    addSkill
  }
}
