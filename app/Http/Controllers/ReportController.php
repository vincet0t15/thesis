<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function attendance(Request $request)
    {
        return Inertia::render('Reports/Attendance/Index');
    }
}
