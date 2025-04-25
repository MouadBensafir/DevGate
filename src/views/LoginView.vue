<template>
  <div class="login-container">
    <form @submit.prevent="login" class="p-4 rounded shadow-sm">
      <h2 class="text-center text-success main-title mb-4">Login to an Account</h2>

      <div class="mb-3">
        <label for="email" class="form-label text-brown">Email :</label>
        <input type="email" id="email" placeholder="Email" v-model="email" class="form-control" />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label text-brown">Password :</label>
        <input type="password" id="password" placeholder="Password" v-model="password" class="form-control" />
      </div>

      <div class="mb-3 text-end">
        <a href="#" @click.prevent="forgotPassword" class="text-decoration-none text-brown small">Forgot Password?</a>
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-success w-100">Login</button>
      </div>

      <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
      <p v-if="successMessage" class="text-success text-center mt-3">{{ successMessage }}</p>

      <hr />

      <div class="text-center">
        <button @click.prevent="loginWithGoogle" class="btn btn-outline-danger w-100">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" class="me-2" />
          Continue with Google
        </button>
      </div>


      <p class="text-center mt-3 mb-0 text-brown">Don’t have an account?</p>
      <div class="text-center">
        <router-link to="/register" class="btn btn-outline-success mt-2">Register</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import useLogin from '@/composables/useLogin'
import useGoogleLogin from '@/composables/useGoogleLogin'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

const { email, password, error, login } = useLogin()
const {
  loginWithGoogle,
  error: googleError,
  successMessage: googleSuccess,
} = useGoogleLogin()

const successMessage = ref('')

// Watch for Google login messages
watch(googleError, val => { if (val) error.value = val })
watch(googleSuccess, val => { if (val) successMessage.value = val })

const forgotPassword = async () => {
  const auth = getAuth()
  const db = getFirestore()
  error.value = ''
  successMessage.value = ''

  if (!email.value) {
    error.value = 'Please enter your email to reset your password.'
    return
  }

  try {
    const q = query(collection(db, 'users'), where('email', '==', email.value.trim().toLowerCase()))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      error.value = 'No user found with this email in the database.'
      return
    }

    await sendPasswordResetEmail(auth, email.value.trim().toLowerCase())
    successMessage.value = 'Password reset email sent. Check your inbox.'
  } catch (err) {
    error.value = err.message
  }
}
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f2f7f3;
  padding: 20px;
}

form {
  width: 100%;
  max-width: 500px;
}

.main-title {
  color: #4CAF50;
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 40px;
  margin-bottom: 30px;
  position: relative;
}

.main-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background-color: #8B4513;
  margin: 10px auto 0 auto;
  border-radius: 2px;
}

.text-brown {
  color: #8B4513;
}

.bg-light {
  background-color: #f9f9f9;
}

.form-control {
  border: 1px solid #8B4513;
}

.btn-success {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.btn-success:hover {
  background-color: #45a049;
}

.btn-outline-success {
  color: #4CAF50;
  border-color: #4CAF50;
}

.btn-outline-success:hover {
  background-color: #4CAF50;
  color: white;
}

.btn-outline-danger {
  color: #DB4437;
  border-color: #DB4437;
}

.btn-outline-danger:hover {
  background-color: #DB4437;
  color: white;
}
</style>
