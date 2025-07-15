import React, { useEffect, useState } from 'react';
import { getProductsForUsers, getAllProducts } from '../services/productService';
import { createOrder, createOrderForUser } from '../services/ordersService';
import { createOrderItem } from '../services/orderItemsService';
import { useRouter } from 'next/router';
import { Modal, Input, Button, Text } from '@nextui-org/react';
import { getAllPaymentMethods, getPaymentMethodsForUsers } from '../services/paymentMethodService';
import { createPaymentConfirmation } from '../services/paymentConfirmationsService';
import InputSelect from '../components/input/InputSelect';

const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user_data');
  return userStr ? JSON.parse(userStr) : null;
};

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [notif, setNotif] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromStorage();
    if (!user || user.role !== 'user') {
      router.replace('/');
      return;
    }
    getAllProducts(1, 100)
      .then((res: any) => {
        setProducts(res.data?.data || []);
      })
      .catch((err: any) => {
        console.error('Error fetching products:', err);
        console.error('Error response:', err.response?.data);
        setNotif({ type: 'error', message: 'Gagal memuat produk. Silakan coba lagi.' });
      })
      .finally(() => setLoading(false));
    // Fetch payment methods
    getAllPaymentMethods(1, 100)
      .then((res: any) => {
        setPaymentMethods(res.data?.data || []);
        if (res.data?.data?.length > 0) setSelectedPaymentMethod(res.data.data[0].payment_method_id);
      })
      .catch((err: any) => {
        console.error('Error fetching payment methods:', err);
        console.error('Error response:', err.response?.data);
      });
  }, [router]);

  const handleBuy = (product: any) => {
    setSelectedProduct(product);
    setQuantity(1);
    setNotif(null);
    // Reset payment method ke default
    if (paymentMethods.length > 0) setSelectedPaymentMethod(paymentMethods[0].payment_method_id);
    setModalOpen(true);
  };

  const handleCheckout = async () => {
    if (!selectedProduct) return;
    setCheckoutLoading(true);
    setNotif(null);
    try {
      const user = getUserFromStorage();
      if (!user) throw new Error('User tidak ditemukan');
      const total = selectedProduct.price * quantity;
      // 1. Create order SEKALIGUS dengan items
      const orderPayload = {
        user_id: user.user_id,
        order_date: new Date().toISOString().slice(0, 10),
        status: 'pending',
        total_amount: total,
        items: [
          {
            product_id: selectedProduct.product_id,
            quantity,
            unit_price: selectedProduct.price,
            subtotal: total,
          }
        ]
      };
      await createOrder(orderPayload);
      setNotif({ type: 'success', message: 'Checkout berhasil! Pesanan Anda telah dibuat.' });
      setTimeout(() => {
        setModalOpen(false);
        setNotif(null);
      }, 1500);
    } catch (err: any) {
      setNotif({ type: 'error', message: err?.response?.data?.message || err.message || 'Checkout gagal' });
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>Loading...</div>;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #fbeee6 100%)',
      padding: '40px 0',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
      }}>
        <h1 style={{
          color: '#800000',
          fontSize: 36,
          fontWeight: 700,
          marginBottom: 32,
          letterSpacing: 1,
          textAlign: 'center',
        }}>
          Daftar Produk
        </h1>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 18 }}>Tidak ada produk tersedia.</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 32,
            }}
          >
            {products.map((product: any) => (
              <div
                key={product.product_id}
                style={{
                  background: '#fff',
                  borderRadius: 18,
                  boxShadow: '0 4px 24px 0 rgba(128,0,0,0.08)',
                  padding: '28px 24px 20px 24px',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  border: '1.5px solid #f3e6e6',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  minHeight: 180,
                  position: 'relative',
                }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px) scale(1.025)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px 0 rgba(128,0,0,0.13)';
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = '';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px 0 rgba(128,0,0,0.08)';
                }}
              >
                <div style={{ fontWeight: 700, color: '#800000', fontSize: 22, marginBottom: 8 }}>
                  {product.name}
                </div>
                <div style={{ color: '#444', fontSize: 15, marginBottom: 16, minHeight: 40 }}>
                  {product.description}
                </div>
                <div style={{
                  marginTop: 'auto',
                  fontWeight: 600,
                  color: '#b91c1c',
                  fontSize: 18,
                  letterSpacing: 0.5,
                }}>
                  Harga: Rp{Number(product.price).toLocaleString('id-ID')}
                </div>
                <Button
                  auto
                  color="gradient"
                  css={{ mt: 16, fontWeight: 600, background: 'linear-gradient(90deg, #b91c1c 0%, #800000 100%)', color: '#fff' }}
                  onClick={() => handleBuy(product)}
                >
                  Beli
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        width="400px"
      >
        <Modal.Header>
          <Text id="modal-title" h4>
            Checkout Produk
          </Text>
        </Modal.Header>
        <Modal.Body>
          {notif && (
            <div style={{ color: notif.type === 'success' ? '#16a34a' : '#dc2626', fontWeight: 600, marginBottom: 8 }}>
              {notif.message}
            </div>
          )}
          <div style={{ fontWeight: 600, color: '#800000', fontSize: 20, marginBottom: 4 }}>
            {selectedProduct?.name}
          </div>
          <div style={{ color: '#444', fontSize: 15, marginBottom: 8 }}>
            Harga: Rp{Number(selectedProduct?.price).toLocaleString('id-ID')}
          </div>
          <Input
            label="Jumlah"
            type="number"
            min={1}
            value={quantity.toString()}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            fullWidth
            bordered
          />
          <div style={{ marginTop: 8, fontWeight: 500 }}>
            Total: <span style={{ color: '#b91c1c' }}>Rp{Number(selectedProduct?.price * quantity).toLocaleString('id-ID')}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={() => setModalOpen(false)} disabled={checkoutLoading}>
            Batal
          </Button>
          <Button auto onClick={handleCheckout} disabled={checkoutLoading} css={{ fontWeight: 600, background: 'linear-gradient(90deg, #b91c1c 0%, #800000 100%)', color: '#fff' }}>
            {checkoutLoading ? 'Loading...' : 'Checkout'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserProducts; 