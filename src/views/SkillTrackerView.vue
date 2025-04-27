<template>
  <div class="container py-5">
    <form @submit.prevent="addSkill" class="card p-4 shadow-sm">
      <h2 class="text-center mb-4">Add a Skill</h2>

      <div class="mb-3">
        <label for="skill" class="form-label">Skill</label>
        <input
          type="text"
          id="skill"
          class="form-control"
          placeholder="Enter your skill"
          v-model="newSkill"
          required
        />
      </div>

      <div class="mb-4">
        <label for="level" class="form-label">Level</label>
        <select
          id="level"
          class="form-select"
          v-model="level"
          required
        >
          <option value="" disabled>Select your level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary w-100">
        Add Skill
      </button>
    </form>
  </div>
</template>

<script setup>
import { useAddSkill } from '@/composables/useAddSkill'

const { newSkill, level, addSkill } = useAddSkill()
</script>

<style scoped>
/* Optional extra styling */
h2 {
  font-weight: bold;
}
</style>
