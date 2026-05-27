# NutriChef AI — Backend

API REST en **Node.js** y **Express** para autenticación de usuarios y gestión de recetas generadas con **Google Gemini**. Persistencia en **MongoDB** mediante Mongoose.

## Características

- Registro e inicio de sesión con JWT (access + refresh token)
- Recuperación de contraseña por correo (Gmail + código de 5 dígitos)
- CRUD de recetas por usuario autenticado
- Generación de título, pasos y tabla nutricional con IA a partir de ingredientes
- Arquitectura en capas: **Domain → Application → Infrastructure → Api**

## Stack

| Tecnología | Uso |
|------------|-----|
| Node.js ≥ 18 | Runtime |
| Express | HTTP / rutas |
| MongoDB + Mongoose | Base de datos |
| jsonwebtoken | Access y refresh tokens |
| bcryptjs | Hash de contraseñas |
| Nodemailer | Envío de códigos de reset |
| @google/genai | Generación de recetas |

## Estructura del proyecto

```
backend/
├── src/
│   ├── Domain/           # Entidades, interfaces, AppError
│   ├── Application/      # Casos de uso (Auth, Recipe)
│   ├── Infrastructure/   # Repositorios, servicios, DB, config
│   ├── Api/              # Controllers, routes, middlewares, mappers
│   ├── app.js            # Factory de Express (sin listen)
│   └── index.js          # Composition root y arranque del servidor
├── tests/                # Pruebas unitarias (node:test)
├── .env.example
└── package.json
```

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- Cuenta y cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (o MongoDB local)
- API key de [Google AI Studio](https://aistudio.google.com/) (Gemini)
- (Opcional) Gmail con [contraseña de aplicación](https://myaccount.google.com/apppasswords) para forgot-password

## Instalación

```bash
cd backend
npm install
```

## Variables de entorno

Copia el ejemplo y completa los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (por defecto `3000`) |
| `MONGODB_URI` | URI de conexión a MongoDB |
| `NODE_ENV` | `development` o `production` |
| `JWT_SECRET` | Secreto del access token |
| `JWT_EXPIRATION` | Ej. `1h` |
| `JWT_REFRESH_SECRET` | Secreto del refresh token |
| `JWT_REFRESH_EXPIRATION` | Ej. `7d` |
| `GMAIL_USER` | Correo emisor |
| `GMAIL_APP_PASSWORD` | Contraseña de aplicación Gmail |
| `GMAIL_FROM` | Remitente visible |
| `PASSWORD_RESET_CODE_EXPIRES_MINUTES` | Vigencia del código (ej. `15`) |
| `GEMINI_API_KEY` | Clave de la API de Gemini |
| `GEMINI_MODEL` | Modelo, ej. `gemini-2.5-flash` |

## Ejecución

```bash
# Desarrollo (recarga con --watch)
npm run dev

# Producción
npm start
```

El servidor queda en `http://localhost:3000` (o el `PORT` configurado).

## API

Base: `/api`

### Autenticación (público)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/register` | Registro `{ name, email, password }` |
| `POST` | `/auth/login` | Login `{ email, password }` → tokens + user |
| `POST` | `/auth/refresh` | Renovar tokens `{ refreshToken }` |
| `POST` | `/auth/forgot-password` | Solicitar código `{ email }` |
| `POST` | `/auth/reset-password` | Restablecer `{ email, code, newPassword }` |

### Recetas (requiere `Authorization: Bearer <accessToken>`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/recipes` | Crear receta con IA `{ ingredients: [{ name, quantity }] }` |
| `GET` | `/recipes` | Listar recetas del usuario |
| `GET` | `/recipes/:id` | Detalle de una receta |
| `DELETE` | `/recipes/:id` | Eliminar receta |

### Respuesta de receta (detalle)

Incluye `title`, `ingredients`, `steps` y `nutritionTable`:

```json
{
  "calories": "120 kcal",
  "protein": "5 g",
  "carbs": "20 g",
  "fat": "3 g",
  "fiber": "2 g",
  "sodium": "10 mg"
}
```

Los valores nutricionales son **estimaciones generadas por IA**, no datos clínicos verificados.

## Pruebas

Pruebas unitarias con el [test runner nativo de Node.js](https://nodejs.org/api/test.html) (`node:test`). Cubren casos de uso y mappers sin base de datos ni llamadas reales a Gemini.

```bash
npm test
```

Archivos en `tests/unit/`. El script `scripts/run-tests.mjs` descubre los archivos automáticamente (compatible con Windows).

## Decisiones técnicas

- **`createApp` separado de `index.js`**: facilita pruebas de integración futuras sin levantar el servidor completo.
- **Casos de uso**: validación y reglas de negocio fuera de controllers y repositorios.
- **Gemini con schema JSON**: respuesta estructurada (título, pasos, nutrición) para persistir de forma consistente.
- **Refresh token**: el frontend puede renovar el access token sin volver a iniciar sesión.

## Licencia

ISC
