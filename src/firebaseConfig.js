import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPCUWNrcUP6YWiTn8G08bt4nYVrEQKh1w",
  authDomain: "alhasanmasjid-662e2.firebaseapp.com",
  projectId: "alhasanmasjid-662e2",
  storageBucket: "alhasanmasjid-662e2.appspot.com",
  messagingSenderId: "122091136300",
  appId: "1:122091136300:web:6b3d719b3f90ffe1513889",
  measurementId: "G-0S87BFBXFZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
