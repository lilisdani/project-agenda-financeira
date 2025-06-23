// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// ODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYc_DpCpP_8uuYOq4lWtFgWFlYC4sRjtU",
  authDomain: "eco-belle.firebaseapp.com",
  databaseURL:"https://console.firebase.google.com/project/eco-belle/database/eco-belle-default-rtdb.firebaseio.com",
  projectId: "eco-belle",
  storageBucket: "eco-belle.firebasestorage.app",
  messagingSenderId: "612419499936",
  appId: "1:612419499936:web:366d551dd410f603efd6c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app);
export{db};
export default app;