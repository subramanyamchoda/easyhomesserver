# 🛠️ EasyHomes – Backend Server 🏡🔐

This is the **backend server** for **EasyHomes**, a smart rental platform built with the MERN stack. It handles user authentication, property listing, role-based access, and secure renter-user communication.

---

## 🔗 Live Links

* 🌐 **Frontend App**: [https://easyhomes7.vercel.app](https://easyhomes7.vercel.app)
* ⚙️ **Backend API**: [https://easyhomes-2ibc.onrender.com](https://easyhomes-2ibc.onrender.com)
* 📁 **Frontend Repo**: [https://github.com/subramanyamchoda/easyhomes\_client](https://github.com/subramanyamchoda/easyhomes_client)
* 📁 **Backend Repo**: [https://github.com/subramanyamchoda/easyhomes\_server](https://github.com/subramanyamchoda/easyhomes_server)

---

## 🚀 Features

* 🧑‍💼 Role-based access: Renters & Users
* 🏡 CRUD operations for rental listings
* 💳 Upload and validate payment for contact access
* 🔒 Secure login with JWT authentication
* 📁 REST APIs for home search, booking access, and user management
* 🖼️ Supports image upload with listings

---

## 🧰 Tech Stack

| Component    | Tech               |
| ------------ | ------------------ |
| Server       | Node.js + Express  |
| Auth         | JWT + Bcrypt       |
| Database     | MongoDB + Mongoose |
| File Uploads | Multer             |
| Deployment   | Render             |

---

## 📂 Folder Structure

```
├── controllers/
│   └── userController.js
│   └── homeController.js
│   └── accessController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   └── User.js
│   └── Home.js
│   └── AccessRequest.js
├── routes/
│   └── userRoutes.js
│   └── homeRoutes.js
│   └── accessRoutes.js
├── uploads/                # Uploaded payment files
├── .env
├── server.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```

---

## ▶️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/subramanyamchoda/easyhomesserver.git
cd easyhomes_server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm run dev
```

Server will run at: `http://localhost:5000`

---

## ✅ API Endpoints Overview

### 👤 User Authentication

```
POST   /api/user/register
POST   /api/user/login
GET    /api/user/profile
```

### 🏡 Home Listings

```
POST   /api/homes/            # Add new home (Renter)
GET    /api/homes/            # Get all listings (User)
GET    /api/homes/:id         # View single home
DELETE /api/homes/:id         # Delete home (Renter)
```

### 🔐 Access Requests

```
POST   /api/access/request    # Submit ₹50 proof to access contact
GET    /api/access/status     # Check access approval
```

---

## 🧪 Sample Request (JSON)

```json
POST /api/user/login
{
  "email": "tenant@example.com",
  "password": "securePass123"
}
```

---

## 🤝 Contributing

```bash
# 1. Fork this repo

# 2. Create a branch
git checkout -b feature/your-feature

# 3. Commit changes
git commit -m "Add your-feature"

# 4. Push to your fork
git push origin feature/your-feature

# 5. Open a Pull Request
```

---

## 🙌 Acknowledgments

This backend was developed to gain hands-on experience in:

* 🏡 Rental platform APIs
* 🔐 Secure, role-based access systems
* 📁 File uploads and validations
* ☁️ Full-stack MERN app deployment

---

## 📌 License

This project is open-source and free to use.

---

## 📞 Contact

Reach out on [LinkedIn](https://www.linkedin.com/in/subramanyamchoda/) or ⭐ the repo if you found it helpful!
