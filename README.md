# Authentication & Product CRUD APIs

A beginner-friendly full-stack implementation of the Sheryians Coding School "Authentication & Product CRUD APIs" assignment.

## Features

- Register and log in with validated credentials and bcrypt password hashing.
- Issue short-lived access tokens and refresh them through an `httpOnly` cookie.
- Create, read, update, and delete products with authenticated writes and public reads.
- Validate request bodies and product IDs before controller/database operations.
- Restore the current user and handle access-token expiration in the React frontend.

## Project links

- GitHub repository: `https://github.com/<your-username>/<repository-name>`
- Live project: `<add-deployment-url-when-available>`

## Stack

### Backend
- Node.js
- Express
- MongoDB / Mongoose
- JWT
- bcrypt
- express-validator
- cookie-parser
- CORS

### Frontend
- React
- Vite
- Fetch API

## Important note about Product fields

The assignment PDF requires product validation and explicitly mentions required fields, correct data types, `price` and `stock` as numbers, but it does not define a fixed Product schema. This implementation therefore uses:

- `name` — required string
- `description` — optional string
- `price` — required number >= 0
- `stock` — required integer >= 0

These fields can be adjusted to match the Product fields you have already been taught/using.

## Project structure

```text
auth-product-crud-assignment/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── productController.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   ├── validators/
│   │   ├── authValidators.js
│   │   └── productValidators.js
│   ├── utils/
│   │   └── tokens.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductForm.jsx
│   │   │   └── ProductList.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Products.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── auth.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── .gitignore
```

## Backend setup

```bash
cd backend
npm install
```

Create `.env` from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/auth_product_crud
ACCESS_TOKEN_SECRET=replace_with_a_long_random_secret
REFRESH_TOKEN_SECRET=replace_with_another_long_random_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

## Frontend setup

```bash
cd frontend
npm install
```

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## API endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh-token` | Public* |
| POST | `/api/auth/logout` | Authenticated |
| GET | `/api/auth/me` | Authenticated |
| POST | `/api/products` | Authenticated |
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| PUT | `/api/products/:id` | Authenticated |
| DELETE | `/api/products/:id` | Authenticated |

`/api/auth/refresh-token` requires a valid refresh-token cookie.

### Example requests

Register a user:

```http
POST /api/auth/register
Content-Type: application/json

{"name":"Asha Patel","email":"asha@example.com","password":"securepass1","confirmPassword":"securepass1"}
```

Successful registration returns `201` and a user object without a password or tokens. Validation failures return `400` with field names and messages.

Create a product using the access token returned by login:

```http
POST /api/products
Authorization: Bearer <access-token>
Content-Type: application/json

{"name":"Notebook","description":"Ruled pages","price":45.5,"stock":20}
```

Successful creation returns `201` with the created product. Product reads do not require an access token.

## Authentication flow

1. Register creates a user after validation and bcrypt hashing.
2. Login verifies the password using `bcrypt.compare`.
3. Login returns a short-lived access token in JSON.
4. Login also creates a long-lived refresh token.
5. Only a hash of the refresh token is stored in MongoDB.
6. The raw refresh token is sent in an `httpOnly` cookie.
7. Protected requests send `Authorization: Bearer <access-token>`.
8. When the access token expires, the frontend calls `/api/auth/refresh-token`.
9. The refresh token is verified and compared with the stored hash.
10. A new access token is returned.
11. Logout invalidates the stored refresh token and clears the cookie.

### Cookie note

The assignment requires an `httpOnly` and `secure` refresh-token cookie. During local development over plain HTTP, the cookie uses `secure: false` so that the local application can actually authenticate. In production (`NODE_ENV=production`) it becomes `secure: true`.

## Validation

`express-validator` runs before controllers.

Registration passwords must be at least 8 characters and contain at least one letter and one number.

Validation failures return HTTP 400 with field-level errors such as:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address."
    }
  ]
}
```

## Testing checklist

### Authentication
- [ ] Register valid user
- [ ] Duplicate registration -> 409
- [ ] Invalid email -> 400
- [ ] Weak password -> 400
- [ ] Password mismatch -> 400
- [ ] Login with valid credentials
- [ ] Wrong password -> 401
- [ ] Non-existing user -> 401
- [ ] Access and refresh token generation
- [ ] Refresh-token hash persisted
- [ ] Refresh token -> new access token
- [ ] Invalid/reused refresh token -> 401 or 403
- [ ] Expired refresh token -> 401 or 403
- [ ] Logout revokes refresh token and clears cookie
- [ ] `/me` with valid access token
- [ ] `/me` without token -> 401
- [ ] Invalid access token -> 401

### Products
- [ ] Create without token -> 401
- [ ] Create with valid token
- [ ] Create with invalid fields -> 400
- [ ] List products publicly
- [ ] Get one product publicly
- [ ] Get with invalid ID -> 400
- [ ] Get non-existing product -> 404
- [ ] Update without token -> 401
- [ ] Update with valid token
- [ ] Update with invalid ID -> 400
- [ ] Update non-existing product -> 404
- [ ] Update with invalid fields -> 400
- [ ] Delete without token -> 401
- [ ] Delete with valid token
- [ ] Delete with invalid ID -> 400
- [ ] Delete non-existing product -> 404

## Security

- Passwords are never stored as plaintext.
- Passwords are never returned.
- JWT secrets are read from environment variables.
- Refresh tokens are stored server-side as hashes.
- Refresh tokens are sent through an `httpOnly` cookie.
- The frontend never reads the refresh-token cookie.
- No secrets should be committed to Git.
