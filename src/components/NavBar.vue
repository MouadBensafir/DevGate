<template>
  <div class="ocean-navbar-wrapper">
    <!-- Version mobile (horizontale) -->
    <nav class="ocean-navbar-mobile d-md-none py-2 px-3">
      <div class="d-flex justify-content-between align-items-center">
        <!-- Logo -->
        <router-link to="/" class="ocean-logo d-flex align-items-center">
          <i class="bi bi-water me-2 fs-4"></i>
          <span class="fw-bold fs-5">DevApp</span>
        </router-link>
        
        <!-- Toggle button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="btn ocean-toggle-btn">
          <i class="bi" :class="mobileMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
        </button>
      </div>
      
      <!-- Menu mobile déplié -->
      <div class="ocean-mobile-menu py-3" :class="{ 'show': mobileMenuOpen }">
        <!-- User Info -->
        <div class="ocean-user-info d-flex align-items-center mb-3 p-2">
          <div class="ocean-avatar me-3">
            <img
              v-if="logged_in && userInfo?.pdp"
              :src="userInfo?.pdp"
              alt="profile"
              class="rounded-circle"
              width="42"
              height="42"
            />
            <div v-else class="ocean-guest-avatar d-flex align-items-center justify-content-center">
              <i class="bi bi-person-fill"></i>
            </div>
          </div>
          <div class="d-flex flex-column">
            <span class="ocean-username fw-semibold">
              {{ logged_in ? userInfo?.firstname : 'Invité' }}
            </span>
            <small class="ocean-useremail text-truncate" style="max-width: 200px;">
              {{ logged_in ? userInfo?.email : 'Non connecté' }}
            </small>
          </div>
        </div>
        
        <!-- Navigation Links -->
        <div class="ocean-nav-links">
          <template v-if="!logged_in">
            <router-link to="/register" class="ocean-nav-item d-flex align-items-center mb-2 p-2" @click="mobileMenuOpen = false">
              <i class="bi bi-person-plus me-3"></i>
              <span>S'inscrire</span>
            </router-link>
            <router-link to="/login" class="ocean-nav-item d-flex align-items-center mb-2 p-2" @click="mobileMenuOpen = false">
              <i class="bi bi-box-arrow-in-right me-3"></i>
              <span>Se connecter</span>
            </router-link>
          </template>
          <template v-else>
            <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/projects`" class="ocean-nav-item d-flex align-items-center mb-2 p-2" @click="mobileMenuOpen = false">
              <i class="bi bi-folder me-3"></i>
              <span>Mes Projets</span>
            </router-link>
            <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/skill-tracker`" class="ocean-nav-item d-flex align-items-center mb-2 p-2" @click="mobileMenuOpen = false">
              <i class="bi bi-graph-up me-3"></i>
              <span>Mes Compétences</span>
            </router-link>
            <button @click="logout" class="ocean-nav-item logout-btn d-flex align-items-center mb-2 p-2 w-100 text-start">
              <i class="bi bi-box-arrow-right me-3"></i>
              <span>Déconnexion</span>
            </button>
          </template>
        </div>
      </div>
    </nav>
    
    <!-- Version Desktop (verticale) -->
    <nav class="ocean-sidebar d-none d-md-flex flex-column vh-100 p-3">
      <!-- User Info -->
      <div class="ocean-user-info d-flex align-items-center mb-4 p-3">
        <div class="ocean-avatar me-3 position-relative">
          <img
            v-if="logged_in && userInfo?.pdp"
            :src="userInfo?.pdp"
            alt="profile"
            class="rounded-circle"
            width="48"
            height="48"
          />
          <div v-else class="ocean-guest-avatar d-flex align-items-center justify-content-center">
            <i class="bi bi-person-fill"></i>
          </div>
        </div>
        <div class="d-flex flex-column overflow-hidden">
          <span class="ocean-username fw-semibold text-truncate" style="max-width: 140px;">
            {{ logged_in ? userInfo?.firstname : 'Invité' }}
          </span>
          <small class="ocean-useremail text-truncate" style="max-width: 140px;">
            {{ logged_in ? userInfo?.email : 'Non connecté' }}
          </small>
        </div>
      </div>
      
      <!-- Navigation Links -->
      <div class="ocean-nav-links mb-4">
        <template v-if="!logged_in">
          <router-link to="/register" class="ocean-nav-item d-flex align-items-center mb-3 p-3">
            <i class="bi bi-person-plus me-3"></i>
            <span>S'inscrire</span>
          </router-link>
          <router-link to="/login" class="ocean-nav-item d-flex align-items-center mb-3 p-3">
            <i class="bi bi-box-arrow-in-right me-3"></i>
            <span>Se connecter</span>
          </router-link>
        </template>
        <template v-else>
          <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/projects`" class="ocean-nav-item d-flex align-items-center mb-3 p-3">
            <i class="bi bi-folder me-3"></i>
            <span>Mes Projets</span>
          </router-link>
          <router-link v-if="userInfo && userInfo.uid" :to="`/users/${userInfo?.uid}/skill-tracker`" class="ocean-nav-item d-flex align-items-center mb-3 p-3">
            <i class="bi bi-graph-up me-3"></i>
            <span>Mes Compétences</span>
          </router-link>
          <button @click="logout" class="ocean-nav-item logout-btn d-flex align-items-center mb-3 p-3 w-100 text-start">
            <i class="bi bi-box-arrow-right me-3"></i>
            <span>Déconnexion</span>
          </button>
        </template>
      </div>
      
      <!-- Spacer -->
      <div class="flex-grow-1 ocean-spacer"></div>
      
      <!-- Brand / Logo -->
      <router-link
        to="/"
        class="ocean-logo-btn btn d-flex align-items-center justify-content-center gap-2 mt-auto p-3"
      >
        <i class="bi bi-water fs-4"></i>
        <span class="fw-bold">DevApp</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { useRouter } from 'vue-router'
import { doc, updateDoc } from 'firebase/firestore'

const logged_in = inject('logged_in')
const userInfo = inject('userDoc')
const router = useRouter()
const mobileMenuOpen = ref(false)

onMounted(async () => {
  try {
    if (auth.currentUser) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        isOnline: true
      });
    }
  } catch (err) {
    console.log('Error while setting presence:', err)
  }
})

const logout = async () => {
  try {
    await signOut(auth)
    console.log('Logged out successfully')
    mobileMenuOpen.value = false
    await router.push('/')
  } catch (err) {
    console.log('Error while logging out:', err)
  }
}
</script>

<style scoped>
/* Thème Océan - Variables */
:root {
  --ocean-deep: #0f2942;
  --ocean-medium: #1a3c5e;
  --ocean-light: #2c5f8a;
  --ocean-accent: #36d1dc;
  --ocean-accent2: #5b86e5;
  --ocean-text: #000000;
  --ocean-text-secondary: rgba(255, 255, 255, 0.75);
  --wave-pattern: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Barre latérale */
.ocean-sidebar {
  border-right: 1px solid rgba(91, 134, 229, 0.2);
  top: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1000;
  background-color: var(--ocean-deep);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.ocean-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: var(--wave-pattern);
  opacity: 0.6;
  z-index: 0;
  pointer-events: none;
}

/* Barre mobile */
.ocean-navbar-mobile {
  background: linear-gradient(90deg, var(--ocean-deep) 0%, var(--ocean-medium) 100%) !important;
  color: var(--ocean-text);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
}


.ocean-toggle-btn {
  background: linear-gradient(135deg, var(--ocean-accent), var(--ocean-accent2));
  color: var(--ocean-deep);
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.ocean-toggle-btn:hover, .ocean-toggle-btn:focus {
  background: linear-gradient(135deg, var(--ocean-accent2), var(--ocean-accent));
  color: var(--ocean-deep);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.ocean-mobile-menu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-in-out;
}

.ocean-mobile-menu.show {
  max-height: 500px; /* Ajustez cette valeur en fonction de la taille de votre menu */
}

/* Logo */
.ocean-logo {
  color: var(--ocean-text);
  text-decoration: none;
  transition: all 0.3s ease;
}

.ocean-logo:hover {
  color: var(--ocean-accent);
  transform: scale(1.05);
}

/* Informations utilisateur */
.ocean-user-info {
  background: linear-gradient(135deg, rgba(44, 95, 138, 0.5), rgba(26, 60, 94, 0.5));
  border-radius: 12px;
  color: var(--ocean-text);
  position: relative;
  z-index: 1;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(91, 134, 229, 0.2);
}

.ocean-user-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(54, 209, 220, 0.1), rgba(91, 134, 229, 0.1));
  border-radius: 12px;
  z-index: -1;
}

.ocean-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ocean-guest-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--ocean-accent), var(--ocean-accent2));
  color: var(--ocean-deep);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}


.ocean-status-indicator.online {
  background-color: #36d1dc;
  box-shadow: 0 0 10px rgba(54, 209, 220, 0.7);
}

.ocean-username {
  color: var(--ocean-text);
  font-size: 0.95rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.ocean-useremail {
  color: var(--ocean-text-secondary);
  font-size: 0.8rem;
}

/* Liens de navigation */
.ocean-nav-links {
  width: 100%;
  position: relative;
  z-index: 1;
}

.ocean-nav-item {
  color: var(--ocean-text);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(44, 95, 138, 0.4), rgba(26, 60, 94, 0.4));
  position: relative;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(91, 134, 229, 0.15);
}

.ocean-nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, var(--ocean-accent), var(--ocean-accent2));
  opacity: 0;
  transition: all 0.3s ease;
}

.ocean-nav-item:hover {
  background: linear-gradient(135deg, rgba(44, 95, 138, 0.6), rgba(26, 60, 94, 0.6));
  color: var(--ocean-text);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(54, 209, 220, 0.3);
}

.ocean-nav-item:hover::before {
  opacity: 1;
}

.ocean-nav-item.router-link-active {
  background: linear-gradient(135deg, rgba(54, 209, 220, 0.2), rgba(91, 134, 229, 0.2));
  color: var(--ocean-text);
  position: relative;
  border: 1px solid rgba(54, 209, 220, 0.4);
  box-shadow: 0 4px 12px rgba(54, 209, 220, 0.2);
}

.ocean-nav-item.router-link-active::before {
  opacity: 1;
}

.ocean-nav-item i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
  color: var(--ocean-accent);
}

.ocean-nav-item:hover i {
  transform: translateX(2px);
  color: var(--ocean-accent2);
}

/* Bouton de déconnexion */
.logout-btn {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.1));
  border: 1px solid rgba(255, 107, 107, 0.3);
  outline: none;
  color: #ff6b6b;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.logout-btn:hover {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 107, 107, 0.2));
  color: #ff8585;
  border: 1px solid rgba(255, 107, 107, 0.4);
}

.logout-btn i {
  color: #ff6b6b;
}

/* Séparateur */
.ocean-spacer {
  position: relative;
}

.ocean-spacer::after {
  content: '';
  position: absolute;
  left: 10%;
  right: 10%;
  top: 50%;
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(54, 209, 220, 0.3), transparent);
}

/* Bouton logo */
.ocean-logo-btn {
  background: linear-gradient(45deg, rgba(54, 209, 220, 0.2), rgba(91, 134, 229, 0.2));
  border: 1px solid rgba(54, 209, 220, 0.3);
  border-radius: 10px;
  color: var(--ocean-text);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.ocean-logo-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.ocean-logo-btn:hover::before {
  left: 100%;
}

.ocean-logo-btn:hover {
  background: linear-gradient(45deg, rgba(54, 209, 220, 0.3), rgba(91, 134, 229, 0.3));
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  color: var(--ocean-text);
  border: 1px solid rgba(54, 209, 220, 0.5);
}

@media (prefers-reduced-motion: reduce) {
  .ocean-logo-btn::before {
    display: none;
  }
  
  .ocean-mobile-menu {
    transition: none;
  }
}

/* Responsive */
@media (max-width: 767.98px) {
  .ocean-mobile-menu {
    background: linear-gradient(180deg, var(--ocean-deep) 0%, var(--ocean-medium) 100%);
    margin-left: -0.75rem;
    margin-right: -0.75rem;
    padding: 0.5rem 1rem;
    border-top: 1px solid rgba(54, 209, 220, 0.2);
  }
  
  .ocean-user-info {
    background: linear-gradient(135deg, rgba(44, 95, 138, 0.3), rgba(26, 60, 94, 0.3));
    border-radius: 10px;
    margin-bottom: 1rem;
    padding: 0.75rem !important;
  }
  
  .ocean-nav-item {
    margin-bottom: 0.5rem;
  }
}
</style>