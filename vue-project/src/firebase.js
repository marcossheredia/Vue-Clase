import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
// ... other firebase imports

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyApYIvXGwhzwSMqI6ytE9L1HMWp5Mp2XRQ",
    authDomain: "vue-clase-8c50c.firebaseapp.com",
    projectId: "vue-clase-8c50c",
    storageBucket: "vue-clase-8c50c.firebasestorage.app",
    messagingSenderId: "390500763149",
    appId: "1:390500763149:web:e69858057785b46dceb744",
    measurementId: "G-ZVBH5T7VMS"
})

// used for the firestore refs
export const db = getFirestore(firebaseApp)