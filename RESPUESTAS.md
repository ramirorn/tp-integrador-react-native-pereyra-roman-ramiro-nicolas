# Respuestas – TP N° 4 “Biblioteca IPF”

Las referencias a líneas corresponden al estado final del repositorio.

---

## Parte B · Estado, efectos y renderizado

### B1. El ciclo de vida de `useLibros`

Código: `src/hooks/useLibros.ts:14-56`.

**a) Render por render**

Caso exitoso:

| Render | Qué lo provoca | `libros` | `cargando` | `error` |
| --- | --- | --- | --- | --- |
| 1 | Montaje del Catálogo | `[]` | `true` | `null` |
| — | Después del render 1 corre el efecto (línea 21) y llama a `obtenerLibros()`. No hay render nuevo mientras espera 800 ms. | | | |
| 2 | Llega la respuesta: `setLibros(datos)`, `setError(null)` (líneas 28-29) y `setCargando(false)` en el `finally` (línea 37). Las tres actualizaciones ocurren en la misma continuación del `await`, así que React 18+ las agrupa (batching) en un solo render. `setError(null)` no cambia nada porque ya era `null`. | 16 libros | `false` | `null` |

Total: 2 renders (en desarrollo, con Strict Mode, React monta dos veces y se ven más).

Caso con error y “Reintentar”:

| Render | Qué lo provoca | `libros` | `cargando` | `error` |
| --- | --- | --- | --- | --- |
| 1 | Montaje | `[]` | `true` | `null` |
| 2 | `obtenerLibros()` lanza el error: `setError(...)` en el `catch` (línea 33) y `setCargando(false)` en el `finally`, agrupados | `[]` | `false` | mensaje |
| 3 | La persona toca “Reintentar”: `setCargando(true)`, `setError(null)` y `setIntento(+1)` (líneas 50-52), agrupados por estar en el mismo evento | `[]` | `true` | `null` |
| — | Como cambió `intento`, se ejecuta la limpieza del efecto anterior (`activo = false`) y el efecto otra vez | | | |
| 4 | Llega la respuesta (o un nuevo error) | 16 libros | `false` | `null` |

**b) ¿Se desmonta el Catálogo?**

No en ninguno de los dos casos. Lo comprobé con un `console.log('[TEMP] limpieza useLibros')` temporal dentro de la limpieza (después de la línea 45; ya lo saqué). Recorrí la app y miré la consola:

- Cambiar a “Mis reservas” y volver: no apareció el mensaje.
- Abrir un detalle y volver con “atrás”: no apareció.
- Iniciar sesión, ir al mostrador y cerrar sesión: tampoco.
- Tocar “Reintentar” después del error simulado: **sí** apareció, una vez.

Por qué:

- Las tabs mantienen montadas las pantallas que ya visitaste; solo cambian cuál se ve.
- Al abrir un detalle se hace `push` en el Stack de la tab: el Catálogo queda debajo, montado.

Entonces la limpieza se ejecuta en dos situaciones reales: cuando cambia `intento` (cada “Reintentar”, que es lo que vi en la consola) y cuando el Catálogo se desmonta de verdad, por ejemplo al recargar o cerrar la app. Por eso el flag `activo` es necesario: si la respuesta llega después, no se llama a `setState` sobre un pedido que ya no importa.

**c) `async` directo en `useEffect`**

Una función `async` siempre devuelve una `Promise`. `useEffect` espera que lo que devuelve el callback sea la función de limpieza (o nada). Si le paso una función `async`, React recibe una promesa en vez de la limpieza: no puede limpiar y además avisa con un warning.

Lo resolví declarando la función `async` adentro del efecto y llamándola, y devolviendo la limpieza de forma sincrónica (`useLibros.ts:21-47`):

```ts
useEffect(() => {
  let activo = true;
  async function cargar() { /* try / catch / finally con await */ }
  cargar();
  return () => {
    activo = false;
  };
}, [intento]);
```

**d) `reintentar`**

`reintentar` (líneas 49-53) pone `cargando` en `true`, borra el error y suma 1 a `intento`. `intento` está en el array de dependencias del efecto (línea 47), así que al cambiar React limpia el efecto anterior y lo vuelve a correr, lo que vuelve a pedir los libros.

Usé un contador y no otro valor porque:

- No puedo usar `error`: si falla dos veces seguidas con el mismo mensaje, el valor no cambia y el efecto no se repetiría.
- No puedo usar `cargando`: el efecto mismo lo cambia, y tenerlo en las dependencias provocaría un bucle o pedidos de más.
- Un número que solo cambia cuando la persona toca el botón expresa exactamente “quiero un pedido nuevo”.

### B2. La condición de carrera del buscador

Código: `src/hooks/useBusqueda.ts:26-62`, `src/app/buscar.tsx:19-30`.

| Momento | Qué pasa | Sin limpieza: qué se ve | Con mi código: qué se ve |
| --- | --- | --- | --- |
| t = 0 ms | Pide `buscarLibros("bor")` (1.400 ms) | “Buscando…” | “Buscando…” |
| t = 200 ms | Pide `buscarLibros("borges")` (300 ms) | “Buscando…” | “Buscando…” (la limpieza apagó el `activo` de “bor”) |
| t = 500 ms | Llega “borges” | Resultados de Borges | Resultados de Borges |
| t = 1.400 ms | Llega “bor” | **Resultados de “bor”** con “borges” escrito en el campo: incorrecto | Siguen los resultados de Borges: la respuesta de “bor” se descarta |

> En mi app además hay un debounce de 300 ms (`useDebounce`), así que escribiendo rápido “bor” ni siquiera llega a pedirse. La tabla supone que las dos búsquedas sí salieron.

**a) Qué hace la limpieza**

Cada ejecución del efecto crea su propia variable `activo = true` (línea 32). La función de limpieza (líneas 46-48) la pone en `false`. React ejecuta la limpieza **antes de correr el efecto con la nueva `consulta`** (y al desmontar). Cuando la respuesta vieja llega, su `.then` todavía ve su propio `activo` (en `false`) y no llama a `setResultado` (líneas 36-38).

Además el resultado guarda para qué consulta fue (`consulta` e `intento`) y solo se muestra si coincide con la actual (líneas 54-55). Eso también evita mostrar resultados viejos durante el render en que cambia `q`.

**b) Comparar `texto === q` dentro del `.then()`**

No funciona. La función del `.then` es una clausura creada en el render en que se lanzó la búsqueda: el `q` que “ve” es el valor de **ese** render, no el actual. Para la búsqueda de “bor”, tanto `texto` como `q` valen `"bor"` dentro de esa clausura, así que la comparación da `true` y la respuesta vieja pisa a la nueva. Las clausuras de JavaScript capturan las variables del ámbito donde se crean; cada render tiene sus propias constantes `q`. La solución del flag funciona justamente porque la limpieza modifica la variable que esa clausura capturó.

**c) La URL y el botón atrás**

Mientras se escribe, la URL cambia a `/buscar?q=...` (300 ms después de dejar de escribir) pero el historial no crece: `router.setParams` reemplaza los parámetros de la pantalla actual. Un solo “atrás” sale del buscador.

Con `router.push` cada búsqueda apilaría una pantalla `/buscar` nueva: escribir “borges” podría dejar 3 o 4 pantallas y “atrás” iría recorriendo búsquedas intermedias. Además cada pantalla nueva tendría su propio estado (el campo de texto se reiniciaría y perdería el foco).

### B3. Mutar o reemplazar

**a)** Muestra `Personas en espera: 0`. `encolar` modifica el objeto que está guardado en el estado, pero no se llama a ningún `setState`. React no se entera de que algo cambió y no vuelve a renderizar; además la referencia es la misma, así que aunque se comparara no detectaría el cambio.

**b)** Al escribir en el `TextInput` controlado se llama a `setTexto`, que sí provoca un render. En ese render se vuelve a leer `espera.tamanio` del mismo objeto (que fue mutado tres veces) y aparece el 3 de golpe. El número no depende de la acción que lo cambió sino de cualquier otra cosa que cause un render. Un error que aparece “a veces” es peor porque es difícil de reproducir: puede pasar las pruebas, depende del orden en que la persona toca las cosas, y cuando se reporta nadie lo puede repetir. Un error que aparece siempre se detecta y se corrige enseguida.

**c)** En `BibliotecaProvider` nunca muto una estructura que ya está en el estado. Clono, modifico la copia y guardo la referencia nueva:

```ts
// src/context/BibliotecaProvider.tsx:64-73 (recientes)
setRecientes((previa) => {
  if (previa.verTope() === isbn) return previa;
  const nueva = previa.clonar();
  nueva.push(isbn);
  return nueva;
});

// src/context/BibliotecaProvider.tsx:101-103 (lista de espera)
const cola = (esperasRef.current[isbn] ?? new Cola<string>()).clonar();
cola.encolar(MI_NOMBRE);
reemplazarCola(isbn, cola); // nuevo objeto esperas + setEsperas
```

`clonar()` está en `src/estructuras/Cola.ts` y `Pila.ts`.

| Alternativa | Ventaja | Costo |
| --- | --- | --- |
| **Clonar y reemplazar (mi elección)** | Mantengo las clases `Pila`/`Cola` con `#items`. React detecta el cambio por referencia y cada render ve un estado consistente | Copiar la estructura en cada cambio es O(n). Con colas de pocas personas no importa |
| Contador de versión (`setVersion(v => v + 1)` después de mutar) | No copia nada | El objeto sigue mutando “por detrás”: un componente memorizado o un render anterior puede ver datos que ya cambiaron. Es fácil olvidarse de incrementar |
| `useReducer` con arrays inmutables | Toda la lógica de cambios en un solo lugar, fácil de probar | Hay que reescribir las estructuras como funciones puras sobre arrays; se pierde la clase `Cola` del TP 2 |

### B4. ¿Dónde vive cada dato?

| Dato | Dónde vive | Por qué ahí |
| --- | --- | --- |
| Texto del buscador | URL (`q`, con `router.setParams`) + estado local `texto` para el campo | En la URL se puede compartir, sobrevive a un deep link y el “atrás” no se rompe. El estado local evita actualizar la URL en cada tecla (debounce) |
| Préstamos y reservas | Context (`prestamos`, y mi posición se calcula desde las colas) | Los usan varias pantallas de distintas ramas (detalle, reservar, mis reservas, mostrador) |
| Listas de espera | Context (`esperas`, un `Cola` por ISBN) | Las modifican la persona usuaria (reservar) y el personal (mostrador) desde ramas distintas |
| Vistos recientemente | Context (`recientes`, una `Pila`) | Se escribe en el detalle y se lee en el Catálogo |
| Sesión del personal | Context (`sesion`) | La necesita el layout raíz para `Stack.Protected` y el header del Catálogo |
| Ejemplares disponibles | Se calcula (`calcularDisponibles`, `src/lib/reservas.ts:6-11`) | Sale de `libro.ejemplares` y los préstamos; guardarlo aparte duplicaría el dato (ver E4 d) |
| Estado del permiso de cámara | Sistema operativo; la app lo lee con `usePermiso` cada vez que la pantalla toma foco o vuelve a primer plano | La persona lo puede cambiar desde Ajustes sin que la app se entere; una copia guardada quedaría vieja |
| Identificador de la notificación programada | Context, dentro de cada préstamo (`notificacionId`) | Hace falta para cancelarla al apagar el interruptor o devolver el libro. Es un dato del préstamo |

**¿Qué se re-renderiza cuando cambia el `value`?** Todos los componentes que llaman a `useContext(BibliotecaContext)` (con `useBiblioteca`), aunque usen una sola propiedad. El `value` está memorizado con `useMemo` (`BibliotecaProvider.tsx:186`), así que solo cambia cuando cambia algún dato, pero cuando cambia, cambia entero.

Sí: el Catálogo usa `disponibles` y `VistosRecientes` usa `recientes`, y al activar un recordatorio cambia `prestamos`, entonces se re-renderizan aunque estén en otra pestaña. Para evitarlo podría dividir el contexto en varios (préstamos, esperas, recientes, sesión), o usar una librería con selectores. En una app de este tamaño no vale la pena: son pocos componentes, las listas son de 16 elementos y no hay animaciones que se traben. Lo haría solo si lo midiera con el Profiler y viera un problema real.

---

## Parte C · Navegación y rutas

### C1. La pila en tu app

| # | Acción | Pilas resultantes (base → tope) |
| --- | --- | --- |
| 1 | Abre la app | Raíz: `[(tabs)]` · Tab Catálogo (activa): `[index]` |
| 2 | Toca un libro | Raíz: `[(tabs)]` · Catálogo: `[index, libro/X]` |
| 3 | Toca “Reservar” | Raíz: `[(tabs), reservar/X (modal)]` · Catálogo: `[index, libro/X]` |
| 4 | Toca “Confirmar” | Raíz: `[(tabs)]` · Tab activa: Mis reservas `[reservas]` · Catálogo sigue `[index, libro/X]` |
| 5 | Atrás (Android) | Raíz: `[(tabs)]` · Las tabs usan `backBehavior: 'firstRoute'` (el valor por defecto en `expo-router`), así que “atrás” vuelve a la primera tab, Catálogo, que sigue mostrando `libro/X` |
| 6 | Toca la tab “Catálogo” | Raíz: `[(tabs)]` · Catálogo: `[index]` (tocar la tab que ya está activa vuelve al inicio de su Stack) |

**a)** En el paso 4 uso `router.dismiss()` y después `router.navigate('/reservas')` (`src/components/ConfirmacionReserva.tsx:37-38`).

- `push('/reservas')`: el modal quedaría en el historial; “atrás” desde Mis reservas volvería a la confirmación, justo lo que pide evitar el enunciado.
- `replace('/reservas')`: reemplaza el modal en el Stack raíz por una ruta que vive dentro de `(tabs)`. Puede terminar creando un segundo `(tabs)` encima del primero (dos barras de pestañas en el historial).
- `dismissTo('/reservas')`: cierra pantallas hasta encontrar esa ruta, pero `/reservas` no está en el historial del Stack raíz (está dentro de las tabs), así que termina comportándose como un `replace`.
- `dismiss` + `navigate`: el modal se saca del historial y `navigate` cambia de pestaña sin apilar nada. Es lo único que deja el historial limpio.

**b)** Si desde Mis reservas se toca la tab “Catálogo” se ve el **detalle**, porque cada tab conserva su propio Stack (`[index, libro/X]`). Si la tab Catálogo ya estaba activa (como después del paso 5), tocarla otra vez vuelve al `index`. Lo probé así: abrí un libro, fui a Mis reservas, toqué Catálogo (se vio el detalle) y la toqué de nuevo (volvió al Catálogo). Mi barra de pestañas propia (`BarraPestanias.tsx`) emite el mismo evento `tabPress` que la barra estándar, por eso se mantiene este comportamiento. Me parece correcto: conservar el Stack de la tab es lo que esperan las personas (volver a donde estaban), y tocar la tab activa para “volver al inicio” es un gesto conocido.

### C2. El escáner que dispara de más

Código: `src/app/(tabs)/(catalogo)/escanear.tsx:14-45`.

**a)** Cada lectura llamaría a `router.push`. Como en el TP 2, las acciones de navegación se encolan y se procesan en orden: si llegan 10 lecturas en un segundo, se apilan 10 detalles del mismo libro. La persona tendría que tocar “atrás” 10 veces, y las animaciones se encadenan.

**b)** Usé `useRef` (`navegandoRef`, línea 24). Con `useState`, `setNavegando(true)` no cambia la variable en el momento: programa un render. Los llamados a `onBarcodeScanned` que llegan antes de ese render son clausuras del render anterior, donde `navegando` sigue valiendo `false`, así que todos pasan la condición. Un ref es un objeto mutable que todos comparten: en cuanto el primer llamado hace `navegandoRef.current = true` (línea 36), el siguiente ya lo ve y sale (línea 28).

**c)** Uso `router.replace` (línea 16). Con `push` la pila quedaría `[index, escanear, libro/X]`: al tocar “atrás” en el detalle se vuelve al escáner, que sigue apuntando al código y vuelve a abrir el detalle (o la persona tiene que salir del escáner a mano). Con `replace` queda `[index, libro/X]` y “atrás” lleva al Catálogo.

**d)** Si el ISBN es válido pero no está en el catálogo, muestro un aviso (“Ese libro no está en el catálogo…”) y la cámara sigue escaneando. Para que no se repita guardo el último código desconocido en `ultimoDesconocidoRef` (líneas 41-44): si llega el mismo, no hago nada. Si escanea otro distinto, se actualiza el aviso.

### C3. Deep links y rutas protegidas

| Link | Qué ve la persona | Qué queda debajo | Qué parte del código lo decide |
| --- | --- | --- | --- |
| `bibliotecaipf://libro/9788499089515` | Detalle de *El Aleph* | Catálogo (`index`) en el Stack de la tab, dentro de `(tabs)` | `unstable_settings.anchor = 'index'` en `src/app/(tabs)/(catalogo)/_layout.tsx:8-10`; `anchor: '(tabs)'` en `src/app/_layout.tsx:8-10` |
| `bibliotecaipf://libro/123` | “ISBN inválido” con link al Catálogo ([captura 06](capturas/06-detalle-isbn-invalido.jpg)) | Catálogo | `esIsbnValido` en `src/app/(tabs)/(catalogo)/libro/[isbn].tsx:11` |
| `bibliotecaipf://buscar?q=borges` | Buscador con los libros de Borges ([captura 04](capturas/04-buscador.jpg)) | `(tabs)` con el Catálogo | `anchor: '(tabs)'` en `src/app/_layout.tsx:9`; `useLocalSearchParams` en `src/app/buscar.tsx:19` |
| `bibliotecaipf://mostrador` (sin sesión) | El Catálogo (la ruta está bloqueada) | Nada más, solo `(tabs)` | `<Stack.Protected guard={sesion}>` en `src/components/NavegacionRaiz.tsx:34` |
| `bibliotecaipf://reserva` | Mis reservas ([captura 09](capturas/09-mis-reservas.jpg)) | `(tabs)` | `<Redirect href="/reservas" />` en `src/app/reserva.tsx` |
| `bibliotecaipf://escanear` (cámara bloqueada) | Escáner con “Cámara bloqueada”, botón “Abrir Ajustes” y el ingreso manual del ISBN | Catálogo (`index`) | `case 'bloqueado'` en `escanear.tsx`, estado calculado en `src/lib/permisos.ts:14` |

**¿Por qué `/libro/123` llega a la pantalla de detalle?** Porque Expo Router hace coincidir rutas por **forma**, no por contenido: `[isbn]` acepta cualquier segmento de texto. El router no sabe qué es un ISBN válido ni qué libros existen. La responsabilidad de responder bien es de la pantalla (y de la lógica que usa): validar el parámetro y mostrar un mensaje con salida. Por eso `libro/[isbn].tsx` valida el formato primero y la existencia después.

### C4. Foco, montaje y primer plano

**a)**

- `useEffect` con `[]`: el **montaje** del componente (una vez).
- `useFocusEffect`: cada vez que la pantalla **toma foco en la navegación** (al volver de otra pestaña o de una pantalla apilada encima).
- `AppState`: los cambios de la **app** entre primer plano y segundo plano (`active`, `background`, `inactive`).

**b)** Al volver de Ajustes solo se entera **`AppState`** (pasa a `active`). La pantalla nunca perdió el foco en la navegación, así que `useFocusEffect` no corre, y el componente no se volvió a montar. Al ir a Catálogo y volver a “Mis reservas” solo se entera **`useFocusEffect`**: la app nunca salió de primer plano y la pantalla ya estaba montada.

**c)** Uso las dos dentro de `usePermiso` (`src/hooks/usePermiso.ts:24-38`): `AppState` para volver de Ajustes y `useFocusEffect` para volver desde otra pantalla. La consulta inicial al montar la hace el hook de Expo (`useCameraPermissions` / `createPermissionHook`). Si usara solo `useEffect` con `[]`, la pestaña “Mis reservas” seguiría diciendo “Notificaciones bloqueadas” después de habilitarlas en Ajustes, hasta cerrar la app.

---

## Parte D · Permisos en tu app

### D1. Recorrido completo de la cámara (Android 14)

| # | Acción | Qué muestra mi app | `status` | `canAskAgain` |
| --- | --- | --- | --- | --- |
| 1 | Toca “Escanear” por primera vez | Escáner con “Escaneá la contratapa” + “Activar cámara” + ingreso manual (estado preguntable). Al tocar “Activar cámara” se abre `/permisos/camara` con el beneficio y “Continuar” | `undetermined` | `true` |
| 2 | “Continuar” → “No permitir” | Vuelve al escáner, sigue en preguntable | `denied` | `true` |
| 3 | Toca “Escanear” otra vez | Igual que el paso 1 | `denied` | `true` |
| 4 | “Continuar” → “No permitir” | Android ya no deja volver a preguntar: el escáner muestra “Cámara bloqueada” y “Abrir Ajustes” | `denied` | `false` |
| 5 | Toca “Escanear” otra vez | Estado bloqueado: “Abrir Ajustes” + ingreso manual | `denied` | `false` |
| 6 | “Abrir Ajustes” → habilita → vuelve | `AppState` pasa a `active`, se vuelve a leer el permiso y aparece la cámara | `granted` | `true` |

**a) iOS.** Cambia en el **paso 2**: iOS muestra el diálogo una sola vez. Después del primer “No permitir”, `canAskAgain` ya es `false`, así que en el paso 2-3 mi app muestra directamente el estado bloqueado con “Abrir Ajustes”. Además, en iOS cambiar el permiso de cámara desde Ajustes reinicia la app: al volver se monta de nuevo y el hook lee `granted` al montarse.

**b)** La línea es `src/lib/permisos.ts:14`:

```ts
return respuesta.canAskAgain ? 'preguntable' : 'bloqueado';
```

Usa `canAskAgain`. Con `status` no alcanza porque vale `denied` tanto después del primer rechazo (todavía se puede preguntar) como cuando está bloqueado. Si solo mirara `status`, mostraría “Continuar” y el sistema no abriría ningún diálogo: un botón que no hace nada.

**c)** Se entera el listener de `AppState` de `usePermiso` (`src/hooks/usePermiso.ts:24-31`), que llama a `obtener()` cuando la app vuelve a `active`. Sin esa parte, la app seguiría mostrando “Cámara bloqueada” aunque ya esté habilitada, hasta que la persona salga de la pantalla y vuelva a entrar.

### D2. Notificaciones y consistencia

**a)** La notificación llegaría igual a los 15 segundos diciendo “Acordate de devolver…” un libro que ya devolvió. Es un dato falso que le resta confianza a la app. Por eso `devolver` cancela el recordatorio (`BibliotecaProvider.tsx:109-118`, línea 114).

**b)** El identificador se guarda en el préstamo, en el estado del Context (`notificacionId`, `BibliotecaProvider.tsx:128`). Si la app se cierra antes de que llegue:

- La **notificación** sigue programada en el sistema operativo y llega igual.
- El **identificador** se pierde, porque el estado vive en memoria (también se pierde el préstamo).

El problema: al volver a abrir la app no hay préstamos, pero la notificación llega, y no hay forma de cancelarla desde la app. Lo resolvería así:

1. Persistir préstamos e identificadores con AsyncStorage (desafío opcional) y restaurarlos al iniciar.
2. Al iniciar, reconciliar con `Notifications.getAllScheduledNotificationsAsync()` y cancelar las que no correspondan a un préstamo activo.
3. Alternativa más simple: programar con un `identifier` derivado del ISBN (por ejemplo `recordatorio-<isbn>`), así se puede cancelar sin haber guardado nada.

**c)** Desde Android 13 mostrar notificaciones requiere el permiso en tiempo de ejecución `POST_NOTIFICATIONS`, y el sistema muestra el diálogo asociado a un canal: si la app no creó ningún canal, el pedido puede no mostrar el diálogo y el permiso queda sin conceder. Por eso `pedirPermisoNotificaciones` crea el canal `prestamos` antes de pedir (`src/lib/notificaciones.ts:33-35`). En Android 12 o anterior no existe ese permiso en tiempo de ejecución: las notificaciones están permitidas al instalar, `requestPermissionsAsync` devuelve `granted` sin diálogo, y el canal sigue siendo necesario (desde Android 8) para que se muestren.

**d)** Si el permiso está denegado, me entero por un aviso dentro de la app en “Mis reservas” (`TarjetaAviso`). El código que decide (`BibliotecaProvider.tsx:158-165`):

```ts
if (persona === MI_NOMBRE) {
  const titulo = buscarLibroPorIsbn(isbn)?.titulo ?? 'tu libro';
  setPrestamos((previos) => [...previos, crearPrestamo(isbn, 'espera')]);
  if (await notificacionesPermitidas()) {
    await notificarLibroListo(titulo);
  } else {
    agregarAviso(`"${titulo}" ya está listo. Pasá a retirarlo por el mostrador.`);
  }
}
```

`notificacionesPermitidas()` (`src/lib/notificaciones.ts:39-42`) consulta el permiso **en ese momento** con `getPermissionsAsync()`. Importa porque la persona pudo cambiarlo en Ajustes desde la última vez: con un valor guardado podría intentar notificar sin permiso (y la persona no se entera de nada) o mandar un aviso interno cuando sí podía notificar.

### D3. Lo que tu app pide y lo que no

| Plataforma | Permiso o clave declarada | Función que lo justifica | ¿Quién lo agrega? |
| --- | --- | --- | --- |
| Android | `android.permission.CAMERA` | Escanear el código de barras | El plugin/manifest de `expo-camera` |
| Android | `android.permission.POST_NOTIFICATIONS` | Recordatorio de devolución y aviso de libro listo | El manifest de `expo-notifications` |
| Android | `android.permission.RECEIVE_BOOT_COMPLETED` | Que las notificaciones programadas sobrevivan a un reinicio del teléfono | El manifest de `expo-notifications` |
| Android | `blockedPermissions` (RECORD_AUDIO, ubicación, almacenamiento, medios, contactos, SYSTEM_ALERT_WINDOW) | Se **quitan** del manifest final: la app no los usa | Yo, en `app.json` |
| iOS | `NSCameraUsageDescription` = “Usamos tu cámara para leer el código de barras del libro y abrir su ficha al instante.” | Escanear | El plugin de `expo-camera`, con mi texto de `cameraPermission` |
| iOS | Notificaciones (sin clave en Info.plist; autorización en tiempo de ejecución) | Recordatorios | `expo-notifications` |

**a)** `expo-camera` puede grabar video con audio, por eso por defecto agrega el micrófono. Como solo escaneo, lo desactivé en el plugin (`app.json:50-55`) y además bloqueé el permiso en Android (`app.json:22`):

```json
["expo-camera", {
  "cameraPermission": "Usamos tu cámara para leer el código de barras del libro y abrir su ficha al instante.",
  "microphonePermission": false,
  "recordAudioAndroid": false
}]
```

`microphonePermission: false` evita `NSMicrophoneUsageDescription` en iOS y `recordAudioAndroid: false` evita `RECORD_AUDIO` en Android.

**b)** Usaría `expo-image-picker` con `launchImageLibraryAsync`. En Android moderno usa el selector de fotos del sistema y no necesita permiso de almacenamiento; en iOS 14+ el selector (PHPicker) tampoco necesita permiso para elegir una foto, aunque el plugin agrega `NSPhotoLibraryUsageDescription` y conviene poner el texto de propósito. Habría que sacar `READ_MEDIA_IMAGES` de `blockedPermissions` solo si se necesitara acceso a toda la galería. **No alcanza con una actualización OTA**: agrega un módulo nativo nuevo y cambia `app.json` (plugins, permisos), y una OTA solo reemplaza JavaScript y assets. Hace falta una build nueva (y en Expo Go funcionaría porque ya trae el módulo, pero eso no vale para la app publicada).

**c)** En Expo Go no pude verificar:

- **El texto de propósito de la cámara:** Expo Go muestra el texto de Expo Go, no el mío, porque el Info.plist es el de esa app.
- **`blockedPermissions` y `microphonePermission: false`:** el manifest es el de Expo Go, que declara muchos más permisos.
- **El canal de Android:** se crea, pero lo que se ve en Ajustes → Notificaciones es el de Expo Go.
- **Notificaciones con la app cerrada:** el comportamiento depende de la app contenedora.

Lo verificaría con un development build (`npx expo run:android` o `eas build --profile development`): ver el diálogo con mi texto, revisar el `AndroidManifest.xml` generado en `android/app/src/main` y ver el canal “Préstamos” en los ajustes de la app.

---

## Parte E · Buenas prácticas y decisiones de diseño

### E1. Revisión de código

**a) Problemas**

| # | Línea | Tipo | Problema y por qué | Corrección |
| --- | --- | --- | --- | --- |
| 1 | 18-20 | Error de ejecución / rendimiento | `useEffect` sin array de dependencias: corre después de **cada** render; como `setLibros` siempre recibe un array nuevo, provoca otro render y otro pedido: bucle infinito | Hook `useLibros` con `[intento]` |
| 2 | 19 | Error de ejecución | No hay `.catch`: cuando `obtenerLibros()` falla (1 de cada 5) queda una promesa rechazada sin manejar y la persona no ve ningún mensaje | `try/catch`, estado `error` y botón “Reintentar” |
| 3 | 18-20 | Advertencia | Sin limpieza: si el componente se desmonta o llega una respuesta vieja, igual se llama a `setLibros` | Flag `activo` en la limpieza |
| 4 | 13-16 | Mala práctica (rechazo en tiendas) | Pide cámara y notificaciones apenas se abre la app, sin contexto ni pantalla previa | Pedir cada permiso al usar la función (escáner / interruptor) con `/permisos/[recurso]` |
| 5 | 13-16 | Advertencia | Dependencias incompletas: usa `pedirPermiso` y el array está vacío (`react-hooks/exhaustive-deps`) | Desaparece al sacar el pedido de ahí |
| 6 | 22-30 | Rendimiento / mala práctica | `Fila` se declara dentro de `Catalogo`: en cada render es un componente **nuevo**, React desmonta y vuelve a montar todas las filas | Componente en su propio archivo (`TarjetaLibro.tsx`) |
| 7 | 35 | Advertencia / mala práctica | `key={i}` usa el índice: si la lista cambia de orden o se filtra, React mezcla el estado de las filas | `keyExtractor={(libro) => libro.isbn}` |
| 8 | 33-36 | Rendimiento | `ScrollView` + `map` renderiza todos los libros juntos | `FlatList`, que virtualiza |
| 9 | 10, 22 | Mala práctica | `any`: se pierde el chequeo de tipos (por ejemplo, `libro.titlo` compilaría) | `Libro` de `src/types` |
| 10 | 25 | Mala práctica | Estilos en línea y colores/tamaños sueltos | `StyleSheet.create` + `tema.ts` |
| 11 | 37-39 | Mala práctica (accesibilidad) | Botón solo con ícono sin `accessibilityRole` ni `accessibilityLabel`; además el área táctil es de 28 × 28 | `BotonIcono` con etiqueta y mínimo 44 × 44 |
| 12 | — | Mala práctica | No hay estados de carga, error ni vacío: mientras carga se ve una pantalla en blanco | `EstadoCarga`, `EstadoError`, `EstadoVacio` |
| 13 | 24 | Mala práctica | `'/libro/' + libro.isbn` arma la ruta a mano y saltea las rutas tipadas | `router.push({ pathname: '/libro/[isbn]', params: { isbn } })` |
| 14 | 11 | Optimización | `permiso` se declara y nunca se usa; `useCameraPermissions` en una pantalla que no usa la cámara | Sacarlo |

**b) Primer minuto sin array de dependencias**

1. Primer render: `libros = []`. Después corre el efecto y pide los libros.
2. A los 800 ms llega la respuesta: `setLibros(datos)` → render 2.
3. Después del render 2 el efecto corre otra vez (no tiene dependencias) → nuevo pedido.
4. A los 800 ms: `setLibros` con un array nuevo → render → otro pedido…

Resultado: un pedido cada ~800 ms (unos 75 en un minuto), la lista se vuelve a dibujar todo el tiempo, consumo de batería y red. Cada vez que falla (20 %) aparece una promesa rechazada sin manejar; el ciclo se corta ahí, porque sin `setLibros` no hay render nuevo… hasta que otra cosa provoque un render y vuelva a arrancar.

Si `obtenerLibros()` devolviera siempre **el mismo array**, `setLibros` recibiría la misma referencia, React compararía con `Object.is`, vería que no cambió y no volvería a renderizar: el bucle se cortaría después del segundo pedido. El error seguiría ahí, solo que escondido: depende de un detalle de implementación de la API. La API simulada devuelve copias justamente para que el error aparezca.

**c) Reescrita con mi app**

```tsx
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { EncabezadoCatalogo } from '../../../components/EncabezadoCatalogo';
import { EstadoCarga } from '../../../components/EstadoCarga';
import { EstadoError } from '../../../components/EstadoError';
import { EstadoVacio } from '../../../components/EstadoVacio';
import { TarjetaLibro } from '../../../components/TarjetaLibro';
import { MENSAJES } from '../../../constants/mensajes';
import { espaciado, tamanios } from '../../../constants/tema';
import { useBiblioteca } from '../../../hooks/useBiblioteca';
import { useLibros } from '../../../hooks/useLibros';
import type { FiltroCatalogo } from '../../../types';

export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { disponibles, posicionDe, prestamoDe } = useBiblioteca();
  const [filtro, setFiltro] = useState<FiltroCatalogo>('todos');

  const visibles = libros.filter((libro) => {
    if (filtro === 'disponibles') {
      return disponibles(libro) > 0;
    }
    if (filtro === 'espera') {
      return disponibles(libro) === 0;
    }
    return true;
  });
  const listo = !cargando && !error;

  function renderizarVacio() {
    if (cargando) {
      return <EstadoCarga mensaje="Cargando el catálogo…" />;
    }
    if (error) {
      return <EstadoError mensaje={error} onReintentar={reintentar} />;
    }
    return <EstadoVacio mensaje={filtro === 'todos' ? MENSAJES.catalogoVacio : MENSAJES.filtroVacio} />;
  }

  return (
    <FlatList
      data={listo ? visibles : []}
      keyExtractor={(libro) => libro.isbn}
      numColumns={2}
      columnWrapperStyle={estilos.fila}
      contentContainerStyle={estilos.contenido}
      renderItem={({ item }) => (
        <View style={estilos.celda}>
          <TarjetaLibro
            libro={item}
            disponibles={disponibles(item)}
            reservado={prestamoDe(item.isbn) !== undefined || posicionDe(item.isbn) !== null}
          />
        </View>
      )}
      ListHeaderComponent={
        <EncabezadoCatalogo
          filtro={filtro}
          onCambiarFiltro={setFiltro}
          cantidad={listo ? visibles.length : null}
        />
      }
      ListEmptyComponent={renderizarVacio()}
    />
  );
}

const estilos = StyleSheet.create({
  contenido: {
    paddingBottom: tamanios.espacioBarra,
  },
  fila: {
    paddingHorizontal: espaciado.sm,
  },
  celda: {
    width: '50%',
    padding: espaciado.sm,
  },
});
```

Es el archivo real `src/app/(tabs)/(catalogo)/index.tsx`. Cada tarjeta es un componente propio (`TarjetaLibro`), la key es el ISBN, hay estados de carga, error y vacío, y los estilos salen de `tema.ts`. Al escáner se entra desde el botón central de la barra de pestañas (`BarraPestanias`, con `accessibilityLabel="Escanear código de barras"` y 64 × 64), y los permisos se piden recién en el escáner, nunca al abrir la app.

**d)** Lo que podría provocar el **rechazo en una tienda** es pedir cámara y notificaciones al abrir la app sin contexto (líneas 13-16): Apple exige que el permiso se pida cuando se usa la función y con un propósito claro, y Google Play revisa los permisos que no tienen una función visible que los justifique. Lo que haría que una persona la **desinstale primero** es el bucle de la línea 18: la app parpadea, gasta datos y batería sin parar, y con la red lenta se vuelve inusable. Dos diálogos de permisos de entrada también espantan, pero el bucle se nota en cada uso.

### E2. Organización y acoplamiento

**a) Importaciones entre carpetas**

```
app ──────────► components, hooks, constants, lib, types
components ───► hooks, lib, constants, types, estructuras (tipos)
hooks ────────► context, lib, constants, types
context ──────► lib, estructuras, data, constants, types
lib ──────────► data, constants, types, estructuras (tipos)
estructuras ──► (nada)
data ─────────► types
constants, types ► (nada)
```

No hay importaciones “hacia arriba”: ningún hook, componente o archivo de `lib` importa de `src/app`. Sería un problema porque `src/app` son pantallas que dependen de todo lo demás: si un hook importara una pantalla se forma un ciclo, el hook ya no se puede reutilizar ni probar sin cargar la navegación, y mover o renombrar una ruta (que cambia la URL) rompería lógica que no tiene nada que ver.

**b)** Cambiaría `src/lib/api.ts` (el `fetch` real). También `src/lib/catalogo.ts`, porque hoy el detalle, el escáner y el contexto buscan libros de forma sincrónica en `LIBROS` (`buscarLibroPorIsbn`), y con una API real esa búsqueda sería asincrónica: el detalle necesitaría su propio estado de carga/error. Eso me dice que la búsqueda por ISBN quedó acoplada a que los datos sean locales. El resto de las pantallas no se entera porque solo usan `useLibros`, `useBusqueda` y `buscarLibroPorIsbn`. Para mejorarlo haría un `useLibro(isbn)` asincrónico desde el principio.

**c) `<ConPermiso recurso="camara">`**

- **Ganaría:** menos código repetido en cada pantalla, y sería imposible olvidarse un estado (el componente decide qué mostrar en cada uno).
- **Perdería:** flexibilidad. En mi escáner el ingreso manual del ISBN tiene que verse **en todos los estados**, incluso sin permiso; con un envoltorio que solo muestra los hijos cuando está concedido, la alternativa quedaría afuera o el componente necesitaría props para cada caso. También se mezclaría la pantalla previa (que es una ruta modal) con el contenido.
- **Para notificaciones no sirve:** no hay una pantalla que “envolver”. El permiso se pide al tocar un interruptor dentro de una tarjeta, y el resultado (activar el recordatorio o no) es una acción, no un contenido para mostrar. Por eso prefiero el hook `usePermiso`, que da el estado y las acciones y deja que cada pantalla decida.

### E3. Mapa de fallas

| Situación | Qué ve la persona | Dónde se maneja | Captura |
| --- | --- | --- | --- |
| `obtenerLibros()` falla | Ícono de nube, “No pudimos cargar el catálogo. Revisá tu conexión e intentá de nuevo.” y “Reintentar” | `src/hooks/useLibros.ts:31-34`; `src/app/(tabs)/(catalogo)/index.tsx:35-37` | [02](capturas/02-catalogo-error.jpg) |
| Se abre `/libro/abc` | “ISBN inválido – Debe tener 13 números” y link “Volver al catálogo” | `src/app/(tabs)/(catalogo)/libro/[isbn].tsx:11-23` | [06](capturas/06-detalle-isbn-invalido.jpg) |
| Se escanea un ISBN que no está en el catálogo | Aviso “Ese libro no está en el catálogo. Probá con otro código. (ISBN …)”; sigue escaneando | `src/app/(tabs)/(catalogo)/escanear.tsx:40-45` | [12](capturas/12-escaner-isbn-inexistente.jpg) (ingreso manual; el aviso del escáner usa la misma validación) |
| La cámara está bloqueada | “Cámara bloqueada – Podés habilitarla en Ajustes o escribir el ISBN abajo.”, “Abrir Ajustes” e ingreso manual | `escanear.tsx` (`case 'bloqueado'`), `src/components/SolicitudCamara.tsx` | — |
| Las notificaciones están denegadas | El interruptor abre `/permisos/notificaciones` con “Abrir Ajustes”; en Mis reservas: “Notificaciones bloqueadas: los avisos van a aparecer acá” y los avisos internos | `src/components/TarjetaPrestamo.tsx:34-39`; `src/components/EncabezadoReservas.tsx`; `BibliotecaProvider.tsx:161-165` | [13](capturas/13-permiso-notificaciones-bloqueado.jpg), [18](capturas/18-aviso-dentro-de-la-app.jpg) |
| Se intenta reservar un libro ya reservado | En el detalle no aparece “Reservar” sino el estado (“Lo tenés prestado…” / “Estás en la posición…”); si se entra igual a `/reservar/…`: “Ya tenés este libro prestado o estás en su lista de espera.” con “Volver” | `src/components/DetalleLibro.tsx:31-57`; `ConfirmacionReserva.tsx:41-51`; `BibliotecaProvider.tsx:92-94` | — |
| “Entregar al siguiente” con la lista vacía | La tarjeta muestra “Al frente: Nadie”, “Esperan 0”, el mensaje “No hay nadie esperando este libro.” y el botón deshabilitado | `src/components/FilaMostrador.tsx`; `BibliotecaProvider.tsx:150-153` | [17](capturas/17-mostrador-entregado-a-vos.jpg) |
| Login con clave incorrecta | “Usuario o clave incorrectos. Revisalos e intentá de nuevo.” | `src/app/login.tsx:17-21` | [14](capturas/14-login-clave-incorrecta.jpg) |

### E4. Decisiones con argumentos

**a) Identificador: ISBN.** Lo usé como parámetro de ruta y como `key`. A favor: es un identificador real que ya viene en el código de barras, así que el escáner, la URL (`/libro/9788499089515`) y la lista usan el mismo valor sin traducir nada; y es estable (no depende del orden). Sobre los casos difíciles: dos ediciones del mismo título tienen **ISBN distintos**, así que no chocan (de hecho es lo correcto: son ejemplares distintos). Los libros sin ISBN (muy viejos o donaciones) son el punto débil; en una biblioteca real agregaría un id propio y usaría el ISBN como dato de búsqueda. Lo guardo como `string` y no como número: `useLocalSearchParams` siempre devuelve strings, el ISBN puede empezar con 0 y 13 dígitos se acercan al límite de precisión segura de los números si hiciera cuentas. Con `string` no hay conversión y la validación es una regex (`src/lib/catalogo.ts:5-9`).

**b) Estructuras: clase con `#items`.** Me dio encapsulamiento: nadie puede hacer `shift()` o meter un elemento en el medio de la cola, y los tests prueban el contrato (`encolar`, `desencolar`, `frente`). Lo que me complicó fue combinarla con React: la clase está pensada para mutarse y React necesita referencias nuevas para enterarse de los cambios. Tuve que agregar `clonar()` y acordarme de no mutar nunca lo que está en el estado, y un `useRef` espejo para las colas (`esperasRef`) para leer el valor más reciente en `entregarAlSiguiente`. Con arrays y `[...pila, x]` todo eso sale natural, pero se pierde la protección. Para el TP me quedo con la clase porque las reglas de la estructura quedan en un lugar.

**c) Memorización.** Sí. **Aporta** en el `value` del Context (`BibliotecaProvider.tsx:186`): sin `useMemo`, cada render del provider crearía un objeto nuevo y todos los consumidores se re-renderizarían aunque no haya cambiado nada. Las funciones con `useCallback` (por ejemplo `registrarVisto`) también aportan porque son dependencia de efectos: `DetalleLibro` hace `useEffect(..., [libro.isbn, registrarVisto])` y si la función cambiara en cada render, apilaría el libro de nuevo. **Sería ruido** en un `useCallback` alrededor de un handler que se pasa a un `Pressable` de React Native (no está memorizado, se re-renderiza igual) o un `useMemo` para calcular `ultimosVistos` con 3 elementos. Para comprobarlo en vez de suponerlo usaría el Profiler de React DevTools (“Highlight updates” y el tiempo de cada commit), antes y después del cambio.

**d) Datos duplicados: se calculan.** Los ejemplares disponibles no están en el estado: `calcularDisponibles` (`src/lib/reservas.ts:6-11`) los saca de `libro.ejemplares` menos los préstamos tomados del estante. Si los guardara además en el estado, tendría dos fuentes de verdad que hay que actualizar juntas: al prestar, al devolver, al entregar desde el mostrador… El día que me olvide de actualizar una (por ejemplo al devolver), el detalle diría “1 disponible” y la confirmación “no quedan ejemplares”, y el error aparecería solo en cierto orden de acciones. Calculándolo, el número siempre es consistente con los préstamos. Una simplificación consciente: un libro que me entregaron desde la lista de espera (`origen: 'espera'`) no descuenta del estante, porque ese ejemplar fue devuelto por otra persona y pasó directo a mí.
