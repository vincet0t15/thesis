<?php

use App\Http\Controllers\DailyTimeRecordController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmploymentTypeController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/', function () {
        return redirect()->route('student.index');
    });


    // DTR
    Route::get('/dtr', [DailyTimeRecordController::class, 'index'])->name('dtr.index');
    Route::get('/dtr-print', [DailyTimeRecordController::class, 'print'])->name('dtr.print');
    Route::post('/dtr-import-logs', [DailyTimeRecordController::class, 'importLogs'])->name('dtr.import.logs');



    //COURSES
    Route::get('/courses', [CourseController::class, 'index'])->name('course.index');
    Route::post('/courses-store', [CourseController::class, 'store'])->name('course.store');
    Route::put('/courses-update/{course}', [CourseController::class, 'update'])->name('course.update');
    Route::delete('/courses-destroy/{course}', [CourseController::class, 'destroy'])->name('course.destroy');


    //STUDENTS
    Route::get('/students', [StudentController::class, 'index'])->name('student.index');
    Route::post('/students-store', [StudentController::class, 'store'])->name('student.store');
    Route::put('/students-update/{student}', [StudentController::class, 'update'])->name('student.update');
    Route::delete('/students-destroy/{student}', [StudentController::class, 'destroy'])->name('student.destroy');

    //EVENTS
    Route::get('/events', [EventController::class, 'index'])->name('event.index');
    Route::post('/events-store', [EventController::class, 'store'])->name('event.store');
    Route::put('/events-update/{event}', [EventController::class, 'update'])->name('event.update');
    Route::delete('/events-destroy/{event}', [EventController::class, 'destroy'])->name('event.destroy');


    // REPORTS
    Route::get('/attendance-reports', [ReportController::class, 'attendance'])->name('report.attendance');
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
