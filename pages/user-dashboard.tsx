import { useEffect, useState } from 'react';
import { Container, Text, Card, Grid, Button } from '@nextui-org/react';
import { useProductStore } from '../stores/productStore';

export default function UserDashboard() {
  const [fadeIn, setFadeIn] = useState(false);
  const { data: products, loadAll, loading, error } = useProductStore();
  const [user, setUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user_data');
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
        }
      }
    }
    setTimeout(() => setFadeIn(true), 100);
    loadAll(1, 100); // fetch up to 100 products
  }, [loadAll]);

  // Ambil inisial dari nama user
  const getInitials = (name?: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || '';
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(120deg, #80000010 0%, #fff 40%, #fad7a0 70%, #fffbe6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1100,
          width: '100%',
          padding: '3rem 0',
        }}
      >
        <div style={{ flex: 1, color: '#800000', paddingRight: '2rem' }}>
          <h1 style={{ fontSize: 44, fontWeight: 'bold', marginBottom: '1rem', color: '#800000', lineHeight: 1.1 }}>
            Sewa Website Siap Pakai
          </h1>
          <div style={{ fontSize: 22, marginBottom: '1.2rem', color: '#B22222' }}>
            Solusi Mudah & Praktis untuk Bisnis Online Anda
          </div>
          <div style={{ fontSize: 16, marginBottom: '2rem', color: '#A93226' }}>
            CV. Lantana Jaya Digital menyediakan layanan sewa website siap pakai untuk UMKM, startup, dan bisnis Anda. Proses cepat, tanpa biaya pembuatan mahal, website langsung aktif dan siap digunakan. Cocok untuk yang ingin tampil online secara instan, profesional, dan terpercaya.
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Kosongkan sisi kanan, bisa diisi gambar jika diinginkan */}
        </div>
      </div>
    </div>
  );
} 