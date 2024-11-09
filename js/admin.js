import { db } from "./firebaseConfig.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const newsForm = document.getElementById("newsForm");
let currentNewsId = null;

// Función para validar usuario y contraseña
async function validateAccess(idUser, pws) {
    const q = query(collection(db, "access"), where("idUser", "==", idUser), where("pws", "==", pws));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return false;  // No hay resultados, credenciales incorrectas
        } else {
            return true;  // Se encontró un documento con las credenciales correctas
        }
    } catch (error) {
        console.error("Error al validar el acceso:", error);
        return false;  // En caso de error en la consulta, denegamos el acceso
    }
}

// Función para pedir las credenciales de acceso
async function requestAccess() {
    const idUser = prompt("Introduce tu usuario:");
    const pws = prompt("Introduce tu contraseña:");

    if (idUser && pws) {
        const isValid = await validateAccess(idUser, pws);

        if (isValid) {
            alert("Acceso permitido.");
            loadAdminContent();  // Cargar el contenido de administrador
        } else {
            alert("Usuario o contraseña incorrectos.");
            window.location.href = "index.html";  // Redirigir al index si las credenciales son incorrectas
        }
    } else {
        alert("Por favor, introduce tanto el usuario como la contraseña.");
        window.location.href = "index.html";  // Redirigir al index si no se ingresaron datos
    }
}

// Llamada a la función de validación al cargar la página de admin
requestAccess();

// Función para cargar el contenido del administrador si las credenciales son correctas
function loadAdminContent() {
    document.getElementById("accessFormContainer").style.display = "none";  // Ocultar el formulario de acceso
    document.getElementById("adminContent").style.display = "block";  // Mostrar el contenido de administrador
    loadNews();  // Cargar las noticias desde Firebase
}
// Evento para agregar o actualizar noticias
newsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const type = document.getElementById("type").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const imageUrl = document.getElementById("imageUrl").value || null;

    try {
        if (currentNewsId) {
            await updateDoc(doc(db, "news", currentNewsId), { type, title, content, imageUrl });
            alert("Noticia actualizada correctamente.");
            currentNewsId = null;
        } else {
            await addDoc(collection(db, "news"), { type, title, content, imageUrl });
            alert("Noticia agregada con éxito.");
        }
        newsForm.reset();
        loadNews();
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al guardar la noticia.");
    }
});

// Función para cargar noticias
async function loadNews() {
    const newsTable = document.querySelector("#newsTable tbody");
    newsTable.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "news"));
    querySnapshot.forEach((docSnapshot) => {
        const news = docSnapshot.data();
        const newsId = docSnapshot.id;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${news.title}</td>
            <td>${news.type}</td>
            <td>${news.content}</td>
            <td>${news.imageUrl ? `<img src="${news.imageUrl}" alt="${news.title}" width="50">` : "Sin imagen"}</td>
            <td>
                <select class="actionSelect">
                    <option value="">Acción</option>
                    <option value="update">Actualizar</option>
                    <option value="delete">Eliminar</option>
                </select>    
            </td>
            <td>
                <button class="actionBtn unique-action-btn" style="display: none;">Cargar datos</button>
            </td>
        `;
        newsTable.appendChild(row);

        const actionSelect = row.querySelector('.actionSelect');
        const actionBtn = row.querySelector('.actionBtn');

        actionSelect.addEventListener('change', () => {
            if (actionSelect.value === 'update') {
                actionBtn.style.display = 'inline-block';
                actionBtn.textContent = 'Cargar datos';
            } else if (actionSelect.value === 'delete') {
                actionBtn.style.display = 'inline-block';
                actionBtn.textContent = 'Eliminar dato';
            } else {
                actionBtn.style.display = 'none';
            }
        });

        actionBtn.addEventListener('click', async () => {
            if (actionSelect.value === 'update') {
                document.getElementById('type').value = news.type;
                document.getElementById('title').value = news.title;
                document.getElementById('content').value = news.content;
                document.getElementById('imageUrl').value = news.imageUrl || "";
                currentNewsId = newsId;
                alert("Datos cargados para actualización.");
            } else if (actionSelect.value === 'delete') {
                if (confirm("¿Está seguro de que desea eliminar esta noticia?")) {
                    await deleteDoc(doc(db, "news", newsId));
                    alert("Noticia eliminada correctamente.");
                    loadNews();
                }
            }
        });
    });
}

// Cargar noticias al inicio
loadNews();
