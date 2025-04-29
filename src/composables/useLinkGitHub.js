import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, GithubAuthProvider, signInWithPopup, linkWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function useLinkGitHub() {
  const error = ref(null);
  const isLoading = ref(false);
  const router = useRouter();

  // Helper function to fetch GitHub username using GitHub API
  const fetchGitHubUsername = async (githubUserId) => {
    const response = await fetch(`https://api.github.com/user/${githubUserId}`);
    if (response.ok) {
      const data = await response.json();
      return data.login; // 'login' field contains the GitHub username
    } else {
      throw new Error('Failed to fetch GitHub username');
    }
  };

  const linkGitHubAccount = async () => {
    let auth = getAuth();
    const provider = new GithubAuthProvider();
    error.value = null;
    isLoading.value = true;

    try {
      if (!auth.currentUser) {
        // If user is not signed in, perform sign in
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Ensure user info is up to date
        await user.reload();

        // Fetch GitHub username using the GitHub API
        const githubUserId = user.providerData.find(p => p.providerId === 'github.com')?.uid;
        const githubUsername = githubUserId ? await fetchGitHubUsername(githubUserId) : 'Unknown';

        // Store GitHub data in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            githubUsername, // Use the fetched GitHub username
            githubProfile: user.reloadUserInfo.profileUrl,
            email: user.email,
            createdAt: new Date(),
            role: "user",
            pdp: user.photoURL || 'https://i.postimg.cc/05zJ6r52/duck-default.png',
          });
        } else {
          // Update existing user with GitHub info
          await updateDoc(userRef, {
            githubUsername, // Use the fetched GitHub username
          }, { merge: true });
        }
      } else {
        // If user is already signed in, link accounts
        await linkWithPopup(auth.currentUser, provider);
        auth = getAuth(); // Reinitialize auth to get the updated user
        let user = auth.currentUser;
        // Ensure user info is up to date after linking
        await user.reload();

        console.log("User while Linking to Github: ", user);

        // Fetch GitHub username using the GitHub API
        const githubUserId = user.providerData.find(p => p.providerId === 'github.com')?.uid;
        const githubUsername = githubUserId ? await fetchGitHubUsername(githubUserId) : 'Unknown';
        console.log("GitHub Username: ", githubUsername);

        // Update user document with GitHub info
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          githubUsername, // Use the fetched GitHub username
        }, { merge: true });
      }
    } catch (err) {
      console.error('GitHub auth error:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
      alert('GitHub account linked successfully!');
      router.push("/");
    }
  };

  return { linkGitHubAccount, error, isLoading };
}
