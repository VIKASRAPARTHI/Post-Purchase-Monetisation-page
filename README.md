# Post-Purchase Monetization Dashboard

A full-stack MERN application (MongoDB, Express, React, Node.js) designed to monetize the post-purchase experience through dynamic credit wallets, premium upgrades, and targeted campaigns.

## Features

### Customer Experience
- **Post-Purchase Dashboard**: Beautiful, branded page shown immediately after payment.
- **Future Me Wallet**: Dynamic credit system (rewards locked for 7 days).
- **Monetization Options**:
  - **Credit Booster**: Double credits instantly (₹49).
  - **Early Unlock**: Unlock credits immediately (₹29).
  - **Premium Wallet**: Subscription for no-expiry credits & 2x boost (₹99/mo).
- **Order Tracking**: Visual timeline and map integration.
- **Helpful Extras**: Non-monetized value adds (guides, surveys).

### Admin Dashboard
- **Overview Analytics**: Key metrics (Revenue, Credits Issued, User Growth).
- **User Credit Management**: Search users, view balances, manually issue/revoke credits.
- **Credit Rules Engine**: Configure automatic earning rules (e.g., >₹2.5k Order = 5% Credits).
- **Monetization Settings**: Adjust pricing and features for all revenue options.
- **Promotions**: specific campaign management.
- **Reporting**: Exportable analytics on credit usage and revenue.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Lucide Icons, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on .env.example
npm start
```
Server runs on `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Client runs on `http://localhost:3000`

## API Documentation

### Orders
- `POST /api/orders`: Create new order (auto-calculates credits).
- `GET /api/orders/:id`: Get order details.

### Credits
- `GET /api/credits/user/:id`: Get user wallet balance.
- `POST /api/credits/boost`: Purchase credit booster.
- `POST /api/credits/early-unlock`: Purchase early unlock.

### Admin
- `GET /api/admin/users`: Manage users.
- `GET /api/admin/credits/stats`: Dashboard analytics.
- `POST /api/admin/users/:id/credits/adjust`: Manual credit adjustment.

## Credit Logic
- **Base Rate**: 5% of order value.
- **Lock Period**: 7 days from delivery.
- **Expiry**: 90 days (unless Premium).
