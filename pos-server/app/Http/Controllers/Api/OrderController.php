<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index()
    {
        return Order::all();
    }

    public function checkPendingOrder()
    {
        // Attempt to find an order with status 0
        $order = Order::where('status', 0)->first();

        // Check if an order was found
        if ($order) {
            // Order found, return true along with the order
            return response()->json(['found' => true, 'order' => $order], 200);
        } else {
            // No order found, return false
            return response()->json(['found' => false], 200);
        }
    }

    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'customerName' => 'required',
            'totalPrice' => 'required',
            'status' => 'required',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Create a new inventory instance
        $order = new Order();
        $order->fill($request->all());
        $order->created_by = Auth::id();
        $order->updated_by = Auth::id();
        $order->created_at = Carbon::now();
        $order->updated_at = Carbon::now();
        $order->save();

        // Return the created inventory instance
        return response()->json(['status' => true, 'data' => $order, 'message' => 'Order Successfuly Created'], 201);
    }

    public function show($id)
    {
        return Order::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        $order->fill($request->all());
        $order->updated_by = Auth::id();
        $order->updated_at = Carbon::now();

        $order->save();

        return response()->json(['status' => true, 'message' => 'Order Successfuly Updated'], 200);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(['message' => 'Order Successfuly Deleted'], 200);;
    }

    public function orderConfirmation($id)
    {
        $order = Order::find($id);

        $orderItems = DB::table('order_items')
            ->join('inventory', 'order_items.inventoryId', '=', 'inventory.id')
            ->where('order_items.orderId', $id)
            ->select('order_items.quantity', 'inventory.priceJual')
            ->get();

        $totalPrice = 0;
        foreach ($orderItems as $item) {
            $totalPrice += $item->priceJual * $item->quantity;
        }

        // Update the total price of the order
        $order->totalPrice = $totalPrice;
        $order->status = 1;
        $order->save();

        // Return the updated order
        return response()->json(['status' => true, 'message' => 'Order Confirmated'], 200);
    }
}
