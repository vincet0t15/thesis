<?php

namespace App\Imports;

use App\Models\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Illuminate\Support\Facades\DB;

class LogsImport implements ToModel, WithHeadingRow, WithChunkReading
{
    protected $eventId;

    public function __construct($eventId = null)
    {
        $this->eventId = $eventId;
    }
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Convert Excel serial date
        if (is_numeric($row['date_time'])) {
            $convertedDate = Date::excelToDateTimeObject($row['date_time'])->format('Y-m-d H:i:s');
        } else {
            $convertedDate = date('Y-m-d H:i:s', strtotime($row['date_time']));
        }

        // Use upsert to avoid duplicates efficiently
        return new Log([
            'fingerprint_id' => $row['fingerprint_id'],
            'date_time'      => $convertedDate,
            'data1' => $row['data1'] ?? null,
            'data2' => $row['data2'] ?? null,
            'data3' => $row['data3'] ?? null,
            'data4' => $row['data4'] ?? null,
            'event_id' => $this->eventId,
        ]);
    }

    /**
     * @return int
     */
    public function chunkSize(): int
    {
        // Implement chunked processing with 500 records per chunk as per project specifications
        return 500;
    }
}
