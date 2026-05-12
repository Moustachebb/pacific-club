import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDslaqWbq2nCroF1RY_L5Cjn45ADZlvVGQ",
  authDomain: "pacific-club-9fa96.firebaseapp.com",
  projectId: "pacific-club-9fa96",
  storageBucket: "pacific-club-9fa96.firebasestorage.app",
  messagingSenderId: "704329162031",
  appId: "1:704329162031:web:333f7d3aabec55cf6215da",
  measurementId: "G-SSCFH28J9V"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)