import { obtener, guardar, generarId } from "../compartido/almacenamiento.js";
import { crearCelda, crearCeldaBoton, mostrarError, ocultarError } from "../compartido/ui.js";

const CLAVE = "veterinarios";

const form = document.getElementById("form-veterinario");
const tabla = document.getElementById("tabla-veterinarios");
const total = document.getElementById("total");
const tituloForm = document.getElementById("titulo-form");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const cuadroError = document.getElementById("mensaje-error");

const inputMatricula = document.getElementById("matricula");
const inputNombre = document.getElementById("nombre");
const inputEspecializacion = document.getElementById("especializacion");
const inputValor = document.getElementById("valorConsulta");


let idEditando = null;

function formatearMoneda(valor) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS"
    }).format(valor);
}

function mostrarVeterinarios() {
    const veterinarios = obtener(CLAVE);

    tabla.innerHTML = "";

    veterinarios.forEach(function (vet) {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(vet.matricula));
        fila.appendChild(crearCelda(vet.nombre));
        fila.appendChild(crearCelda(vet.especializacion));
        fila.appendChild(crearCelda(formatearMoneda(vet.valorConsulta)));
        fila.appendChild(crearCeldaBoton("Editar", "btn-warning", "editar", vet.idVeterinario));
        fila.appendChild(crearCeldaBoton("Eliminar", "btn-danger", "eliminar", vet.idVeterinario));

        tabla.appendChild(fila);
    });

        total.textContent = veterinarios.length;
}

// Vuelve el formulario al modo "alta"
function salirModoEdicion() {
    idEditando = null;
    form.reset();
    ocultarError(cuadroError);
    tituloForm.textContent = "Dar de alta";
    btnGuardar.textContent = "Agregar veterinario";
    btnCancelar.classList.add("d-none");
}

function entrarModoEdicion(vet) {
    idEditando = vet.idVeterinario;

    inputMatricula.value = vet.matricula;
    inputNombre.value = vet.nombre;
    inputEspecializacion.value = vet.especializacion;
    inputValor.value = vet.valorConsulta;

    ocultarError(cuadroError);
    tituloForm.textContent = "Editar veterinario";
    btnGuardar.textContent = "Guardar cambios";
    btnCancelar.classList.remove("d-none");
    inputMatricula.focus();
}

form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = inputNombre.value.trim();
    const especializacion = inputEspecializacion.value;
    const matriculaTexto = inputMatricula.value.trim();
    const valorTexto = inputValor.value.trim();

    // ----- Validaciones -----
    const matricula = Number(matriculaTexto);
    const valorConsulta = Number(valorTexto);

    if (matriculaTexto === "" || !Number.isInteger(matricula) || matricula <= 0) {
        mostrarError(cuadroError, "La matrícula debe ser un número entero mayor a 0.");
        return;
    }

    if (nombre === "") {
        mostrarError(cuadroError, "Completá el nombre.");
        return;
    }

    if (especializacion === "") {
        mostrarError(cuadroError, "Seleccioná una especialización.");
        return;
    }

    if (valorTexto === "" || isNaN(valorConsulta) || valorConsulta <= 0) {
        mostrarError(cuadroError, "El valor de la consulta debe ser un número mayor a 0.");
        return;
    }

    const veterinarios = obtener(CLAVE);

    // La matrícula no puede repetirse (se ignora al veterinario que se está editando)
    const repetida = veterinarios.some(function (v) {
        return v.matricula === matricula && v.idVeterinario !== idEditando;
    });
    if (repetida) {
        mostrarError(cuadroError, "Ya existe un veterinario con esa matrícula.");
        return;
    }

    ocultarError(cuadroError);

    if (idEditando === null) {
        // ALTA
        veterinarios.push({
            idVeterinario: generarId(),
            matricula: matricula,
            nombre: nombre,
            especializacion: especializacion,
            valorConsulta: valorConsulta
        });          
    } else {
        // EDICIÓN
        const indice = veterinarios.findIndex(function (v) {
            return v.idVeterinario === idEditando;
        });

        if (indice === -1) {
            mostrarError(cuadroError, "Ese veterinario ya no existe. Se canceló la edición.");
            salirModoEdicion();
            mostrarVeterinarios();
            return;
        }

        veterinarios[indice] = {
            idVeterinario: idEditando,
            matricula: matricula,
            nombre: nombre,
            especializacion: especializacion,
            valorConsulta: valorConsulta
        };
    }

    guardar(CLAVE, veterinarios);
    salirModoEdicion();
    mostrarVeterinarios();
});

btnCancelar.addEventListener("click", salirModoEdicion);

tabla.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button");
    if (boton === null) {
        return;
    }

    const id = boton.dataset.id;

    if (boton.dataset.accion === "editar") {
        const vet = obtener(CLAVE).find(function (v) {
            return v.idVeterinario === id;
        });
        if (vet) {
            entrarModoEdicion(vet);
        }
    }

    if (boton.dataset.accion === "eliminar") {
        if (!confirm("¿Seguro que querés eliminar este veterinario?")) {
            return;
        }

        const restantes = obtener(CLAVE).filter(function (v) {
            return v.idVeterinario !== id;
        });
        guardar(CLAVE, restantes);

        // Si justo se estaba editando el veterinario eliminado, se sale del modo edición
        if (idEditando === id) {
            salirModoEdicion();
        }

        mostrarVeterinarios();
    }
});

mostrarVeterinarios();
