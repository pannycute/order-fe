// components/Content.tsx

import React from 'react';
import { Container, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { Box } from '../styles/box';
import { axiosInstance } from '../../utils/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Icons components
const Calendar = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const TrendingUp = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
    <polyline points="16,7 22,7 22,13"/>
  </svg>
);

const DollarSign = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

interface MonthlyData {
  month: string;
  total: number;
}

export function Content() {
  const router = useRouter();
  const [todayIncome, setTodayIncome] = React.useState(0);
  const [monthIncome, setMonthIncome] = React.useState(0);
  const [totalIncome, setTotalIncome] = React.useState(0);
  const [monthlyComparison, setMonthlyComparison] = React.useState<MonthlyData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [userRole, setUserRole] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user_data');
      if (userStr) {
        try {
          setUserRole(JSON.parse(userStr).role || '');
        } catch {}
      }
    }
    setLoading(true);
    Promise.all([
      axiosInstance.get('/api/reports/omzet/monthly-comparison'),
      axiosInstance.get('/api/reports/omzet'),
      axiosInstance.get('/api/reports/omzet/today'),
      axiosInstance.get('/api/reports/omzet/month'),
    ])
      .then(([compRes, totalRes, todayRes, monthRes]) => {
        setMonthlyComparison(compRes.data.data || []);
        setTotalIncome(totalRes.data.total || 0);
        setTodayIncome(todayRes.data.total || 0);
        setMonthIncome(monthRes.data.total || 0);
      })
      .catch((err) => {
        console.error('Dashboard API Error:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box
      css={{
        minHeight: '100vh',
        width: '100%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: '2rem',
        position: 'relative',
      }}
    >
      <Container
        css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 1100,
          py: '3rem',
          '@xsMax': {
            flexDirection: 'column',
            py: '2rem',
          },
        }}
      >
        {/* Ringkasan laporan hanya untuk admin */}
        {userRole === 'admin' && (
          <>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 24,
              justifyContent: 'center',
              marginBottom: 36,
              width: '100%',
              maxWidth: 900,
              flexWrap: 'wrap',
            }}>
              {/* Pendapatan Hari Ini */}
              <div style={{
                flex: 1,
                minWidth: 220,
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 4px 24px 0 rgba(128,0,0,0.10)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                border: '1.5px solid #f3e6e6',
              }}>
                <span style={{ color: '#b91c1c', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DollarSign size={20} color="#b91c1c" /> Pendapatan Hari Ini
                </span>
                <span style={{ fontWeight: 800, fontSize: 28, color: '#16a34a', marginBottom: 4 }}>
                  Rp{todayIncome.toLocaleString('id-ID')}
                </span>
              </div>
              {/* Pendapatan Bulan Ini */}
              <div style={{
                flex: 1,
                minWidth: 220,
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 4px 24px 0 rgba(128,0,0,0.10)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                border: '1.5px solid #f3e6e6',
              }}>
                <span style={{ color: '#b91c1c', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={20} color="#b91c1c" /> Pendapatan Bulan Ini
                </span>
                <span style={{ fontWeight: 800, fontSize: 28, color: '#b91c1c', marginBottom: 4 }}>
                  Rp{monthIncome.toLocaleString('id-ID')}
                </span>
              </div>
              {/* Total Pendapatan */}
              <div style={{
                flex: 1,
                minWidth: 220,
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 4px 24px 0 rgba(128,0,0,0.10)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                border: '1.5px solid #f3e6e6',
              }}>
                <span style={{ color: '#b91c1c', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp size={20} color="#b91c1c" /> Total Pendapatan
                </span>
                <span style={{ fontWeight: 800, fontSize: 28, color: '#800000', marginBottom: 4 }}>
                  Rp{totalIncome.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <div style={{
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 2px 12px 0 rgba(128,0,0,0.07)',
              padding: 32,
              marginBottom: 32,
              width: '100%',
              maxWidth: 900,
            }}>
              <Text b size={18} css={{ color: '#800000', marginBottom: 16, display: 'block', letterSpacing: 1 }}>Grafik Pendapatan Bulanan</Text>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyComparison} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v: number) => 'Rp' + v.toLocaleString('id-ID')} />
                  <Tooltip formatter={(v: any) => 'Rp' + Number(v).toLocaleString('id-ID')} />
                  <Legend />
                  <Bar dataKey="total" fill="#800000" name="Pendapatan" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
    </Container>
    </Box>
  );
}