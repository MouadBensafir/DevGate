<template>
  <div class="github-container">
    <button 
      @click="linkGitHubAccount" 
      :disabled="isLoading"
      class="github-button"
    >
      <i class="bi bi-github me-2"></i>
      {{ isLoading ? 'Connecting...' : 'Link GitHub Account' }}
    </button>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import useLinkGitHub from '@/composables/useLinkGitHub'

const { linkGitHubAccount, error, isLoading } = useLinkGitHub()
</script>

<style scoped>
.github-container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.github-button {
  background-color: #24292e;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.github-button:hover:not(:disabled) {
  background-color: #1a1f23;
}

.github-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  text-align: center;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: rgba(220, 53, 69, 0.1);
}
</style>
