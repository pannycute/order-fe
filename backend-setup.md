# Backend Setup untuk Payment Gateway

## 1. Install Midtrans PHP Library

```bash
composer require midtrans/midtrans-php
```

## 2. Tambahkan Environment Variables

Di file `.env` Laravel:
```env
MIDTRANS_SERVER_KEY=your_server_key_here
MIDTRANS_CLIENT_KEY=your_client_key_here
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANDBOX=true
```

## 3. Buat Payment Controller

```php
<?php
// app/Http/Controllers/PaymentController.php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\PaymentConfirmation;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function __construct()
    {
        // Set konfigurasi Midtrans
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function createPayment(Request $request)
    {
        try {
            $request->validate([
                'order_id' => 'required|exists:orders,order_id',
                'amount' => 'required|numeric',
                'customer_name' => 'required|string',
                'customer_email' => 'required|email',
            ]);

            $order = Order::findOrFail($request->order_id);
            
            // Siapkan parameter untuk Midtrans
            $params = [
                'transaction_details' => [
                    'order_id' => 'ORDER-' . $order->order_id,
                    'gross_amount' => $order->total_amount,
                ],
                'customer_details' => [
                    'first_name' => $request->customer_name,
                    'email' => $request->customer_email,
                ],
                'item_details' => [
                    [
                        'id' => $order->order_id,
                        'price' => $order->total_amount,
                        'quantity' => 1,
                        'name' => 'Order #' . $order->order_id,
                    ]
                ],
                'enabled_payments' => [
                    'credit_card', 'bca_va', 'bni_va', 'bri_va',
                    'gopay', 'shopeepay', 'indomaret', 'alfamart'
                ],
            ];

            // Dapatkan Snap Token dari Midtrans
            $snapToken = Snap::getSnapToken($params);

            return response()->json([
                'success' => true,
                'snap_token' => $snapToken,
                'payment_url' => "https://app.midtrans.com/snap/v2/vtweb/{$snapToken}",
                'message' => 'Payment URL generated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment: ' . $e->getMessage()
            ], 500);
        }
    }

    public function handleWebhook(Request $request)
    {
        try {
            $json = $request->getContent();
            $signatureKey = $request->header('X-Signature-Key');
            
            // Verifikasi signature (opsional tapi recommended)
            if (!$this->verifySignature($json, $signatureKey)) {
                return response()->json(['error' => 'Invalid signature'], 400);
            }

            $notification = json_decode($json, true);
            
            $orderId = $notification['order_id'];
            $status = $notification['transaction_status'];
            $fraudStatus = $notification['fraud_status'];
            
            // Extract order ID dari format "ORDER-123"
            $realOrderId = str_replace('ORDER-', '', $orderId);
            
            $order = Order::where('order_id', $realOrderId)->first();
            
            if (!$order) {
                return response()->json(['error' => 'Order not found'], 404);
            }

            // Update status berdasarkan notifikasi Midtrans
            if ($status == 'capture' || $status == 'settlement') {
                if ($fraudStatus == 'challenge') {
                    // TODO: Handle challenge
                    $order->update(['status' => 'pending']);
                } else if ($fraudStatus == 'accept') {
                    // Payment berhasil
                    $order->update(['status' => 'proses']);
                    
                    // Buat payment confirmation otomatis
                    PaymentConfirmation::create([
                        'order_id' => $order->order_id,
                        'user_id' => $order->user_id,
                        'amount' => $order->total_amount,
                        'payment_method_id' => 1, // Default payment method
                        'confirmation_date' => now(),
                        'status' => 'confirmed',
                        'bukti_transfer' => 'midtrans_payment'
                    ]);
                }
            } else if ($status == 'cancel' || $status == 'deny' || $status == 'expire') {
                $order->update(['status' => 'cancelled']);
            } else if ($status == 'pending') {
                $order->update(['status' => 'pending']);
            }

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Webhook processing failed: ' . $e->getMessage()
            ], 500);
        }
    }

    private function verifySignature($json, $signatureKey)
    {
        $expectedSignature = hash('sha512', $json . config('midtrans.server_key'));
        return $expectedSignature === $signatureKey;
    }

    public function checkPaymentStatus($orderId)
    {
        try {
            $order = Order::where('order_id', $orderId)->first();
            
            if (!$order) {
                return response()->json(['error' => 'Order not found'], 404);
            }

            // Cek status payment confirmation
            $paymentConfirmation = PaymentConfirmation::where('order_id', $orderId)
                ->where('status', 'confirmed')
                ->first();

            return response()->json([
                'success' => true,
                'order_status' => $order->status,
                'payment_status' => $paymentConfirmation ? 'confirmed' : 'pending',
                'payment_confirmation' => $paymentConfirmation
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to check payment status: ' . $e->getMessage()
            ], 500);
        }
    }
}
```

## 4. Buat Config File untuk Midtrans

```php
<?php
// config/midtrans.php

return [
    'server_key' => env('MIDTRANS_SERVER_KEY'),
    'client_key' => env('MIDTRANS_CLIENT_KEY'),
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    'is_sandbox' => env('MIDTRANS_IS_SANDBOX', true),
    'merchant_id' => env('MIDTRANS_MERCHANT_ID'),
];
```

## 5. Tambahkan Routes

```php
<?php
// routes/api.php

// Payment routes
Route::post('/payment/create', [PaymentController::class, 'createPayment']);
Route::post('/webhook/payment', [PaymentController::class, 'handleWebhook']);
Route::get('/payment/status/{orderId}', [PaymentController::class, 'checkPaymentStatus']);
```

## 6. Update Frontend untuk Menggunakan Snap Token

```javascript
// Di frontend, update handleAutomaticPayment function

const handleAutomaticPayment = async () => {
  if (!payOrder) return;
  setPayLoading(true);
  setNotif(null);
  
  try {
    const paymentData = {
      order_id: payOrder.order_id,
      amount: payOrder.total_amount,
      customer_name: user.name,
      customer_email: user.email,
    };

    const response = await axiosInstance.post('/api/payment/create', paymentData);
    
    if (response.data.success && response.data.snap_token) {
      // Load Midtrans Snap
      const script = document.createElement('script');
      script.src = 'https://app.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', 'YOUR_CLIENT_KEY');
      
      script.onload = () => {
        // @ts-ignore
        window.snap.pay(response.data.snap_token, {
          onSuccess: function(result) {
            setNotif({ 
              type: 'success', 
              message: 'Pembayaran berhasil! Status order akan diperbarui otomatis.' 
            });
            setTimeout(() => {
              setPayModalOpen(false);
              setNotif(null);
              // Refresh data order
              window.location.reload();
            }, 2000);
          },
          onPending: function(result) {
            setNotif({ 
              type: 'warning', 
              message: 'Pembayaran pending. Silakan selesaikan pembayaran Anda.' 
            });
          },
          onError: function(result) {
            setNotif({ 
              type: 'error', 
              message: 'Pembayaran gagal. Silakan coba lagi.' 
            });
          },
          onClose: function() {
            setNotif({ 
              type: 'info', 
              message: 'Pembayaran dibatalkan.' 
            });
          }
        });
      };
      
      document.head.appendChild(script);
    }
  } catch (err: any) {
    setNotif({ 
      type: 'error', 
      message: err?.response?.data?.message || 'Gagal memulai pembayaran otomatis' 
    });
  } finally {
    setPayLoading(false);
  }
};
```

## 7. Setup Midtrans Account

1. Daftar di [Midtrans Dashboard](https://dashboard.midtrans.com/)
2. Dapatkan Server Key dan Client Key
3. Set webhook URL: `https://yourdomain.com/api/webhook/payment`
4. Test dengan sandbox mode terlebih dahulu

## 8. Testing

### Test Cards (Sandbox):
- **Credit Card**: 4811 1111 1111 1114
- **BCA VA**: 1111111111111111
- **BNI VA**: 1111111111111111
- **BRI VA**: 1111111111111111

### Test Payment Flow:
1. User checkout produk
2. Pilih "Pembayaran Otomatis"
3. Redirect ke Midtrans
4. Pilih metode pembayaran
5. Selesaikan pembayaran
6. Webhook update status otomatis
7. User lihat status order berubah

## 9. Production Checklist

- [ ] Ganti ke production mode
- [ ] Set webhook URL production
- [ ] Test semua payment methods
- [ ] Setup monitoring dan logging
- [ ] Backup database
- [ ] SSL certificate aktif 