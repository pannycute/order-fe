import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useOrderItemStore } from '../stores/orderItemStore';
import { useOrderStore } from '../stores/orderstore';
import { useProductStore } from '../stores/productStore';
import { 
  Card, 
  Text, 
  Button, 
  Input,
  Badge,
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
  Package,
  ShoppingCart,
  Hash,
  DollarSign,
  Calculator,
  TrendingUp
} from 'lucide-react';
import { axiosInstance } from '../utils/axiosInstance';
import AddEditOrderItemForm from '../components/orderitems/AddEditForm';

const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user_data');
  return userStr ? JSON.parse(userStr) : null;
};

const OrderItems = () => {
  const router = useRouter();
  const orderItemStore = useOrderItemStore();
  const orderStore = useOrderStore();
  const productStore = useProductStore();
  const { setVisible, bindings } = useModal();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<any>(null);
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
        await orderItemStore.loadAll(1, 9999)
        await orderStore.loadAll(1, 9999)
        await productStore.loadAll(1, 9999)
      } catch (error) {
        console.error('Error loading order items:', error);
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
        <Text h4>Memuat data item pesanan...</Text>
      </div>
    );
  }

  if (!user) return null;

  // Filter order items berdasarkan search term dan order
  const filteredOrderItems = orderItemStore.data.filter(item => {
    const matchesSearch = item.order_item_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.order_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getProductName(item.product_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrder = orderFilter === 'all' || item.order_id?.toString() === orderFilter;
    return matchesSearch && matchesOrder;
  });

  const handleDelete = async (item: any) => {
    if (confirm(`Apakah Anda yakin ingin menghapus item pesanan "${item.order_item_id}"?`)) {
      try {
        await orderItemStore.deleteOne(item.order_item_id);
        alert('Item pesanan berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting order item:', error);
        alert('Gagal menghapus item pesanan!');
      }
    }
  };

  const openViewModal = (item: any) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const formatCurrency = (amount: any) => {
    if (amount === null || amount === undefined || amount === '') {
      return 'Rp 0';
    }
    const num = Number(amount);
    if (isNaN(num)) return 'Rp 0';
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  const getProductName = (productId: number) => {
    const product = productStore.data.find((p) => p.product_id === productId);
    return product ? product.name : 'Produk tidak ditemukan';
  };

  const getOrderInfo = (orderId: number) => {
    const order = orderStore.data.find((o) => o.order_id === orderId);
    return order ? {
      order_id: order.order_id,
      order_date: order.order_date,
      status: order.status
    } : null;
  };

  const getOrderStatusColor = (status: string) => {
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

  const getOrderStatusLabel = (status: string) => {
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

  // Get unique orders for filter dropdown
  const uniqueOrders = Array.from(new Set(orderStore.data.map(order => order.order_id))).sort((a, b) => a - b);

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
                Kelola Item Pesanan
              </h1>
              <Text size={16} css={{ color: '#666', marginTop: '0.5rem' }}>
                Manajemen item pesanan CV. Lantana Jaya Digital
              </Text>
            </div>
            
            <AddEditOrderItemForm
              buttonLabel={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={20} />
                  Tambah Item
                </div>
              }
            />
          </div>

          {/* Search and Filters */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <Input
              placeholder="Cari item pesanan..."
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
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
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
              <option value="all">Semua Pesanan</option>
              {uniqueOrders.map(orderId => (
                <option key={orderId} value={orderId.toString()}>
                  Pesanan #{orderId}
                </option>
              ))}
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

      {/* Order Items Content */}
      <div style={{
        flex: 1,
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {filteredOrderItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#666'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <Text h4>Belum ada item pesanan</Text>
              <Text size={16} css={{ color: '#999' }}>
                {searchTerm || orderFilter !== 'all' 
                  ? 'Tidak ada item yang sesuai dengan filter'
                  : 'Mulai dengan menambahkan item pesanan baru'
                }
              </Text>
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '1.5rem',
            }}>
              {filteredOrderItems.map((item) => {
                const orderInfo = getOrderInfo(item.order_id);
                return (
                  <Card
                    key={item.order_item_id}
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
                            #{item.order_item_id}
                          </Text>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#666',
                            fontSize: '14px'
                          }}>
                            <ShoppingCart size={14} />
                            Pesanan #{item.order_id}
                          </div>
                        </div>
                        {orderInfo && (
                          <Badge
                            color={getOrderStatusColor(orderInfo.status)}
                            variant="flat"
                            size="sm"
                          >
                            {getOrderStatusLabel(orderInfo.status)}
                          </Badge>
                        )}
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        <Package size={14} />
                        <Text size={14} css={{ color: '#666', fontWeight: 600 }}>
                          {getProductName(item.product_id)}
                        </Text>
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <Text size={12} css={{ color: '#666' }}>Quantity</Text>
                          <Text size={16} css={{ color: '#800000', fontWeight: 600 }}>
                            {item.quantity}
                          </Text>
                        </div>
                        <div>
                          <Text size={12} css={{ color: '#666' }}>Harga Satuan</Text>
                          <Text size={16} css={{ color: '#800000', fontWeight: 600 }}>
                            {formatCurrency(item.unit_price)}
                          </Text>
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        background: 'rgba(128,0,0,0.05)',
                        borderRadius: 8
                      }}>
                        <Calculator size={14} />
                        <Text size={14} css={{ color: '#666' }}>Subtotal:</Text>
                        <Text size={16} css={{ color: '#800000', fontWeight: 700 }}>
                          {formatCurrency(item.subtotal)}
                        </Text>
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
                          onClick={() => openViewModal(item)}
                        >
                          <Eye size={14} />
                        </Button>
                        <AddEditOrderItemForm
                          initialData={item}
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
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 size={14} />
                        </Button>
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
              {filteredOrderItems.map((item) => {
                const orderInfo = getOrderInfo(item.order_id);
                return (
                  <Card
                    key={item.order_item_id}
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
                            text={`#${item.order_item_id}`}
                            size="md"
                            color="primary"
                            css={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                          />
                          <div>
                            <Text h5 css={{ color: '#800000', margin: 0 }}>
                              #{item.order_item_id}
                            </Text>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem',
                              marginTop: '0.25rem',
                              color: '#666',
                              fontSize: '13px'
                            }}>
                              <ShoppingCart size={12} />
                              Pesanan #{item.order_id}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ textAlign: 'center' }}>
                            <Text size={12} css={{ color: '#666' }}>
                              Quantity
                            </Text>
                            <Text h6 css={{ color: '#800000', margin: 0 }}>
                              {item.quantity}
                            </Text>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <Text size={12} css={{ color: '#666' }}>
                              Harga Satuan
                            </Text>
                            <Text h6 css={{ color: '#800000', margin: 0 }}>
                              {formatCurrency(item.unit_price)}
                            </Text>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <Text size={12} css={{ color: '#666' }}>
                              Subtotal
                            </Text>
                            <Text h6 css={{ color: '#800000', margin: 0 }}>
                              {formatCurrency(item.subtotal)}
                            </Text>
                          </div>
                          {orderInfo && (
                            <Badge
                              color={getOrderStatusColor(orderInfo.status)}
                              variant="flat"
                              size="sm"
                            >
                              {getOrderStatusLabel(orderInfo.status)}
                            </Badge>
                          )}
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
                            onClick={() => openViewModal(item)}
                          >
                            <Eye size={14} />
                          </Button>
                          <AddEditOrderItemForm
                            initialData={item}
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
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div style={{ 
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: 'rgba(128,0,0,0.05)',
                        borderRadius: 8
                      }}>
                        <Text size={13} css={{ color: '#666', marginBottom: '0.5rem' }}>
                          Produk:
                        </Text>
                        <Text size={14} css={{ color: '#800000', fontWeight: 600 }}>
                          {getProductName(item.product_id)}
                        </Text>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Item Detail Modal */}
      <Modal
        scroll
        width="600px"
        aria-labelledby="order-item-detail-modal"
        {...bindings}
      >
        <Modal.Header>
          <Text id="order-item-detail-modal" size={18}>
            Detail Item Pesanan #{selectedItem?.order_item_id}
          </Text>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
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
                  <Text size={14} css={{ color: '#666' }}>ID Item</Text>
                  <Text h6 css={{ color: '#800000', margin: 0 }}>#{selectedItem.order_item_id}</Text>
                </div>
                <div>
                  <Text size={14} css={{ color: '#666' }}>ID Pesanan</Text>
                  <Text h6 css={{ color: '#800000', margin: 0 }}>#{selectedItem.order_id}</Text>
                </div>
                <div>
                  <Text size={14} css={{ color: '#666' }}>Quantity</Text>
                  <Text h6 css={{ color: '#800000', margin: 0 }}>{selectedItem.quantity}</Text>
                </div>
                <div>
                  <Text size={14} css={{ color: '#666' }}>Harga Satuan</Text>
                  <Text h6 css={{ color: '#800000', margin: 0 }}>
                    {formatCurrency(selectedItem.unit_price)}
                  </Text>
                </div>
              </div>
              
              <div>
                <Text h6 css={{ color: '#800000', marginBottom: '0.5rem' }}>
                  Produk
                </Text>
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: 8,
                  border: '1px solid rgba(128,0,0,0.1)'
                }}>
                  <Text size={16} css={{ color: '#800000', fontWeight: 600 }}>
                    {getProductName(selectedItem.product_id)}
                  </Text>
                </div>
              </div>
              
              <div>
                <Text h6 css={{ color: '#800000', marginBottom: '0.5rem' }}>
                  Informasi Pesanan
                </Text>
                {(() => {
                  const orderInfo = getOrderInfo(selectedItem.order_id);
                  return orderInfo ? (
                    <div style={{
                      padding: '1rem',
                      background: 'rgba(255,255,255,0.8)',
                      borderRadius: 8,
                      border: '1px solid rgba(128,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <Text size={14} css={{ color: '#666' }}>Status Pesanan:</Text>
                        <Badge
                          color={getOrderStatusColor(orderInfo.status)}
                          variant="flat"
                          size="sm"
                        >
                          {getOrderStatusLabel(orderInfo.status)}
                        </Badge>
                      </div>
                      <Text size={14} css={{ color: '#666' }}>
                        Tanggal: {orderInfo.order_date ? new Date(orderInfo.order_date).toLocaleDateString('id-ID') : '-'}
                      </Text>
                    </div>
                  ) : (
                    <Text size={14} css={{ color: '#999' }}>Informasi pesanan tidak tersedia</Text>
                  );
                })()}
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, #800000 0%, #b91c1c 100%)',
                borderRadius: 8,
                color: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text size={16} css={{ color: 'white', fontWeight: 600 }}>
                    Total Subtotal
                  </Text>
                  <Text size={20} css={{ color: 'white', fontWeight: 700 }}>
                    {formatCurrency(selectedItem.subtotal)}
                  </Text>
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

export default OrderItems;