<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CreateObjective from "@/components/CreateObjective.vue";
import { ref } from 'vue';

const userId = ref(null);
onMounted(() => {
  userId.value = useRoute().params.userId; // Replace with actual user ID
});

</script>

<template>
  <div class="container mt-4">
    <CreateObjective :user-id="userId" />
  </div>
</template>

<style scoped>
.upload-box {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.upload-box:hover {
  background-color: #e9ecef;
}

.upload-placeholder {
  padding: 20px;
}
</style>