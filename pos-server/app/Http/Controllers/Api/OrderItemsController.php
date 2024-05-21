<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrderItemsController extends Controller
{
    public function index()
    {
        // Retrieve all order items with priceJual from the inventory table
        $orderItems = OrderItem::leftJoin('inventory', 'order_items.inventoryId', '=', 'inventory.id')
            ->select('order_items.*', 'inventory.priceJual')
            ->get();

        // Return the order items with priceJual
        return response()->json($orderItems, 200);
    }

    public function getOrderItemsByOrderId(Request $request)
    {
        // Validate the orderId
        $validator = Validator::make(['orderId' => $request->input('orderId')], [
            'orderId' => 'required|exists:orders,id',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Retrieve order items with the specified orderId
        $orderItems = OrderItem::leftJoin('inventory', 'order_items.inventoryId', '=', 'inventory.id')
            ->where('order_items.orderId', $request->input('orderId'))
            ->select('order_items.*', 'inventory.priceJual', 'inventory.name')
            ->get();
        // Return the order items
        return response()->json(['status' => true, 'data' => $orderItems], 200);
    }

    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'inventoryId' => 'required',
            'quantity' => 'required',
            'orderId' => 'required',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Fetch the inventory item
        $inventory = Inventory::find($request->input('inventoryId'));

        // Check if the inventory item exists and has sufficient quantity
        if ($inventory->quantity < $request->input('quantity')) {
            return response()->json(['error' => 'Insufficient inventory quantity'], 400);
        }

        // Reduce the inventory quantity
        $inventory->quantity -= $request->input('quantity');
        $inventory->updated_by = Auth::id();
        $inventory->updated_at = Carbon::now();
        $inventory->save();

        // Create a new inventory instance
        $orderItem = new OrderItem();
        $orderItem->fill($request->all());
        $orderItem->created_by = Auth::id();
        $orderItem->updated_by = Auth::id();
        $orderItem->created_at = Carbon::now();
        $orderItem->updated_at = Carbon::now();
        $orderItem->save();

        // Return the created inventory instance
        return response()->json(['status' => true, 'message' => 'Order Item Successfuly Created'], 201);
    }

    public function show($id)
    {
        return OrderItem::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $orderItem = OrderItem::find($id);
        $orderItem->fill($request->all());
        $orderItem->updated_by = Auth::id();
        $orderItem->updated_at = Carbon::now();

        $orderItem->save();

        return response()->json(['message' => 'Order Item Successfuly Updated'], 200);
    }

    public function destroy($id)
    {
        $orderItem = OrderItem::findOrFail($id);
        $orderItem->delete();
        return response()->json(['message' => 'Order Item Successfuly Deleted'], 200);;
    }
}
