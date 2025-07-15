import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useOrderStore } from '../stores/orderStore';
import { useOrderItemStore } from '../stores/orderItemStore';
import { useProductStore } from '../stores/productStore';
import { 
  Card, 
  Text, 
  Button, 
  Input,
  Badge,
  Spacer,
  Modal,
  useModal,
  Avatar
} from '@nextui-org/react';
import { 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List,
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { axiosInstance } from '../utils/axiosInstance';
import AddEditOrderForm from '../components/orders/AddEditForm';

const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user_data');
  return userStr ? JSON.parse(userStr) : null;
};

const Orders = () => {
  const router = useRouter();
  const orderStore = useOrderStore();
  const orderItemStore = useOrderItemStore();
  const productStore = useProductStore();
  const { setVisible, bindings } = useModal();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const currentUser = getUserFromStorage();
    if (!currentUser) {
      router.replace('/login');
      return;
    }
    setUser(currentUser);
    
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          orderStore.loadAll(1, 9999),
          orderItemStore.loadAll(1, 9999),
          productStore.loadAll(1, 9999)
        ]);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    setTimeout(() => setFadeIn(true), 100);
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
        <Text h4>Memuat data pesanan...</Text>
      </div>
    );
  }

  if (!user) return null;

  // Filter orders berdasarkan search term dan status
  const filteredOrders = orderStore.data.filter(order => {
    const matchesSearch =
      order.order_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getOrderItems(order.order_id).some(item =>
        getProductName(item.product_id).toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (order: any) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pesanan "${order.order_id}"?`)) {
      try {
        await orderStore.deleteOne(order.order_id);
        alert('Pesanan berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Gagal menghapus pesanan!');
      }
    }
  };

  const openViewModal = (order: any) => {
    setSelectedOrder(order);
    setVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'selesai':
        return 'success';
      case 'pending':
      case 'menunggu':
        return 'warning';
      case 'cancelled':
      case 'dibatalkan':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'selesai':
        return <CheckCircle size={16} />;
      case 'pending':
      case 'menunggu':
        return <Clock size={16} />;
      case 'cancelled':
      case 'dibatalkan':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'selesai':
        return 'Selesai';
      case 'pending':
      case 'menunggu':
        return 'Menunggu';
      case 'cancelled':
      case 'dibatalkan':
        return 'Dibatalkan';
      default:
        return status || 'Tidak diketahui';
    }
  };

  const formatCurrency = (amount: any) => {
    if (amount === null || amount === undefined || amount === '') {
      return 'Rp 0';
    }
    const num = Number(amount);
    if (isNaN(num)) return 'Rp 0';
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  const getOrderItems = (orderId: number) => {
    return orderItemStore.data.filter((item) => item.order_id === orderId);
  };

  const getProductName = (productId: number) => {
    const product = productStore.data.find(
      (p) => String(p.product_id) === String(productId)
    );
    return product ? product.name : 'Produk tidak ditemukan';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(120deg, #80000010 0%, #fff 40%, #fad7a0 70%, #fffbe6 100%)',
        display: 'flex',
        flexDirection: 'column',
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '2rem',
        background: 'rgba(255,255,255,0.9)',
        borderBottom: '1px solid rgba(128,0,0,0.1)',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 'bold', color: '#800000', margin: 0 }}>
                Kelola Pesanan
              </h1>
              <Text size={16} css={{ color: '#666', marginTop: '0.5rem' }}>
                Manajemen pesanan CV. Lantana Jaya Digital
              </Text>
            </div>
            
            {user.role === 'user' && (
              <AddEditOrderForm
                buttonLabel={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Tambah Pesanan
                  </div>
                }
              />
            )}
          </div>

          {/* Search and Filters */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <Input
              placeholder="Cari pesanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="lg"
              bordered
              css={{ 
                width: '300px',
                '@sm': { width: '400px' }
              }}
              contentLeft={<Search size={16} />}
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: 12,
                fontSize: 14,
                backgroundColor: 'white',
                color: '#800000',
                minWidth: '150px'
              }}
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                auto
                light
                css={{ 
                  borderRadius: 8,
                  minWidth: 'auto',
                  padding: '8px'
                }}
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                auto
                light
                css={{ 
                  borderRadius: 8,
                  minWidth: 'auto',
                  padding: '8px'
                }}
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div style={{
        flex: 1,
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {filteredOrders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#666'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <Text h4>Belum ada pesanan</Text>
              <Text size={16} css={{ color: '#999' }}>
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tidak ada pesanan yang sesuai dengan filter'
                  : 'Mulai dengan membuat pesanan baru'
                }
              </Text>
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '1.5rem',
            }}>
              {filteredOrders.map((order) => {
                const orderItems = getOrderItems(order.order_id);
                return (
                  <Card
                    key={order.order_id}
                    css={{
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: 16,
                      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px 0 rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <Card.Body>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '1rem' 
                      }}>
                        <div>
                          <Text h4 css={{ color: '#800000', margin: 0 }}>
                            #{order.order_id}
                          </Text>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#666',
                            fontSize: '14px'
                          }}>
                            <Calendar size={14} />
                            {order.order_date ? new Date(order.order_date).toLocaleDateString('id-ID') : '-'}
                          </div>
                        </div>
                        <Badge
                          color={getStatusColor(order.status)}
                          variant="flat"
                          size="sm"
                          css={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.25rem' 
                          }}
                        >
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        <DollarSign size={14} />
                        <Text size={14} css={{ color: '#666', fontWeight: 600 }}>
                          {formatCurrency(order.total_amount)}
                        </Text>
                      </div>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <Text size={14} css={{ color: '#666', marginBottom: '0.5rem' }}>
                          Produk:
                        </Text>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '0.25rem' 
                        }}>
                          {orderItems.length > 0 ? (
                            orderItems.slice(0, 3).map((item) => (
                              <div key={item.order_item_id} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                fontSize: '13px',
                                color: '#666'
                              }}>
                                <Package size={12} />
                                {getProductName(item.product_id)} x {item.quantity}
                              </div>
                            ))
                          ) : (
                            <Text size={13} css={{ color: '#999' }}>-</Text>
                          )}
                          {orderItems.length > 3 && (
                            <Text size={12} css={{ color: '#999' }}>
                              +{orderItems.length - 3} produk lainnya
                            </Text>
                          )}
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginTop: '1rem'
                      }}>
                        <Button
                          auto
                          size="sm"
                          light
                          css={{ 
                            borderRadius: 8,
                            minWidth: 'auto',
                            padding: '8px'
                          }}
                          onClick={() => openViewModal(order)}
                        >
                          <Eye size={14} />
                        </Button>
                        {(user.role === 'user' || user.role === 'admin') && (
                          <>
                            <AddEditOrderForm
                              initialData={order}
                              buttonLabel={<Edit size={14} />}
                            />
                            <Button
                              auto
                              size="sm"
                              color="error"
                              light
                              css={{ 
                                borderRadius: 8,
                                minWidth: 'auto',
                                padding: '8px'
                              }}
                              onClick={() => handleDelete(order)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {filteredOrders.map((order) => {
                const orderItems = getOrderItems(order.order_id);
                return (
                  <Card
                    key={order.order_id}
                    css={{
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: 12,
                      boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Card.Body>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <Avatar
                            text={`#${order.order_id}`}
                            size="md"
                            color="primary"
                            css={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                          />
                          <div>
                            <Text h5 css={{ color: '#800000', margin: 0 }}>
                              #{order.order_id}
                            </Text>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem',
                              marginTop: '0.25rem',
                              color: '#666',
                              fontSize: '13px'
                            }}>
                              <Calendar size={12} />
                              {order.order_date ? new Date(order.order_date).toLocaleDateString('id-ID') : '-'}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ textAlign: 'right' }}>
                            <Text size={14} css={{ color: '#666' }}>
                              Total
                            </Text>
                            <Text h6 css={{ color: '#800000', margin: 0 }}>
                              {formatCurrency(order.total_amount)}
                            </Text>
                          </div>
                          <Badge
                            color={getStatusColor(order.status)}
                            variant="flat"
                            size="sm"
                            css={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.25rem' 
                            }}
                          >
                            {getStatusIcon(order.status)}
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          gap: '0.5rem'
                        }}>
                          <Button
                            auto
                            size="sm"
                            light
                            css={{ 
                              borderRadius: 8,
                              minWidth: 'auto',
                              padding: '8px'
                            }}
                            onClick={() => openViewModal(order)}
                          >
                            <Eye size={14} />
                          </Button>
                          {(user.role === 'user' || user.role === 'admin') && (
                            <>
                              <AddEditOrderForm
                                initialData={order}
                                buttonLabel={<Edit size={14} />}
                              />
                              <Button
                                auto
                                size="sm"
                                color="error"
                                light
                                css={{ 
                                  borderRadius: 8,
                                  minWidth: 'auto',
                                  padding: '8px'
                                }}
                                onClick={() => handleDelete(order)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {orderItems.length > 0 && (
                        <div style={{ 
                          marginTop: '1rem',
                          padding: '0.75rem',
                          background: 'rgba(128,0,0,0.05)',
                          borderRadius: 8
                        }}>
                          <Text size={13} css={{ color: '#666', marginBottom: '0.5rem' }}>
                            Produk dalam pesanan:
                          </Text>
                          <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '0.5rem' 
                          }}>
                            {orderItems.map((item) => (
                              <Badge
                                key={item.order_item_id}
                                color="default"
                                variant="flat"
                                size="sm"
                              >
                                {getProductName(item.product_id)} x {item.quantity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        scroll
        width="600px"
        aria-labelledby="order-detail-modal"
        {...bindings}
      >
        <Modal.Header>
          <Text id="order-detail-modal" size={18}>
            Detail Pesanan #{selectedOrder?.order_id}
          </Text>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(128,0,0,0.05)',
                borderRadius: 8
              }}>
                <div>
                  <Text size={14} css={{ color: '#666' }}>ID Pesanan</Text>
                  <Text h6 css={{ color: '#800000', margin: 0 }}>#{selectedOrder.order_id}</Text>
                </div>
                <div>
                  <Text size={14} css={{ color: '#666' }}>Status</Text>
                  <Badge
                    color={getStatusColor(selectedOrder.status)}
                    variant="flat"
                    size="sm"
                    css={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      marginTop: '0.25rem'
                    }}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusLabel(selectedOrder.status)}
                  </Badge>
                </div>
                <div>
                  <Text size={14} css={{ color: '#666' }}>Tanggal Pesanan</Text>
                  <Text h6 css={{ color: '#800000', margin: 0 }}>
                    {selectedOrder.order_date ? new Date(selectedOrder.order_date).toLocaleDateString('id-ID') : '-'}
                  </Text>
                </div>
                <div>
                  <Text size={14} css={{ color: '#666' }}>Total Amount</Text>
                  <Text h6 css={{ color: '#800000', margin: 0 }}>
                    {formatCurrency(selectedOrder.total_amount)}
                  </Text>
                </div>
              </div>
              
              <div>
                <Text h6 css={{ color: '#800000', marginBottom: '0.5rem' }}>
                  Produk dalam Pesanan
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {getOrderItems(selectedOrder.order_id).map((item) => (
                    <div
                      key={item.order_item_id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: 8,
                        border: '1px solid rgba(128,0,0,0.1)'
                      }}
                    >
                      <div>
                        <Text size={14} css={{ color: '#800000', fontWeight: 600 }}>
                          {getProductName(item.product_id)}
                        </Text>
                        <Text size={12} css={{ color: '#666' }}>
                          Quantity: {item.quantity}
                        </Text>
                      </div>
                      <Text size={14} css={{ color: '#800000', fontWeight: 600 }}>
                        {formatCurrency(item.subtotal || 0)}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={() => setVisible(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orders;
