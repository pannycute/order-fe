# Sistem Order Management

Sistem manajemen order dengan Next.js frontend dan Laravel backend.

## Fitur

### User
- ✅ Login/Register
- ✅ Dashboard User
- ✅ Lihat Produk
- ✅ Checkout Produk
- ✅ Lihat Pesanan Saya
- ✅ Konfirmasi Pembayaran
- ✅ Perhitungan Tenggat Waktu

### Admin
- ✅ Dashboard Admin dengan Laporan
- ✅ Manajemen User
- ✅ Manajemen Produk
- ✅ Manajemen Order
- ✅ Manajemen Payment Methods
- ✅ Manajemen Payment Confirmations
- ✅ Laporan Pendapatan

## Setup

### Frontend (Next.js)
```bash
npm install
npm run dev
```

### Backend (Laravel)
```bash
composer install
php artisan migrate
php artisan serve
```

## Environment Variables

Buat file `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/register` - User register

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

### Payment Confirmations
- `GET /api/paymentconfirmations` - Get all confirmations
- `POST /api/paymentconfirmations` - Create confirmation
- `PUT /api/paymentconfirmations/{id}` - Update confirmation

### Reports
- `GET /api/reports/omzet/today` - Today's income
- `GET /api/reports/omzet/month` - Monthly income
- `GET /api/reports/omzet/monthly-comparison` - Monthly comparison

## Database Structure

### Users
- user_id (PK)
- name
- email
- password
- role (admin/user)

### Products
- product_id (PK)
- name
- description
- price
- stock
- duration (in months)

### Orders
- order_id (PK)
- user_id (FK)
- order_date
- status
- total_amount

### Order Items
- order_item_id (PK)
- order_id (FK)
- product_id (FK)
- quantity
- unit_price
- subtotal

### Payment Methods
- payment_method_id (PK)
- method_name
- details

### Payment Confirmations
- confirmation_id (PK)
- order_id (FK)
- user_id (FK)
- amount
- bukti_transfer
- payment_method_id (FK)
- confirmation_date
- status

## Features

### Tenggat Waktu Otomatis
Sistem menghitung tenggat waktu berdasarkan:
- Tanggal order
- Durasi produk (dalam bulan)
- Perhitungan yang akurat untuk semua bulan

### Payment System
- Upload bukti transfer
- Status pending → confirmed
- Verifikasi admin

### Role-based Access
- User: Lihat produk, checkout, lihat pesanan
- Admin: Full access semua fitur

## Tech Stack

- **Frontend**: Next.js, TypeScript, NextUI
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Backend**: Laravel, MySQL
- **Authentication**: Laravel Sanctum

```
├── components
│   ├── accounts            # Accounts components
│   ├── charts              # Charts components
│   ├── breadcrumb          # component
|   ├── home                # Home components
|   ├── layout              # Layout components
|   ├── navbar              # Navbar components
|   ├── sidebar             # Sidebar components
|   ├── table               # Table components
|   ├── styles              # Some reusable components
|   ├── icons               # Icons
|   ├── hooks               #  Hooks
├── pages                   # Documentation files 
│   ├──  _app.tsx           # Entry point for the app
│   ├──  index.tsx          # Home page
│   ├── accounts.tsx        # Accounts Page
│   ├── more...             # Soon
└──

```
## For Run

Install dependencies

    
```bash
npm install
```

Start the server

    
        
```bash
npm run dev
```

Now you can visit https://localhost:3000 in your browser.
