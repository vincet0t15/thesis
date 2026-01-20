<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Student;
use App\Models\YearLevel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    //STUDENTS
    public function index()
    {
        $students = Student::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('student_id', 'like', "%{$search}%");
            })
            ->when(request('course_id'), function ($query, $courseId) {
                if ($courseId !== 'all') {
                    $query->where('course_id', $courseId);
                }
            })
            ->when(request('year_level_id'), function ($query, $yearLevelId) {
                if ($yearLevelId !== 'all') {
                    $query->where('year_level_id', $yearLevelId);
                }
            })
            ->with(['course', 'yearLevel'])
            ->orderBy('name', 'asc')
            ->paginate(10)->withQueryString();

        return Inertia::render(
            'Students/Index',
            [
                'students' => $students,
                'courses' => Course::all(),
                'yearLevels' => YearLevel::all(),
                'filters' => request()->all(['search', 'course_id', 'year_level_id']),
            ]
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|unique:students,student_id',
            'name' => 'required',
            'course_id' => 'required',
            'year_level_id' => 'nullable|exists:year_levels,id',
        ]);

        Student::create($request->all());

        return redirect()->back()->with('success', 'Student created successfully');
    }

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'student_id' => 'required|unique:students,student_id,' . $student->id,
            'name' => 'required',
            'course_id' => 'required',
            'year_level_id' => 'nullable|exists:year_levels,id',
        ]);

        $student->update($request->only(['student_id', 'name', 'course_id', 'year_level_id']));

        return redirect()->back()->with('success', 'Student updated successfully');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->back()->with('success', 'Student deleted successfully');
    }
}
