<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('logs', function (Blueprint $table) {
            // Add index on student_id for faster lookups
            $table->index('student_id');

            // Add index on date_time for faster date range queries
            $table->index('date_time');

            // Add composite index for the common query pattern in upsert operations
            $table->index(['student_id', 'date_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('logs', function (Blueprint $table) {
            $table->dropIndex(['fingerprint_id', 'date_time']);
            $table->dropIndex(['date_time']);
            $table->dropIndex(['fingerprint_id']);
        });
    }
};
