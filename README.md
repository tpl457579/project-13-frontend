# Pet Lovers

**Pet Lovers** is a fun React app for anyone that loves to know about pets that includes **Fun Games** & a page to learn **Fun Pet facts**. Also a cool questionnaire that help you to find your **perfect buddy**, and a **shop** to find the perfect toys, food and clothing for your best friend.

## Setup Instructions

Deployment Url - https://bejewelled-jelly-bcdcb3.netlify.app/cat-search

- clone the repo from github - https://github.com/tpl457579/project-13-frontend
- npm init -y (to install dependencies)
- npm run dev
- npm run scrape(if needs to be tested)
c

# Guess the Dog Breed Game

A simple fun game where users guess the correct breed of a dog from three random images. Players earn points for correct guesses & lose lives for wrong answers.
There is an API I have created named **Dog Character API** that contains collected information on over 200 dog breeds collected from different sources.

# Match the Cats

A card matching game with 3 rounds to complete.

# Pet Facts

A page that displays fun random facts about dogs and cats.

# Pet Questionnaire

A fun questionnaire that helps you to find your perfect buddy. The questionnaire uses information on different dog and cat breeds and match them with the user's answers to find the best match.

# Shop

A page where users can find the perfect toys, food and clothing for their pets. Users can filter by breed, price, and rating. The **Shop** and **Avertisement Partnerships** are the whole reason for this application to exist, to earn money from **affiliate marketing**, the games etc. are to attract and keep customers engaged.

# Technologies Used

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)

# Shop

Products in the shop are **scraped** from the internet using a tool named **scraper.js**. The scraper is set to scrape from Amazon - if you need to scrape from other websites modifications will be necessary.

In the the shop you can add and remove your **favourites** to your favourites page by clicking the **heart button**, from the favourites page you can remove the products by clicking on the **heart button**. By clicking on the product you will be brought to the page where you can by the product.

# Admin Product Dashboard

A full-stack admin dashboard for managing products, dogs and cats with image uploads, scraping, and secure access. Built with:

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

* [public/](.\project-13-frontend\public)
  * [cat2.png](.\project-13-frontend\public\cat2.png)
  * [dog-2.svg](.\project-13-frontend\public\dog-2.svg)
  * [dog1.png](.\project-13-frontend\public\dog1.png)
  * [hide.png](.\project-13-frontend\public\hide.png)
  * [insurance.png](.\project-13-frontend\public\insurance.png)
  * [paw1.svg](.\project-13-frontend\public\paw1.svg)
  * [placeholder.png](.\project-13-frontend\public\placeholder.png)
  * [visible.png](.\project-13-frontend\public\visible.png)
  * [_redirects](.\project-13-frontend\public\_redirects)
* [src/](.\project-13-frontend\src)
  * [components/](.\project-13-frontend\src\components)
    * [AdminAnimalCard/](.\project-13-frontend\src\components\AdminAnimalCard)
      * [AdminAnimalCard.css](.\project-13-frontend\src\components\AdminAnimalCard\AdminAnimalCard.css)
      * [AdminAnimalCard.jsx](.\project-13-frontend\src\components\AdminAnimalCard\AdminAnimalCard.jsx)
    * [AdminLayout/](.\project-13-frontend\src\components\AdminLayout)
      * [AdminLayout.css](.\project-13-frontend\src\components\AdminLayout\AdminLayout.css)
      * [AdminLayout.jsx](.\project-13-frontend\src\components\AdminLayout\AdminLayout.jsx)
    * [AlphabetFilter/](.\project-13-frontend\src\components\AlphabetFilter)
      * [AlphabetFilter.css](.\project-13-frontend\src\components\AlphabetFilter\AlphabetFilter.css)
      * [AlphabetFilter.jsx](.\project-13-frontend\src\components\AlphabetFilter\AlphabetFilter.jsx)
    * [AnimalForm/](.\project-13-frontend\src\components\AnimalForm)
      * [AnimalForm.css](.\project-13-frontend\src\components\AnimalForm\AnimalForm.css)
      * [AnimalForm.jsx](.\project-13-frontend\src\components\AnimalForm\AnimalForm.jsx)
    * [AnimalPopup/](.\project-13-frontend\src\components\AnimalPopup)
      * [AnimalPopup.css](.\project-13-frontend\src\components\AnimalPopup\AnimalPopup.css)
      * [AnimalPopup.jsx](.\project-13-frontend\src\components\AnimalPopup\AnimalPopup.jsx)
    * [AnimalToggle/](.\project-13-frontend\src\components\AnimalToggle)
      * [AnimalToggle.css](.\project-13-frontend\src\components\AnimalToggle\AnimalToggle.css)
      * [AnimalToggle.jsx](.\project-13-frontend\src\components\AnimalToggle\AnimalToggle.jsx)
    * [Buttons/](.\project-13-frontend\src\components\Buttons)
      * [Button.css](.\project-13-frontend\src\components\Buttons\Button.css)
      * [Button.jsx](.\project-13-frontend\src\components\Buttons\Button.jsx)
    * [ChatButton/](.\project-13-frontend\src\components\ChatButton)
      * [ChatButton.css](.\project-13-frontend\src\components\ChatButton\ChatButton.css)
      * [ChatButton.jsx](.\project-13-frontend\src\components\ChatButton\ChatButton.jsx)
    * [DeleteModal/](.\project-13-frontend\src\components\DeleteModal)
      * [DeleteModal.css](.\project-13-frontend\src\components\DeleteModal\DeleteModal.css)
      * [DeleteModal.jsx](.\project-13-frontend\src\components\DeleteModal\DeleteModal.jsx)
    * [DropZone/](.\project-13-frontend\src\components\DropZone)
      * [DropZone.css](.\project-13-frontend\src\components\DropZone\DropZone.css)
      * [DropZone.jsx](.\project-13-frontend\src\components\DropZone\DropZone.jsx)
    * [Footer/](.\project-13-frontend\src\components\Footer)
      * [Footer.css](.\project-13-frontend\src\components\Footer\Footer.css)
      * [Footer.jsx](.\project-13-frontend\src\components\Footer\Footer.jsx)
    * [FormInput/](.\project-13-frontend\src\components\FormInput)
      * [FormInput.css](.\project-13-frontend\src\components\FormInput\FormInput.css)
      * [FormInput.jsx](.\project-13-frontend\src\components\FormInput\FormInput.jsx)
    * [Hamburger/](.\project-13-frontend\src\components\Hamburger)
      * [Hamburger.css](.\project-13-frontend\src\components\Hamburger\Hamburger.css)
      * [Hamburger.jsx](.\project-13-frontend\src\components\Hamburger\Hamburger.jsx)
    * [Header/](.\project-13-frontend\src\components\Header)
      * [Header.css](.\project-13-frontend\src\components\Header\Header.css)
      * [Header.jsx](.\project-13-frontend\src\components\Header\Header.jsx)
    * [IdeaBulb/](.\project-13-frontend\src\components\IdeaBulb)
      * [IdeaBulb.css](.\project-13-frontend\src\components\IdeaBulb\IdeaBulb.css)
      * [IdeaBulb.jsx](.\project-13-frontend\src\components\IdeaBulb\IdeaBulb.jsx)
    * [Intro/](.\project-13-frontend\src\components\Intro)
      * [Intro.css](.\project-13-frontend\src\components\Intro\Intro.css)
      * [Intro.jsx](.\project-13-frontend\src\components\Intro\Intro.jsx)
    * [Loader/](.\project-13-frontend\src\components\Loader)
      * [Loader.css](.\project-13-frontend\src\components\Loader\Loader.css)
      * [Loader.jsx](.\project-13-frontend\src\components\Loader\Loader.jsx)
    * [Modal/](.\project-13-frontend\src\components\Modal)
      * [Modal.css](.\project-13-frontend\src\components\Modal\Modal.css)
      * [Modal.jsx](.\project-13-frontend\src\components\Modal\Modal.jsx)
    * [PageLayout/](.\project-13-frontend\src\components\PageLayout)
      * [PageLayout.css](.\project-13-frontend\src\components\PageLayout\PageLayout.css)
      * [PageLayout.jsx](.\project-13-frontend\src\components\PageLayout\PageLayout.jsx)
    * [PaginationControls/](.\project-13-frontend\src\components\PaginationControls)
      * [PaginationControls.css](.\project-13-frontend\src\components\PaginationControls\PaginationControls.css)
      * [PaginationControls.jsx](.\project-13-frontend\src\components\PaginationControls\PaginationControls.jsx)
    * [PasswordInput/](.\project-13-frontend\src\components\PasswordInput)
      * [PasswordInput.css](.\project-13-frontend\src\components\PasswordInput\PasswordInput.css)
      * [PasswordInput.jsx](.\project-13-frontend\src\components\PasswordInput\PasswordInput.jsx)
    * [PetInsurancePopup/](.\project-13-frontend\src\components\PetInsurancePopup)
      * [PetInsurancePopup.css](.\project-13-frontend\src\components\PetInsurancePopup\PetInsurancePopup.css)
      * [PetInsurancePopup.jsx](.\project-13-frontend\src\components\PetInsurancePopup\PetInsurancePopup.jsx)
    * [ProductCard/](.\project-13-frontend\src\components\ProductCard)
      * [ProductCard.css](.\project-13-frontend\src\components\ProductCard\ProductCard.css)
      * [ProductCard.jsx](.\project-13-frontend\src\components\ProductCard\ProductCard.jsx)
    * [ProductForm/](.\project-13-frontend\src\components\ProductForm)
      * [ProductForm.css](.\project-13-frontend\src\components\ProductForm\ProductForm.css)
      * [ProductForm.jsx](.\project-13-frontend\src\components\ProductForm\ProductForm.jsx)
    * [ScrollButton/](.\project-13-frontend\src\components\ScrollButton)
      * [ScrollButton.css](.\project-13-frontend\src\components\ScrollButton\ScrollButton.css)
      * [ScrollButton.jsx](.\project-13-frontend\src\components\ScrollButton\ScrollButton.jsx)
    * [SearchBar/](.\project-13-frontend\src\components\SearchBar)
      * [SearchBar.css](.\project-13-frontend\src\components\SearchBar\SearchBar.css)
      * [SearchBar.jsx](.\project-13-frontend\src\components\SearchBar\SearchBar.jsx)
    * [ShopProductCard/](.\project-13-frontend\src\components\ShopProductCard)
      * [ShopProductCard.jsx](.\project-13-frontend\src\components\ShopProductCard\ShopProductCard.jsx)
    * [ShowPopup/](.\project-13-frontend\src\components\ShowPopup)
      * [ShowPopup.css](.\project-13-frontend\src\components\ShowPopup\ShowPopup.css)
      * [ShowPopup.js](.\project-13-frontend\src\components\ShowPopup\ShowPopup.js)
    * [SmallAnimalCard/](.\project-13-frontend\src\components\SmallAnimalCard)
      * [SmallAnimalCard.css](.\project-13-frontend\src\components\SmallAnimalCard\SmallAnimalCard.css)
      * [SmallAnimalCard.jsx](.\project-13-frontend\src\components\SmallAnimalCard\SmallAnimalCard.jsx)
    * [Spinner/](.\project-13-frontend\src\components\Spinner)
      * [Spinner.css](.\project-13-frontend\src\components\Spinner\Spinner.css)
      * [Spinner.jsx](.\project-13-frontend\src\components\Spinner\Spinner.jsx)
    * [ThemeToggle/](.\project-13-frontend\src\components\ThemeToggle)
      * [ThemeToggle.css](.\project-13-frontend\src\components\ThemeToggle\ThemeToggle.css)
      * [ThemeToggle.jsx](.\project-13-frontend\src\components\ThemeToggle\ThemeToggle.jsx)
    * [AnimalContext.jsx](.\project-13-frontend\src\components\AnimalContext.jsx)
    * [apiFetch.js](.\project-13-frontend\src\components\apiFetch.js)
    * [AuthContext.jsx](.\project-13-frontend\src\components\AuthContext.jsx)
    * [FullScreenToggle.jsx](.\project-13-frontend\src\components\FullScreenToggle.jsx)
    * [PawIcon.jsx](.\project-13-frontend\src\components\PawIcon.jsx)
    * [ProtectedRoute.jsx](.\project-13-frontend\src\components\ProtectedRoute.jsx)
  * [FilterControls/](.\project-13-frontend\src\FilterControls)
    * [FilterControls.css](.\project-13-frontend\src\FilterControls\FilterControls.css)
    * [FilterControls.jsx](.\project-13-frontend\src\FilterControls\FilterControls.jsx)
  * [Hooks/](.\project-13-frontend\src\Hooks)
    * [useAdminActions.js](.\project-13-frontend\src\Hooks\useAdminActions.js)
    * [useAnimalForm.js](.\project-13-frontend\src\Hooks\useAnimalForm.js)
    * [useAuth.js](.\project-13-frontend\src\Hooks\useAuth.js)
    * [useCatFilters.js](.\project-13-frontend\src\Hooks\useCatFilters.js)
    * [useCats.js](.\project-13-frontend\src\Hooks\useCats.js)
    * [useDogFilters.js](.\project-13-frontend\src\Hooks\useDogFilters.js)
    * [useDogs.js](.\project-13-frontend\src\Hooks\useDogs.js)
    * [useFavourites.js](.\project-13-frontend\src\Hooks\useFavourites.js)
    * [useFilters.js](.\project-13-frontend\src\Hooks\useFilters.js)
    * [useFullScreen.js](.\project-13-frontend\src\Hooks\useFullScreen.js)
    * [useLocalStorage.js](.\project-13-frontend\src\Hooks\useLocalStorage.js)
    * [useModal.js](.\project-13-frontend\src\Hooks\useModal.js)
    * [usePagination.js](.\project-13-frontend\src\Hooks\usePagination.js)
    * [usePetType.js](.\project-13-frontend\src\Hooks\usePetType.js)
    * [useProducts.js](.\project-13-frontend\src\Hooks\useProducts.js)
  * [Pages/](.\project-13-frontend\src\Pages)
    * [AdminAnimals/](.\project-13-frontend\src\Pages\AdminAnimals)
      * [AdminAnimals.css](.\project-13-frontend\src\Pages\AdminAnimals\AdminAnimals.css)
      * [AdminAnimals.jsx](.\project-13-frontend\src\Pages\AdminAnimals\AdminAnimals.jsx)
    * [AdminProducts/](.\project-13-frontend\src\Pages\AdminProducts)
      * [AdminProducts.css](.\project-13-frontend\src\Pages\AdminProducts\AdminProducts.css)
      * [AdminProducts.jsx](.\project-13-frontend\src\Pages\AdminProducts\AdminProducts.jsx)
    * [AnimalSearch/](.\project-13-frontend\src\Pages\AnimalSearch)
      * [AnimalSearch.css](.\project-13-frontend\src\Pages\AnimalSearch\AnimalSearch.css)
      * [AnimalSearch.jsx](.\project-13-frontend\src\Pages\AnimalSearch\AnimalSearch.jsx)
    * [FavouritesPage/](.\project-13-frontend\src\Pages\FavouritesPage)
      * [FavouritesPage.css](.\project-13-frontend\src\Pages\FavouritesPage\FavouritesPage.css)
      * [FavouritesPage.jsx](.\project-13-frontend\src\Pages\FavouritesPage\FavouritesPage.jsx)
    * [FunAnimalFacts/](.\project-13-frontend\src\Pages\FunAnimalFacts)
      * [FunAnimalFacts.css](.\project-13-frontend\src\Pages\FunAnimalFacts\FunAnimalFacts.css)
      * [FunAnimalFacts.jsx](.\project-13-frontend\src\Pages\FunAnimalFacts\FunAnimalFacts.jsx)
    * [GuessTheDog/](.\project-13-frontend\src\Pages\GuessTheDog)
      * [GuessTheDog.css](.\project-13-frontend\src\Pages\GuessTheDog\GuessTheDog.css)
      * [GuessTheDog.jsx](.\project-13-frontend\src\Pages\GuessTheDog\GuessTheDog.jsx)
    * [Home/](.\project-13-frontend\src\Pages\Home)
      * [Home.css](.\project-13-frontend\src\Pages\Home\Home.css)
      * [Home.jsx](.\project-13-frontend\src\Pages\Home\Home.jsx)
    * [Login/](.\project-13-frontend\src\Pages\Login)
      * [Login.css](.\project-13-frontend\src\Pages\Login\Login.css)
      * [Login.jsx](.\project-13-frontend\src\Pages\Login\Login.jsx)
    * [MatchTheCats/](.\project-13-frontend\src\Pages\MatchTheCats)
      * [MatchTheCats.css](.\project-13-frontend\src\Pages\MatchTheCats\MatchTheCats.css)
      * [MatchTheCats.jsx](.\project-13-frontend\src\Pages\MatchTheCats\MatchTheCats.jsx)
    * [Profile/](.\project-13-frontend\src\Pages\Profile)
      * [Profile.css](.\project-13-frontend\src\Pages\Profile\Profile.css)
      * [Profile.jsx](.\project-13-frontend\src\Pages\Profile\Profile.jsx)
    * [Register/](.\project-13-frontend\src\Pages\Register)
      * [Register.css](.\project-13-frontend\src\Pages\Register\Register.css)
      * [Register.jsx](.\project-13-frontend\src\Pages\Register\Register.jsx)
    * [Shop/](.\project-13-frontend\src\Pages\Shop)
      * [Shop.css](.\project-13-frontend\src\Pages\Shop\Shop.css)
      * [Shop.jsx](.\project-13-frontend\src\Pages\Shop\Shop.jsx)
    * [SuitableAnimal/](.\project-13-frontend\src\Pages\SuitableAnimal)
      * [SuitableAnimal.css](.\project-13-frontend\src\Pages\SuitableAnimal\SuitableAnimal.css)
      * [SuitableAnimal.jsx](.\project-13-frontend\src\Pages\SuitableAnimal\SuitableAnimal.jsx)
  * [Reducers/](.\project-13-frontend\src\Reducers)
    * [CatGameReducer.jsx](.\project-13-frontend\src\Reducers\CatGameReducer.jsx)
    * [DogGameReducer.jsx](.\project-13-frontend\src\Reducers\DogGameReducer.jsx)
  * [App.jsx](.\project-13-frontend\src\App.jsx)
  * [index.css](.\project-13-frontend\src\index.css)
  * [main.jsx](.\project-13-frontend\src\main.jsx)
* [.env](.\project-13-frontend\.env)
* [.gitignore](.\project-13-frontend\.gitignore)
* [.nvmrc](.\project-13-frontend\.nvmrc)
* [eslint.config.js](.\project-13-frontend\eslint.config.js)
* [index.html](.\project-13-frontend\index.html)
* [package-lock.json](.\project-13-frontend\package-lock.json)
* [package.json](.\project-13-frontend\package.json)
* [README.md](.\project-13-frontend\README.md)
* [vite.config.js](.\project-13-frontend\vite.config.js)

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
