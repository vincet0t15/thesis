<?php

namespace App\Providers;

use App\Interface\DTRInterface;
use App\Interface\EmploymentTypeInterface;
use App\Interface\OfficeInterface;
use App\Repositories\DTRRepository;
use App\Repositories\EmploymentTypeRepository;
use App\Repositories\OfficeRepository;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // $this->app->bind(OfficeInterface::class, OfficeRepository::class);
        // $this->app->bind(EmploymentTypeInterface::class, EmploymentTypeRepository::class);
        $this->app->bind(DTRInterface::class, DTRRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('local')) {
        URL::forceScheme('https');
    }
    }
}
