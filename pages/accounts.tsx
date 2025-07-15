import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserStore } from '../stores/userStore';
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
  Edit,
  Trash2,
  Grid3X3,
  List,
  Phone
} from 'lucide-react';
import { axiosInstance } from '../utils/axiosInstance';
import AddEditUserForm from "../components/accounts/AddEditUserForm";

const getAdminFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user_data');
  return userStr ? JSON.parse(userStr) : null;
};

const Accounts = () => {
  const router = useRouter();
  const userStore = useUserStore();
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
        await userStore.loadAll(1, 9999);
      } catch (error) {
        console.error('Error loading users:', error);
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
        <div style={{ fontSize: '2rem' }}>👥</div>
        <Text h4>Memuat data pengguna...</Text>
      </div>
    );
  }

  if (!admin) return null;

  // Filter users berdasarkan search term dan role
  const filteredUsers = userStore.data.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });



  const handleDelete = async (user: any) => {
    if (user.user_id === admin.user_id) {
      alert('Anda tidak dapat menghapus akun sendiri!');
      return;
    }
    
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.name}"?`)) {
      try {
        await userStore.deleteOne(user.user_id);
        alert('Pengguna berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Gagal menghapus pengguna!');
      }
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setVisible(true);
  };
  const openAddModal = () => {
    setSelectedUser(null);
    setVisible(true);
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || '';
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'user': return 'primary';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'user': return 'Pengguna';
      default: return role;
    }
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
                Kelola Pengguna
              </h1>
              <Text size={16} css={{ color: '#666', marginTop: '0.5rem' }}>
                Manajemen akun pengguna CV. Lantana Jaya Digital
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
              Tambah Pengguna
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
              placeholder="Cari pengguna..."
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
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
              <option value="all">Semua Role</option>
              <option value="admin">Administrator</option>
              <option value="user">Pengguna</option>
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

      {/* Users Content */}
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem',
            }}>
              {filteredUsers.map((user) => (
                <Card
                  key={user.user_id}
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
                      alignItems: 'center', 
                      gap: '1rem',
                      marginBottom: '1rem' 
                    }}>
                      <Avatar
                        text={getInitials(user.name)}
                        size="lg"
                        color={user.role === 'admin' ? 'error' : 'primary'}
                        css={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                      />
                      <div style={{ flex: 1 }}>
                        <Text h4 css={{ color: '#800000', margin: 0 }}>
                          {user.name}
                        </Text>
                        <Text size={14} css={{ color: '#666' }}>
                          {user.email}
                        </Text>
                      </div>
                      <Badge
                        color={getRoleColor(user.role)}
                        variant="flat"
                        size="sm"
                      >
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                    
                    {user.phone && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        <Phone size={14} />
                        {user.phone}
                      </div>
                    )}
                    
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '1rem',
                    }}>
                      <Button
                        auto
                        size="sm"
                        light
                        color="primary"
                        onClick={() => openEditModal(user)}
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
                        onClick={() => handleDelete(user)}
                        css={{ flex: 1 }}
                        disabled={user.user_id === admin.user_id}
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
                  gridTemplateColumns: '2fr 1fr 1fr',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: '1px solid #e0e0e0',
                  fontWeight: 600,
                  color: '#800000',
                }}>
                  <div>Nama & Email</div>
                  <div>Role</div>
                  <div>Aksi</div>
                </div>
                
                {filteredUsers.map((user) => (
                  <div
                    key={user.user_id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr',
                      gap: '1rem',
                      padding: '1rem',
                      borderBottom: '1px solid #f0f0f0',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Avatar
                        text={getInitials(user.name)}
                        size="sm"
                        color={user.role === 'admin' ? 'error' : 'primary'}
                      />
                      <div>
                        <Text b css={{ color: '#800000' }}>{user.name}</Text>
                        <Text size={12} css={{ color: '#666' }}>
                          {user.email}
                        </Text>
                      </div>
                    </div>
                    <div>
                      <Badge
                        color={getRoleColor(user.role)}
                        variant="flat"
                      >
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        auto
                        size="sm"
                        light
                        color="primary"
                        onClick={() => openEditModal(user)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        auto
                        size="sm"
                        light
                        color="error"
                        onClick={() => handleDelete(user)}
                        disabled={user.user_id === admin.user_id}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
          
          {filteredUsers.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#666',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.5 }}>👥</div>
              <Text h4>Belum ada pengguna</Text>
              <Text size={14}>Mulai dengan menambahkan pengguna pertama</Text>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add User Modal */}
      <Modal
        open={visible}
        onClose={() => setVisible(false)}
        width="600px"
        aria-labelledby="modal-title"
      >
        <Modal.Body>
          <AddEditUserForm
            initialData={selectedUser}
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

export default Accounts;