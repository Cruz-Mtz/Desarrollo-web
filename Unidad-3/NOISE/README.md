# NOISE — plataforma musical

NOISE es un proyecto escolar desarrollado con HTML, CSS, JavaScript y Bootstrap. Incluye inicio de sesión, catálogo musical, administración de álbumes y reproductor.

## Cómo ejecutar

1. Abre la carpeta NOISE en Visual Studio Code.
2. Revisa `js/config.js` y confirma que la dirección corresponda a tu recurso de MockAPI.
3. Abre `index.html` con Live Server.

## Accesos de demostración

- Administrador: `admin` / `admin123`
- Usuario: `usuario` / `user123`

## API y operaciones

NOISE utiliza MockAPI para guardar los álbumes. El proyecto realiza estas operaciones:

- GET: consultar los álbumes.
- POST: agregar un álbum.
- PUT: editar un álbum.
- DELETE: eliminar un álbum.

Los campos que se envían a MockAPI son `name`, `artist`, `year`, `genre`, `cover`, `description` y `audioUrl`. Se conserva el campo `genre` para coincidir con el recurso existente.

## Reproductor

El reproductor permite reproducir, pausar, avanzar, retroceder, ajustar el volumen y mover la barra de progreso. Si un álbum no tiene una dirección de audio propia, NOISE consulta iTunes Search para intentar obtener una vista previa. Estas vistas previas son fragmentos y no álbumes completos.

## JavaScript utilizado

El código se adaptó a una estructura parecida al ejercicio de clase:

- Variables con `var`.
- Funciones tradicionales.
- Condiciones `if` y `else`.
- Ciclos `for`.
- Eventos con `addEventListener`.
- Consultas con `fetch` y `async/await`.
- Manejo de errores con `try/catch`.
- `JSON.stringify` y `JSON.parse` para guardar y leer datos.
- `localStorage` para mantener la sesión en el navegador.

Se evitaron métodos y sintaxis más compactos como `map`, `filter`, `find`, funciones flecha, `Set`, el operador `?.` y el operador de propagación.

## Nota

El inicio de sesión es demostrativo y guarda las cuentas en el navegador. No debe utilizarse como sistema de autenticación para producción.
