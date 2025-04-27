// src/composables/useFetchSkills.js

import { ref } from 'vue'
import { getFirestore, getDocs, collection } from 'firebase/firestore'

const db = getFirestore()

export function useFetchSkills(userId) {
  const skillList = ref([])

  const fetchSkills = async () => {
    const skillRef = collection(db, 'users', userId, 'skills')
    try {
      const querySnapshot = await getDocs(skillRef)
      skillList.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      // Sort the skills by 'createdAt' in descending order
      skillList.value.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
    } catch (error) {
      console.error("Error fetching skills: ", error)
    }
  }

  return {
    skillList,
    fetchSkills,
  }
}
