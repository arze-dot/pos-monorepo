<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kategori;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class KategoriController extends Controller
{
    public function index()
    {
        // Eager load the createdByUser relationship
        $kategoris = Kategori::with('createdByUser')->get();

        // Transform the collection to include username or name instead of ID
        $kategoris->transform(function ($kategori) {
            return [
                'id' => $kategori->id,
                'name' => $kategori->name,
                'created_by' => $kategori->createdByUser->username ?? null, // Assuming 'username' is the attribute for the user's username
                'created_at' => $kategori->created_at,
                'updated_by' => $kategori->createdByUser->username ?? null,
                'updated_at' => $kategori->updated_at,
            ];
        });

        return $kategoris;
    }

    public function store(Request $request)
    {
        // Get the authenticated user's ID
        $userId = Auth::id();

        // Create a new instance of the Kategori model
        $kategori = new Kategori();

        // Assign values to the columns
        $kategori->created_by = $userId;
        $kategori->updated_by = $userId;
        $kategori->created_at = Carbon::now();
        $kategori->updated_at = Carbon::now();

        // You can assign other request data as well
        $kategori->name = $request->input('name');

        // Save the new Kategori instance to the database
        $kategori->save();

        // Return the created Kategori instance
        return response()->json(
            ['message' => 'Kategori successfully created'],
            201
        );
    }

    public function show($id)
    {
        return Kategori::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        // Find the Kategori by ID
        $kategori = Kategori::findOrFail($id);

        $kategori->update($request->except(['created_by']));

        $kategori->update($request->except(['created_at']));

        $kategori->update(['updated_by' => Auth::id()]);

        $kategori->update(['updated_at' => now()]);

        return response()->json(
            ['message' => 'Kategori successfully updated'],
            200
        );
    }

    public function destroy($id)
    {
        $kategori = Kategori::findOrFail($id);
        $kategori->delete();
        return  response()->json(
            ['message' => 'Kategori successfully deleted'],
            200
        );;
    }
}
