// Cross-platform (Windows/macOS/Linux): compila el backend Spring Boot y copia
// el jar ejecutable a src-tauri/resources para que Tauri lo empaquete y lo lance
// como proceso local. Se invoca desde tauri.conf.json (beforeBuildCommand).
//
// Se llama al wrapper de Maven por nombre relativo con `cwd` en la carpeta del
// backend, para que un espacio en la ruta (p.ej. "Hotel Rayza") no rompa el
// comando al pasar por el shell de Windows.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const backendDir = join(scriptDir, '..', '..', '..', 'backend')
const resourcesDir = join(scriptDir, '..', 'resources')
const isWindows = process.platform === 'win32'
const mvnw = isWindows ? 'mvnw.cmd' : './mvnw'

console.log('Compilando el backend (mvnw clean package)...')
execFileSync(mvnw, ['-q', 'clean', 'package', '-DskipTests'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true, // ejecuta el wrapper (.cmd / script) a través del shell
})

const targetDir = join(backendDir, 'target')
const jar = readdirSync(targetDir).find((f) => f.endsWith('.jar') && !f.endsWith('.original'))

if (!jar) {
  console.error(`No se encontró ningún .jar en ${targetDir}`)
  process.exit(1)
}

if (!existsSync(resourcesDir)) {
  mkdirSync(resourcesDir, { recursive: true })
}

const dest = join(resourcesDir, 'backend.jar')
copyFileSync(join(targetDir, jar), dest)
console.log(`Copiado ${jar} -> ${dest}`)
