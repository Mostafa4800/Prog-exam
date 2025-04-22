  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    // Initialize Firestore