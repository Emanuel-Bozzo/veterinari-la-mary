import { obtener, guardar, generarId } from "../compartido/almacenamiento.js";
import { crearCelda, crearCeldaBoton, mostrarError, ocultarError } from "../compartido/ui.js";

const CLAVE = "mascotas";

const form = document.getElementById("form-mascota");
const tabla = document.getElementById("tabla-mascotas");
const total = document.getElementById("total");
const tituloForm = document.getElementById("titulo-form");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const cuadroError = document.getElementById("mensaje-error");

const inputNombre = document.getElementById("nombreMascota");
const inputDuenio = document.getElementById("nombreDuenio");
const inputColor = document.getElementById("color");
const inputEdad = document.getElementById("edad");
const inputPeso = document.getElementById("peso");


let idEditando = null;

function mostrarMascotas() {
    const mascotas = obtener(CLAVE);

    tabla.innerHTML = "";
    
    mascotas.forEach(function (mascota) {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(mascota.nombreMascota));
        fila.appendChild(crearCelda(mascota.nombreDuenio));
        fila.appendChild(crearCelda(mascota.color));
        fila.appendChild(crearCelda(mascota.edad + (mascota.edad === 1 ? " año" : " años")));
        fila.appendChild(crearCelda(mascota.peso + " kg"));
        fila.appendChild(crearCeldaBoton("Editar", "btn-warning", "editar", mascota.idMascota));
        fila.appendChild(crearCeldaBoton("Eliminar", "btn-danger", "eliminar", mascota.idMascota));

        tabla.appendChild(fila);
    });

    total.textContent = mascotas.length;
}

// Vuelve el formulario al modo "alta"
function salirModoEdicion() {
    idEditando = null;
    form.reset();
    ocultarError(cuadroError);
    tituloForm.textContent = "Dar de alta";
    btnGuardar.textContent = "Agregar mascota";
    btnCancelar.classList.add("d-none");
}

function entrarModoEdicion(mascota) {
    idEditando = mascota.idMascota;

    inputNombre.value = mascota.nombreMascota;
    inputDuenio.value = mascota.nombreDuenio;
    inputColor.value = mascota.color;
    inputEdad.value = mascota.edad;
    inputPeso.value = mascota.peso;

    ocultarError(cuadroError);
    tituloForm.textContent = "Editar mascota";
    btnGuardar.textContent = "Guardar cambios";
    btnCancelar.classList.remove("d-none");
    inputNombre.focus();
}

form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombreMascota = inputNombre.value.trim();
    const nombreDuenio = inputDuenio.value.trim();
    const color = inputColor.value.trim();
    const edadTexto = inputEdad.value.trim();
    const pesoTexto = inputPeso.value.trim();

    // ----- Validaciones -----
    if (nombreMascota === "" || nombreDuenio === "" || color === "") {
        mostrarError(cuadroError, "Completá el nombre, el dueño y el color.");
        return;
    }

    const edad = Number(edadTexto);
    const peso = Number(pesoTexto);

    if (edadTexto === "" || !Number.isInteger(edad) || edad < 0 || edad > 30) {
        mostrarError(cuadroError, "La edad debe ser un número entero entre 0 y 30.");
        return;
    }

    if (pesoTexto === "" || isNaN(peso) || peso <= 0) {
        mostrarError(cuadroError, "El peso debe ser un número mayor a 0.");
        return;
    }

    ocultarError(cuadroError);

    const mascotas = obtener(CLAVE);

    if (idEditando === null) {
        // ALTA
        mascotas.push({
            idMascota: generarId(),
            nombreMascota: nombreMascota,
            nombreDuenio: nombreDuenio,
            color: color,
            edad: edad,
            peso: peso
        });
    } else {
        // EDICIÓN
        const indice = mascotas.findIndex(function (m) {
            return m.idMascota === idEditando;  
        });

        if (indice === -1) {
            // La mascota ya no existe (por ejemplo, se eliminó en otra pestaña)
            mostrarError(cuadroError, "Esa mascota ya no existe. Se canceló la edición.");
            salirModoEdicion();
            mostrarMascotas();
            return;
        }    

        mascotas[indice] = {
            idMascota: idEditando,
            nombreMascota: nombreMascota,
            nombreDuenio: nombreDuenio,
            color: color,
            edad: edad,
            peso: peso
        };
    }

    guardar(CLAVE, mascotas);
    salirModoEdicion();
    mostrarMascotas();
});

btnCancelar.addEventListener("click", salirModoEdicion);

tabla.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button");
    if (boton === null) {
        return;
    }

    const id = boton.dataset.id;

    if (boton.dataset.accion === "editar") {
        const mascota = obtener(CLAVE).find(function (m) {
            return m.idMascota === id;
        });
        if (mascota) {
            entrarModoEdicion(mascota);
        }
    }

    if (boton.dataset.accion === "eliminar") {
        if (!confirm("¿Seguro que querés eliminar esta mascota?")) {
            return;
        }

        const restantes = obtener(CLAVE).filter(function (m) {
            return m.idMascota !== id;
        });
        guardar(CLAVE, restantes);

        // Si justo se estaba editando la mascota eliminada, se sale del modo edición
        if (idEditando === id) {
            salirModoEdicion();
        }

        mostrarMascotas();
    }
});

mostrarMascotas();
