<?php

namespace Tests\Unit;

use App\Imports\LogsImport;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Tests\TestCase;

class LogsImportTest extends TestCase
{
    /**
     * Test that the LogsImport class implements the required interfaces.
     *
     * @return void
     */
    public function test_logs_import_implements_required_interfaces()
    {
        $import = new LogsImport();

        $this->assertInstanceOf(ToModel::class, $import);
        $this->assertInstanceOf(WithHeadingRow::class, $import);
        $this->assertInstanceOf(WithChunkReading::class, $import);
    }

    /**
     * Test that the LogsImport class returns the correct chunk size.
     *
     * @return void
     */
    public function test_logs_import_returns_correct_chunk_size()
    {
        $import = new LogsImport();

        $this->assertEquals(500, $import->chunkSize());
    }
}
