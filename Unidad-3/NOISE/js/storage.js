// Funciones para guardar y recuperar información del navegador

function obtenerUsuarios() {
    var usuariosGuardados = localStorage.getItem("sonora_users");

    if (usuariosGuardados) {
        return JSON.parse(usuariosGuardados);
    }

    var usuariosIniciales = [
        { id: 1, username: "admin", password: "admin123", role: "admin" },
        { id: 2, username: "usuario", password: "user123", role: "usuario" }
    ];

    localStorage.setItem("sonora_users", JSON.stringify(usuariosIniciales));
    return usuariosIniciales;
}

function obtenerSesion() {
    var datosSesion = localStorage.getItem("sonora_session");

    if (datosSesion) {
        return JSON.parse(datosSesion);
    }

    return null;
}

function guardarSesion(usuario) {
    localStorage.setItem("sonora_session", JSON.stringify(usuario));
}

function borrarSesion() {
    localStorage.removeItem("sonora_session");
}
