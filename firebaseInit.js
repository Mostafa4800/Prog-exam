// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCo9HxNm6BnAUlfMBHyNPlZ3yHe5MnOyj8",
  authDomain: "admin-prog-exam.firebaseapp.com",
  projectId: "admin-prog-exam",
  storageBucket: "admin-prog-exam.firebasestorage.app",
  messagingSenderId: "665505507105",
  appId: "1:665505507105:web:abfcd5ff5643de92f20060",
  measurementId: "G-YVWKSXYK1Y"
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();


