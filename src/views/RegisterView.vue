<template>
  <div class="ocean-register-container">
    <form @submit.prevent="register" class="ocean-register-form p-4 rounded shadow-lg">
      <h2 class="text-center ocean-title mb-4">Create an Account</h2>

      <!-- Google Sign In Button -->
      <div class="text-center">
        <button @click="signInWithGoogle" type="button" class="btn ocean-btn-google w-100">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" class="me-2" />
          Continue with Google
        </button>
      </div>

      <div class="ocean-divider my-4">
        <span>or</span>
      </div>

      <!-- First & Last Name -->
      <div class="row mb-3">
        <div class="col">
          <label for="firstname" class="form-label ocean-label">First Name :</label>
          <div class="ocean-input-group">
            <i class="bi bi-person ocean-input-icon"></i>
            <input type="text" id="firstname" placeholder="First name" v-model="firstname" class="form-control ocean-input" />
          </div>
        </div>
        <div class="col">
          <label for="lastname" class="form-label ocean-label">Last Name :</label>
          <div class="ocean-input-group">
            <i class="bi bi-person ocean-input-icon"></i>
            <input type="text" id="lastname" placeholder="Last name" v-model="lastname" class="form-control ocean-input" />
          </div>
        </div>
      </div>

      <!-- Email & Password -->
      <div class="mb-3">
        <label for="email" class="form-label ocean-label">Email :</label>
        <div class="ocean-input-group">
          <i class="bi bi-envelope ocean-input-icon"></i>
          <input type="email" id="email" placeholder="Your email address" v-model="email" class="form-control ocean-input" />
        </div>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label ocean-label">Password :</label>
        <div class="ocean-input-group">
          <i class="bi bi-lock ocean-input-icon"></i>
          <input type="password" id="password" placeholder="Your password" v-model="password" class="form-control ocean-input" />
        </div>
      </div>

      <!-- Birthday -->
      <div class="mb-3">
        <label for="birthday" class="form-label ocean-label">Birthday :</label>
        <div class="ocean-input-group">
          <i class="bi bi-calendar ocean-input-icon"></i>
          <input type="date" id="birthday" v-model="birthday" class="form-control ocean-input" />
        </div>
      </div>

      <!-- Profile Picture Upload -->
      <div class="mb-3">
        <label class="form-label ocean-label">Profile Picture :</label>
        <div
          class="ocean-upload-box rounded p-3 text-center position-relative"
          @dragover.prevent
          @drop="handleFileDrop"
          @click="triggerFileInput"
        >
          <input
            type="file"
            ref="fileInput"
            class="d-none"
            @change="handleFileSelect"
          />
          <div v-if="!pdp" class="upload-placeholder">
            <i class="bi bi-person-circle fs-1 ocean-icon"></i>
            <p class="ocean-text-muted mb-0">Click or drag a profile image</p>
          </div>
          <div v-else class="position-relative">
            <img
              :src="pdp"
              alt="Profile Picture"
              class="img-fluid rounded shadow-sm"
              style="max-height: 200px; object-fit: cover"
            />
            <button
              type="button"
              class="btn btn-sm ocean-btn-remove position-absolute top-0 end-0 m-2"
              @click.stop="pdp = ''"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        <small class="form-text ocean-text-muted">Or enter a direct image link below:</small>
        <div class="ocean-input-group mt-2">
          <i class="bi bi-link-45deg ocean-input-icon"></i>
          <input type="text" class="form-control ocean-input" placeholder="https://example.com/image.jpg" v-model="pdp" />
        </div>
      </div>

      <!-- Bio -->
      <div class="mb-4">
        <label for="bio" class="form-label ocean-label">Biography :</label>
        <div class="ocean-input-group">
          <i class="bi bi-file-text ocean-input-icon" style="top: 16px;"></i>
          <textarea id="bio" placeholder="Tell us about yourself..." v-model="bio" class="form-control ocean-input ocean-textarea"></textarea>
        </div>
      </div>

      <!-- Submit -->
      <div class="text-center">
        <button type="submit" class="btn ocean-btn-primary w-100">
          <i class="bi bi-person-plus me-2"></i>Register
        </button>
      </div>

      <p v-if="error" class="ocean-error text-center mt-3">{{ error }}</p>

      <div class="ocean-login-prompt mt-4">
        <p class="text-center mb-2">Already have an account?</p>
        <router-link to="/login" class="btn ocean-btn-secondary w-100">
          <i class="bi bi-box-arrow-in-right me-2"></i>Login
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'register-view'
}
</script>

<script setup>
import { ref } from 'vue';
import useSignup from '@/composables/useSignup';
import useGoogleSignIn from '@/composables/useGoogleSignIn';

const { signInWithGoogle } = useGoogleSignIn();
const { email, password, firstname, lastname, bio, birthday, error, pdp, register } = useSignup();

// File upload handlers
const fileInput = ref(null);

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      pdp.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

function handleFileDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      pdp.value = reader.result;
    };
    reader.readAsDataURL(file);
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

.ocean-register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a4b6c, #1a7b9b);
  padding: 20px;
}

.ocean-register-form {
  width: 100%;
  max-width: 650px;
  background-color: white;
  border-radius: 15px;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 25px rgba(10, 75, 108, 0.2);
}

.ocean-title {
  color: #0a4b6c;
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
  background: linear-gradient(135deg, #1a7b9b, #64b5d9);
  margin: 10px auto 0 auto;
  border-radius: 2px;
}

.ocean-label {
  color: #0a4b6c;
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
  color: #1a7b9b;
  z-index: 10;
}

.ocean-input {
  padding-left: 40px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  height: 48px;
}

.ocean-textarea {
  min-height: 100px;
  padding-top: 14px;
}

.ocean-input:focus {
  border-color: #0fb8c9;
  box-shadow: 0 0 0 3px rgba(15, 184, 201, 0.2);
}

.ocean-upload-box {
  background-color: #f8f8f8;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px dashed #64b5d9;
}

.ocean-upload-box:hover {
  background-color: #e6f7ff;
  border-color: #0fb8c9;
}

.ocean-icon {
  color: #1a7b9b;
  transition: transform 0.3s ease-in-out;
}

.ocean-upload-box:hover .ocean-icon {
  transform: scale(1.2);
}

.ocean-text-muted {
  color: #6c757d;
}

.ocean-btn-primary {
  background: linear-gradient(135deg, #1a7b9b, #64b5d9);
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(10, 75, 108, 0.1);
}

.ocean-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 14px rgba(10, 75, 108, 0.15);
  background: linear-gradient(135deg, #1a7b9b, #0fb8c9);
}

.ocean-btn-secondary {
  background-color: #e6f7ff;
  border: none;
  color: #0a4b6c;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.ocean-btn-secondary:hover {
  background-color: #d1eeff;
  color: #1a7b9b;
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

.ocean-btn-remove {
  background-color: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.ocean-btn-remove:hover {
  background-color: #e74c3c;
  transform: scale(1.1);
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
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
  padding: 10px;
  border-radius: 6px;
  margin-top: 15px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .ocean-register-form {
    padding: 20px 15px;
  }
  
  .ocean-title {
    font-size: 1.75rem;
  }
}
</style>