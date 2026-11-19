// Funciones para comunicarse con MockAPI

async function consultarAlbumes() {
    var respuesta = await fetch(API_URL);
    if (!respuesta.ok) {
        throw new Error("No se pudieron consultar los álbumes. Código: " + respuesta.status);
    }
    var datos = await respuesta.json();
    return datos;
}

async function agregarAlbum(album) {
    var respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(album)
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo agregar el álbum. Código: " + respuesta.status);
    }

    return await respuesta.json();
}

async function editarAlbum(id, album) {
    var respuesta = await fetch(API_URL + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(album)
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo editar el álbum. Código: " + respuesta.status);
    }

    return await respuesta.json();
}

async function borrarAlbum(id) {
    var respuesta = await fetch(API_URL + "/" + id, {
        method: "DELETE"
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el álbum. Código: " + respuesta.status);
    }

    return true;
}
