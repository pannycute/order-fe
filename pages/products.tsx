import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useProductStore } from '../stores/productStore';
import { 
  Card, 
  Text, 
  Button, 
  Input,
  Badge,
  Modal,
  useModal
} from '@nextui-org/react';
import { 
  Plus, 
  Search, 
  Filter,
  Package,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List
} from 'lucide-react';
import { axiosInstance } from '../utils/axiosInstance';
import AddEditProductForm from "../components/products/AddEditForm";

const getAdminFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user_data');
  return userStr ? JSON.parse(userStr) : null;
};

// Fungsi untuk format currency
const formatCurrency = (amount: number) => {
  if (!amount || isNaN(amount)) return 'Rp0';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Products = () => {
  const router = useRouter();
  const productStore = useProductStore();
  
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const adminUser = getAdminFromStorage();
    if (!adminUser || adminUser.role !== 'admin') {
      router.replace('/');
      return;
    }
    setAdmin(adminUser);
    
    const loadData = async () => {
      try {
        setLoading(true);
        await productStore.loadAll(1, 9999);
      } catch (error) {
        console.error('Error loading products:', error);
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
        <Text h4>Memuat produk...</Text>
      </div>
    );
  }

  if (!admin) return null;

  // Filter products berdasarkan search term
  const filteredProducts = productStore.data.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (product: any) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
      try {
        await productStore.deleteOne(product.product_id);
        alert('Produk berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus produk!');
      }
    }
  };

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setVisible(true);
  };
  const openAddModal = () => {
    setSelectedProduct(null);
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
                Kelola Produk
              </h1>
              <Text size={16} css={{ color: '#666', marginTop: '0.5rem' }}>
                Manajemen produk CV. Lantana Jaya Digital
              </Text>
            </div>
            
            <Button
              auto
              color="gradient"
              css={{ 
                background: 'linear-gradient(135deg, #800000 0%, #b91c1c 100%)',
                fontWeight: 600,
                borderRadius: 12,
                padding: '12px 24px'
              }}
              onClick={openAddModal}
            >
              <Plus size={20} style={{ marginRight: '0.5rem' }} />
              Tambah Produk
            </Button>
          </div>

          {/* Search and Filters */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <Input
              placeholder="Cari produk..."
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

      {/* Products Content */}
      <div style={{
        flex: 1,
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {viewMode === 'grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}>
              {filteredProducts.map((product) => (
                <Card
                  key={product.product_id}
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
                    <div style={{ marginBottom: '1rem' }}>
                      <Text h4 css={{ color: '#800000', marginBottom: '0.5rem' }}>
                        {product.name}
                      </Text>
                      <Text size={14} css={{ color: '#666', lineHeight: 1.5 }}>
                        {product.description || 'Tidak ada deskripsi'}
                      </Text>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <Text size={20} css={{ color: '#16a34a', fontWeight: 800 }}>
                        {formatCurrency(product.price)}
                      </Text>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                    }}>
                      <Badge
                        color={product.stock > 20 ? 'success' : product.stock > 10 ? 'warning' : 'error'}
                        variant="flat"
                      >
                        Stok: {product.stock}
                      </Badge>
                      
                      {product.duration && (
                        <Badge color="primary" variant="flat">
                          {product.duration} Bulan
                        </Badge>
                      )}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                    }}>
                      <Button
                        auto
                        size="sm"
                        light
                        color="primary"
                        onClick={() => openEditModal(product)}
                        css={{ flex: 1 }}
                      >
                        <Edit size={16} style={{ marginRight: '0.25rem' }} />
                        Edit
                      </Button>
                      <Button
                        auto
                        size="sm"
                        light
                        color="error"
                        onClick={() => handleDelete(product)}
                        css={{ flex: 1 }}
                      >
                        <Trash2 size={16} style={{ marginRight: '0.25rem' }} />
                        Hapus
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Card css={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 16,
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            }}>
              <Card.Body>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: '1px solid #e0e0e0',
                  fontWeight: 600,
                  color: '#800000',
                }}>
                  <div>Nama Produk</div>
                  <div>Harga</div>
                  <div>Stok</div>
                  <div>Aksi</div>
                </div>
                
                {filteredProducts.map((product) => (
                  <div
                    key={product.product_id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr',
                      gap: '1rem',
                      padding: '1rem',
                      borderBottom: '1px solid #f0f0f0',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <Text b css={{ color: '#800000' }}>{product.name}</Text>
                      <Text size={12} css={{ color: '#666' }}>
                        {product.description || 'Tidak ada deskripsi'}
                      </Text>
                    </div>
                    <div>
                      <Text css={{ color: '#16a34a', fontWeight: 600 }}>
                        {formatCurrency(product.price)}
                      </Text>
                    </div>
                    <div>
                      <Badge
                        color={product.stock > 20 ? 'success' : product.stock > 10 ? 'warning' : 'error'}
                        variant="flat"
                      >
                        {product.stock}
                      </Badge>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        auto
                        size="sm"
                        light
                        color="primary"
                        onClick={() => openEditModal(product)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        auto
                        size="sm"
                        light
                        color="error"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
          
          {filteredProducts.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#666',
            }}>
              <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <Text h4>Belum ada produk</Text>
              <Text size={14}>Mulai dengan menambahkan produk pertama Anda</Text>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Product Modal */}
      <Modal
        open={visible}
        onClose={() => setVisible(false)}
        width="600px"
        aria-labelledby="modal-title"
      >
        <Modal.Body>
          <AddEditProductForm
            initialData={selectedProduct}
            buttonLabel={null}
          />
        </Modal.Body>
      </Modal>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.8)',
        borderTop: '1px solid rgba(128,0,0,0.1)',
      }}>
        <p style={{ color: '#800000', margin: 0, fontSize: '14px' }}>
          &copy; 2024 CV. Lantana Jaya Digital. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Products;
