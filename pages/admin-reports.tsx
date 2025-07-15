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
  Input, 
  Badge, 
  Spacer,
  Progress,
  Divider
} from '@nextui-org/react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar,
  Filter,
  Download,
  BarChart3,
  FileText
} from 'lucide-react';
import { axiosInstance } from '../utils/axiosInstance';

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

// Fungsi untuk format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const AdminReports = () => {
  const router = useRouter();
  const orderStore = useOrderStore();
  const orderItemStore = useOrderItemStore();
  const productStore = useProductStore();
  const userStore = useUserStore();
  
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
        // Load semua data tanpa limit untuk laporan
        //await Promise.all([
          //orderStore.loadAll(1, 9999), // Ambil semua data
          //orderItemStore.loadAll(1, 9999),
          //productStore.loadAll(1, 9999),
          //userStore.loadAll(1, 9999),
        //]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
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
        <div style={{ fontSize: '2rem' }}>📊</div>
        <Text h4>Memuat laporan...</Text>
      </div>
    );
  }

  if (!admin) return null;

  // Tampilkan pesan jika tidak ada data
  if (orderStore.data.length === 0 && !orderStore.loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '2rem' }}>📊</div>
        <Text h4>Tidak ada data pesanan</Text>
        <Text size={14} css={{ color: '#666' }}>
          Belum ada pesanan yang tercatat dalam sistem.
        </Text>
      </div>
    );
  }

  // Filter orders berdasarkan kriteria
  const filteredOrders = orderStore.data.filter(order => {
    const orderDate = new Date(order.order_date);
    const filterDateObj = filterDate ? new Date(filterDate) : null;
    
    const dateMatch = !filterDate || 
      orderDate.getFullYear() === filterDateObj?.getFullYear() &&
      orderDate.getMonth() === filterDateObj?.getMonth() &&
      orderDate.getDate() === filterDateObj?.getDate();
    
    const statusMatch = filterStatus === 'all' || order.status === filterStatus;
    
    return dateMatch && statusMatch;
  });

  // Hitung statistik - gunakan semua data untuk statistik umum
  const allOrders = orderStore.data;
  const totalRevenue = allOrders.reduce((sum, order) => {
    const amount = Number(order.total_amount) || 0;
    return sum + amount;
  }, 0);
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(order => order.status === 'pending').length;
  const cancelledOrders = allOrders.filter(order => order.status === 'cancelled').length;

  // Debug: tampilkan informasi data
  console.log('Total orders in store:', orderStore.data.length);
  console.log('Filtered orders:', filteredOrders.length);
  console.log('Total revenue:', totalRevenue);
  console.log('Sample order data:', orderStore.data.slice(0, 3));
  console.log('Order store loading:', orderStore.loading);
  console.log('Order store error:', orderStore.error);
  
  // Tampilkan data jika kosong
  if (orderStore.data.length === 0 && !orderStore.loading) {
    console.log('⚠️ No orders data found!');
  }

  // Fungsi untuk download laporan pendapatan sebagai PDF
  const downloadRevenueReport = () => {
    const reportDate = new Date().toLocaleDateString('id-ID');
    
    // Buat konten HTML untuk PDF
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Laporan Pendapatan - CV. Lantana Jaya Digital</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #800000;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #800000;
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #800000;
            border-bottom: 2px solid #800000;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 18px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
          }
          .stat-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #800000;
          }
          .stat-label {
            font-weight: bold;
            color: #800000;
            margin-bottom: 5px;
          }
          .stat-value {
            font-size: 18px;
            font-weight: bold;
          }
          .monthly-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          .monthly-table th,
          .monthly-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .monthly-table th {
            background: #800000;
            color: white;
            font-weight: bold;
          }
          .monthly-table tr:nth-child(even) {
            background: #f8f9fa;
          }
          .orders-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 12px;
          }
          .orders-table th,
          .orders-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .orders-table th {
            background: #800000;
            color: white;
            font-weight: bold;
          }
          .orders-table tr:nth-child(even) {
            background: #f8f9fa;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            color: #666;
            font-size: 12px;
          }
          .status-completed { color: #10b981; font-weight: bold; }
          .status-pending { color: #f59e0b; font-weight: bold; }
          .status-cancelled { color: #ef4444; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>LAPORAN PENDAPATAN</h1>
          <p>CV. Lantana Jaya Digital</p>
          <p>Tanggal: ${reportDate}</p>
        </div>
        
        <div class="section">
          <h2>STATISTIK UMUM</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">Total Pendapatan</div>
              <div class="stat-value">${formatCurrency(totalRevenue)}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Total Pesanan</div>
              <div class="stat-value">${totalOrders}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Pesanan Pending</div>
              <div class="stat-value">${pendingOrders}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Pesanan Dibatalkan</div>
              <div class="stat-value">${cancelledOrders}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Total Pelanggan</div>
              <div class="stat-value">${userStore.data.filter(u => u.role === 'user').length}</div>
            </div>
      </div>
      </div>
        
        <div class="section">
          <h2>DETAIL PESANAN</h2>
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Pelanggan</th>
                <th>Tanggal</th>
                <th>Jumlah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.map(order => {
                const user = userStore.data.find(u => u.user_id === order.user_id);
                const customerName = user?.name || `User #${order.user_id}`;
                const orderDate = formatDate(order.order_date);
                const amount = formatCurrency(Number(order.total_amount) || 0);
                const status = order.status === 'completed' ? 'Selesai' : 
                              order.status === 'pending' ? 'Menunggu' : 
                              order.status === 'cancelled' ? 'Dibatalkan' : order.status;
                const statusClass = order.status === 'completed' ? 'status-completed' : 
                                   order.status === 'pending' ? 'status-pending' : 
                                   order.status === 'cancelled' ? 'status-cancelled' : '';
                
                return `
                  <tr>
                    <td>${order.order_id}</td>
                    <td>${customerName}</td>
                    <td>${orderDate}</td>
                    <td>${amount}</td>
                    <td class="${statusClass}">${status}</td>
                </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
    `;
    
    htmlContent += `
        <div class="footer">
          <p>Laporan ini dibuat secara otomatis pada ${reportDate}</p>
          <p>Sistem Informasi CV. Lantana Jaya Digital</p>
        </div>
      </body>
      </html>
    `;
    
    // Buat blob dan buka di tab baru untuk print sebagai PDF
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    // Buka di tab baru untuk print sebagai PDF
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#fff',
      margin: 0,
      padding: 0,
    }}>
      <h1 style={{ color: '#800000', fontSize: 24, fontWeight: 700, marginBottom: 28, letterSpacing: 0.5, marginLeft: 32 }}>Laporan Pendapatan</h1>
      
      {/* Statistics Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        flexWrap: 'wrap',
        marginBottom: 40,
        width: '100%',
        marginTop: 32,
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: 1200,
        padding: '0 32px',
      }}>
        <Card css={{ p: 20, width: 280, minWidth: 250, maxWidth: 300, flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(16,185,129,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <DollarSign size={20} />
            <div>
              <Text size={24} css={{ color: 'white', fontWeight: 800, margin: 0 }}>
                {formatCurrency(totalRevenue)}
              </Text>
              <Text size={13} css={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Total Pendapatan
              </Text>
            </div>
          </div>
        </Card>
        
        <Card css={{ p: 20, width: 280, minWidth: 250, maxWidth: 300, flex: 1, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(59,130,246,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingCart size={20} />
            <div>
              <Text size={24} css={{ color: 'white', fontWeight: 800, margin: 0 }}>
                {totalOrders}
              </Text>
              <Text size={13} css={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Total Pesanan
              </Text>
            </div>
          </div>
        </Card>
        
        <Card css={{ p: 20, width: 280, minWidth: 250, maxWidth: 300, flex: 1, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(239,68,68,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users size={20} />
            <div>
              <Text size={24} css={{ color: 'white', fontWeight: 800, margin: 0 }}>
                {userStore.data.filter(u => u.role === 'user').length}
              </Text>
              <Text size={13} css={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Total Pelanggan
              </Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        flexWrap: 'wrap',
        marginBottom: 40,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: 1200,
        padding: '0 32px',
      }}>
        {/* Filters and Download */}
        <div style={{ flex: 1, minWidth: 400, maxWidth: 600 }}>
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 20, boxShadow: '0 2px 12px 0 rgba(128,0,0,0.07)', padding: 32 }}>
            <Text b size={18} css={{ color: '#800000', marginBottom: 20, display: 'block', letterSpacing: 0.5 }}>Filter & Download Laporan</Text>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <Input
                type="date"
                label="Filter Tanggal"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                size="sm"
                bordered
                css={{ width: '100%' }}
              />
              
              <div>
                <Text size={13} css={{ color: '#800000', marginBottom: 8, display: 'block' }}>
                  Status Pesanan
                </Text>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: 12,
                    fontSize: 14,
                    backgroundColor: 'white',
                    color: '#800000'
                  }}
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button
                auto
                color="gradient"
                css={{ 
                  background: 'linear-gradient(135deg, #800000 0%, #b91c1c 100%)',
                  fontWeight: 600,
                  width: '100%',
                  borderRadius: 12,
                  padding: '12px'
                }}
                onClick={downloadRevenueReport}
              >
                <FileText size={16} style={{ marginRight: '0.5rem' }} />
                Download Laporan PDF
              </Button>
              
              <Text size={12} css={{ color: '#666', textAlign: 'center', marginTop: 8 }}>
                Klik tombol di atas untuk membuka laporan di tab baru. 
                Gunakan Ctrl+P untuk print sebagai PDF.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports; 