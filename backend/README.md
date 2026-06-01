# HOMMED Backend (Python)

## Setup

1. Create a virtual environment and activate it.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create `.env` from `.env.example`.

Example:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@job-portal.7fw5ipp.mongodb.net/?retryWrites=true&w=majority&appName=Job-portal
DB_NAME=hommed
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@hommed.com
ADMIN_PASSWORD=admin123
```

## Run

```bash
python run.py
```

## API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/users/me`
- `GET /api/users/addresses`
- `POST /api/users/addresses`
- `GET /api/orders/my-orders`
- `POST /api/orders`
- `POST /api/admin/login`
- `GET /api/admin/orders`
