# 📦 Asset Management System

A modern full-stack web application built with **FastAPI**, **PostgreSQL**, **Next.js**, **TypeScript**, and **Tailwind CSS**. It features secure JWT-based authentication, role-based access control, and a clean, scalable architecture that separates the backend API from the frontend client.

---

## ✨ Features

- 🔐 **JWT Authentication** — access & refresh token flow for secure sessions
- 👤 **User Profiles** — rich profile fields (bio, avatar, social links, location, etc.)
- 🛡️ **Role-Based Access Control** — different permissions per user role
- 🗂️ **Category Management** — organize content into categories
- 📚 **Course, Module & Lesson Structure** — hierarchical content organization
- 🎬 **Free Content Support** — publicly accessible preview content
- 📝 **Enrollment System** — track user enrollments
- 💳 **Payment Integration** — handle transactions and payment records
- ☁️ **Cloudinary Integration** — media/image uploads and storage
- 🗄️ **Database Migrations** — schema versioning via Alembic
- 🎨 **Modern UI** — responsive interface built with Tailwind CSS and Framer Motion animations
- 🌍 **State Management** — global state handled with Redux Toolkit

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | High-performance async Python web framework |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [SQLAlchemy](https://www.sqlalchemy.org/) | ORM for database models |
| [Alembic](https://alembic.sqlalchemy.org/) | Database migrations |
| [Pydantic / Pydantic Settings](https://docs.pydantic.dev/) | Data validation & settings management |
| [python-jose](https://github.com/mpdavis/python-jose) | JWT encoding/decoding |
| [passlib / bcrypt](https://passlib.readthedocs.io/) | Password hashing |
| [FastAPI-Mail](https://sabuhish.github.io/fastapi-mail/) | Transactional emails |
| [Uvicorn](https://www.uvicorn.org/) | ASGI server |

### Frontend
| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework (App Router) |
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Redux Toolkit](https://redux-toolkit.js.org/) | State management |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [React Select](https://react-select.com/) | Advanced select inputs |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| [jwt-decode](https://github.com/auth0/jwt-decode) | Client-side token decoding |

---

## 📁 Project Structure

```
asset-management-fastapi-nextjs/
├── backend/
│   ├── app/
│   │   ├── api/           # Route handlers (auth, users, category, course, module, enrollments, payment, profile...)
│   │   ├── core/          # App configuration & settings
│   │   ├── db/            # Database engine & session setup
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   └── main.py        # FastAPI application entrypoint
│   ├── alembic.ini        # Alembic migration configuration
│   └── requirements.txt   # Python dependencies
│
└── frontend/
    ├── src/                # Next.js application source
    ├── package.json        # Node dependencies & scripts
    └── ...
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL database
- (Optional) Cloudinary account for media uploads

### 1. Clone the repository

```bash
git clone https://github.com/anik-bin-sayed/asset-management-fastapi-nextjs.git
cd asset-management-fastapi-nextjs
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` with the following variables:

```env
APP_NAME=Asset Management System
APP_VERSION=1.0.0

DATABASE_URL=postgresql://user:password@localhost:5432/asset_management

SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Run database migrations:

```bash
alembic upgrade head
```

Start the API server:

```bash
uvicorn app.main:app --reload
```

The backend will be available at **http://127.0.0.1:8000** (interactive docs at `/docs`).

#### SSLCommerz sandbox callbacks

For local sandbox payments, the gateway must be able to reach the backend callback URLs. Expose port `8000` through an HTTPS tunnel (for example, `ngrok http 8000`), set `BACKEND_URL` in `backend/.env` to the tunnel's public HTTPS URL, and keep `FRONTEND_URL` pointed at the local frontend (for example, `http://localhost:3000`). Set `SSLCOMMERZ_IS_SANDBOX=true` and configure the sandbox store credentials before restarting the API.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **http://localhost:3000**.

---

## 📡 API Overview

Once the backend is running, explore the auto-generated interactive documentation:

- Swagger UI → `http://127.0.0.1:8000/docs`
- ReDoc → `http://127.0.0.1:8000/redoc`

All routes are mounted under the `/api` prefix and grouped by resource (auth, users, profile, category, course, module, enrollments, payment).

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add some feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project currently has no explicit license. Feel free to reach out to the repository owner for usage permissions.

---

## 👤 Author

**Anik Bin Sayed**
GitHub: [@anik-bin-sayed](https://github.com/anik-bin-sayed)
