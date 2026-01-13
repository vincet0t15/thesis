<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    //
    public function index(Request $request)
    {
        $search = $request->input('search');

        $courses = Course::when($request, function ($query) use ($search) {
            $query->where('course_name', 'like', '%' . $search . '%');
            $query->orWhere('course_code', 'like', '%' . $search . '%');
        })
            ->paginate(25)
            ->withQueryString();

        return inertia('Courses/Index', [
            'courses' => $courses,
            'filters' => $request->only('search')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_name' => 'required|string|max:255',
            'course_code' => 'required|string|max:255',
        ]);

        Course::create($request->all());

        return redirect()->back()->with('success', 'Course created successfully');
    }

    public function destroy(Request $request, Course $course)
    {
        $course->delete();

        return redirect()->back()->with('success', 'Course deleted successfully');
    }

    public function update(Request $request, Course $course)
    {


        $request->validate([
            'course_name' => 'required|string|max:255',
            'course_code' => 'required|string|max:255',
        ]);

        $course->update($request->all());

        return redirect()->back()->with('success', 'Course updated successfully');
    }
}
