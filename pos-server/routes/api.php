<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderItemsController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::post("login", [AuthController::class, "login"]);

Route::group([
    "middleware" => ["auth:api"]
], function () {

    // User
    Route::post("user", [UserController::class, "register"]);
    Route::put("user/{id}", [UserController::class, "edit"]);
    Route::delete("user/{id}", [UserController::class, "delete"]);

    // Kategori
    Route::get('kategori', [KategoriController::class, 'index']);
    Route::post('kategori', [KategoriController::class, 'store']);
    Route::put('kategori/{id}', [KategoriController::class, 'update']);
    Route::delete('kategori/{id}', [KategoriController::class, 'destroy']);

    // Inventori
    Route::get('inventory', [InventoryController::class, 'index']);
    Route::post('inventory', [InventoryController::class, 'store']);
    Route::put('inventory/{id}', [InventoryController::class, 'update']);
    Route::delete('inventory/{id}', [InventoryController::class, 'destroy']);

    // Order
    Route::get('order', [OrderController::class, 'index']);
    Route::post('order', [OrderController::class, 'store']);
    Route::put('order/{id}', [OrderController::class, 'update']);
    Route::delete('order/{id}', [OrderController::class, 'destroy']);
    Route::post('order-confirmation/{id}', [OrderController::class, 'orderConfirmation']);
    Route::get('order/{id}', [OrderController::class, 'show']);
    Route::get('order-pending', [OrderController::class, 'checkPendingOrder']);

    // Order Items
    Route::get('order-item', [OrderItemsController::class, 'index']);
    Route::post('order-item', [OrderItemsController::class, 'store']);
    Route::put('order-item/{id}', [OrderItemsController::class, 'update']);
    Route::delete('order-item/{id}', [OrderItemsController::class, 'destroy']);
    Route::get('order-item/{id}', [OrderItemsController::class, 'show']);
    Route::post('check-order-item', [OrderItemsController::class, 'getOrderItemsByOrderId']);
});
