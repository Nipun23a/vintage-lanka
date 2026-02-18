# Vintage Lanka

A full-stack e-commerce mobile application for buying and selling vintage items, built with React Native (Expo) and Node.js/Express.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Screens](#screens)

---

## Overview

Vintage Lanka is a marketplace application that connects buyers and sellers of vintage products. It supports two user roles — **Buyer** and **Seller** — each with their own dedicated interface. The app includes product browsing, cart management, Stripe-powered checkout, order tracking, and real-time messaging.

---

## Tech Stack

### Frontend (Mobile App)
| Technology | Version |
|---|---|
| React Native | 0.76.9 |
| Expo SDK | ~52.0.46 |
| React | 18.3.1 |
| React Navigation | 7.x |
| Firebase (Auth, Storage, Realtime DB) | Latest |
| Stripe React Native | 0.38.6 |
| Axios | 1.9.0 |
| React Hook Form | 7.56.1 |
| Lottie React Native | 7.1.0 |
| Moment.js | 2.30.1 |

### Backend (Server)
| Technology | Version |
|---|---|
| Node.js / Express | 5.1.0 |
| MongoDB / Mongoose | 8.14.0 |
| Firebase Admin SDK | 13.3.0 |
| Stripe | 18.1.0 |
| bcryptjs | 3.0.2 |
| dotenv | 16.5.0 |
| nodemon | 3.1.10 |

---

## Project Structure

```
vintage-lanka/
├── app/                          # React Native Frontend (Expo)
│   ├── android/                  # Android native configuration
│   ├── assets/                   # Static assets
│   │   ├── fonts/
│   │   │   ├── Alatsi/
│   │   │   ├── Montaga/
│   │   │   └── Montserrat/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash-icon.png
│   │   └── favicon.png
│   ├── components/               # Reusable UI components
│   │   ├── Header.js
│   │   ├── AddressManagementModal.js
│   │   ├── PersonalInfoUpdateModal.js
│   │   └── PasswordUpdateModal.js
│   ├── config/                   # App configuration
│   │   ├── firebase.js           # Firebase initialization
│   │   └── useUser.js            # User context hook
│   ├── layout/                   # Layout wrappers
│   │   └── AuthLayout.js
│   ├── navigation/               # Navigation setup
│   │   └── AppNavigator.js       # Root navigator (auth + buyer + seller)
│   ├── screens/                  # App screens
│   │   ├── auth/
│   │   │   ├── UserTypeScreen.js
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── ForgotPasswordScreen.js
│   │   ├── buyer/
│   │   │   ├── BuyerHomeScreen.js
│   │   │   ├── BuyerSearchScreen.js
│   │   │   ├── BuyerFavoritesScreen.js
│   │   │   ├── ProductDetailScreen.js
│   │   │   ├── CartScreen.js
│   │   │   ├── CheckoutScreen.js
│   │   │   ├── OrderHistoryScreen.js
│   │   │   ├── TransactionHistoryScreen.js
│   │   │   ├── OrderThankYouScreen.js
│   │   │   └── ChatScreen.js
│   │   └── seller/
│   │       ├── SellerHomeScreen.js
│   │       ├── SellerProductsScreen.js
│   │       ├── SellerOrderScreen.js
│   │       ├── SellerWalletScreen.js
│   │       ├── SellerProfileScreen.js
│   │       ├── CreateProductScreen.js
│   │       └── InboxScreen.js
│   ├── App.js                    # Root component with font loading & Stripe
│   ├── index.js                  # Expo entry point
│   ├── StartScreen.js            # Welcome screen
│   ├── app.json                  # Expo configuration
│   └── package.json
│
└── server/                       # Express.js Backend
    ├── config/
    │   ├── db.js                 # MongoDB connection
    │   └── firebase.js           # Firebase Admin SDK setup
    ├── controller/
    │   ├── userController.js
    │   ├── productController.js
    │   ├── orderController.js
    │   └── categoryController.js
    ├── models/
    │   ├── userModel.js          # User schema (buyer/seller/admin)
    │   ├── productModel.js       # Product schema with reviews
    │   ├── orderModel.js         # Order schema with status tracking
    │   └── categoryModel.js
    ├── routes/
    │   ├── userRoutes.js
    │   ├── productRoutes.js
    │   ├── orderRoutes.js
    │   └── categoryRoutes.js
    ├── seeder/                   # Database seed scripts
    │   ├── userSeeder.js
    │   ├── buyerSeeder.js
    │   ├── productSeeder.js
    │   ├── categorySeeder.js
    │   ├── orderSeeder.js
    │   └── favoritesSeeder.js
    ├── index.js                  # Express server entry point
    ├── Procfile                  # Deployment config (node index.js)
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas URI)
- Expo CLI: `npm install -g expo-cli`
- Firebase project with Authentication, Realtime Database, and Storage enabled
- Stripe account (test or live)

---

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (see [Environment Variables](#environment-variables)).

Add your Firebase service account key as `server/serviceAccountKey.json`.

Start the server:

```bash
# Development
npm run dev

# Production
npm start
```

The server runs on `http://localhost:5000`.

---

### Frontend Setup

```bash
cd app
npm install
```

Update `app/config/firebase.js` with your Firebase project credentials.

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code with Expo Go (Android/iOS) or run on an emulator.

---

## Environment Variables

### Server (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/vintage-lanka
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### App (`app/`)

Update `app/App.js` with your Stripe publishable key:

```js
<StripeProvider publishableKey="pk_test_...">
```

Update `app/config/firebase.js` with your Firebase config object.

---

## API Endpoints

### Users — `/users`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | User login |
| GET | `/:id` | Get user by ID |
| PUT | `/:id` | Update user profile |
| DELETE | `/:id` | Delete user |
| POST | `/:userId/cart` | Add item to cart |
| GET | `/:userId/cart` | Get cart items |
| DELETE | `/:userId/cart` | Clear cart |
| PATCH | `/:userId/password` | Update password |
| GET | `/:userId/favourites/:productId` | Check favourite |
| POST | `/:userId/favourites/:productId` | Add to favourites |
| DELETE | `/:userId/favourites/:productId` | Remove from favourites |
| POST | `/:userId/addresses/:addressId` | Add address |
| DELETE | `/:userId/addresses/:addressId` | Remove address |

### Products — `/products`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all products |
| POST | `/` | Create new product |
| GET | `/seller/:sellerId` | Get products by seller |
| GET | `/:productId` | Get single product |
| GET | `/preferences/:userId` | Get user-preference products |
| PUT | `/:productId` | Update product |
| DELETE | `/:productId` | Delete product |

### Orders — `/orders`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create order |
| GET | `/buyer/:buyerId` | Get orders by buyer |
| GET | `/seller/:sellerId` | Get orders by seller |
| PUT | `/:orderId/status` | Update order status |

### Payments — `/`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create-payment-intent` | Create Stripe payment intent |
| POST | `/webhook` | Stripe webhook handler |

---

## Features

### Buyer
- Register and log in as a buyer
- Browse products by category
- Search and filter products
- View product details with reviews and ratings
- Add/remove products to/from favourites
- Manage shopping cart
- Checkout with Stripe payment
- View order history and transaction receipts
- Real-time messaging with sellers
- Manage profile, addresses, and password

### Seller
- Register and log in as a seller
- Create, edit, and delete product listings with images
- Manage inventory
- Track and fulfil orders (Pending → Processing → Shipped → Delivered)
- View wallet and payment history
- Real-time messaging with buyers
- Manage seller profile and settings

---

## Screens

### Authentication
| Screen | Description |
|---|---|
| `StartScreen` | Welcome / landing screen |
| `UserTypeScreen` | Choose Buyer or Seller role |
| `LoginScreen` | Email & password login |
| `RegisterScreen` | New user registration |
| `ForgotPasswordScreen` | Password reset flow |

### Buyer
| Screen | Description |
|---|---|
| `BuyerHomeScreen` | Product feed and categories |
| `BuyerSearchScreen` | Search and filter products |
| `BuyerFavoritesScreen` | Saved favourites |
| `ProductDetailScreen` | Full product view with reviews |
| `CartScreen` | Shopping cart management |
| `CheckoutScreen` | Stripe payment and address entry |
| `OrderThankYouScreen` | Order confirmation |
| `OrderHistoryScreen` | Past orders list |
| `TransactionHistoryScreen` | Detailed transaction history |
| `ChatScreen` | Messaging with seller |

### Seller
| Screen | Description |
|---|---|
| `SellerHomeScreen` | Sales overview dashboard |
| `SellerProductsScreen` | Inventory management |
| `CreateProductScreen` | Add new product listing |
| `SellerOrderScreen` | Order fulfilment management |
| `SellerWalletScreen` | Wallet and earnings |
| `SellerProfileScreen` | Profile and settings |
| `InboxScreen` | Messages from buyers |
