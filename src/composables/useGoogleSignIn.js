import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function useGoogleSignIn() {
  const error = ref(null);
  const router = useRouter();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    error.value = null;

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          firstname: user.displayName?.split(' ')[0] || '',
          lastname: user.displayName?.split(' ')[1] || '',
          email: user.email,
          bio: 'No real bio yet',
          birthday: '',
          createdAt: new Date(),
          role: "user",
          pdp: user.photoURL || 'https://i.postimg.cc/05zJ6r52/duck-default.png',
        });
      }

      await router.push('/');
    } catch (err) {
      console.error("Google sign-in error:", err);
      error.value = err.message;
    }
  };

  return { signInWithGoogle, error };
}
