import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useOrderStore } from '../stores/orderStore';
import { useOrderItemStore } from '../stores/orderItemStore';
import { useProductStore } from '../stores/productStore';
import { useUserStore } from '../stores/userStore';
import { 
  Card, 
  Text, 
  Button, 
  Spacer
} from '@nextui-org/react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react';
import { axiosInstance } from '../utils/axiosInstance';

const getAdminFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user_data');
  return userStr ? JSON.parse(userStr) : null;
};

const AdminDashboard = () => {
  const router = useRouter();
  const orderStore = useOrderStore();
  const orderItemStore = useOrderItemStore();
  const productStore = useProductStore();
  const userStore = useUserStore();
  
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
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
        // await Promise.all([
        //   orderStore.loadAll(1, 9999),
        //   orderItemStore.loadAll(1, 9999),
        //   productStore.loadAll(1, 9999),
        //   userStore.loadAll(1, 9999),
        // ]);
      } catch (error) {
        console.error('Error loading data:', error);
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
        <div style={{ fontSize: '2rem' }}>⚙️</div>
        <Text h4>Memuat dashboard...</Text>
      </div>
    );
  }

  if (!admin) return null;

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
      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 2rem' }}>
        <div
          style={{
        display: 'flex',
        flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 1200,
            width: '100%',
            padding: '3rem 0',
          }}
        >
          <div style={{ flex: 1, color: '#800000', paddingRight: '2rem' }}>
            <h1 style={{ fontSize: 44, fontWeight: 'bold', marginBottom: '1rem', color: '#800000', lineHeight: 1.1 }}>
              Dashboard Admin
            </h1>
            <div style={{ fontSize: 22, marginBottom: '1.2rem', color: '#B22222' }}>
              Kelola Sistem & Pantau Performa Bisnis
            </div>
            <div style={{ fontSize: 16, marginBottom: '2rem', color: '#A93226' }}>
              Selamat datang di panel admin CV. Lantana Jaya Digital. Kelola produk, pantau pesanan, dan analisis performa bisnis Anda dengan mudah. Akses semua fitur manajemen dalam satu dashboard yang terintegrasi.
            </div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
            
            <button
              onClick={() => router.push('/admin-reports')}
              style={{
                padding: '1rem 2.5rem',
                background: 'linear-gradient(90deg, #800000cc 0%, #B22222cc 100%)',
                color: '#fffbe6',
                border: 'none',
                borderRadius: '15px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px 0 rgba(128,0,0,0.15)',
                minWidth: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 30px 0 rgba(128,0,0,0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(128,0,0,0.15)';
              }}
            >
              <BarChart3 size={20} />
              Lihat Laporan
            </button>
            
            <button
              onClick={() => router.push('/products')}
              style={{
                padding: '1rem 2.5rem',
                background: 'transparent',
                color: '#800000',
                border: '2px solid #800000',
                borderRadius: '15px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '200px',
                display: 'flex',
                alignItems: 'center',
        justifyContent: 'center',
                gap: '0.5rem',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#800000';
                e.currentTarget.style.color = '#fffbe6';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#800000';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Package size={20} />
              Kelola Produk
            </button>
          </div>
        </div>
      </main>

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

export default AdminDashboard; 