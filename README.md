# Sonido Vivo — Frontend (React)

Tienda online de instrumentos musicales **Sonido Vivo**: catálogo, carrito, compra con despacho o retiro, historial de pedidos y panel de administración por rol. Consume la API REST del backend con **Axios** e inicia sesión con **JWT**.

| | |
|---|---|
| **Asignatura** | DSY1104 – Desarrollo Fullstack II (2026) · Sección 005D |
| **Equipo 7** | Sebastián Alejandro Fica Droguett (seb.fica@duocuc.cl) · Alonso Ignacio Valenzuela Gonzales (alo.valenzuela@duocuc.cl) |
| **Repositorio backend** | URL_DEL_REPO_BACKEND |
| **Swagger (API)** | `http://IP_PUBLICA_EC2:8080/swagger-ui.html` (la IP cambia al reiniciar el laboratorio de AWS Academy) |
| **Tienda desplegada** | `http://IP_PUBLICA_EC2:5173` |
| **Material complementario** | https://drive.google.com/drive/folders/1eXd8NFijBfCoC-25je-nII3zIXDd5BaY?usp=sharing |

---

## Tecnologías
React 19 + Vite · React Router · Bootstrap 5 / React Bootstrap · **Axios** · Vitest + Testing Library.

## Estructura
```
src/
├── components/      Atomic Design: atoms, molecules, organisms, templates (+ RutaProtegida)
├── pages/           Una página por ruta (públicas, cliente y panel admin) + AccesoDenegado
├── context/         TiendaContext: estado global (catálogo, sesión, carrito, pedidos, usuarios)
├── services/        Axios: api.js (instancia, token, errores) y un service por recurso
├── dto/             Arman el cuerpo exacto que exige la API (producto.dto, pedido.dto)
├── utils/           Funciones puras (precios)
└── data/            Datos de las vistas informativas (blog) y datos de ejemplo usados por las pruebas
```

## Integración con la API
- **Axios solo vive en `src/services`.** Los componentes reciben datos y funciones por `props.algo`.
- `api.js` usa la dirección base **`/api/v1`**. En el servidor, el **proxy de Vite** reenvía `/api` al backend (`localhost:8080`), así el código no depende de la IP pública y no hay solicitudes entre orígenes.
- Cada pantalla muestra **carga** ("Cargando catálogo…", "Ingresando…", "Procesando pago…"), **éxito** y **error** (mensaje del servidor en la página).

| Pantalla | Endpoints |
|---|---|
| Inicio, Catálogo, Categorías, Ofertas, Detalle | `GET /productos`, `GET /categorias`, `GET /marcas` |
| Login / Registro | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| Checkout, Mis pedidos | `GET /pedidos/opciones`, `GET /regiones`, `POST /pedidos`, `GET /pedidos` |
| Panel → Productos, Categorías | `POST/PUT/DELETE /productos`, `POST/PUT /categorias` |
| Panel → Pedidos | `GET /pedidos`, `PATCH /pedidos/{codigo}/estado` |
| Panel → Usuarios, Mi perfil | `GET/POST /usuarios`, `PUT /usuarios/{id}` |

## Sesión y permisos
- **Token JWT en `sessionStorage`** (`sv_token`): la sesión **sobrevive a la recarga** (se recupera con `GET /auth/me`) y se borra al **cerrar sesión**, al **cerrar la pestaña** o cuando el backend responde **401** (token vencido, 60 min).
  - *Por qué sessionStorage:* a diferencia de `localStorage`, no queda guardado al cerrar el navegador; el riesgo de lectura por XSS se mitiga con la vigencia corta y el escape de React. Una cookie HttpOnly sería más segura, pero exige manejar CSRF.
- **Rutas:** públicas (catálogo, ofertas, detalle, carrito, login, informativas) · solo **Cliente** (checkout, mis pedidos) · **Administrador y Vendedor** (`/admin/...`) · solo **Administrador** (`/admin/usuarios`).
- Sin sesión → login. Rol sin permiso → página **Acceso denegado**. Los menús se muestran según el rol. **El backend vuelve a comprobar cada permiso** (401/403): ocultar un botón no es seguridad.

## Cómo ejecutar
Requisitos: **Node.js 24** y el backend encendido en el mismo servidor (puerto 8080).
```bash
npm install
npm run dev                         # desarrollo: http://localhost:5173 (o http://IP:5173 en la EC2)
npm run build && npm run preview    # versión compilada (la que se presenta)
npm run test:run                    # pruebas unitarias (Vitest)
```

**Cuentas de prueba:** `admin@sonidovivo.cl`, `vendedor@sonidovivo.cl`, `cliente@correo.cl` (contraseña definida en `DEMO_PASSWORD` del backend).

## Estado
| Funcionalidad | Estado |
|---|---|
| Catálogo desde la API (carga, error y reintento) | ✅ |
| Login, registro y sesión persistente con JWT | ✅ |
| Rutas y menús por rol, página Acceso denegado | ✅ |
| Checkout con Región → Comuna y regla de stock (409) | ✅ |
| Mis pedidos y cambio de estado en el panel | ✅ |
| CRUD de usuarios, productos y categorías contra la API | ✅ |
| Pruebas Vitest de páginas adaptadas a la API (simulando los services) | ✅ |
