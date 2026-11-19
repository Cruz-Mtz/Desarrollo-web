// Variables principales de NOISE

var albumes = [];
var colaReproduccion = [];
var indiceAlbumActual = 0;
var temporizadorAviso;

// Obtener un elemento HTML por su ID
function elemento(id) {
    return document.getElementById(id);
}

// Ejecutar las funciones cuando la página termine de cargar
window.onload = function () {
    obtenerUsuarios();

    elemento("formularioLogin").addEventListener("submit", validarInicioSesion);
    elemento("botonCerrarSesion").addEventListener("click", cerrarSesion);
    elemento("inicioMarca").addEventListener("click", function (evento) {
        evento.preventDefault();
        mostrarVista("catalog");
    });

    var botonesMenu = document.querySelectorAll("[data-vista]");
    for (var i = 0; i < botonesMenu.length; i++) {
        botonesMenu[i].addEventListener("click", function () {
            mostrarVista(this.getAttribute("data-vista"));
        });
    }

    elemento("buscarCatalogo").addEventListener("keyup", mostrarCatalogo);
    elemento("filtroGenero").addEventListener("change", mostrarCatalogo);
    elemento("buscarAdmin").addEventListener("keyup", mostrarTablaAdmin);
    elemento("botonAgregarAlbum").addEventListener("click", function () {
        abrirModal(null);
    });
    elemento("cerrarModal").addEventListener("click", cerrarModal);
    elemento("cancelarModal").addEventListener("click", cerrarModal);
    elemento("modalAlbum").addEventListener("click", function (evento) {
        if (evento.target.getAttribute("data-close")) {
            cerrarModal();
        }
    });
    elemento("formularioAlbum").addEventListener("submit", guardarAlbum);

    iniciarReproductor();

    var sesion = obtenerSesion();
    if (sesion !== null) {
        entrarAplicacion(sesion);
    }
};

// Revisar los datos del formulario de inicio de sesión
function validarInicioSesion(evento) {
    evento.preventDefault();

    var usuario = elemento("usuario").value.trim();
    var contrasena = elemento("contrasena").value;
    var datosUsuario = iniciarSesion(usuario, contrasena);

    if (datosUsuario === null) {
        elemento("errorLogin").innerText = "Usuario o contraseña incorrectos.";
        return;
    }

    elemento("errorLogin").innerText = "";
    entrarAplicacion(datosUsuario);
}

// Mostrar la aplicación después de iniciar sesión
async function entrarAplicacion(usuario) {
    elemento("vistaLogin").classList.add("oculto");
    elemento("vistaAplicacion").classList.remove("oculto");

    elemento("usuarioLateral").innerText = usuario.nombreUsuario;
    elemento("rolLateral").innerText = usuario.role === "admin" ? "Administrador" : "Usuario";
    elemento("avatarUsuario").innerText = usuario.nombreUsuario.charAt(0).toUpperCase();

    var opcionesAdmin = document.getElementsByClassName("solo-admin");
    for (var i = 0; i < opcionesAdmin.length; i++) {
        if (usuario.role === "admin") {
            opcionesAdmin[i].classList.remove("oculto");
        } else {
            opcionesAdmin[i].classList.add("oculto");
        }
    }

    await cargarAlbumes();
    mostrarVista("catalog");
}

// Cambiar entre catálogo y administración
function mostrarVista(vista) {
    if (vista === "admin" && !esAdministrador()) {
        vista = "catalog";
    }

    if (vista === "catalog") {
        elemento("vistaCatalogo").classList.remove("oculto");
        elemento("vistaAdmin").classList.add("oculto");
        elemento("tituloPagina").innerText = "Catálogo musical";
    } else {
        elemento("vistaCatalogo").classList.add("oculto");
        elemento("vistaAdmin").classList.remove("oculto");
        elemento("tituloPagina").innerText = "Panel de administración";
        mostrarAdmin();
    }

    var botonesMenu = document.querySelectorAll("[data-vista]");
    for (var i = 0; i < botonesMenu.length; i++) {
        botonesMenu[i].classList.remove("active");

        if (botonesMenu[i].getAttribute("data-vista") === vista) {
            botonesMenu[i].classList.add("active");
        }
    }
}

// Consultar los álbumes de MockAPI
async function cargarAlbumes() {
    elemento("estadoConexion").innerText = "Conectando API...";
    elemento("estadoApi").innerText = "Revisar";

    try {
        albumes = await consultarAlbumes();

        if (!Array.isArray(albumes)) {
            albumes = [];
        }

        elemento("estadoConexion").innerText = "API conectada";
        elemento("estadoApi").innerText = "Activa";
    } catch (error) {
        albumes = [];
        elemento("estadoConexion").innerText = "Error de conexión";
        elemento("estadoApi").innerText = "Error";
        mostrarAviso(error.message);
    }

    mostrarCatalogo();
    mostrarAdmin();
}

// Mostrar los álbumes en el catálogo
function mostrarCatalogo() {
    var busqueda = elemento("buscarCatalogo").value.toLowerCase();
    var genero = elemento("filtroGenero").value;
    var contenido = "";
    var cantidad = 0;
    var generos = [];
    var i;

    for (i = 0; i < albumes.length; i++) {
        var nombre = albumes[i].name || "";
        var artista = albumes[i].artist || "";
        var generoAlbum = albumes[i].genre || "";

        if (generos.indexOf(generoAlbum) === -1 && generoAlbum !== "") {
            generos.push(generoAlbum);
        }

        var texto = (nombre + " " + artista).toLowerCase();

        if (texto.indexOf(busqueda) !== -1 && (genero === "" || generoAlbum === genero)) {
            contenido += crearTarjetaAlbum(albumes[i]);
            cantidad++;
        }
    }

    elemento("cantidadAlbumes").innerText = cantidad + (cantidad === 1 ? " álbum" : " álbumes");
    elemento("rejillaCatalogo").innerHTML = contenido;

    // Llenar el filtro de géneros
    var opciones = '<option value="">Todos los géneros</option>';
    for (i = 0; i < generos.length; i++) {
        opciones += '<option value="' + escaparHTML(generos[i]) + '">' + escaparHTML(generos[i]) + '</option>';
    }

    elemento("filtroGenero").innerHTML = opciones;
    elemento("filtroGenero").value = genero;

    if (elemento("filtroGenero").value !== genero) {
        elemento("filtroGenero").value = "";
    }

    if (cantidad === 0) {
        elemento("catalogoVacio").classList.remove("oculto");
    } else {
        elemento("catalogoVacio").classList.add("oculto");
    }

    var botonesReproducir = document.querySelectorAll("[data-play]");
    for (i = 0; i < botonesReproducir.length; i++) {
        botonesReproducir[i].addEventListener("click", reproducirDesdeBoton);
    }
}

// Crear el HTML de cada tarjeta
function crearTarjetaAlbum(album) {
    var portada = crearPortada(album);
    var nombre = escaparHTML(album.name || "Sin título");
    var artista = escaparHTML(album.artist || "Artista desconocido");
    var anio = escaparHTML(String(album.year || "—"));
    var genero = escaparHTML(album.genre || "Sin género");

    return '<div class="col">' +
        '<article class="album-card card h-100">' +
        portada +
        '<div class="album-info card-body d-flex flex-column">' +
        '<h4 class="card-title">' + nombre + '</h4>' +
        '<p class="card-text">' + artista + '</p>' +
        '<div class="album-meta mt-auto"><span>' + anio + '</span><span class="genero-tag">' + genero + '</span></div>' +
        '<button class="album-play mt-2" data-play="' + escaparHTML(String(album.id)) + '">▶ REPRODUCIR</button>' +
        '</div></article></div>';
}

function reproducirDesdeBoton() {
    var id = this.getAttribute("data-play");
    reproducirAlbum(id);
}

// Mostrar el panel de administración
function mostrarAdmin() {
    if (!esAdministrador()) {
        return;
    }

    var generos = [];
    for (var i = 0; i < albumes.length; i++) {
        if (albumes[i].genre && generos.indexOf(albumes[i].genre) === -1) {
            generos.push(albumes[i].genre);
        }
    }

    elemento("totalAlbumes").innerText = albumes.length;
    elemento("totalGeneros").innerText = generos.length;

    if (elemento("estadoConexion").innerText === "API conectada") {
        elemento("estadoApi").innerText = "Activa";
    } else {
        elemento("estadoApi").innerText = "Revisar";
    }

    mostrarTablaAdmin();
}

// Crear las filas de la tabla de administración
function mostrarTablaAdmin() {
    var busqueda = elemento("buscarAdmin").value.toLowerCase();
    var contenido = "";
    var cantidad = 0;

    for (var i = 0; i < albumes.length; i++) {
        var album = albumes[i];
        var texto = (album.name + " " + album.artist + " " + album.genre).toLowerCase();

        if (texto.indexOf(busqueda) !== -1) {
            contenido += '<tr>' +
                '<td><div class="table-album">' + crearMiniPortada(album) +
                '<div><strong>' + escaparHTML(album.name || "Sin título") + '</strong>' +
                '<small>ID: ' + escaparHTML(String(album.id)) + '</small></div></div></td>' +
                '<td>' + escaparHTML(album.artist || "—") + '</td>' +
                '<td>' + escaparHTML(String(album.year || "—")) + '</td>' +
                '<td>' + escaparHTML(album.genre || "—") + '</td>' +
                '<td><div class="action-group">' +
                '<button class="icon-btn" data-edit="' + escaparHTML(String(album.id)) + '" title="Editar">✎</button>' +
                '<button class="icon-btn delete-btn" data-delete="' + escaparHTML(String(album.id)) + '" title="Eliminar">⌫</button>' +
                '</div></td></tr>';
            cantidad++;
        }
    }

    elemento("tablaAlbumes").innerHTML = contenido;

    if (cantidad === 0) {
        elemento("adminVacio").classList.remove("oculto");
    } else {
        elemento("adminVacio").classList.add("oculto");
    }

    var botonesEditar = document.querySelectorAll("[data-edit]");
    for (var j = 0; j < botonesEditar.length; j++) {
        botonesEditar[j].addEventListener("click", editarDesdeBoton);
    }

    var botonesEliminar = document.querySelectorAll("[data-delete]");
    for (var k = 0; k < botonesEliminar.length; k++) {
        botonesEliminar[k].addEventListener("click", eliminarDesdeBoton);
    }
}

function editarDesdeBoton() {
    var id = this.getAttribute("data-edit");
    var album = null;

    for (var i = 0; i < albumes.length; i++) {
        if (String(albumes[i].id) === String(id)) {
            album = albumes[i];
        }
    }

    if (album !== null) {
        abrirModal(album);
    }
}

function eliminarDesdeBoton() {
    var id = this.getAttribute("data-delete");
    eliminarAlbum(id);
}

// Mostrar una portada o un recuadro si no hay imagen
function crearPortada(album) {
    var url = album.cover || "";

    if (url !== "") {
        return '<img class="album-cover" src="' + escaparHTML(url) +
            '" alt="Portada de álbum" onerror="this.outerHTML=\'<div class=&quot;cover-placeholder&quot;>♫</div>\'">';
    }

    return '<div class="cover-placeholder">♫</div>';
}

function crearMiniPortada(album) {
    if (album.cover) {
        return '<img src="' + escaparHTML(album.cover) + '" alt="" onerror="this.style.display=\'none\'">';
    }

    return '<div class="mini-cover">♫</div>';
}

// Evitar que texto ingresado rompa el HTML
function escaparHTML(texto) {
    texto = String(texto);
    texto = texto.replace(/&/g, "&amp;");
    texto = texto.replace(/</g, "&lt;");
    texto = texto.replace(/>/g, "&gt;");
    texto = texto.replace(/"/g, "&quot;");
    texto = texto.replace(/'/g, "&#39;");
    return texto;
}

// Abrir el formulario para agregar o editar
function abrirModal(album) {
    elemento("formularioAlbum").reset();
    elemento("idAlbum").value = "";

    if (album !== null) {
        elemento("idAlbum").value = album.id;
        elemento("tituloModal").innerText = "Editar álbum";
        elemento("botonGuardarAlbum").innerText = "Guardar cambios";
        elemento("nombreAlbum").value = album.name || "";
        elemento("nombreArtista").value = album.artist || "";
        elemento("anioAlbum").value = album.year || "";
        elemento("generoAlbum").value = album.genre || "";
        elemento("portadaAlbum").value = album.cover || "";
        elemento("descripcionAlbum").value = album.description || "";
        elemento("audioAlbum").value = album.audioUrl || "";
    } else {
        elemento("tituloModal").innerText = "Nuevo álbum";
        elemento("botonGuardarAlbum").innerText = "Guardar álbum";
    }

    elemento("errorFormulario").innerText = "";
    elemento("modalAlbum").classList.remove("oculto");
}

function cerrarModal() {
    elemento("modalAlbum").classList.add("oculto");
}

// Guardar un álbum nuevo o actualizar uno existente
async function guardarAlbum(evento) {
    evento.preventDefault();

    if (!esAdministrador()) {
        return;
    }

    var anio = Number(elemento("anioAlbum").value);
    var album = {
        name: elemento("nombreAlbum").value.trim(),
        artist: elemento("nombreArtista").value.trim(),
        year: anio,
        genre: elemento("generoAlbum").value.trim(),
        cover: elemento("portadaAlbum").value.trim(),
        description: elemento("descripcionAlbum").value.trim(),
        audioUrl: elemento("audioAlbum").value.trim()
    };

    if (album.name === "" || album.artist === "" || album.genre === "" ||
        anio < 1900 || anio > 2100 || anio === 0) {
        elemento("errorFormulario").innerText = "Revisa los campos obligatorios y el año.";
        return;
    }

    var id = elemento("idAlbum").value;
    elemento("botonGuardarAlbum").disabled = true;
    elemento("botonGuardarAlbum").innerText = "Guardando...";

    try {
        if (id === "") {
            await agregarAlbum(album);
            mostrarAviso("Álbum agregado correctamente.");
        } else {
            await editarAlbum(id, album);
            mostrarAviso("Álbum actualizado correctamente.");
        }

        cerrarModal();
        await cargarAlbumes();
    } catch (error) {
        elemento("errorFormulario").innerText = error.message;
    }

    elemento("botonGuardarAlbum").disabled = false;

    if (id === "") {
        elemento("botonGuardarAlbum").innerText = "Guardar álbum";
    } else {
        elemento("botonGuardarAlbum").innerText = "Guardar cambios";
    }
}

// Eliminar un álbum
async function eliminarAlbum(id) {
    if (!esAdministrador()) {
        return;
    }

    var nombre = "este álbum";
    for (var i = 0; i < albumes.length; i++) {
        if (String(albumes[i].id) === String(id)) {
            nombre = albumes[i].name;
        }
    }

    if (confirm('¿Seguro que quieres eliminar "' + nombre + '"?')) {
        try {
            await borrarAlbum(id);
            mostrarAviso("Álbum eliminado.");
            await cargarAlbumes();
        } catch (error) {
            mostrarAviso(error.message);
        }
    }
}

// Configurar los controles del reproductor
function iniciarReproductor() {
    var audio = elemento("elementoAudio");

    elemento("reproductorPausar").addEventListener("click", pausarReproductor);
    elemento("reproductorAnterior").addEventListener("click", reproducirAnterior);
    elemento("reproductorSiguiente").addEventListener("click", reproducirSiguiente);

    elemento("barraVolumen").addEventListener("input", function () {
        audio.volume = Number(elemento("barraVolumen").value);
    });

    elemento("barraProgreso").addEventListener("input", function () {
        if (audio.duration) {
            audio.currentTime = audio.duration * Number(elemento("barraProgreso").value) / 100;
        }
    });

    audio.volume = 0.8;
    audio.addEventListener("play", function () {
        elemento("reproductorPausar").innerText = "Ⅱ";
    });
    audio.addEventListener("pause", function () {
        elemento("reproductorPausar").innerText = "▶";
    });
    audio.addEventListener("timeupdate", actualizarProgreso);
    audio.addEventListener("loadedmetadata", actualizarProgreso);
    audio.addEventListener("ended", reproducirSiguiente);
    audio.addEventListener("error", function () {
        mostrarAviso("No se pudo cargar el audio. Prueba otra URL.");
    });
}

function pausarReproductor() {
    var audio = elemento("elementoAudio");

    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

function reproducirAnterior() {
    if (colaReproduccion.length === 0) {
        return;
    }

    indiceAlbumActual--;
    if (indiceAlbumActual < 0) {
        indiceAlbumActual = colaReproduccion.length - 1;
    }

    reproducirAlbum(colaReproduccion[indiceAlbumActual].id);
}

function reproducirSiguiente() {
    if (colaReproduccion.length === 0) {
        return;
    }

    indiceAlbumActual++;
    if (indiceAlbumActual >= colaReproduccion.length) {
        indiceAlbumActual = 0;
    }

    reproducirAlbum(colaReproduccion[indiceAlbumActual].id);
}

// Buscar y reproducir una vista previa de iTunes si el álbum no tiene audio propio
async function reproducirAlbum(id) {
    colaReproduccion = [];
    indiceAlbumActual = 0;

    for (var i = 0; i < albumes.length; i++) {
        if (albumes[i].id !== undefined) {
            colaReproduccion.push(albumes[i]);
        }
    }

    for (var j = 0; j < colaReproduccion.length; j++) {
        if (String(colaReproduccion[j].id) === String(id)) {
            indiceAlbumActual = j;
        }
    }

    var album = colaReproduccion[indiceAlbumActual];
    if (!album) {
        return;
    }

    var audio = elemento("elementoAudio");
    var direccionAudio = album.audioUrl || "";

    if (direccionAudio === "") {
        mostrarAviso("Buscando una vista previa disponible...");

        try {
            var busqueda = encodeURIComponent(album.artist + " " + album.name);
            var respuesta = await fetch("https://itunes.apple.com/search?term=" + busqueda + "&entity=song&limit=10");
            var datos = await respuesta.json();

            if (respuesta.ok && datos.results.length > 0) {
                for (var k = 0; k < datos.results.length; k++) {
                    if (datos.results[k].previewUrl) {
                        direccionAudio = datos.results[k].previewUrl;
                        break;
                    }
                }
            }
        } catch (error) {
            direccionAudio = "";
        }
    }

    if (direccionAudio === "") {
        mostrarAviso("No encontramos una vista previa. Agrega una URL de audio en Administración.");
        return;
    }

    audio.pause();
    audio.src = direccionAudio;
    elemento("tituloReproductor").innerText = album.name || "Sin título";
    elemento("artistaReproductor").innerText = album.artist || "Artista desconocido";
    elemento("portadaReproductor").src = album.cover || "";
    elemento("barraReproductor").classList.remove("oculto");
    audio.load();

    try {
        await audio.play();
    } catch (error) {
        mostrarAviso("El navegador bloqueó la reproducción. Intenta nuevamente.");
    }
}

// Actualizar el tiempo y la barra de progreso
function actualizarProgreso() {
    var audio = elemento("elementoAudio");
    var actual = audio.currentTime || 0;
    var duracion = audio.duration || 0;

    if (duracion > 0) {
        elemento("barraProgreso").value = actual / duracion * 100;
    } else {
        elemento("barraProgreso").value = 0;
    }

    elemento("tiempoActual").innerText = formatearTiempo(actual);
    elemento("duracionAudio").innerText = formatearTiempo(duracion);
}

function formatearTiempo(segundos) {
    if (isNaN(segundos)) {
        segundos = 0;
    }

    var minutos = Math.floor(segundos / 60);
    var resto = Math.floor(segundos % 60);

    if (resto < 10) {
        return minutos + ":0" + resto;
    }

    return minutos + ":" + resto;
}

// Mostrar mensajes temporales
function mostrarAviso(mensaje) {
    var aviso = elemento("avisoEmergente");
    aviso.innerText = mensaje;
    aviso.classList.add("show");

    clearTimeout(temporizadorAviso);

    temporizadorAviso = setTimeout(function () {
        aviso.classList.remove("show");
    }, 3200);
}
