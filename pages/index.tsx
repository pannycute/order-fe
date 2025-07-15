import type {NextPage} from 'next';
import {useRouter} from 'next/router';
import {useState} from 'react';

const Home: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Data order bisa dari state, props, dsb.
  const orderId = 123;
  const amount = 100000;
  const customerName = 'Budi';
  const customerEmail = 'budi@email.com';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(120deg, #80000010 0%, #fff 40%, #fad7a0 70%, #fffbe6 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main Content - Landing Page */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 2rem' }}>
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
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
            
            <button
              onClick={() => router.push('/register')}
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
              Daftar Sekarang
            </button>
            
            <button
              onClick={() => router.push('/login')}
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
              Masuk
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

export default Home;
