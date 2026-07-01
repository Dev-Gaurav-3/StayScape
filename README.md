# StayScape 🏡

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge)](https://stayscape-nkjp.onrender.com/listings)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render)](https://stayscape-nkjp.onrender.com/listings)

A full-stack Airbnb-inspired property rental platform where users can discover, list, and review stays from around the world.

🔗 **Live Demo:** [https://stayscape-nkjp.onrender.com/listings](https://stayscape-nkjp.onrender.com/listings)

---

## 🌟 Features

- **Listings** — Create, read, update, and delete property listings with title, description, location, price, and images
- **Authentication** — Secure user registration and login via Passport.js with session management
- **Reviews & Ratings** — Leave star-rated reviews on listings; authors can delete their own reviews
- **Search** — Real-time property search powered by MongoDB `$regex` queries
- **Flash Messages** — Success and error feedback on all major actions
- **Dark Mode** — Toggle between light and dark themes, persisted via `localStorage`
- **Form Validation** — Client-side Bootstrap 5 validation on all forms
- **Responsive UI** — Mobile-friendly design with a custom coral/rose brand color scheme

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Node.js, Express.js                 |
| Templating | EJS, ejs-mate                       |
| Database   | MongoDB, Mongoose                   |
| Auth       | Passport.js (Local Strategy)        |
| Frontend   | Bootstrap 5, Custom CSS             |
| Tools      | Git, VS Code                        |
| Deployment | Render                              |

---

## 📁 Project Structure

```
stayscape/
├── models/
│   ├── listing.js        # Mongoose schema for property listings
│   └── review.js         # Mongoose schema for reviews
├── routes/
│   ├── listing.js        # CRUD routes for listings
│   ├── review.js         # Routes for adding/deleting reviews
│   └── user.js           # Auth routes (register, login, logout)
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs   # ejs-mate base layout
│   ├── listings/
│   │   ├── index.ejs         # All listings / search results
│   │   ├── show.ejs          # Single listing detail page
│   │   ├── new.ejs           # Create listing form
│   │   └── edit.ejs          # Edit listing form
│   └── users/
│       ├── login.ejs
│       └── register.ejs
├── public/
│   ├── css/
│   │   └── style.css     # Custom styles with coral/rose theme
│   └── js/
│       └── script.js     # Dark mode toggle, form validation
├── app.js                # Express app entry point
└── package.json
```

---

---

## ☁️ Deployment

This app is live on **Render**: [https://stayscape-nkjp.onrender.com/listings](https://stayscape-nkjp.onrender.com/listings)

> ⚠️ Note: The app is hosted on Render's free tier, so it may take **30–60 seconds** to wake up on the first visit if it has been idle.

---

## 📸 Screenshots

<img width="1921" height="5236" alt="image" src="https://github.com/user-attachments/assets/27b1e722-97f8-41d6-a461-137739dae2f9" />
<img width="1921" height="1211" alt="image" src="https://github.com/user-attachments/assets/f962628c-2c6d-4add-b2f1-b912ce3fe9f8" />
<img width="1921" height="1211" alt="image" src="https://github.com/user-attachments/assets/6c31f849-9c4e-4901-8af1-3be38ceaf4f0" />
<img width="1921" height="2810" alt="image" src="https://github.com/user-attachments/assets/8025c91b-ba40-4f7f-99f3-d5d13a2a1784" />
<img width="1921" height="2877" alt="image" src="https://github.com/user-attachments/assets/bd9bdebb-7d45-4e9f-b545-7a7136e60ec3" />


---

## 👤 Author

**Gaurav Suryavanshi**