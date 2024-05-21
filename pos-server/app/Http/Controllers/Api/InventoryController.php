<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Inventory;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    public function index()
    {
        return Inventory::all();
    }

    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'idKategori' => 'required',
            'quantity' => 'required',
            'name' => 'required',
            'priceJual' => 'required',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Create a new inventory instance
        $inventory = new Inventory();
        $inventory->idKategori = $request->input('idKategori');
        $inventory->quantity = $request->input('quantity');
        $inventory->name = $request->input('name');
        $inventory->priceJual = $request->input('priceJual');
        $inventory->created_by = Auth::id();
        $inventory->updated_by = Auth::id();
        $inventory->created_at = Carbon::now();
        $inventory->updated_at = Carbon::now();
        $inventory->save();

        // Return the created inventory instance
        return response()->json(['status' => true, 'message' => 'Inventory Successfuly Created'], 201);
    }

    public function show($id)
    {
        return Inventory::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $inventory = Inventory::find($id);
        $inventory->fill($request->all());
        $inventory->updated_by = Auth::id();
        $inventory->updated_at = Carbon::now();

        $inventory->save();

        return response()->json(['status' => true, 'message' => 'Inventory Successfuly Updated'], 200);
    }

    public function destroy($id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->delete();
        return response()->json(['message' => 'Inventory Successfuly Deleted'], 200);;
    }
}
