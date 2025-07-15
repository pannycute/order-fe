<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Get all orders with pagination
     */
    public function index(Request $request)
    {
        try {
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 10);
            $offset = ($page - 1) * $limit;

            $orders = DB::table('orders')
                ->leftJoin('users', 'orders.user_id', '=', 'users.user_id')
                ->select(
                    'orders.*',
                    'users.name as customer_name',
                    'users.email as customer_email'
                )
                ->orderBy('orders.created_at', 'desc')
                ->offset($offset)
                ->limit($limit)
                ->get();

            $totalData = DB::table('orders')->count();

            return response()->json([
                'success' => true,
                'data' => $orders,
                'totalData' => $totalData,
                'page' => $page,
                'limit' => $limit
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get order by ID
     */
    public function show($id)
    {
        try {
            $order = DB::table('orders')
                ->leftJoin('users', 'orders.user_id', '=', 'users.user_id')
                ->select(
                    'orders.*',
                    'users.name as customer_name',
                    'users.email as customer_email'
                )
                ->where('orders.order_id', $id)
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pesanan tidak ditemukan'
                ], 404);
            }

            // Get order items
            $orderItems = DB::table('order_items')
                ->leftJoin('products', 'order_items.product_id', '=', 'products.product_id')
                ->select(
                    'order_items.*',
                    'products.name as product_name',
                    'products.price as product_price'
                )
                ->where('order_items.order_id', $id)
                ->get();

            $order->items = $orderItems;

            return response()->json([
                'success' => true,
                'data' => $order
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat detail pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new order
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,user_id',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,product_id',
                'items.*.quantity' => 'required|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Calculate total amount
            $totalAmount = 0;
            foreach ($request->items as $item) {
                $product = DB::table('products')->where('product_id', $item['product_id'])->first();
                $totalAmount += $product->price * $item['quantity'];
            }

            // Create order
            $orderId = DB::table('orders')->insertGetId([
                'user_id' => $request->user_id,
                'order_date' => now(),
                'status' => 'pending',
                'total_amount' => $totalAmount,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create order items
            foreach ($request->items as $item) {
                DB::table('order_items')->insert([
                    'order_id' => $orderId,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat',
                'data' => [
                    'order_id' => $orderId,
                    'total_amount' => $totalAmount
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update order status
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:pending,confirmed,shipped,completed,cancelled',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $order = DB::table('orders')->where('order_id', $id)->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pesanan tidak ditemukan'
                ], 404);
            }

            DB::table('orders')
                ->where('order_id', $id)
                ->update([
                    'status' => $request->status,
                    'updated_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Status pesanan berhasil diupdate'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete order
     */
    public function destroy($id)
    {
        try {
            $order = DB::table('orders')->where('order_id', $id)->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pesanan tidak ditemukan'
                ], 404);
            }

            DB::beginTransaction();

            // Delete order items first
            DB::table('order_items')->where('order_id', $id)->delete();

            // Delete order
            DB::table('orders')->where('order_id', $id)->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pesanan: ' . $e->getMessage()
            ], 500);
        }
    }
} 