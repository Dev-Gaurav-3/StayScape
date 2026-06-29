# StayScape 🏡

A full-stack Airbnb-inspired property rental platform where users can discover, list, and review stays from around the world.

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

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/stayscape.git
cd stayscape

# 2. Install dependencies
npm install

# 3. Set up environment variables
#    Create a .env file in the root directory:
MONGO_URL=mongodb://localhost:27017/stayscape

# 4. Start the development server
node app.js
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📸 Screenshots
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
---

## 🔮 Upcoming Features

- [ ] Image upload via Cloudinary
- [ ] Map integration for listing locations
- [ ] Deployment on Render / Railway

---

## 👤 Author

**Gaurav Suryavanshi**