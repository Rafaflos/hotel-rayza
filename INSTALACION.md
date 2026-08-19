# Hotel Rayza — Guía de instalación (PC del hotel, Windows)

Esta guía explica cómo dejar el sistema funcionando en la computadora del hotel.
El sistema tiene **3 piezas** que corren todas en la misma PC:

1. **MySQL** — la base de datos donde se guarda todo (reservas, huéspedes, pagos…).
2. **El backend** (Java) — va empaquetado dentro de la app; no se instala aparte.
3. **La app de escritorio** (Hotel Rayza) — lo que ve y usa el personal.

Cuando el usuario abre "Hotel Rayza", la app arranca el backend sola y este se
conecta a MySQL en la misma PC. No se necesita internet para el día a día
(solo para la facturación electrónica con Nubefact, si se activa).

---

## Paso 0 — Requisitos previos (instalar una sola vez)

En la PC del hotel hay que instalar **dos programas** antes de la app:

### a) Java 17 o superior (JRE)
El backend corre sobre Java. Descargar e instalar **Temurin JRE 17** (gratuito):
https://adoptium.net/es/temurin/releases/?version=17

- Al instalar, marcar la opción **"Set JAVA_HOME"** y **"Add to PATH"** si aparece.
- Verificar: abrir `cmd` (símbolo del sistema) y escribir `java -version`.
  Debe mostrar la versión 17 o mayor.

### b) MySQL Server 8
Descargar el **MySQL Installer for Windows**:
https://dev.mysql.com/downloads/installer/

- Instalar el producto **"MySQL Server"** (el "Server only" alcanza).
- Durante la instalación pide una **contraseña para el usuario `root`**.
  **Anotar esa contraseña**, se necesita en el Paso 2. Ejemplo: `MiClaveSegura123`.
- Dejar el puerto por defecto **3306**.

---

## Paso 1 — Crear la base de datos y las tablas

1. Copiar a la PC el archivo **`database/01-schema.sql`** de este proyecto.
2. Abrir `cmd` y ejecutar (reemplazando la contraseña por la que anotaste):

   ```
   mysql -u root -p < 01-schema.sql
   ```

   Pedirá la contraseña de root. Al terminar debe decir
   *"Base de datos hotel_management creada correctamente."*

   > Si `mysql` no se reconoce, usar la ruta completa, normalmente:
   > `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < 01-schema.sql`

Esto crea la base `hotel_management` con todas las tablas y los datos base
(roles, métodos de pago, tipos de habitación, servicios).

---

## Paso 2 — Configurar la contraseña de MySQL para la app

El backend necesita saber la contraseña de MySQL. Se le pasa con una
**variable de entorno de Windows** (así no queda escrita en ningún archivo):

1. Menú Inicio → buscar **"Editar las variables de entorno del sistema"**.
2. Botón **"Variables de entorno…"**.
3. En **"Variables del sistema"** → **"Nueva…"**:
   - Nombre: `DB_PASSWORD`
   - Valor: la contraseña de root de MySQL (la del Paso 0b).
4. Aceptar todo. **Reiniciar la PC** para que tome la variable.

> Si la contraseña de root de MySQL está vacía (no recomendado), no hace falta
> esta variable.

---

## Paso 3 — Instalar la app

1. Copiar el instalador **`Hotel Rayza_1.0.0_x64_es-ES.msi`** (o el `.exe`) a la PC.
   *(Ver "Cómo se genera el instalador" más abajo.)*
2. Doble clic → siguiente, siguiente, instalar.
3. Se crea el acceso directo **"Hotel Rayza"** en el escritorio y el menú Inicio.

---

## Paso 4 — Primer arranque

1. Abrir **Hotel Rayza**. La primera vez tarda unos segundos (arranca el backend).
2. Iniciar sesión con el usuario administrador que se crea solo:
   - Usuario: **admin**
   - Contraseña: **admin123**
3. **Importante:** cambiar esa contraseña de inmediato
   (menú lateral → *Cambiar contraseña*).
4. Crear los usuarios del personal (recepción, caja, etc.) desde la sección
   **Usuarios**, asignándole a cada uno su rol.

Listo. El sistema ya está operativo.

---

## (Opcional) Paso 5 — Activar la facturación electrónica (Nubefact)

Por defecto la app **NO** envía comprobantes reales a SUNAT (modo seguro).
Para activarla, agregar estas variables de entorno del sistema (como en el Paso 2)
y reiniciar:

- `NUBEFACT_ENABLED` = `true`
- `NUBEFACT_URL` = la ruta de tu cuenta Nubefact
- `NUBEFACT_TOKEN` = tu token de Nubefact

> ⚠️ Es una cuenta de **producción real**: cada boleta/factura emitida es un
> documento fiscal verdadero ante SUNAT. Probar primero con cuidado.

---

## Cómo se genera el instalador `.msi` (para el desarrollador)

El instalador de Windows **debe compilarse en Windows** (no se puede desde Mac).
Hay dos formas:

### Opción A — GitHub Actions (recomendada)
El proyecto ya trae el flujo `.github/workflows/build-windows.yml`.

1. Subir el proyecto a un repositorio de GitHub.
2. Crear un *tag* de versión y hacer push:
   ```
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. En la pestaña **Actions** del repo, esperar a que termine el build.
4. Descargar el artefacto **`hotel-rayza-windows`** — dentro está el `.msi` / `.exe`.

También se puede lanzar manualmente desde Actions → *Build Windows Installer* →
*Run workflow*.

### Opción B — Compilar en una PC con Windows
En una PC Windows con **Java 17**, **Node 20**, **Rust** y **MySQL** instalados:

```
cd "Carita Hotel"
npm install
npm run tauri build
```

El instalador queda en:
`Carita Hotel\src-tauri\target\release\bundle\msi\` (y `\nsis\` para el `.exe`).

---

## Actualizaciones automáticas (auto-updater)

La app revisa sola si hay una versión nueva **cada vez que se abre** (si la PC
tiene internet). Si la hay, le avisa al usuario y, con su confirmación, la
descarga, la instala y reinicia la app. Los datos en MySQL nunca se tocan.

Para que funcione, hay que configurar **dos cosas una sola vez** en GitHub:

### 1. La URL del repo en la configuración
En `Carita Hotel/src-tauri/tauri.conf.json`, dentro de `plugins.updater.endpoints`,
reemplazar `TU-USUARIO` por tu usuario/organización real de GitHub:

```
"endpoints": [
  "https://github.com/TU-USUARIO/hotel-rayza/releases/latest/download/latest.json"
]
```

### 2. Las llaves de firma como *secrets* del repo
El instalador se firma para que la app confíe en la actualización. Las llaves
ya se generaron; la **privada** vive en `~/.tauri/hotel-rayza-updater.key`
(NUNCA se sube al repo). En GitHub → *Settings* → *Secrets and variables* →
*Actions* → *New repository secret*, crear:

- `TAURI_SIGNING_PRIVATE_KEY` = **el contenido completo** del archivo
  `~/.tauri/hotel-rayza-updater.key`.
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` = vacío (la llave se generó sin contraseña).

> ⚠️ Guarda una copia de seguridad de `~/.tauri/hotel-rayza-updater.key` en un
> lugar seguro. **Si la pierdes, no podrás volver a firmar actualizaciones** y
> tendrías que reinstalar la app a mano en cada PC.

### Cómo publicar una actualización
Cada vez que quieras sacar una versión nueva:

1. Subir la versión en `tauri.conf.json` (`"version": "1.0.1"`).
2. Crear y subir el tag:
   ```
   git tag v1.0.1
   git push origin v1.0.1
   ```
3. GitHub Actions compila, firma y publica el Release solo. Las PCs del hotel
   se actualizan la próxima vez que abran la app.

---

## Respaldos (recomendado)

Toda la información vive en MySQL. Para respaldar, programar una copia diaria:

```
mysqldump -u root -p hotel_management > respaldo_hotel_AAAA-MM-DD.sql
```

Guardar esos archivos en un USB o en la nube. Para restaurar:

```
mysql -u root -p hotel_management < respaldo_hotel_AAAA-MM-DD.sql
```

---

## Resumen rápido

| Pieza      | Qué es                        | Se instala |
|------------|-------------------------------|------------|
| Java 17    | Motor del backend             | Una vez, aparte |
| MySQL 8    | Base de datos                 | Una vez, aparte |
| Hotel Rayza| App + backend empaquetados    | El instalador `.msi` |

Usuario inicial: **admin / admin123** (cambiar en el primer uso).
