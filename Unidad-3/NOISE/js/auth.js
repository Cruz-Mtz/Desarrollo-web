// Funciones para iniciar y cerrar sesión

function iniciarSesion(usuario, contrasena) {
    var usuarios = obtenerUsuarios();
    var usuarioEncontrado = null;

    for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].username === usuario && usuarios[i].password === contrasena) {
            usuarioEncontrado = usuarios[i];
        }
    }

    if (usuarioEncontrado === null) {
        return null;
    }

    var sesion = {
        id: usuarioEncontrado.id,
        nombreUsuario: usuarioEncontrado.username,
        role: usuarioEncontrado.role
    };

    guardarSesion(sesion);
    return sesion;
}

function cerrarSesion() {
    borrarSesion();
    window.location.reload();
}

function esAdministrador() {
    var sesion = obtenerSesion();

    if (sesion && sesion.role === "admin") {
        return true;
    }

    return false;
}
