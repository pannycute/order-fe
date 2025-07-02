import { useEffect, useState } from 'react';
import { Container, Text, Card } from '@nextui-org/react';

export default function UserDashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
        }
      }
    }
    setTimeout(() => setFadeIn(true), 100);
  }, []);

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
        width: '100vw',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        css={{
          p: '2.2rem 3rem',
          maxWidth: 700,
          w: '100%',
          borderRadius: '22px',
          background: '#fff',
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.08)',
          border: '1px solid #eee',
          transition: 'opacity 0.7s',
          opacity: fadeIn ? 1 : 0,
        }}
      >
        <Container css={{ textAlign: 'center', px: 0 }}>
          <Text h1 size={24} css={{ mb: '1.2rem', fontWeight: 800, color: '#800000', fontFamily: 'Poppins, Montserrat, Inter, Arial, sans-serif', letterSpacing: '0.5px' }}>
            Selamat Datang, <Text span css={{ color: '#800000', fontWeight: 900 }}>{user?.name || 'User'}</Text>
          </Text>
          <Text size={15} css={{ color: '#22223b', lineHeight: 1.7, textAlign: 'justify', fontFamily: 'Poppins, Montserrat, Inter, Arial, sans-serif' }}>
            CV. Lantana Jaya Digital didirikan pada tahun 2023 untuk menyediakan solusi teknologi digital yang mudah diakses dan terjangkau, khususnya dalam pengembangan website. Perusahaan ini hadir untuk membantu usaha kecil dan menengah membangun kehadiran online yang kuat dan andal. Didirikan oleh tiga individu dengan visi yang sama, CV. Lantana Jaya Digital berkomitmen menjadi mitra terpercaya dalam menghadirkan inovasi teknologi di berbagai sektor. Layanan utama meliputi pembuatan, jual beli, dan sewa website siap pakai, sehingga memudahkan klien memiliki platform digital secara praktis dan efisien. Dengan tim yang berpengalaman dan fokus pada kualitas, CV. Lantana Jaya Digital terus berkembang dan menjadi pilihan utama bagi banyak perusahaan di Indonesia.
          </Text>
        </Container>
      </Card>
    </div>
  );
} 