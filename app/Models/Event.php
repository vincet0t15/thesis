<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'name',
        'date_from',
        'date_to',
        'location',
        'description',
        'is_active',
        'time_in',
    ];

    public function Logs()
    {
        return $this->hasMany(Log::class);
    }
}
