import { initializeApp } from 'firebase/app'

import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDmZImTYddLquHArY0LgQ3Ua6nnEmJI_RI",
  authDomain: "pacific-club-5afc1.firebaseapp.com",
  projectId: "pacific-club-5afc1",
  storageBucket: "pacific-club-5afc1.firebasestorage.app",
  messagingSenderId: "806505243955",
  appId: "1:806505243955:web:c9b9cb1eb01339f35d4a46",
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)