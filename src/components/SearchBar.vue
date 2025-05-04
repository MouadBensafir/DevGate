<template>
  <div class="ocean-search-wrapper d-flex justify-content-end align-items-center px-3">
    <div class="ocean-search-container">
      <div class="ocean-search-icon">
        <i class="bi bi-search"></i>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search users..."
        class="ocean-search-input"
        @keyup.enter="handleSearch"
      />
      <div v-if="searchQuery" class="ocean-search-clear" @click="clearSearch">
        <i class="bi bi-x-circle"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const searchQuery = ref('');
const router = useRouter();

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push("/search/" + searchQuery.value.trim());
    searchQuery.value = '';
  }
}

function clearSearch() {
  searchQuery.value = '';
}
</script>

<style scoped>
/* Ocean theme search component */
.ocean-search-wrapper {
  --ocean-primary: #1a3c5e;
  --ocean-secondary: #5b86e5;
  --ocean-accent: #36d1dc;
  --ocean-light: #e6f7ff;
  --ocean-dark: #0f2942;
  --ocean-shadow: 0 4px 15px rgba(15, 41, 66, 0.2);
  --ocean-transition: all 0.3s ease;
  position: relative;
  width: 100%;
}

.ocean-search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 250px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  transition: var(--ocean-transition);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.ocean-search-container:hover,
.ocean-search-container:focus-within {
  background-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: var(--ocean-accent);
}

.ocean-search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

.ocean-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  padding: 0.6rem 0.5rem;
  font-size: 0.9rem;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

.ocean-search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.ocean-search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: var(--ocean-transition);
}

.ocean-search-clear:hover {
  color: white;
}

/* Mobile version adjustments */
@media (max-width: 767px) {
  .ocean-search-container {
    background-color: #f8f9fa;
    border: 1px solid #e0e0e0;
    max-width: 100%;
  }
  
  .ocean-search-icon {
    color: var(--ocean-primary);
  }
  
  .ocean-search-input {
    color: var(--ocean-dark);
  }
  
  .ocean-search-input::placeholder {
    color: #aaa;
  }
  
  .ocean-search-clear {
    color: #777;
  }
  
  .ocean-search-container:hover,
  .ocean-search-container:focus-within {
    border-color: var(--ocean-secondary);
  }
}
</style>