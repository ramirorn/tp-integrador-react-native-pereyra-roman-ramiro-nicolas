# Biblioteca IPF

App integradora del Taller Complementario – React Native II (TP N° 4). Permite consultar el catálogo de la biblioteca, reservar libros, recibir un recordatorio antes de devolverlos y, para el personal, entregar libros respetando el orden de las listas de espera.

- **Alumno:** Ramiro Nicolás Pereyra Román
- **SDK de Expo:** 58 (`expo ~58.0.26`, `expo-router ~58.0.32`, React Native 0.88, React 19.3)
- **Proyecto creado con:** `npx create-expo-app@latest` (plantilla default con TypeScript y Expo Router). Paquetes agregados con `npx expo install`.

## Cómo ejecutar

```bash
npm install
npx expo start
```

Escanear el QR con **Expo Go** (Android o iOS). Otros comandos:

```bash
npx expo lint        # lint
npx tsc --noEmit     # chequeo de tipos
npm test             # pruebas de Pila y Cola (jest-expo)
```

**Credenciales del personal** (fijas en `src/constants/personal.ts`): usuario `biblioteca`, clave `ipf2026`.

**Libros para probar el escáner:** los 16 libros usan ISBN de ediciones reales (verificados en Open Library), por ejemplo `Cien años de soledad` (9780307474728) y `El principito` (9788498381498). Si tenés otro libro a mano, se puede reemplazar el ISBN en `src/data/libros.ts`.

## Árbol de rutas (`src/app`)

```
src/app
├── _layout.tsx                 Stack raíz (BibliotecaProvider + Stack.Protected). anchor: (tabs)
├── +not-found.tsx              404 con la URL inexistente
├── buscar.tsx                  /buscar?q=        (Stack raíz)
├── login.tsx                   /login            (modal, solo sin sesión)
├── mostrador.tsx               /mostrador        (solo con sesión)
├── reserva.tsx                 /reserva          <Redirect href="/reservas" />
├── reservar
│   └── [isbn].tsx              /reservar/[isbn]  (modal)
├── permisos
│   └── [recurso].tsx           /permisos/camara | /permisos/notificaciones (modal)
└── (tabs)
    ├── _layout.tsx             Tabs (expo-router/tabs): "Catálogo" y "Mis reservas"
    ├── reservas.tsx            /reservas         (tab "Mis reservas")
    └── (catalogo)
        ├── _layout.tsx         Stack propio de la tab Catálogo. anchor: index
        ├── index.tsx           /                 (Catálogo)
        ├── escanear.tsx        /escanear
        └── libro
            └── [isbn].tsx      /libro/[isbn]
```

| Layout | Navegador |
| --- | --- |
| `src/app/_layout.tsx` | `Stack` raíz. Declara `buscar`, los modales (`reservar/[isbn]`, `permisos/[recurso]`, `login`) y protege `login`/`mostrador` con `Stack.Protected`. `unstable_settings.anchor = '(tabs)'`. |
| `src/app/(tabs)/_layout.tsx` | `Tabs` importado de `expo-router/tabs` (en SDK 58 ya no se exporta desde `expo-router`). Íconos de `@expo/vector-icons`. |
| `src/app/(tabs)/(catalogo)/_layout.tsx` | `Stack` de la tab Catálogo. `unstable_settings.anchor = 'index'` para que un deep link a un libro deje el Catálogo debajo. |

`/escanear` vive dentro del Stack de la tab Catálogo para poder hacer `router.replace` hacia `/libro/[isbn]` dentro del mismo Stack.

## Estructura de `src`

| Carpeta | Contenido |
| --- | --- |
| `app` | Solo rutas y layouts |
| `components` | Un componente por archivo (`Boton`, `TarjetaLibro`, `BarraPestanias`, `EscanerCamara`…) |
| `hooks` | `useLibros`, `useBusqueda`, `useDebounce`, `usePermiso`, `usePermisosNotificaciones`, `useBiblioteca` |
| `lib` | Lógica sin React: `api` (entregado), `catalogo`, `reservas`, `recientes`, `fechas`, `permisos`, `notificaciones` |
| `context` | `BibliotecaContext` y `BibliotecaProvider` (préstamos, esperas, recientes, sesión y avisos) |
| `estructuras` | `Pila` y `Cola` con `#items`, getter `tamanio` y `aArray()` (+ tests) |
| `data` | `libros.ts` (16 libros y listas de espera iniciales) |
| `types` | `Libro` (entregado) y tipos propios |
| `constants` | `tema.ts` (colores, tamaños, espaciados), mensajes, configuración y credenciales |

## Plugins de `app.json`

```jsonc
"plugins": [
  // Expo Router: rutas a partir de src/app y scheme "bibliotecaipf" para deep links.
  "expo-router",
  // Pantalla de carga con el color de la app.
  ["expo-splash-screen", { "backgroundColor": "#1E3A8A", "image": "./assets/images/splash-icon.png", "imageWidth": 76 }],
  [
    "expo-camera",
    {
      // iOS: NSCameraUsageDescription. Molde "Usamos tu [dato] para [beneficio]".
      "cameraPermission": "Usamos tu cámara para leer el código de barras del libro y abrir su ficha al instante.",
      // Mínimo privilegio: no se graba video, así que no se pide micrófono (iOS)...
      "microphonePermission": false,
      // ...ni RECORD_AUDIO (Android).
      "recordAudioAndroid": false
    }
  ],
  // Notificaciones locales. Color del ícono en Android. iOS no requiere texto de propósito.
  ["expo-notifications", { "color": "#1E3A8A" }]
]
```

Además: `"scheme": "bibliotecaipf"`, `"experiments": { "typedRoutes": true }` y `"userInterfaceStyle": "light"`.

## Permisos

| Recurso | Módulo | Cuándo se pide | Alternativa si se niega |
| --- | --- | --- | --- |
| Cámara | `expo-camera` (`useCameraPermissions` dentro de `usePermiso`) | En `/escanear`, al tocar "Activar cámara" se abre `/permisos/camara` y recién su botón "Continuar" lanza el diálogo del sistema | Escribir el ISBN a mano en la misma pantalla. Si está bloqueado, botón "Abrir Ajustes" |
| Notificaciones | `expo-notifications` (`usePermisosNotificaciones`, creado con `createPermissionHook`) | Únicamente al encender "Recordarme" en un préstamo (`/permisos/notificaciones`). En Android se crea antes el canal `prestamos` | Los avisos (libro listo para retirar) aparecen dentro de `/reservas`; la fecha de devolución siempre está visible |

### Justificación de `blockedPermissions`

Algunas librerías (o el template) pueden agregar permisos al `AndroidManifest` por dependencias transitivas. La app **solo** necesita cámara y notificaciones, así que se bloquean explícitamente:

| Permiso bloqueado | Por qué |
| --- | --- |
| `RECORD_AUDIO` | El escáner no graba video; refuerza `recordAudioAndroid: false` |
| `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION` | La app no usa ubicación (no se instala `expo-location`) |
| `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO` | No se leen ni guardan archivos o fotos (no se instala `expo-image-picker`) |
| `READ_CONTACTS` | No se usan contactos |
| `SYSTEM_ALERT_WINDOW` | Lo agrega el modo desarrollo; la app no dibuja sobre otras apps |

## Deep links de prueba

En Expo Go reemplazar `bibliotecaipf://` por `exp://IP:8081/--/`.

| Link | Resultado esperado |
| --- | --- |
| `bibliotecaipf://libro/9788499089515` | Detalle de *El Aleph*, con el Catálogo debajo |
| `bibliotecaipf://libro/123` | Mensaje "ISBN inválido" con link al Catálogo |
| `bibliotecaipf://libro/9789999999999` | Mensaje "Libro no encontrado" |
| `bibliotecaipf://buscar?q=borges` | Buscador con resultados de Borges y las tabs debajo |
| `bibliotecaipf://mostrador` | Sin sesión: `Stack.Protected` bloquea la ruta y se muestra el Catálogo (ancla) |
| `bibliotecaipf://reserva` | Redirige a `/reservas` |
| `bibliotecaipf://escanear` | Escáner (con cámara bloqueada: "Abrir Ajustes" + ingreso manual) |
| `bibliotecaipf://cualquier-cosa` | Pantalla 404 que muestra la URL |

## Desafíos opcionales

- **Pruebas:** `src/estructuras/__tests__` (10 casos, incluye desencolar una cola vacía).
- **Debounce:** `useDebounce` espera 300 ms antes de actualizar `q` en la URL, con `clearTimeout` en la limpieza.

## Verificación

Salida de `npx expo lint` (sin errores ni advertencias, sin reglas desactivadas):

```
$ npx expo lint
$
```

Salida de `npx tsc --noEmit`:

```
$ npx tsc --noEmit
$
```

Salida de `npm test`:

```
Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
```

## Capturas

Tomadas en la versión web de la app (`npx expo start --web`) con un viewport de teléfono (375 × 812). Están en [`capturas/`](capturas/).

| Pedido de la consigna | Captura |
| --- | --- |
| Catálogo cargando | [01-catalogo-cargando](capturas/01-catalogo-cargando.jpg) |
| Catálogo con error | [02-catalogo-error](capturas/02-catalogo-error.jpg) |
| Catálogo con datos | [03-catalogo-datos](capturas/03-catalogo-datos.jpg) |
| Buscador | [04-buscador](capturas/04-buscador.jpg) |
| Detalle inexistente | [05-detalle-inexistente](capturas/05-detalle-inexistente.jpg), [06-detalle-isbn-invalido](capturas/06-detalle-isbn-invalido.jpg) |
| Reserva con ejemplares | [07-reserva-con-ejemplares](capturas/07-reserva-con-ejemplares.jpg) |
| Reserva sin ejemplares | [08-reserva-sin-ejemplares](capturas/08-reserva-sin-ejemplares.jpg), [09-mis-reservas](capturas/09-mis-reservas.jpg) |
| Escáner | [10-escaner-preguntable](capturas/10-escaner-preguntable.jpg), [11-permiso-camara](capturas/11-permiso-camara.jpg), [12-escaner-isbn-inexistente](capturas/12-escaner-isbn-inexistente.jpg) |
| Aviso sin permiso de notificaciones | [13-permiso-notificaciones-bloqueado](capturas/13-permiso-notificaciones-bloqueado.jpg), [18-aviso-dentro-de-la-app](capturas/18-aviso-dentro-de-la-app.jpg) |
| Login | [14-login-clave-incorrecta](capturas/14-login-clave-incorrecta.jpg) |
| Mostrador antes y después de “Entregar al siguiente” | [15-mostrador-antes](capturas/15-mostrador-antes.jpg), [16-mostrador-despues](capturas/16-mostrador-despues.jpg), [17-mostrador-entregado-a-vos](capturas/17-mostrador-entregado-a-vos.jpg) |
| Pantalla 404 | [19-pantalla-404](capturas/19-pantalla-404.jpg) |

En el navegador no se pueden reproducir el escáner con la cámara concedida o bloqueada por el sistema ni una notificación del sistema: esos estados dependen del teléfono. El estado bloqueado se ve en la captura 13 (las notificaciones del navegador aparecen bloqueadas) y el aviso que reemplaza a la notificación, en la 18.
