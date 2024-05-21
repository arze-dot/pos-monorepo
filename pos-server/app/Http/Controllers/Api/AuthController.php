<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // User Login (POST, formdata)
    public function login(Request $request)
    {

        // Data validation
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['error' => 'Error Validation', 'message' => $validator->errors()], 400);
        }

        // JWTAuth
        $myTTL = 60 * 24 * 7;
        JWTAuth::factory()->setTTL($myTTL);
        $token = JWTAuth::attempt([
            "username" => $request->username,
            "password" => $request->password
        ]);

        if (!empty($token)) {

            return response()->json([
                "status" => true,
                "message" => "User logged in succcessfully",
                "token" => $token
            ]);
        }

        return response()->json([
            "status" => false,
            "message" => "Invalid details"
        ]);
    }
}
