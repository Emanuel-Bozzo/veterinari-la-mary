
    const formVeterinario = document.getElementById("form-veterinario");
    const tablaVeterinarios = document.getElementById("tabla-veterinarios");
    const total = document.getElementById("total");
    let idEditando = null;

    function mostrarVeterinarios() {
        // 1. leer el array guardado
        const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];

        // 2. vaciar el tbody para no duplicar filas
        tablaVeterinarios.innerHTML = "";

        // 3. por cada veterinario, agregar una fila
        veterinarios.forEach(function (veterinario) {
            tablaVeterinarios.innerHTML += `
                <tr>
                    <td>${veterinario.matricula}</td>
                    <td>${veterinario.nombre}</td>
                    <td>${veterinario.especializacion}</td>
                                    <td>${veterinario.valorConsulta.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</td>
                    <td><button class="btn btn-sm btn-warning" data-id="${veterinario.idVeterinario}">Editar</button></td>
                    <td><button class="btn btn-sm btn-danger" data-id="${veterinario.idVeterinario}">Eliminar</button></td>
                </tr>
            `;
        });

        // 4. actualizar el contador
        total.textContent = veterinarios.length;
    }

    formVeterinario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const matricula = parseInt(document.getElementById("matricula").value);
        const nombre = document.getElementById("nombre").value;
        const especializacion = document.getElementById("especializacion").value;
        const valorConsulta = parseFloat(document.getElementById("valorConsulta").value);

        const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];

        if (idEditando === null) {
            // ALTA
            const veterinario = {
                idVeterinario: crypto.randomUUID(),
                matricula: matricula,
                nombre: nombre,
                especializacion: especializacion,
                valorConsulta: valorConsulta
            };
            veterinarios.push(veterinario);
        } else {
            // EDICIÓN
            const indice = veterinarios.findIndex(function (v) {
                return v.idVeterinario === idEditando;
            });

            veterinarios[indice] = {
                idVeterinario: idEditando,
                matricula: matricula,
                nombre: nombre,
                especializacion: especializacion,
                valorConsulta: valorConsulta
            };

            idEditando = null;
        }

        localStorage.setItem("veterinarios", JSON.stringify(veterinarios));
        mostrarVeterinarios();
        formVeterinario.reset();
    });

    mostrarVeterinarios();

    tablaVeterinarios.addEventListener("click", function (evento) {
        const boton = evento.target;

        if (boton.classList.contains("btn-danger")) {
            const id = boton.dataset.id;

            const confirmar = confirm("¿Seguro que querés eliminar este veterinario?");

            if (confirmar) {
                // 1. leer el array (igual que en mostrarVeterinarios)
                const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];

                // 2. quedarte solo con las que tengan un id DISTINTO
                const filtradas = veterinarios.filter(function (v) {
                    return v.idVeterinario !== id;
                });

                // 3. guardar el array nuevo (igual que en el alta, pero con "filtradas")
                localStorage.setItem("veterinarios", JSON.stringify(filtradas));

                // 4. redibujar la tabla
                mostrarVeterinarios();
            }
        }

        if (boton.classList.contains("btn-warning")) {
            const id = boton.dataset.id;

            const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];

            // 1. buscar el veterinario (devuelve el primer elemento que cumple)
            const veterinario = veterinarios.find(function (v) {
                return v.idVeterinario === id;
            });

            // 2. cargar sus datos en el formulario
            document.getElementById("matricula").value = veterinario.matricula;
            document.getElementById("nombre").value = veterinario.nombre;
            document.getElementById("especializacion").value = veterinario.especializacion;
            document.getElementById("valorConsulta").value = veterinario.valorConsulta;

            // 3. recordar que estamos editando
            idEditando = id;
        }
    });

            