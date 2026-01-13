<?php

namespace App\Repositories;

use App\Interface\DTRInterface;
use App\Models\Course;
use App\Models\Employee;
use App\Models\EmploymentType;
use App\Models\Office;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;

class DTRRepository implements DTRInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function index($request)
    {
        $search = $request->input('search');
        $courseId = $request->course_id;
        $selectedEvent = $request->input('event_id');

        $students = Student::when($search, function ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('student_id', 'like', '%' . $search . '%');
            });
        })

            ->when($courseId, function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->when($selectedEvent, function ($query) use ($selectedEvent) {
                $query->whereHas('Logs', function ($q) use ($selectedEvent) {
                    $q->where('event_id', $selectedEvent);
                });
            })
            ->with('course')
            ->orderBy('name', 'asc')
            ->paginate(100)
            ->withQueryString();

        // Get user notifications if user is authenticated
        $notifications = [];
        if (Auth::check()) {
            $notifications = Auth::user()->unreadNotifications->toArray();
        }

        return [
            'students' => $students,
            'courses' => Course::all(),
            'notifications' => $notifications,
        ];
    }
}
