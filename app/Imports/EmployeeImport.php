<?php

namespace App\Imports;

use App\Models\Employee;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class EmployeeImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        $employees = [];

        foreach ($rows as $row) {
            if (!empty($row['fingerprint_id']) && !empty($row['name'])) {
                $employees[] = [
                    'fingerprint_id' => $row['fingerprint_id'],
                    'name' => $row['name'],
                    'office_id' => $row['office_id'] ?? null,
                    'is_active' => $row['is_active'] ?? null,
                    'employment_type_id' => $row['employment_type_id'] ?? null,
                ];
            }
        }

        // Get existing fingerprint_ids from the DB
        $existingIds = Employee::whereIn('fingerprint_id', array_column($employees, 'fingerprint_id'))
            ->pluck('fingerprint_id')
            ->toArray();

        // Filter out existing entries
        $employeesToInsert = array_filter($employees, function ($employee) use ($existingIds) {
            return !in_array($employee['fingerprint_id'], $existingIds);
        });

        // Chunk and insert only new ones
        $chunks = array_chunk($employeesToInsert, 1000);
        foreach ($chunks as $chunk) {
            Employee::insert($chunk); // use insert instead of upsert
        }
    }
}
