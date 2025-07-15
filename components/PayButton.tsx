import React, { useState } from 'react';

type PayButtonProps = {
  orderId: number | string;
  amount: number;
  customerName: string;
  customerEmail: string;
  children?: React.ReactNode;
};

declare global {
  interface Window {
    snap: any;
  }
}

const PayButton: React.FC<PayButtonProps> = ({
  orderId,
  amount,
  customerName,
  customerEmail,
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          amount,
          customer_name: customerName,
          customer_email: customerEmail,
        }),
      });

      const data = await res.json();

      if (!data.success || !data.snap_token) {
        alert(data.message || 'Gagal mendapatkan Snap Token');
        setLoading(false);
        return;
      }

      if (window.snap) {
        window.snap.pay(data.snap_token, {
          onSuccess: function (result: any) {
            alert('Pembayaran berhasil!\n' + JSON.stringify(result));
          },
          onPending: function (result: any) {
            alert('Pembayaran pending.\n' + JSON.stringify(result));
          },
          onError: function (result: any) {
            alert('Pembayaran gagal!\n' + JSON.stringify(result));
          },
          onClose: function () {
            alert('Kamu menutup popup tanpa menyelesaikan pembayaran');
          },
        });
      } else {
        alert('Midtrans Snap belum siap.');
      }
    } catch (err: any) {
      alert('Terjadi error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <button onClick={handlePay} disabled={loading}>
      {loading ? 'Memproses...' : children || 'Bayar Sekarang'}
    </button>
  );
};

export default PayButton; 