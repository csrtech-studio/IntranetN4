// main.js

// Importar la autenticación desde firebaseConfig.js
import { auth } from './firebaseConfig.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

$(document).ready(function () {
    console.log("Document ready");

    // Verificar el estado de autenticación del usuario
    onAuthStateChanged(auth, function(user) {
        if (user) {
            console.log('Usuario autenticado');
            
            // Ocultar los enlaces de navegación al inicio
            $('#navLinks').hide();

            // Mostrar enlaces de acción al hacer clic en el botón
            $('#showLinksBtn').on('click', function () {
                console.log('Botón de menú clickeado');
                $('#navLinks').toggle();
            });
        } else {
            console.log('Usuario no autenticado');
            window.location.href = 'login.html';  // Redirigir a login si no está autenticado
        }
    });

    // Cerrar sesión
    $('#logoutBtn').on('click', function (event) {
        event.preventDefault();

        // Cerrar sesión en Firebase
        signOut(auth).then(() => {
            console.log('Sesión cerrada correctamente');
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error('Error al cerrar sesión:', error);
        });
    });
});
