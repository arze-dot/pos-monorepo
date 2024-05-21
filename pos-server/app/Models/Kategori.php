<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    use HasFactory;

    protected $table = 'kategori';
    protected $guarded = ['created_by', 'updated_at'];

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
