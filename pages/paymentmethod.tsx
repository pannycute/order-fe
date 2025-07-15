import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { usePaymentMethodStore } from '../stores/paymentmethodStore';
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
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List,
  CreditCard,
  Info
} from 'lucide-react';
import AddEditPaymentMethodForm from '../components/paymentmethods/AddEditForm.tsx';

const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user_data');
  return userStr ? JSON.parse(userStr) : null;
};

const PaymentMethods = () => {
  const router = useRouter();
  const paymentMethodStore = usePaymentMethodStore();
  const { setVisible, bindings } = useModal();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
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
        await paymentMethodStore.loadAll(1, 9999);
      } catch (error) {
        console.error('Error loading payment methods:', error);
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
        <div style={{ fontSize: '2rem' }}>💳</div>
        <Text h4>Memuat data metode pembayaran...</Text>
      </div>
    );
  }

  if (!user) return null;

  // Filter payment methods berdasarkan search term
  const filteredMethods = paymentMethodStore.data.filter(method => {
    const matchesSearch = method.method_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.details?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (method: any) => {
    if (confirm(`Apakah Anda yakin ingin menghapus metode pembayaran "${method.method_name}"?`)) {
      try {
        await paymentMethodStore.deleteOne(method.payment_method_id);
        alert('Metode pembayaran berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting payment method:', error);
        alert('Gagal menghapus metode pembayaran!');
      }
    }
  };

  const openViewModal = (method: any) => {
    setSelectedMethod(method);
    setVisible(true);
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
                Kelola Metode Pembayaran
              </h1>
              <Text size={16} css={{ color: '#666', marginTop: '0.5rem' }}>
                Manajemen metode pembayaran CV. Lantana Jaya Digital
              </Text>
            </div>

            <AddEditPaymentMethodForm
              buttonLabel={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={20} />
                  Tambah Metode
                </div>
              }
            />
          </div>

          {/* Search and View Toggle */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <Input
              placeholder="Cari metode pembayaran..."
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

      {/* Payment Methods Content */}
      <div style={{
        flex: 1,
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {filteredMethods.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#666'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💳</div>
              <Text h4>Belum ada metode pembayaran</Text>
              <Text size={16} css={{ color: '#999' }}>
                {searchTerm
                  ? 'Tidak ada metode yang sesuai dengan pencarian'
                  : 'Mulai dengan menambahkan metode pembayaran baru'
                }
              </Text>
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '1.5rem',
            }}>
              {filteredMethods.map((method) => (
                <Card
                  key={method.payment_method_id}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <CreditCard size={24} color="#800000" />
                        <Text h4 css={{ color: '#800000', margin: 0 }}>
                          {method.method_name}
                        </Text>
                      </div>
                      <Badge color="primary" variant="flat" size="sm">
                        ID #{method.payment_method_id}
                      </Badge>
                    </div>
                    <Text size={14} css={{ color: '#666', marginBottom: '1rem' }}>
                      {method.details || <span style={{ color: '#bbb' }}>Tidak ada detail</span>}
                    </Text>
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
                        onClick={() => openViewModal(method)}
                      >
                        <Eye size={14} />
                      </Button>
                      <AddEditPaymentMethodForm
                        initialData={method}
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
                        onClick={() => handleDelete(method)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {filteredMethods.map((method) => (
                <Card
                  key={method.payment_method_id}
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
                          icon={<CreditCard size={18} color="#800000" />}
                          size="md"
                          color="primary"
                          css={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                        />
                        <div>
                          <Text h5 css={{ color: '#800000', margin: 0 }}>
                            {method.method_name}
                          </Text>
                          <Text size={13} css={{ color: '#666' }}>
                            ID #{method.payment_method_id}
                          </Text>
                        </div>
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
                          onClick={() => openViewModal(method)}
                        >
                          <Eye size={14} />
                        </Button>
                        <AddEditPaymentMethodForm
                          initialData={method}
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
                          onClick={() => handleDelete(method)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <Text size={14} css={{ color: '#666', marginTop: '0.5rem' }}>
                      {method.details || <span style={{ color: '#bbb' }}>Tidak ada detail</span>}
                    </Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Method Detail Modal */}
      <Modal
        scroll
        width="500px"
        aria-labelledby="payment-method-detail-modal"
        {...bindings}
      >
        <Modal.Header>
          <Text id="payment-method-detail-modal" size={18}>
            Detail Metode Pembayaran
          </Text>
        </Modal.Header>
        <Modal.Body>
          {selectedMethod && (
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
                  <Text size={14} css={{ color: '#666' }}>ID</Text>
                  <Text h6 css={{ color: '#800000', margin: 0 }}>#{selectedMethod.payment_method_id}</Text>
                </div>
                <div>
                  <Text size={14} css={{ color: '#666' }}>Nama Metode</Text>
                  <Text h6 css={{ color: '#800000', margin: 0 }}>{selectedMethod.method_name}</Text>
                </div>
              </div>
              <div>
                <Text h6 css={{ color: '#800000', marginBottom: '0.5rem' }}>
                  Detail
                </Text>
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: 8,
                  border: '1px solid rgba(128,0,0,0.1)'
                }}>
                  <Text size={16} css={{ color: '#800000', fontWeight: 600 }}>
                    {selectedMethod.details || 'Tidak ada detail'}
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

export default PaymentMethods;