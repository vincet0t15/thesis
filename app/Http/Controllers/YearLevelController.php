<?php

namespace App\Http\Controllers;

use App\Models\YearLevel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class YearLevelController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string',
        ]);

        $yearLevels = YearLevel::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name', 'asc')
            ->paginate(10)->withQueryString();


        return Inertia::render(
            'YearLevels/Index',
            [
                'yearLevels' => $yearLevels,
                'filters' => request()->all('search'),
            ]
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $yearLevel = YearLevel::create($request->all());

        return redirect()->back()->with('success', 'Year level created successfully');
    }

    public function update(Request $request, YearLevel $yearLevel)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $yearLevel->update($request->all());

        return redirect()->back()->with('success', 'Year level updated successfully');
    }

    public function destroy(YearLevel $yearLevel)
    {
        $yearLevel->delete();

        return redirect()->back()->with('success', 'Year level deleted successfully');
    }
}
