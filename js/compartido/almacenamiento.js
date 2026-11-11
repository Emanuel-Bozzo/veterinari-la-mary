// Funciones compartidas para leer y guardar listas en LocalStorage.
// Cada entidad se guarda bajo su propia clave "mascotas", "veterinarios".

export function obtener(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch (error) {
        // Si el contenido guardado está dañado, se empieza con una lista vacía
        return [];
    }
}

export function guardar(clave, lista) {
    localStorage.setItem(clave, JSON.stringify(lista));
}

export function generarId() {
    return crypto.randomUUID();
}