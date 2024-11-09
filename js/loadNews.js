import { db } from './firebaseConfig.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

async function loadNews() {
    const newsContainer = document.getElementById('newsContainer');
    
    // Limpiar el contenedor antes de cargar las noticias
    newsContainer.innerHTML = '';

    try {
        const querySnapshot = await getDocs(collection(db, 'news'));
        
        // Verificar si la colección está vacía
        if (querySnapshot.empty) {
            // Si la colección está vacía, mostrar un mensaje
            const noNewsMessage = document.createElement('p');
            noNewsMessage.textContent = 'No hay nuevas notificaciones';
            newsContainer.appendChild(noNewsMessage);
        } else {
            // Si hay noticias, agregarlas al contenedor
            querySnapshot.forEach((doc) => {
                const news = doc.data();
                const newsElement = document.createElement('div');
                newsElement.classList.add('news-item');
                
                const imageUrl = news.imageUrl ? `<img src="${news.imageUrl}" alt="Imagen de la noticia">` : '';
                
                // Verificar si existe la propiedad 'createdAt' y si tiene 'seconds'
                const createdAt = news.createdAt ? new Date(news.createdAt.seconds * 1000).toLocaleDateString() : 'Fecha no disponible';

                newsElement.innerHTML = `
                    <h3>${news.title}</h3>
                    <p>${news.content}</p>
                    ${imageUrl}
                    <small>${news.type} - ${createdAt}</small>
                `;
                
                newsContainer.appendChild(newsElement);
            });
        }
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('es-ES', options); // Formato en español
       
        // Mostrar la fecha de hoy
        dateContainer.innerHTML = `<p>Hoy es ${formattedDate}</p>`;
       
    } catch (e) {
        console.error('Error al cargar noticias: ', e);
    }
}

loadNews();

 // Formatear la fecha de hoy en el formato deseado: "Hoy es martes 6 de agosto de 2024"
