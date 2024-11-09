import { db } from "./firebaseConfig.js";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const orderForm = document.getElementById("orderForm");
let currentOrderId = null; // Variable para almacenar el ID del documento que se está actualizando

// Agregar evento para el envío del formulario
orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const empleado = document.getElementById("empleado").value;
    const orden = document.getElementById("orden").value;
    const numParte = document.getElementById("numParte").value;
    const planta = document.getElementById("planta").value;
    const fecha = document.getElementById("fecha").value;

    try {
        if (currentOrderId) {
            // Si existe un ID, estamos actualizando la orden
            const updatedOrder = {
                empleado,
                orden,
                numParte,
                planta,
                fecha
            };
            await updateDoc(doc(db, "ordenes", currentOrderId), updatedOrder);
            alert("Orden actualizada correctamente.");
            currentOrderId = null;  // Limpiar el ID después de la actualización
        } else {
            // Si no hay ID, estamos agregando una nueva orden
            await addDoc(collection(db, "ordenes"), {
                empleado,
                orden,
                numParte,
                planta,
                fecha
            });
            alert("Orden registrada con éxito");
        }
        orderForm.reset(); // Limpiar el formulario
        loadOrders(); // Recargar las órdenes
    } catch (error) {
        console.error("Error al registrar la orden:", error);
        alert("Hubo un error al registrar la orden");
    }
});

// Función para cargar las órdenes
async function loadOrders() {
    const ordersTable = document.querySelector("#orderTable tbody");
    ordersTable.innerHTML = ""; // Limpiar tabla

    try {
        const querySnapshot = await getDocs(collection(db, "ordenes"));
        querySnapshot.forEach((docSnapshot) => {
            const order = docSnapshot.data();
            const orderId = docSnapshot.id; // Obtener el ID del documento

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.empleado}</td>
                <td>${order.orden}</td>
                <td>${order.numParte}</td>
                <td>${order.planta}</td>
                <td>${order.fecha}</td>
                <td>
                    <select class="actionSelect">
                        <option value="">Seleccionar acción</option>
                        <option value="update">Actualizar</option>
                        <option value="delete">Eliminar</option>
                    </select>    
                </td>
                <td> 
                    <button class="actionBtn" style="display: none;">Cargar datos</button>
                </td>
            `;
            ordersTable.appendChild(row);

            // Seleccionar los elementos del DOM
            const actionSelect = row.querySelector('.actionSelect');
            const actionBtn = row.querySelector('.actionBtn');

            actionBtn.classList.add("unique-action-btn");

            // Mostrar el botón "Guardar" al seleccionar una acción y cambiar su texto
            actionSelect.addEventListener('change', function() {
                if (actionSelect.value === 'update') {
                    actionBtn.style.display = 'inline-block';  // Mostrar el botón "Guardar"
                    actionBtn.textContent = 'Cargar datos';    // Cambiar el texto del botón
                } else if (actionSelect.value === 'delete') {
                    actionBtn.style.display = 'inline-block';  // Mostrar el botón "Guardar"
                    actionBtn.textContent = 'Eliminar dato';   // Cambiar el texto del botón
                } else {
                    actionBtn.style.display = 'none';  // Ocultar el botón si no se selecciona nada
                }
            });

            // Evento para manejar la acción de actualizar o eliminar
            actionBtn.addEventListener('click', async () => {
                const action = actionSelect.value;

                if (action === 'update') {
                    // Cargar los datos en los inputs para la actualización
                    document.getElementById('empleado').value = order.empleado;
                    document.getElementById('orden').value = order.orden;
                    document.getElementById('numParte').value = order.numParte;
                    document.getElementById('planta').value = order.planta;
                    document.getElementById('fecha').value = order.fecha;

                    currentOrderId = orderId;  // Guardar el ID del documento a actualizar

                    alert("Los datos han sido cargados para la actualización.");
                } else if (action === 'delete') {
                    if (confirm("¿Está seguro de que desea eliminar este registro?")) {
                        // Eliminar el documento de Firebase
                        await deleteDoc(doc(db, "ordenes", orderId));
                        alert("Orden eliminada correctamente.");
                        loadOrders(); // Recargar los datos
                    }
                }
            });
        });
    } catch (error) {
        console.error("Error al cargar los datos de Firestore: ", error);
    }
}

// Cargar los datos al iniciar
loadOrders();
