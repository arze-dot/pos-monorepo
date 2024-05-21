<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // User Register (POST, formdata)
    public function register(Request $request)
    {

        // Data validation
        $validator = Validator::make($request->all(), [
            "name" => "required",
            "username" => "required|unique:users",
            "password" => "required|confirmed"
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['error' => 'Error Validation', 'message' => $validator->errors()], 400);
        }

        $data = [
            "name" => $request->name,
            "username" => $request->username,
            "password" => Hash::make($request->password)
        ];

        // User Model
        User::create($data);

        // Response
        return response()->json([
            "message" => "User registered successfully"
        ], 201);
    }


    /**
     * Edit the specified user.
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit($id, Request $request)
    {
        // Data validation
        $validator = Validator::make($request->all(), [
            "name" => "sometimes|required",
            "username" => [
                "sometimes",
                "required",
                Rule::unique('users')->ignore($id),
            ],
            "password" => "sometimes|required|confirmed"
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['error' => 'Validation Error', 'message' => $validator->errors()], 400);
        }

        // Find the user by id
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Update user data
        $user->fill([
            "name" => $request->input('name', $user->name),
            "username" => $request->input('username', $user->username),
            "password" => $request->filled('password') ? Hash::make($request->password) : $user->password,
        ]);

        $user->save();
        return response()->json([
            "message" => "User updated successfully",
            "data" => $user
        ]);
    }

    /**
     * Delete the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete($id)
    {
        // Find the user by id
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Delete the user
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
