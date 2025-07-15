use App\Models\Order;
use App\Models\PaymentConfirmation;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;
use App\Http\Controllers\Controller;
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
            // Cek status payment confirmation
            $paymentConfirmation = PaymentConfirmation::where('order_id', $orderId)
                ->where('status', 'confirmed')
                ->first(); 