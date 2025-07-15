// Validation utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password minimal 8 karakter' };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password harus mengandung huruf kecil' };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password harus mengandung huruf besar' };
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password harus mengandung angka' };
  }
  return { isValid: true, message: '' };
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
  return phoneRegex.test(phone);
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && Number.isInteger(price);
};

export const validateQuantity = (quantity: number): boolean => {
  return quantity > 0 && Number.isInteger(quantity);
};

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file: File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg']): boolean => {
  return allowedTypes.includes(file.type);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateDeadline = (orderDate: string, durationMonths: number): Date => {
  const order = new Date(orderDate);
  const deadline = new Date(order);
  
  // Set tanggal yang sama di bulan yang ditargetkan
  const targetDate = deadline.getDate();
  deadline.setMonth(deadline.getMonth() + durationMonths);
  
  // Jika tanggal berubah karena bulan target tidak punya tanggal tersebut
  // (misal: 31 Jan → 31 Feb yang tidak ada), set ke tanggal terakhir bulan target
  if (deadline.getDate() !== targetDate) {
    deadline.setDate(0); // Set ke tanggal terakhir bulan sebelumnya (yang sebenarnya adalah bulan target)
  }
  
  return deadline;
};

export const formatDeadline = (orderDate: string, durationMonths: number): string => {
  const deadline = calculateDeadline(orderDate, durationMonths);
  return deadline.toLocaleDateString('id-ID');
};

export const isExpired = (deadline: string | Date): boolean => {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const today = new Date();
  return deadlineDate < today;
};

export const getDaysUntilDeadline = (deadline: string | Date): number => {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const validateOrderForm = (form: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!form.user_id) {
    errors.push('User harus dipilih');
  }
  
  if (!form.order_date) {
    errors.push('Tanggal order harus diisi');
  }
  
  if (!form.total_amount || form.total_amount <= 0) {
    errors.push('Total amount harus lebih dari 0');
  }
  
  if (!form.items || form.items.length === 0) {
    errors.push('Order harus memiliki minimal 1 item');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateProductForm = (form: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!form.name || form.name.trim().length === 0) {
    errors.push('Nama produk harus diisi');
  }
  
  if (!form.description || form.description.trim().length === 0) {
    errors.push('Deskripsi produk harus diisi');
  }
  
  if (!validatePrice(form.price)) {
    errors.push('Harga harus lebih dari 0');
  }
  
  if (!validateQuantity(form.stock)) {
    errors.push('Stock harus lebih dari 0');
  }
  
  if (!form.duration || form.duration <= 0) {
    errors.push('Durasi harus lebih dari 0');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePaymentForm = (form: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!form.order_id) {
    errors.push('Order ID harus diisi');
  }
  
  if (!form.amount || form.amount <= 0) {
    errors.push('Jumlah pembayaran harus lebih dari 0');
  }
  
  if (!form.bukti_transfer) {
    errors.push('Bukti transfer harus diupload');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}; 