# Dog Lovers

**Dog Lovers** is a fun React app for anyone that loves to know about dogs that includes a **Guess the Dog Game** & a page to learn **Fun Dog facts**. Also a cool questionnaire that help you to find your **perfect buddy**, and a **shop** to find the perfect toys for your best friend.

## Setup Instructions

Deployment Url - https://silver-choux-195ea8.netlify.app/

- clone the repo from github - https://github.com/tpl457579/project-13-frontend
- npm init -y (to install dependencies)
- npm run dev
- npm run scrape(if needs to be tested)
c

# Guess the Dog Breed Game

A simple fun game where users guess the correct breed of a dog from three random images. Players earn points for correct guesses & lose lives for wrong answers.
There is an API I have created named **Dog Character API** that contains collected information on over 200 dog breeds collected from different sources.

# Dog Facts

A page that displays fun facts about dogs. The page uses the **Dog Facts API** made by me for this project to fetch random dog facts and display them.

# Dog Questionnaire

A fun questionnaire that helps you to find your perfect dog buddy. The questionnaire uses the **Dog Character API** to fetch information on different dog breeds and match them with the user's answers to find the best match.

# Shop

A page where users can find the perfect toys for their dogs. The page uses the **Dog Character API** to fetch information on different dog breeds and their corresponding toys. Users can filter the toys by breed, price, and rating. The **Shop** is the whole reason for this application to exist, to earn money from **affiliate marketing**, the games etc. are to attract and keep customers engaged.

# APIs Used

- **Dog Image API:**  
  https://dog.ceo/api/breeds/image/random

- **Dog Facts API:**  
  https://dog-facts-api.onrender.com/

## Features

# Dog Game

- Guess the dog breed from images (Dog CEO API)
- Score tracking
- 5 lives per game
- Timing function
- Restart on game over
- Display random dog facts (Dog Facts API)
- Client-side routing with React Router

# Technologies Used

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Dog CEO API](https://dog.ceo/dog-api/)
- [Dog Facts API](https://dog-facts-api.onrender.com/)

# Shop

Products in the shop are **scraped** from the internet using a tool named **scraper.js**. The scraper is set to scrape from Amazon - if you need to scrape from other websites modifications will be necessary.

In the the shop you can add and remove your **favourites** to your favourites page by clicking the **heart button**, from the favourites page you can remove the products by clicking on the **heart button**. By clicking on the product you will be brought to the page where you can by the product.

# Admin Product Dashboard

A full-stack admin dashboard for managing products with image uploads, scraping, and secure access. Built with:

- **Frontend**: React + React Hook Form

- **Image Hosting**: Cloudinary
- **Authentication**: JWT
- **Scraping**: Cheerio + Axios
- **Cron Jobs**: node-cron

---

## Features

- Add, edit, delete products with image preview
- Upload images via file or URL to Cloudinary
- Admin-only access with JWT auth
- Scrape products from the internet and clean favourites
- Daily cron job for scraping and cleanup
- Modular backend with secure routes and validation
- Responsive design for desktop and mobile devices
- Clean and modular frontend code
- Custom hooks for buttons, fetches, modals, and more
- Pages to show favourites, profile, and admin dashboard.

## New Feature !!!

On the admin page to add a product you simply have to enter the url from Amazon and the form will automatically fill in the product info.

---


You can setup admin accounts
node createAdmin.js

### Admin Routes (require JWT token)

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| GET    | `/api/products`            | Fetch all products  |
| GET    | `/api/products/:id`        | Fetch product by ID |
| POST   | `/api/products/create`     | Create product      |
| PUT    | `/api/products/update/:id` | Update product      |
| DELETE | `/api/products/delete/:id` | Delete product      |
| GET    | `/api/products/scrape`     | Scrape products     |

> All admin routes require header: `Authorization: Bearer <your_token>`

## Project Structure

```
├── public/ # Static assets
├── src/
│ ├── api/
│ │ ├── controllers/ # Product logic (CRUD, scrape, cleanup)
│ │ │ └── products.js
│ │ ├── models/ # Mongoose schemas
│ │ │ ├── products.js
│ │ │ └── users.js
│ │ ├── routes/ # Express routes
│ │ │ └── products.js
│ ├── config/
│ │ └── db.js # MongoDB connection
│ ├── middlewares/
│ │ ├── auth.js # JWT authentication
│ │ ├── adminAuth.js # Role-based access control
│ │ └── file.js # Multer + Cloudinary config
│ ├── utils/
│ │ ├── cloudinaryHelper.js # Image upload + publicId extraction
│ │ └── jwtHelper.js # Token generation and verification
│ ├── pages/
│ │ └── AdminProducts.jsx # Admin dashboard UI
│ ├── styles/
│ │ └── AdminProducts.css # Styling for dashboard and modals
│ └── index.js # Frontend entry point
├── createAdmin.js # Script to seed admin user
├── scraper.js # CLI scraper for Guaw.com
├── cron.js # Daily scheduled scrape + cleanup
├── .env # Environment variables
├── package.json # Project metadata and dependencies
└── README.md # Project documentation
```

### Technologies Used

**Frontend**

- React
- React Hook Form
- Axios
- React icons
- Lucide React
- React Router

**Dev Tools**

- dotenv
- Insomnia (API testing)
