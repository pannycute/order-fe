-- Buat tabel orders jika belum ada
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_date` datetime NOT NULL,
  `status` enum('pending','confirmed','shipped','completed','cancelled') NOT NULL DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`),
  KEY `order_date` (`order_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Buat tabel order_items jika belum ada
CREATE TABLE IF NOT EXISTS `order_items` (
  `order_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tambahkan foreign key constraints
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Masukkan beberapa data sample untuk testing
INSERT INTO `orders` (`user_id`, `order_date`, `status`, `total_amount`) VALUES
(1, '2024-01-15 10:30:00', 'completed', 150000.00),
(2, '2024-01-20 14:45:00', 'completed', 250000.00),
(1, '2024-02-05 09:15:00', 'completed', 300000.00),
(3, '2024-02-10 16:20:00', 'pending', 175000.00),
(2, '2024-03-01 11:30:00', 'completed', 400000.00),
(1, '2024-03-15 13:45:00', 'completed', 225000.00),
(3, '2024-04-01 08:20:00', 'completed', 350000.00),
(2, '2024-04-10 15:10:00', 'cancelled', 200000.00),
(1, '2024-05-01 12:00:00', 'completed', 275000.00),
(3, '2024-05-15 10:30:00', 'pending', 125000.00);

-- Masukkan data sample untuk order_items
INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`) VALUES
(1, 1, 2),
(1, 3, 1),
(2, 2, 1),
(2, 4, 2),
(3, 1, 3),
(4, 2, 1),
(4, 5, 1),
(5, 3, 2),
(5, 4, 1),
(6, 1, 1),
(6, 2, 1),
(7, 3, 3),
(8, 4, 2),
(9, 1, 2),
(9, 5, 1),
(10, 2, 1); 