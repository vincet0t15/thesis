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
            $today = now('Asia/Manila')->toDateString();
            $filters['date_from'] = $today;
            $filters['date_to'] = $today;
            $request->merge([
                'date_from' => $today,
                'date_to' => $today,
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

        // Calculate totals for Time In and Time Out
        // We wrap the current query as a subquery to count the computed columns time_in and time_out
        $subQuery = $query->toBase();
        $totals = DB::table(DB::raw("({$subQuery->toSql()}) as sub"))
            ->mergeBindings($subQuery)
            ->selectRaw('COUNT(time_in) as total_in, COUNT(time_out) as total_out')
            ->first();

        $totalTimeIn = $totals->total_in ?? 0;
        $totalTimeOut = $totals->total_out ?? 0;

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
            'totalTimeIn' => $totalTimeIn,
            'totalTimeOut' => $totalTimeOut,
        ]);
    }

    public function attendeeCount(Request $request)
    {
        $filters = $request->only(['event_id', 'date_from', 'date_to']);

        if (!$request->boolean('initialized') && empty($filters['date_from']) && empty($filters['date_to'])) {
            $today = now('Asia/Manila')->toDateString();

            $filters['date_from'] = $today;
            $filters['date_to'] = $today;
            $request->merge([
                'date_from' => $today,
                'date_to' => $today,
            ]);
        }

        $fromDate = $request->date_from ? \Carbon\Carbon::parse($request->date_from)->startOfDay() : null;
        $toDate = $request->date_to ? \Carbon\Carbon::parse($request->date_to)->endOfDay() : null;

        $query = DB::table('events')
            ->leftJoin('logs', function ($join) use ($fromDate, $toDate) {
                $join->on('logs.event_id', '=', 'events.id')
                    ->whereNull('logs.deleted_at')
                    ->whereRaw('DATE(logs.date_time) >= events.date_from')
                    ->whereRaw('DATE(logs.date_time) <= events.date_to');

                if ($fromDate) {
                    $join->where('logs.date_time', '>=', $fromDate);
                }
                if ($toDate) {
                    $join->where('logs.date_time', '<=', $toDate);
                }
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

        // Restrict listed events to those that overlap with the selected range
        if ($fromDate && $toDate) {
            $query->whereDate('events.date_from', '<=', $toDate->toDateString())
                ->whereDate('events.date_to', '>=', $fromDate->toDateString());
        }

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
