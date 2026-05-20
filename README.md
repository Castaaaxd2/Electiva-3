# 🐦 BirdLens

**BirdLens** es una aplicación móvil de clasificación de aves mediante inteligencia artificial. Toma una foto de un ave y el sistema identifica la especie al instante utilizando un modelo de deep learning entrenado con 32 especies.

---

## 📋 Tabla de contenidos

- [¿Qué hace la app?](#qué-hace-la-app)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración de variables de entorno](#configuración-de-variables-de-entorno)
- [Cómo usar la aplicación](#cómo-usar-la-aplicación)
- [Cómo actualizar el proyecto](#cómo-actualizar-el-proyecto)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Especies reconocidas](#especies-reconocidas)
- [Preguntas frecuentes](#preguntas-frecuentes)
- [Solución de problemas comunes](#solución-de-problemas-comunes)

---

## ¿Qué hace la app?

BirdLens permite:

- 📸 Tomar una foto directamente desde la cámara o seleccionar una desde la galería.
- 🧠 Identificar automáticamente la especie del ave mediante un modelo de TensorFlow.
- 📊 Ver el porcentaje de confianza de la predicción.
- 🗂️ Consultar un historial de clasificaciones anteriores.

---

## Requisitos previos

Antes de instalar el proyecto, asegúrate de tener lo siguiente instalado en tu computador:

| Herramienta | Versión mínima | Cómo instalar |
|-------------|---------------|---------------|
| Node.js | >= 20 | [nodejs.org](https://nodejs.org) |
| pnpm | >= 9 | `npm install -g pnpm` |
| Python | >= 3.9 | [python.org](https://www.python.org) |
| Git | Cualquiera | [git-scm.com](https://git-scm.com) |

Para probar la app en un dispositivo físico:

- Instala **Expo Go** desde la [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779) o [Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent).

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Castaaaxd2/Electiva-3.git
cd Electiva-3
```

### 2. Instalar dependencias del proyecto (frontend + backend JS)

```bash
pnpm install
```

### 3. Instalar dependencias del servidor Python (modelo de IA)

```bash
pip install flask flask-cors tensorflow pillow numpy
```

> Si tienes un archivo `requirements.txt` o `dependencias.txt`, también puedes usarlo como referencia para instalar manualmente cada paquete.

### 4. Iniciar el servidor de IA (Python)

```bash
python app.py
```

El servidor quedará activo en `http://localhost:3000`. Debes mantenerlo corriendo mientras usas la app.

### 5. Iniciar la aplicación móvil

```bash
pnpm --filter @workspace/mobile run dev
```

Aparecerá un código QR en la terminal. Escanéalo con Expo Go desde tu celular para abrir la app.

### 6. (Opcional) Iniciar el servidor API

```bash
pnpm --filter @workspace/api-server run dev
```

---

## Configuración de variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos PostgreSQL
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/birdlens

# Seguridad de sesiones
SESSION_SECRET=una_clave_secreta_aqui

# URL del servidor Python con el modelo de IA
MODEL_SERVER_URL=http://localhost:3000
```

> ⚠️ **Importante:** Nunca subas el archivo `.env` al repositorio. Ya está incluido en el `.gitignore`.

---

## Cómo usar la aplicación

### Clasificar un ave

1. Abre BirdLens desde Expo Go en tu celular.
2. En la pantalla principal, toca el botón de **Cámara** para tomar una foto, o el de **Galería** para seleccionar una imagen existente.
3. Selecciona o captura la imagen del ave.
4. La app enviará la imagen al servidor y en segundos mostrará:
   - El **nombre de la especie** detectada.
   - El **porcentaje de confianza** de la predicción.
5. Puedes guardar el resultado o realizar una nueva clasificación.

### Consultar el historial

- Navega a la pestaña **Historial** para ver todas las clasificaciones anteriores guardadas en el dispositivo.

---

## Cómo actualizar el proyecto

### Obtener los últimos cambios del repositorio

```bash
git pull origin main
```

### Actualizar dependencias de Node.js/pnpm

Después de hacer `git pull`, ejecuta:

```bash
pnpm install
```

Esto instalará o actualizará automáticamente cualquier paquete nuevo o modificado.

### Actualizar dependencias de Python

Si se añadieron nuevas librerías al backend, instálalas con:

```bash
pip install flask flask-cors tensorflow pillow numpy --upgrade
```

### Aplicar cambios al esquema de base de datos

Si se modificó el esquema de la base de datos, ejecuta:

```bash
pnpm --filter @workspace/db run push
```

### Actualizar el modelo de IA

Si se reemplaza el archivo `modelo_aves.h5` por una versión mejorada:

1. Descarga el nuevo archivo desde donde te lo compartan.
2. Reemplaza el archivo `modelo_aves.h5` en la raíz del proyecto.
3. Reinicia el servidor Python:
   ```bash
   # Detén el proceso actual (Ctrl + C) y vuelve a ejecutar:
   python app.py
   ```

---

## Estructura del proyecto

```
Electiva-3/
├── app.py                  # Servidor Flask con el modelo de IA
├── modelo_aves.h5          # Modelo entrenado de TensorFlow (32 especies)
├── dependencias.txt        # Lista de todas las dependencias
├── artifacts/
│   ├── mobile/             # App móvil con Expo + React Native
│   └── api-server/         # Servidor API (Express 5 + PostgreSQL)
├── lib/                    # Librerías y utilidades compartidas
├── scripts/                # Scripts auxiliares del proyecto
├── package.json            # Configuración del workspace
└── pnpm-workspace.yaml     # Definición del monorepo
```

---

## Especies reconocidas

El modelo puede identificar las siguientes 32 especies de aves:

| # | Especie | # | Especie |
|---|---------|---|---------|
| 1 | Canario costeño | 17 | Loro Cabeciazul |
| 2 | Caracara plancus | 18 | Luis Bienteveo |
| 3 | Carpinterito Oliváceo | 19 | Mango Gorjinegro |
| 4 | Carpintero Coronirrojo | 20 | Mirla patinaranja |
| 5 | Centzontle Tropical | 21 | Paloma doméstica |
| 6 | Chulo | 22 | Papamoscas Rayado Chico |
| 7 | Colibrí Cola Canela | 23 | Perico carisucio |
| 8 | Colibrí cola de raqueta | 24 | Rascón Chiricote |
| 9 | Copetón | 25 | Semillero común |
| 10 | Cucarachero común | 26 | Tangara Azulegris |
| 11 | Eufonia Piquigruesa | 27 | Tangara dorada |
| 12 | Garza ganadera | 28 | Tirano Pirirí |
| 13 | Garza Ganadera Occidental | 29 | Tordo negro |
| 14 | Gavilán caminero | 30 | Tortolita común |
| 15 | Golondrina azul y blanco | 31 | Vireón Cejas Canela |
| 16 | Golondrina Yucateca | 32 | Zorzal Sabiá |

---

## Preguntas frecuentes

**¿La app funciona sin internet?**
El procesamiento de imágenes requiere conexión al servidor local (o remoto). Si el servidor Python está corriendo en tu computador y el celular está en la misma red Wi-Fi, no necesitas internet externo.

**¿Puedo usar la app sin Expo Go?**
Sí, pero necesitarías compilar la app como APK o IPA, lo cual requiere Android Studio o Xcode. Para pruebas y desarrollo, Expo Go es la opción más rápida.

**¿El modelo reconoce aves en tiempo real (video)?**
No, actualmente solo procesa imágenes estáticas (fotos). La clasificación en video requeriría modificaciones adicionales al modelo y la app.

**¿Qué tan preciso es el modelo?**
La precisión depende de la calidad de la imagen. Para mejores resultados: usa buena iluminación, centra el ave en el encuadre y evita fondos muy cargados.

**¿Se pueden añadir más especies?**
Sí, pero requiere reentrenar el modelo con nuevas imágenes y reemplazar el archivo `modelo_aves.h5`. También habría que actualizar la lista `clases` en `app.py`.

**¿Por qué aparece un error al predecir?**
Generalmente indica que el servidor Python no está corriendo. Verifica que `python app.py` esté activo en la terminal antes de usar la app.

---

## Solución de problemas comunes

**Error: `Cannot connect to server`**
- Asegúrate de que el servidor Python está activo: `python app.py`
- Verifica que el celular y el computador estén en la misma red Wi-Fi.
- Revisa que `MODEL_SERVER_URL` en `.env` apunte a la IP correcta de tu máquina.

**Error: `Module not found` al correr `python app.py`**
- Instala las dependencias faltantes:
  ```bash
  pip install flask flask-cors tensorflow pillow numpy
  ```

**Error: `pnpm: command not found`**
- Instala pnpm globalmente:
  ```bash
  npm install -g pnpm
  ```

**La app no carga en Expo Go**
- Verifica que el servidor de desarrollo esté corriendo: `pnpm --filter @workspace/mobile run dev`
- Asegúrate de escanear el QR con la app de Expo Go, no con la cámara del celular.
- Si el QR no funciona, ingresa manualmente la URL `exp://` que aparece en la terminal.

**Error de base de datos**
- Confirma que PostgreSQL está corriendo.
- Verifica que `DATABASE_URL` en `.env` tenga el usuario, contraseña y nombre de la base de datos correctos.
- Ejecuta `pnpm --filter @workspace/db run push` para sincronizar el esquema.

---

## Comandos de referencia rápida

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de IA (Python)
python app.py

# Iniciar app móvil
pnpm --filter @workspace/mobile run dev

# Iniciar servidor API
pnpm --filter @workspace/api-server run dev

# Verificar tipos TypeScript
pnpm run typecheck

# Build completo
pnpm run build

# Actualizar esquema de base de datos
pnpm --filter @workspace/db run push
```

---

> Proyecto desarrollado como parte de **Electiva 3** — Clasificación de aves con inteligencia artificial.
