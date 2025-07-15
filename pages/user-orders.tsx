import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useOrderStore } from '../stores/orderStore';
import { useOrderItemStore } from '../stores/orderItemStore';
import { useProductStore } from '../stores/productStore';
import { Modal, Input, Button, Text, Card, Badge, Spacer, Divider } from '@nextui-org/react';
import { axiosInstance } from '../utils/axiosInstance';
import { Package, Calendar, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';

const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user_data');
  return userStr ? JSON.parse(userStr) : null;
};

// Fungsi untuk menghitung tenggat waktu yang akurat
const calculateDeadline = (orderDate: string, durationMonths: number): string => {
  const order = new Date(orderDate);
  const deadline = new Date(order);
  
  // Set tanggal yang sama di bulan yang ditargetkan
  const targetDate = deadline.getDate();
  deadline.setMonth(deadline.getMonth() + durationMonths);
  
  // Jika tanggal berubah karena bulan target tidak punya tanggal tersebut
  // (misal: 31 Jan → 31 Feb yang tidak ada), set ke tanggal terakhir bulan target
  if (deadline.getDate() !== targetDate) {
    deadline.setDate(0); // Set ke tanggal terakhir bulan sebelumnya (yang sebenarnya adalah bulan target)
  }
  
  return deadline.toLocaleDateString('id-ID');
};

const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return {
        color: 'warning' as const,
        text: 'Menunggu Pembayaran',
        icon: <Clock size={16} />,
        bgColor: '#fef3c7',
        textColor: '#92400e'
      };
    case 'confirmed':
      return {
        color: 'primary' as const,
        text: 'Pembayaran Dikonfirmasi',
        icon: <CheckCircle size={16} />,
        bgColor: '#dbeafe',
        textColor: '#1e40af'
      };
    case 'completed':
      return {
        color: 'success' as const,
        text: 'Selesai',
        icon: <CheckCircle size={16} />,
        bgColor: '#d1fae5',
        textColor: '#065f46'
      };
    case 'cancelled':
      return {
        color: 'error' as const,
        text: 'Dibatalkan',
        icon: <XCircle size={16} />,
        bgColor: '#fee2e2',
        textColor: '#991b1b'
      };
    default:
      return {
        color: 'default' as const,
        text: status,
        icon: <Package size={16} />,
        bgColor: '#f3f4f6',
        textColor: '#374151'
      };
  }
};

const UserOrders = () => {
  const router = useRouter();
  const orderStore = useOrderStore();
  const orderItemStore = useOrderItemStore();
  const productStore = useProductStore();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payOrder, setPayOrder] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payFile, setPayFile] = useState<File | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [notif, setNotif] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const u = getUserFromStorage();
    if (!u || u.role !== 'user') {
      router.replace('/');
      return;
    }
    setUser(u);
    Promise.all([
      orderStore.loadAll(1, 100),
      orderItemStore.loadAll(1, 1000),
      productStore.loadAll(1, 1000),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '2rem' }}>📦</div>
        <Text h4>Memuat pesanan...</Text>
      </div>
    );
  }
  
  if (!user) return null;

  const userOrders = orderStore.data.filter((order) => String(order.user_id) === String(user.user_id));

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: 1200, 
      margin: '0 auto',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #800000 0%, #b91c1c 100%)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white',
        boxShadow: '0 10px 25px rgba(128, 0, 0, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <Package size={32} />
          <Text h2 style={{ color: 'white', margin: 0 }}>
            Pesanan Saya
          </Text>
        </div>
        <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
          Kelola dan lacak semua pesanan Anda di sini
        </Text>
      </div>

      {/* Orders Section */}
      {userOrders.length === 0 ? (
        <Card css={{ 
          padding: '4rem 2rem', 
          textAlign: 'center',
          background: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <Text h3 style={{ marginBottom: '0.5rem', color: '#374151' }}>
            Belum ada pesanan
          </Text>
          <Text style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Mulai belanja produk untuk melihat pesanan Anda di sini
          </Text>
          <Button 
            auto 
            color="gradient"
            css={{ 
              background: 'linear-gradient(135deg, #800000 0%, #b91c1c 100%)',
              fontWeight: 600
            }}
            onClick={() => router.push('/user-products')}
          >
            Mulai Belanja
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {userOrders.map((order) => {
            const orderItems = orderItemStore.data.filter((item) => item.order_id === order.order_id);
            const products = orderItems.map((item) => {
              const product = productStore.data.find((p) => p.product_id === item.product_id);
              return { ...item, product };
            });
            // Tambahkan log debug kecocokan product_id
            if (typeof window !== 'undefined') {
              const productIdsInStore = productStore.data.map(p => p.product_id);
              const productIdsInOrder = orderItems.map(i => i.product_id);
              const unmatched = productIdsInOrder.filter(id => !productIdsInStore.includes(id));
              console.log('orderItems:', orderItems);
              console.log('productStore:', productStore.data);
              console.log('productIdsInOrder:', productIdsInOrder);
              console.log('productIdsInStore:', productIdsInStore);
              if (unmatched.length > 0) {
                console.warn('product_id berikut dari orderItems tidak ditemukan di productStore:', unmatched);
              } else {
                console.log('Semua product_id orderItems ditemukan di productStore');
              }
              console.log('products mapped:', products);
            }
            const statusInfo = getStatusInfo(order.status);

            return (
              <Card 
                key={order.order_id}
                css={{ 
                  background: 'white',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                {/* Order Header */}
                <div style={{ 
                  padding: '1.5rem',
                  borderBottom: '1px solid #f3f4f6',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Package size={20} color="#800000" />
                        <Text h4 style={{ color: '#800000', margin: 0 }}>
                          Order #{order.order_id}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                        <Calendar size={16} />
                        <Text size="sm">
                          {new Date(order.order_date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                      </div>
                    </div>
                    <Badge 
                      color={statusInfo.color}
                      css={{ 
                        background: statusInfo.bgColor,
                        color: statusInfo.textColor,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {statusInfo.icon}
                        {statusInfo.text}
                      </div>
                    </Badge>
                  </div>
                </div>

                {/* Products List */}
                <div style={{ padding: '1.5rem' }}>
                  <Text h5 style={{ marginBottom: '1rem', color: '#374151' }}>
                    Produk yang Dipesan
                  </Text>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {products.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <Text h6 style={{ color: '#374151', marginBottom: '0.25rem' }}>
                            {item.product?.name || `Product #${item.product_id} (Nama tidak ditemukan)`}
                          </Text>
                          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
                            {item.product?.description || <span style={{ color: '#b91c1c' }}>Deskripsi tidak tersedia</span>}
                          </div>
                          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
                            Durasi: {item.product?.duration ? `${item.product.duration} bulan` : <span style={{ color: '#b91c1c' }}>Tidak tersedia</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#6b7280', marginBottom: 4 }}>
                            <Text size="sm">Qty: {item.quantity}</Text>
                            <Text size="sm">@ Rp{Number(item.unit_price).toLocaleString('id-ID', { style: 'decimal', maximumFractionDigits: 0 })}</Text>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Text h6 style={{ color: '#800000', fontWeight: 'bold' }}>
                            Rp{Number(item.subtotal).toLocaleString('id-ID', { style: 'decimal', maximumFractionDigits: 0 })}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div style={{ 
                  padding: '1.5rem',
                  borderTop: '1px solid #f3f4f6',
                  background: '#f8fafc'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <Text h4 style={{ color: '#800000', margin: 0 }}>
                         Total: Rp{Number(order.total_amount).toLocaleString('id-ID', { style: 'decimal', maximumFractionDigits: 0 })}
                       </Text>
                     </div>

                    {order.status?.toLowerCase() === 'pending' && (
                      <Button
                        auto
                        color="gradient"
                        css={{ 
                          fontWeight: 600, 
                          background: 'linear-gradient(135deg, #800000 0%, #b91c1c 100%)',
                          color: '#fff',
                          minWidth: '120px'
                        }}
                        onClick={() => {
                          setPayOrder(order);
                          setPayAmount(order.total_amount?.toString() || '');
                          setPayFile(null);
                          setNotif(null);
                          setPayModalOpen(true);
                        }}
                      >
                        <CreditCard size={16} style={{ marginRight: '0.5rem' }} />
                        Bayar Sekarang
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        width="500px"
      >
        <Modal.Header>
          <Text id="modal-title" h4>
            Konfirmasi Pembayaran
          </Text>
        </Modal.Header>
        <Modal.Body>
          {notif && (
            <div style={{ 
              padding: '0.75rem',
              borderRadius: '8px',
              color: notif.type === 'success' ? '#065f46' : '#991b1b', 
              fontWeight: 600, 
              marginBottom: '1rem',
              background: notif.type === 'success' ? '#d1fae5' : '#fee2e2',
              border: `1px solid ${notif.type === 'success' ? '#a7f3d0' : '#fecaca'}`
            }}>
              {notif.message}
            </div>
          )}
          
          <Card css={{ padding: '1rem', marginBottom: '1rem', background: '#f8fafc' }}>
            <Text h5 style={{ color: '#800000', marginBottom: '0.5rem' }}>
              Order #{payOrder?.order_id}
            </Text>
            <Text style={{ color: '#6b7280' }}>
              Silakan transfer ke rekening berikut:
            </Text>
          </Card>

          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem',
            border: '1px solid #f59e0b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CreditCard size={20} color="#92400e" />
              <Text h6 style={{ color: '#92400e', margin: 0 }}>
                DANA
              </Text>
            </div>
            <Text style={{ color: '#92400e', fontWeight: 600 }}>
              CV.Lantana Jaya Digital
            </Text>
            <Text style={{ color: '#92400e', fontWeight: 700, fontSize: '1.1rem' }}>
              085700810752
            </Text>
          </div>

          <Spacer y={1} />
          
          <Input
            label="Nominal Pembayaran"
            // type="number"
            min={1}
            value={payAmount}
            onChange={e => setPayAmount(e.target.value)}
            fullWidth
            bordered
            placeholder="Masukkan nominal pembayaran"
            disabled
          />
          
          <Spacer y={1} />
          
          <div>
            <Text style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
              Upload Bukti Transfer
            </Text>
            <input
              type="file"
              accept="image/*"
              onChange={e => setPayFile(e.target.files?.[0] || null)}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                background: '#f9fafb'
              }}
            />
          </div>
          
          <Spacer y={1} />
          
          <Button
            auto
            onClick={async () => {
              if (!payOrder) return;
              setPayLoading(true);
              setNotif(null);
              try {
                const formData = new FormData();
                formData.append('order_id', payOrder.order_id);
                formData.append('user_id', user.user_id);
                formData.append('amount', payAmount);
                if (payFile) formData.append('bukti_transfer', payFile);
                const today = new Date().toISOString().slice(0, 10);
                formData.append('payment_method_id', '1'); // ID DANA
                formData.append('confirmation_date', today);
                formData.append('status', 'pending');
                await axiosInstance.post('/paymentconfirmations', formData);
                setNotif({ type: 'success', message: 'Pembayaran berhasil dikirim! Silakan tunggu verifikasi admin.' });
                setTimeout(() => {
                  setPayModalOpen(false);
                  setNotif(null);
                }, 1500);
              } catch (err: any) {
                setNotif({ type: 'error', message: err?.response?.data?.message || err.message || 'Gagal mengirim pembayaran' });
              } finally {
                setPayLoading(false);
              }
            }}
            disabled={payLoading}
            css={{ 
              fontWeight: 600, 
              background: 'linear-gradient(135deg, #800000 0%, #b91c1c 100%)', 
              color: '#fff',
              width: '100%'
            }}
          >
            {payLoading ? 'Mengirim...' : 'Kirim Bukti Transfer'}
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={() => setPayModalOpen(false)} disabled={payLoading}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserOrders;