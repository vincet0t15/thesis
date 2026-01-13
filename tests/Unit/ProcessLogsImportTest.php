<?php

namespace Tests\Unit;

use App\Jobs\ProcessLogsImport;
use Tests\TestCase;

class ProcessLogsImportTest extends TestCase
{
    /**
     * Test that the ProcessLogsImport job can be instantiated.
     *
     * @return void
     */
    public function test_process_logs_import_job_can_be_instantiated()
    {
        $job = new ProcessLogsImport('test/file/path.xlsx');

        $this->assertInstanceOf(ProcessLogsImport::class, $job);
        // We can't directly access the protected filePath property, but we can test that the job was created
        $this->assertNotNull($job);
    }
}
