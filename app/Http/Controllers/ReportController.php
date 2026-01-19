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
        $filters = $request->only(['search', 'course_id', 'event_id', 'date_from', 'date_to']);
        $search = trim((string) $request->input('search', ''));
        $courseId = $request->input('course_id');
        $eventId = $request->input('event_id');

        if ($courseId === 'all') {
            $courseId = null;
            $filters['course_id'] = null;
        }

        if ($eventId === 'all') {
            $eventId = null;
            $filters['event_id'] = null;
        }


        if (!$request->boolean('initialized') && empty($filters['date_from']) && empty($filters['date_to'])) {
            $today = now()->toDateString();
            $filters['date_from'] = $today;
            $filters['date_to'] = $today;
            $request->merge([
                'date_from' => $today,
                'date_to' => $today,
                // 'initialized' => true,
            ]);
        }

        $query = Log::query()
            ->join('students', 'logs.student_id', '=', 'students.id')
            ->leftJoin('courses', 'students.course_id', '=', 'courses.id')
            ->leftJoin('events', 'logs.event_id', '=', 'events.id')
            ->select([
                'logs.student_id',
                'students.name as student_name',
                'students.student_id as student_code',
                'courses.course_name',
                'events.name as event_name',
                DB::raw('DATE(logs.date_time) as date'),
                DB::raw('MIN(CASE WHEN logs.checkType = 0 THEN logs.date_time END) as time_in'),
                DB::raw('MAX(CASE WHEN logs.checkType = 1 THEN logs.date_time END) as time_out'),
            ])
            ->groupBy('logs.student_id', 'date', 'students.name', 'students.student_id', 'courses.course_name', 'logs.event_id', 'events.name');

        if ($courseId) {
            $query->where('students.course_id', $courseId);
        }

        if ($request->date_from) {
            $query->whereDate('logs.date_time', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('logs.date_time', '<=', $request->date_to);
        }

        if ($eventId) {
            $query->where('logs.event_id', $eventId);
        }

        // Apply date range filter (based on logs.date_time) using provided or default dates
        if ($request->date_from || $request->date_to) {
            $dateFrom = $request->date_from ? \Carbon\Carbon::parse($request->date_from)->startOfDay() : null;
            $dateTo = $request->date_to ? \Carbon\Carbon::parse($request->date_to)->endOfDay() : null;

            if ($dateFrom && $dateTo) {
                $query->whereBetween('logs.date_time', [$dateFrom, $dateTo]);
            } elseif ($dateFrom) {
                $query->where('logs.date_time', '>=', $dateFrom);
            } elseif ($dateTo) {
                $query->where('logs.date_time', '<=', $dateTo);
            }
        }

        if ($search !== '') {
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

    public function attendeeCount(Request $request)
    {
        $filters = $request->only(['event_id', 'date_from', 'date_to']);

        if (!$request->boolean('initialized') && empty($filters['date_from']) && empty($filters['date_to'])) {
            $today = now()->toDateString();
            $filters['date_from'] = $today;
            $filters['date_to'] = $today;
            $request->merge([
                'date_from' => $today,
                'date_to' => $today,
            ]);
        }

        $query = DB::table('events')
            ->leftJoin('logs', function ($join) {
                $join->on('logs.event_id', '=', 'events.id')
                    ->whereNull('logs.deleted_at')
                    ->whereColumn('logs.date_time', '>=', 'events.date_from')
                    ->whereColumn('logs.date_time', '<=', 'events.date_to');
            })
            ->leftJoin('students', 'logs.student_id', '=', 'students.id')
            ->leftJoin('courses', 'students.course_id', '=', 'courses.id')
            ->select([
                'events.name as event_name',
                'events.date_from',
                'events.date_to',
                'courses.course_name as program',
                DB::raw('COUNT(DISTINCT logs.student_id) as attendees')
            ])
            ->groupBy('events.id', 'events.name', 'events.date_from', 'events.date_to', 'courses.id', 'courses.course_name');

        if ($request->event_id && $request->event_id !== 'all') {
            $query->where('events.id', $request->event_id);
        }

        // Restrict listed events to those whose own date range falls within the selected range
        if ($request->date_from && $request->date_to) {
            $fromDate = \Carbon\Carbon::parse($request->date_from)->toDateString();
            $toDate = \Carbon\Carbon::parse($request->date_to)->toDateString();
            $query->whereDate('events.date_from', '>=', $fromDate)
                ->whereDate('events.date_to', '<=', $toDate);
        }
        // Note: log date filtering is applied inside the left join to preserve events with zero attendees.

        $data = $query->orderBy('events.date_from', 'desc')
            ->orderBy('courses.course_name', 'asc')
            ->paginate(15)
            ->withQueryString();

        $allEvents = Event::select('id', 'name')->orderBy('date_from', 'desc')->get();

        return Inertia::render('Reports/AttendeeCount/Index', [
            'reportData' => $data,
            'allEvents' => $allEvents,
            'filters' => $filters,
        ]);
    }
}
