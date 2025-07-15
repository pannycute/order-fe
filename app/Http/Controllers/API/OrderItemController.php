<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderItemController extends Controller
{
    /**
     * Get all order items with pagination
     */
    public function index(Request $request)
    {
        try {
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 10);
            $offset = ($page - 1) * $limit;

            $orderItems = DB::table('order_items')
                ->leftJoin('orders', 'order_items.order_id', '=', 'orders.order_id')
                ->leftJoin('products', 'order_items.product_id', '=', 'products.product_id')
                ->select(
                    'order_items.*',
                    'orders.order_date',
                    'orders.status as order_status',
                    'products.name as product_name',
                    'products.price as product_price'
                )
                ->orderBy('order_items.created_at', 'desc')
                ->offset($offset)
                ->limit($limit)
                ->get();

            $totalData = DB::table('order_items')->count();

            return response()->json([
                'success' => true,
                'data' => $orderItems,
                'totalData' => $totalData,
                'page' => $page,
                'limit' => $limit
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data item pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get order item by ID
     */
    public function show($id)
    {
        try {
            $orderItem = DB::table('order_items')
                ->leftJoin('orders', 'order_items.order_id', '=', 'orders.order_id')
                ->leftJoin('products', 'order_items.product_id', '=', 'products.product_id')
                ->select(
                    'order_items.*',
                    'orders.order_date',
                    'orders.status as order_status',
                    'products.name as product_name',
                    'products.price as product_price'
                )
                ->where('order_items.order_item_id', $id)
                ->first();

            if (!$orderItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Item pesanan tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $orderItem
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat detail item pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new order item
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'order_id' => 'required|exists:orders,order_id',
                'product_id' => 'required|exists:products,product_id',
                'quantity' => 'required|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $orderItemId = DB::table('order_items')->insertGetId([
                'order_id' => $request->order_id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Item pesanan berhasil ditambahkan',
                'data' => [
                    'order_item_id' => $orderItemId
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan item pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update order item
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'quantity' => 'required|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $orderItem = DB::table('order_items')->where('order_item_id', $id)->first();

            if (!$orderItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Item pesanan tidak ditemukan'
                ], 404);
            }

            DB::table('order_items')
                ->where('order_item_id', $id)
                ->update([
                    'quantity' => $request->quantity,
                    'updated_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Item pesanan berhasil diupdate'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate item pesanan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete order item
     */
    public function destroy($id)
    {
        try {
            $orderItem = DB::table('order_items')->where('order_item_id', $id)->first();

            if (!$orderItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Item pesanan tidak ditemukan'
                ], 404);
            }

            DB::table('order_items')->where('order_item_id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item pesanan berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus item pesanan: ' . $e->getMessage()
            ], 500);
        }
    }
} 