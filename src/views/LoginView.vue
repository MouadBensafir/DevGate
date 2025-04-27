<template>
  <div class="ocean-login-container">
    <form @submit.prevent="login" class="ocean-login-form p-4 rounded shadow-lg">
      <h2 class="text-center ocean-title mb-4">Login to your Account</h2>

      <div class="mb-4">
        <label for="email" class="form-label ocean-label">Email :</label>
        <div class="ocean-input-group">
          <i class="bi bi-envelope ocean-input-icon"></i>
          <input type="email" id="email" placeholder="Votre adresse email" v-model="email" class="form-control ocean-input" />
        </div>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label ocean-label">Mot de passe :</label>
        <div class="ocean-input-group">
          <i class="bi bi-lock ocean-input-icon"></i>
          <input type="password" id="password" placeholder="Votre mot de passe" v-model="password" class="form-control ocean-input" />
        </div>
      </div>

      <div class="mb-4 text-end">
        <a href="#" @click.prevent="forgotPassword" class="ocean-link small">Forgot Password ?</a>
      </div>

      <div class="text-center">
        <button type="submit" class="btn ocean-btn-primary w-100">
          <i class="bi bi-box-arrow-in-right me-2"></i>Login
        </button>
      </div>

      <p v-if="error" class="ocean-error text-center mt-3">{{ error }}</p>
      <p v-if="successMessage" class="ocean-success text-center mt-3">{{ successMessage }}</p>

      <div class="ocean-divider my-4">
        <span>ou</span>
      </div>

      <div class="text-center">
        <button @click.prevent="loginWithGoogle" class="btn ocean-btn-google w-100">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" class="me-2" />
          Continue with Google
        </button>
      </div>

      <div class="ocean-register-prompt mt-4">
        <p class="text-center mb-2">Already have an account ?</p>
        <router-link to="/register" class="btn ocean-btn-secondary w-100">
          <i class="bi bi-person-plus me-2"></i>Register
        </router-link>
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
    error.value = 'Veuillez saisir votre email pour réinitialiser votre mot de passe.'
    return
  }

  try {
    const q = query(collection(db, 'users'), where('email', '==', email.value.trim().toLowerCase()))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      error.value = 'Aucun utilisateur trouvé avec cet email dans la base de données.'
      return
    }

    await sendPasswordResetEmail(auth, email.value.trim().toLowerCase())
    successMessage.value = 'Email de réinitialisation envoyé. Vérifiez votre boîte de réception.'
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
:root {
  --ocean-primary: #1a7b9b;
  --ocean-secondary: #64b5d9;
  --ocean-accent: #0fb8c9;
  --ocean-light: #e6f7ff;
  --ocean-dark: #0a4b6c;
  --ocean-gradient: linear-gradient(135deg, var(--ocean-primary), var(--ocean-secondary));
  --ocean-shadow: 0 10px 25px rgba(10, 75, 108, 0.2);
  --ocean-error: #e74c3c;
  --ocean-success: #2ecc71;
}

.ocean-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a4b6c, #1a7b9b);
  padding: 20px;
}

.ocean-login-form {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 15px;
  position: relative;
  z-index: 2;
  box-shadow: var(--ocean-shadow);
}

.ocean-title {
  color: var(--ocean-dark);
  font-size: 2rem;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 30px;
  font-family: 'Poppins', sans-serif;
  position: relative;
}

.ocean-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: var(--ocean-gradient);
  margin: 10px auto 0 auto;
  border-radius: 2px;
}

.ocean-label {
  color: var(--ocean-dark);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.ocean-input-group {
  position: relative;
}

.ocean-input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--ocean-primary);
  z-index: 10;
}

.ocean-input {
  padding-left: 40px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  height: 48px;
}

.ocean-input:focus {
  border-color: var(--ocean-accent);
  box-shadow: 0 0 0 3px rgba(15, 184, 201, 0.2);
}

.ocean-link {
  color: var(--ocean-primary);
  text-decoration: none;
  transition: all 0.3s ease;
}

.ocean-link:hover {
  color: var(--ocean-accent);
  text-decoration: underline;
}

.ocean-btn-primary {
  background: var(--ocean-gradient);
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(10, 75, 108, 0.1);
}

.ocean-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 14px rgba(10, 75, 108, 0.15);
  background: linear-gradient(135deg, var(--ocean-primary), var(--ocean-accent));
}

.ocean-btn-secondary {
  background-color: var(--ocean-light);
  border: none;
  color: var(--ocean-dark);
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.ocean-btn-secondary:hover {
  background-color: #d1eeff;
  color: var(--ocean-primary);
}

.ocean-btn-google {
  background-color: white;
  border: 2px solid #e0e0e0;
  color: #757575;
  padding: 11px 25px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.ocean-btn-google:hover {
  background-color: #f8f8f8;
  border-color: #d0d0d0;
}

.ocean-divider {
  display: flex;
  align-items: center;
  text-align: center;
}

.ocean-divider::before,
.ocean-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.ocean-divider span {
  padding: 0 15px;
  color: #999;
  font-size: 0.9rem;
}

.ocean-error {
  color: var(--ocean-error);
  background-color: rgba(231, 76, 60, 0.1);
  padding: 10px;
  border-radius: 6px;
  margin-top: 15px;
}

.ocean-success {
  color: var(--ocean-success);
  background-color: rgba(46, 204, 113, 0.1);
  padding: 10px;
  border-radius: 6px;
  margin-top: 15px;
}

.ocean-register-prompt {
  color: var(--ocean-dark);
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .ocean-login-form {
    padding: 20px 15px;
  }
  
  .ocean-title {
    font-size: 1.75rem;
  }
}

</style>