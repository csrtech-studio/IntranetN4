// firebaseConfig.js

// Importar las funciones necesarias de Firebase para la inicialización y autenticación
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; // Importa Firestore

// Configuración de Firebase (tu configuración personal de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyAyn697-iMNKUbFu08Nr0CPI1mI4Eaq7No",
    authDomain: "intranet-n4.firebaseapp.com",
    projectId: "intranet-n4",
    storageBucket: "intranet-n4.firebasestorage.app",
    messagingSenderId: "507091369490",
    appId: "1:507091369490:web:3efb6c2977faf6189fa2cb"
};

// Inicializar la aplicación de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Obtener el servicio de autenticación
const auth = getAuth(app);

// Exportar el servicio de autenticación para usarlo en otros archivos
export { auth, db };

