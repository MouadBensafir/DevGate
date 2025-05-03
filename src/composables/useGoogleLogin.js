import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default function useGoogleLogin() {
  const error = ref(null)
  const successMessage = ref(null)
  const router = useRouter()

  const loginWithGoogle = async () => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    error.value = null
    successMessage.value = null

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      await router.push('/')
      successMessage.value = `Welcome ${user.displayName}!`
    } catch (err) {
      error.value = err.message
    }
  }

  return { loginWithGoogle, error, successMessage }
}
