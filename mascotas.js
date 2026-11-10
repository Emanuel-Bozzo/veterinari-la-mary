
const formMascota = document.getElementById("form-mascota");
const tablaMascotas = document.getElementById("tabla-mascotas");
const total = document.getElementById("total");
let idEditando = null;

function mostrarMascotas() {
    // 1. leer el array guardado
    const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

    // 2. vaciar el tbody para no duplicar filas
    tablaMascotas.innerHTML = "";

    // 3. por cada mascota, agregar una fila
    mascotas.forEach(function (mascota) {
        tablaMascotas.innerHTML += `
            <tr>
                <td>${mascota.nombreMascota}</td>
                <td>${mascota.nombreDuenio}</td>
                <td>${mascota.color}</td>
                <td>${mascota.edad} ${mascota.edad === 1 ? "año" : "años"}</td>
                <td>${mascota.peso} kg</td>
                <td><button class="btn btn-sm btn-warning" data-id="${mascota.idMascota}">Editar</button></td>
                <td><button class="btn btn-sm btn-danger" data-id="${mascota.idMascota}">Eliminar</button></td>
            </tr>
        `;
    });

    // 4. actualizar el contador
    total.textContent = mascotas.length;
}

formMascota.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombreMascota = document.getElementById("nombreMascota").value;
    const nombreDuenio = document.getElementById("nombreDuenio").value;
    const color = document.getElementById("color").value;
    const edad = parseInt(document.getElementById("edad").value);
    const peso = parseFloat(document.getElementById("peso").value);

    const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

    if (idEditando === null) {
        // ALTA
        const mascota = {
            idMascota: crypto.randomUUID(),
            nombreMascota: nombreMascota,
            nombreDuenio: nombreDuenio,
            color: color,
            edad: edad,
            peso: peso
        };
        mascotas.push(mascota);
    } else {
        // EDICIÓN
        const indice = mascotas.findIndex(function (m) {
            return m.idMascota === idEditando;  
        });

        mascotas[indice] = {
            idMascota: idEditando,
            nombreMascota: nombreMascota,
            nombreDuenio: nombreDuenio,
            color: color,
            edad: edad,
            peso: peso
        };

        idEditando = null;
    }

    localStorage.setItem("mascotas", JSON.stringify(mascotas));
    mostrarMascotas();
    formMascota.reset();
});

mostrarMascotas();

tablaMascotas.addEventListener("click", function (evento) {
    const boton = evento.target;

    if (boton.classList.contains("btn-danger")) {
        const id = boton.dataset.id;

        const confirmar = confirm("¿Seguro que querés eliminar esta mascota?");

        if (confirmar) {
            // 1. leer el array (igual que en mostrarMascotas)
            const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

            // 2. quedarte solo con las que tengan un id DISTINTO
            const filtradas = mascotas.filter(function (m) {
                return m.idMascota !== id;
            });

            // 3. guardar el array nuevo (igual que en el alta, pero con "filtradas")
            localStorage.setItem("mascotas", JSON.stringify(filtradas));

            // 4. redibujar la tabla
            mostrarMascotas();
        }
    }



    if (boton.classList.contains("btn-warning")) {
        const id = boton.dataset.id;

        const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

        // 1. buscar la mascota (devuelve el primer elemento que cumple)
        const mascota = mascotas.find(function (m) {
            return m.idMascota === id;
        });

        // 2. cargar sus datos en el formulario
        document.getElementById("nombreMascota").value = mascota.nombreMascota;
        document.getElementById("nombreDuenio").value = mascota.nombreDuenio;
        document.getElementById("color").value = mascota.color;
        document.getElementById("edad").value = mascota.edad;
        document.getElementById("peso").value = mascota.peso;

        // 3. recordar que estamos editando
        idEditando = id;
    }
});
