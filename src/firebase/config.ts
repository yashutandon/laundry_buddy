import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBDLe1eV58bgYGU6cXnBkrnAKTAbJouHGY",
  authDomain: "laundary-a7dbb.firebaseapp.com",
  projectId: "laundary-a7dbb",
  storageBucket: "laundary-a7dbb.firebasestorage.app",
  messagingSenderId: "512643828298",
  appId: "1:512643828298:web:2a21959fba3461ab2eb4b3",
  measurementId: "G-X727HRVLBJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;