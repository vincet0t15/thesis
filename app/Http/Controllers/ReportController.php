<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Event;
use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function attendance(Request $request)
    {
        $filters = $request->only(['search', 'course_id', 'event_id']);
        $search = $request->input('search');

        $query = Log::query()
            ->join('students', 'logs.student_id', '=', 'students.id')
            ->leftJoin('courses', 'students.course_id', '=', 'courses.id')
            ->leftJoin('events', 'logs.event_id', '=', 'events.id')
            ->select([
                'logs.student_id', // This is the FK (students.id)
                'students.name as student_name',
                'students.student_id as student_code',
                'courses.course_name',
                'events.name as event_name',
                DB::raw('DATE(logs.date_time) as date'),
                DB::raw('MIN(CASE WHEN logs.checkType = 0 THEN logs.date_time END) as time_in'),
                DB::raw('MAX(CASE WHEN logs.checkType = 1 THEN logs.date_time END) as time_out'),
            ])
            ->groupBy('logs.student_id', 'date', 'students.name', 'students.student_id', 'courses.course_name', 'logs.event_id', 'events.name');

        // Apply Filters
        if ($request->course_id) {
            $query->where('students.course_id', $request->course_id);
        }

        if ($request->event_id) {
            $event = Event::find($request->event_id);
            if ($event) {
                $dateFrom = \Carbon\Carbon::parse($event->date_from)->startOfDay();
                $dateTo = \Carbon\Carbon::parse($event->date_to)->endOfDay();

                $query->where(function ($q) use ($dateFrom, $dateTo, $request) {
                    $q->where('logs.event_id', $request->event_id)
                        ->orWhere(function ($sub) use ($dateFrom, $dateTo) {
                            $sub->whereBetween('logs.date_time', [$dateFrom, $dateTo])
                                ->whereNull('logs.event_id');
                        });
                });
            } else {
                $query->where('logs.event_id', $request->event_id);
            }
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('students.name', 'like', "%{$search}%")
                    ->orWhere('students.student_id', 'like', "%{$search}%");
            });
        }

        $logs = $query->orderBy('date', 'desc')
            ->orderBy('time_in', 'asc')
            ->paginate(15)
            ->withQueryString();

        $courses = Course::all();
        $events = Event::where('is_active', true)->get();

        return Inertia::render('Reports/Attendance/Index', [
            'logs' => $logs,
            'courses' => $courses,
            'events' => $events,
            'filters' => $filters,
        ]);
    }
}
