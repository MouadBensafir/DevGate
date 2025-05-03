<template>
  <div class="github-callback">
    <p v-if="loading">Connecting GitHub account...</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
// <script setup>
// import { ref, onMounted } from 'vue';
// import { getFirestore, doc, setDoc } from 'firebase/firestore';

// const loading = ref(true);
// const error = ref(null);

// const handleGitHubCallback = async () => {
//   try {
//     const params = new URLSearchParams(window.location.search);
//     const code = params.get('code');
//     const uid = localStorage.getItem('pendingGitHubUid');

//     if (!code || !uid) {
//       throw new Error('Missing GitHub authorization code or user ID');
//     }

//     // Call backend API to exchange code for token
//     const response = await fetch('http://localhost:3000/api/github-auth', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ code }),
//     });

//     if (!response.ok) throw new Error('Failed to get access token');

//     const { access_token } = await response.json();

//     // Get GitHub user data
//     const userResponse = await fetch('https://api.github.com/user', {
//       headers: { 'Authorization': `Bearer ${access_token}` },
//     });
//     const { login } = await userResponse.json();

//     // Update Firestore
//     const db = getFirestore();
//     await setDoc(doc(db, 'users', uid), { github: login }, { merge: true });

//     // Cleanup and redirect
//     localStorage.removeItem('pendingGitHubUid');
    
//   } catch (err) {
//     console.error('GitHub OAuth error:', err);
//     error.value = err.message;
//   } finally {
//     loading.value = false;
//   }
// };

// onMounted(() => {
//   handleGitHubCallback();
// });
// </script>

<style>
.github-callback {
  padding: 2rem;
  text-align: center;
}
.error {
  color: red;
}
</style>