<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Student;
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
            ->with('course')
            ->orderBy('name', 'asc')
            ->paginate(10)->withQueryString();

        return Inertia::render(
            'Students/Index',
            [
                'students' => $students,
                'courses' => Course::all(),
                'filters' => request()->all('search'),
            ]
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|unique:students,student_id',
            'name' => 'required',
            'course_id' => 'required',
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
        ]);

        $student->update($request->only(['student_id', 'name']));

        return redirect()->back()->with('success', 'Student updated successfully');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->back()->with('success', 'Student deleted successfully');
    }
}
