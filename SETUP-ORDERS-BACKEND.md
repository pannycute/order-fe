# Setup Backend untuk Orders

## Langkah-langkah Setup

### 1. Buat Tabel Database
Jalankan file `database-orders.sql` di database MySQL Anda untuk membuat tabel orders dan order_items.

### 2. Tambahkan Controllers
Copy file-file berikut ke folder `app/Http/Controllers/API/`:
- `OrderController.php`
- `OrderItemController.php`

### 3. Tambahkan Routes
Tambahkan routes berikut ke file `routes/api.php`:

```php
# Order routes
Route::get('/orders', [App\Http\Controllers\API\OrderController::class, 'index']);
Route::get('/orders/{id}', [App\Http\Controllers\API\OrderController::class, 'show']);
Route::post('/orders', [App\Http\Controllers\API\OrderController::class, 'store']);
Route::put('/orders/{id}', [App\Http\Controllers\API\OrderController::class, 'update']);
Route::delete('/orders/{id}', [App\Http\Controllers\API\OrderController::class, 'destroy']);

# Order items routes
Route::get('/order-items', [App\Http\Controllers\API\OrderItemController::class, 'index']);
Route::get('/order-items/{id}', [App\Http\Controllers\API\OrderItemController::class, 'show']);
Route::post('/order-items', [App\Http\Controllers\API\OrderItemController::class, 'store']);
Route::put('/order-items/{id}', [App\Http\Controllers\API\OrderItemController::class, 'update']);
Route::delete('/order-items/{id}', [App\Http\Controllers\API\OrderItemController::class, 'destroy']);

# Import di bagian atas file
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\OrderItemController;
```

### 4. Test API
Setelah setup selesai, test API dengan mengakses:
- `GET /api/orders` - untuk melihat semua orders
- `GET /api/orders/1` - untuk melihat detail order
- `GET /api/order-items` - untuk melihat semua order items

### 5. Frontend
Frontend sudah siap dan akan otomatis mengambil data dari API setelah backend selesai disetup.

## Struktur Data

### Tabel Orders
- `order_id` - Primary key
- `user_id` - Foreign key ke users
- `order_date` - Tanggal pesanan
- `status` - Status pesanan (pending, confirmed, shipped, completed, cancelled)
- `total_amount` - Total jumlah pesanan
- `created_at`, `updated_at` - Timestamps

### Tabel Order Items
- `order_item_id` - Primary key
- `order_id` - Foreign key ke orders
- `product_id` - Foreign key ke products
- `quantity` - Jumlah produk
- `created_at`, `updated_at` - Timestamps

## Data Sample
File `database-orders.sql` sudah berisi data sample untuk testing laporan pendapatan. 