// Funciones compartidas para armar la interfaz de las páginas de administración.

// Crea una celda <td> con texto. Usa textContent, así lo que escribe el usuario
// nunca se interpreta como HTML.
export function crearCelda(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

// Crea una celda con un botón de acción (editar / eliminar)
export function crearCeldaBoton(texto, clase, accion, id) {
    const td = document.createElement("td");
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn btn-sm " + clase;
    boton.textContent = texto;
    boton.dataset.accion = accion;
    boton.dataset.id = id;
    td.appendChild(boton);
    return td;
}

export function mostrarError(cuadro, mensaje) {
    cuadro.textContent = mensaje;
    cuadro.classList.remove("d-none");
}

export function ocultarError(cuadro) {
    cuadro.classList.add("d-none");
}