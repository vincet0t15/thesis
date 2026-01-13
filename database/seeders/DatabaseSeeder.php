<?php

namespace Database\Seeders;

use App\Models\EmploymentType;
use App\Models\Office;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Admin',
                'username' => 'admin',
                'is_active' => true,
                'password' => bcrypt('admin123'),
            ],

        ];

        User::insert($users);
    }
}
