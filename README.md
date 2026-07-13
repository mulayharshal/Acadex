<div align="center">

<img src="https://img.shields.io/badge/Acadex-Academic%20Resource%20Sharing-blue?style=for-the-badge&logo=bookstack&logoColor=white" alt="Acadex Banner"/>

# 📚 Acadex

### Modern Academic Resource Sharing Platform

> *Learn. Share. Grow Together.*

---

### 🚀 Live Demo

https://acadex-web.netlify.app/

https://acadex-harshal.web.app/

</div>

---

# 🌟 About

**Acadex** is a modern full-stack academic resource sharing platform designed to help students upload, discover, preview, and download academic resources in one place. It enables collaborative learning through secure authentication, cloud storage, responsive design, and community-driven interactions.

Built using **React.js**, **Spring Boot**, **Spring Security**, **MySQL**, **Cloudinary**, and **Firebase**, Acadex provides a seamless experience across desktop and mobile devices.

---

# ✨ Features

## 🔐 Authentication & Security

- JWT Authentication
- Secure Login & Registration
- Password Encryption (BCrypt)
- Role-Based Authorization
- Protected REST APIs
- Email Verification using Brevo OTP
- Forgot Password via OTP
- Password Reset via OTP
- Secure Session Management

---

## 👤 User Profile

- Profile Management
- Edit Profile
- Upload Profile Picture
- Bio & Contact Information
- Personal Dashboard
- User Statistics

---

## 📄 Notes Module

- Upload Academic Notes
- PDF Preview
- Image Preview
- Office Document Preview (DOC, DOCX, PPT, PPTX, XLS, XLSX)
- Text File Preview
- Download Notes
- Like Notes
- Save Notes
- View Counter
- Categories
- Custom Categories
- Tags
- Comment System
- Delete Own Comments

---

## 💻 Projects Module

- Upload Projects
- Project Thumbnail Upload
- ZIP File Upload
- Download Project Files
- Live Demo Link
- YouTube Demo Link
- Tech Stack
- Categories
- Tags
- Like Projects
- Save Projects
- View Counter
- Comment System

---

## 🔍 Search & Discovery

- Search Notes
- Search Projects
- Latest Uploads

---

## ☁ Cloud Storage

- Cloudinary Integration
- Profile Images
- Notes Storage
- Project Images
- Project ZIP Files
- Automatic Cloud File Management

---

## 📧 Email Services (Brevo)

- Email Verification OTP
- Forgot Password OTP
- Password Reset OTP
- Welcome Email
- Account Notification Emails
- Security Notifications

---

## 📱 Responsive UI

- Mobile Friendly
- Tablet Optimized
- Desktop Optimized
- Modern UI Design
- Smooth Animations
- Premium User Experience

---

# 🚀 Planned Features

- 🤖 AI Resource Recommendation
- 💬 Real-Time Student Chat
- 👥 Study Groups
- 🔔 Push Notifications
- 💳 Premium Membership
- 💰 Payment Gateway (Stripe / Razorpay)
- ⭐ Ratings & Reviews
- 🏆 Achievement Badges
- 📚 Bookmark Collections
- 📈 User Analytics Dashboard
- 📌 Recently Viewed Resources
- 🔗 Share Notes & Projects
- 🛡️ Report Content
- 🌙 Dark Mode
- 📲 Progressive Web App (PWA)
- 🎥 Video Learning Resources
- 💼 Internship & Placement Portal
- 📅 Campus Events
- 🤝 Mentor–Student Connect
- 🧠 AI Study Assistant
- 🌐 Multi-language Support

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS |
| Backend | Spring Boot |
| Security | Spring Security + JWT |
| Database | MySQL |
| ORM | Spring Data JPA + Hibernate |
| File Storage | Cloudinary |
| Email Service | Brevo |
| Deployment | Firebase Hosting + Render |
| Version Control | Git & GitHub |

---

# ⚙ Installation

## Prerequisites

- Java 17+
- Maven
- Node.js 18+
- MySQL 8+
- Git

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/mulayharshal/Acadex.git

cd Acadex
```

---

## 2️⃣ Backend Setup

Create a MySQL database

```sql
CREATE DATABASE acadex;
```

Configure `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/acadex
spring.datasource.username=your_username
spring.datasource.password=your_password

jwt.secret=your_jwt_secret

cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret

brevo.api.key=your_brevo_api_key
```

Run Backend

```bash
cd acadex-backend

mvn spring-boot:run
```

Backend runs on

```
http://localhost:8080
```

---

## 3️⃣ Frontend Setup

```bash
cd acadex-frontend

npm install

npm run dev
```

Create `.env`

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1/
```

Frontend runs on

```
http://localhost:5173
```

---

# 📂 Supported File Types

## Notes

- PDF
- DOC
- DOCX
- PPT
- PPTX
- TXT

---

## Projects

- ZIP
- Project Images
- Live Demo Links
- YouTube Demo Links

---

# 🌐 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Firebase Hosting |
| Backend | Render (Docker) |
| File Storage | Cloudinary |
| Email Service | Brevo |

---

# 📸 Screenshots

<div align="center">


<img src="screenshots/Screenshot 2026-07-06 132140.png" width="100%"> 
<img src="screenshots/Screenshot 2026-07-06 141409.png" width="100%"> 
<img src="screenshots/Screenshot 2026-07-06 132636.png" width="100%"> 
<img src="screenshots/Screenshot 2026-07-06 132653.png" width="100%"> 
<img src="screenshots/Screenshot 2026-07-06 132734.png" width="100%"> 
<img src="screenshots/Screenshot 2026-07-06 132745.png" width="100%"> 
<img src="screenshots/Screenshot 2026-07-06 132824.png" width="100%"> 
<img src="screenshots/Screenshot 2026-07-06 133148.png" width="100%"> 
<img src="screenshots/Screenshot 2026-07-06 133207.png" width="100%"> 

</div>

---

# 📂 Project Structure

```text
Acadex
│
├── .github
│   └── workflows
│
├── Acadex Backend
│   ├── src
│   │   └── main
│   │       ├── java
│   │       │   └── com.acadex
│   │       │       ├── auth
│   │       │       ├── common
│   │       │       ├── config
│   │       │       ├── dto
│   │       │       ├── model
│   │       │       ├── notes
│   │       │       ├── project
│   │       │       ├── userProfile
│   │       │       └── AcadexApplication.java
│   │       │
│   │       └── resources
│   │
│   └── pom.xml
│
├── acadex-frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```
---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 👨‍💻 Developer

<div align="center">

## Harshal Mulay

**Java Full Stack Developer | Information Technology Engineer**

[![GitHub](https://img.shields.io/badge/GitHub-mulayharshal-black?style=flat-square&logo=github)](https://github.com/mulayharshal)

</div>

---

# 📜 License

This project is developed for **educational purposes** to help students collaborate, learn, and share academic resources efficiently.

---

<div align="center">

## ⭐ If you like this project, don't forget to star the repository!

**Built with ❤️ for Students, Developers & Learners**

### Learn • Share • Innovate

</div>