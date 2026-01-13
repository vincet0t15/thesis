<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ProcessImportsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dtr:process-imports {--timeout=1200} {--tries=3}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start queue worker for processing large DTR imports';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $timeout = $this->option('timeout');
        $tries = $this->option('tries');

        $this->info("To process large DTR imports, please run the following command in a separate terminal:");
        $this->line("php artisan queue:work --timeout={$timeout} --tries={$tries}");
        $this->info("");
        $this->info("This command will start a queue worker that can handle large file imports.");
        $this->info("For very large imports (1M+ records), you may need to increase the timeout value.");
        $this->info("");
        $this->info("The queue worker will continue running until you stop it with CTRL+C.");
    }
}
