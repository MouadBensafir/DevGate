import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

export default function useGoogleLogin() {
  const error = ref(null)
  const successMessage = ref(null)
  const router = useRouter()

  const loginWithGoogle = async () => {
    const auth = getAuth()
    const db = getFirestore()
    const provider = new GoogleAuthProvider()
    error.value = null
    successMessage.value = null

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        profilePicture: user.photoURL,
        githubUsername: '',
        bio: 'No real bio yet',
        createdAt: new Date(),
      }, { merge: true })

      await router.push('/')
      successMessage.value = `Welcome ${user.displayName}!`
    } catch (err) {
      error.value = err.message
    }
  }

  return { loginWithGoogle, error, successMessage }
}
