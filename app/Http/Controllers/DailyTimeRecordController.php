<?php

namespace App\Http\Controllers;

use App\Imports\LogsImport;
use App\Interface\DTRInterface;
use App\Jobs\ProcessLogsImport;
use App\Models\Event;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;

class DailyTimeRecordController extends Controller
{

    protected $dTRInterface;

    public function __construct(DTRInterface $dTRInterface)
    {
        $this->dTRInterface = $dTRInterface;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');

        $data = $this->dTRInterface->index($request);
        $events = Event::where('is_active', true)
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })->get();

        return Inertia::render('DTR/index', [
            'events' => $events,
            'students' => $data['students'],
            'courses' => $data['courses'],
            'filters' => [
                'search' => $request->input('search'),
                'selectedYear' => $request->input('selectedYear'),
                'selectedMonth' => $request->input('selectedMonth'),
                'course_id' => $request->course_id,
            ],
            'notifications' => $data['notifications'] ?? [],
        ]);
    }

    public function print(Request $request)
    {

        if ($request->event_id) {
            $event = Event::findOrFail($request->event_id);
            $date_from = Carbon::parse($event->date_from)->startOfDay();
            $date_to   = Carbon::parse($event->date_to)->endOfDay();

            $year  = $date_from->year;
            $month = $date_from->month;
        } else {
            $year = $request->selectedYear ?? Carbon::now()->year;
            $month = $request->selectedMonth ?? Carbon::now()->month;

            $date_from = Carbon::createFromDate($year, $month, 1)->startOfDay();
            $date_to = $date_from->copy()->endOfMonth()->endOfDay();
            $event = null;
        }


        $start = Carbon::createFromDate($year, $month, 1);
        $end = $start->copy()->endOfMonth();
        $forTheMonthOf = $start->format('F') . ' 1–' . $end->format('d, Y');


        $students = Student::with([
            'Logs' => fn($query) =>
            $query->whereBetween('date_time', [$date_from, $date_to])
                ->when($request->event_id, fn($q) => $q->where('event_id', $request->event_id))
                ->orderBy('date_time')
        ])->whereIn('id', $request->student)
            ->get();

        $allRecords = [];

        $daysInMonth = collect();
        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $daysInMonth->push($date->toDateString());
        }

        foreach ($students as $student) {
            $logsByDate = $student->Logs->groupBy(fn($log) => Carbon::parse($log->date_time)->toDateString());
            $records = [];
            $allLogs = collect();

            foreach ($daysInMonth as $dateStr) {
                $date = Carbon::parse($dateStr);
                $dayLogs = $logsByDate[$dateStr] ?? collect();

                $sortedLogs = $dayLogs->sortBy('date_time')->values();
                $pairs = [];
                $currentIn = null;




                foreach ($sortedLogs as $log) {
                    if ($log->checkType === 0) {
                        if ($currentIn === null) {
                            $currentIn = $log;
                        } else {
                            // If we already have an IN entry, don't replace it
                            // This ensures we keep the first IN entry
                            continue;
                        }
                    } else {
                        if ($currentIn !== null) {
                            if (Carbon::parse($log->date_time)->gt(Carbon::parse($currentIn->date_time))) {
                                $pairs[] = ['in' => $currentIn, 'out' => $log];
                                $currentIn = null;
                            } else {
                                $pairs[] = ['in' => $currentIn, 'out' => null];
                                $pairs[] = ['in' => null, 'out' => $log];
                                $currentIn = null;
                            }
                        } else {
                            $pairs[] = ['in' => null, 'out' => $log];
                        }
                    }
                }

                if ($currentIn !== null) {
                    $pairs[] = ['in' => $currentIn, 'out' => null];
                }

                $amIn = $amOut = $pmIn = $pmOut = null;
                $amInCandidates = [];
                $amOutCandidates = [];
                $pmInCandidates = [];
                $pmOutCandidates = [];

                // Separate all IN and OUT times based on hour
                foreach ($pairs as $pair) {
                    $inTime = $pair['in'] ? Carbon::parse($pair['in']->date_time) : null;
                    $outTime = $pair['out'] ? Carbon::parse($pair['out']->date_time) : null;

                    if ($inTime) {
                        if ($inTime->hour < 12) {
                            $amInCandidates[] = $inTime;
                        } else {
                            $pmInCandidates[] = $inTime;
                        }
                    }

                    if ($outTime) {
                        if ($outTime->hour < 13) {
                            $amOutCandidates[] = $outTime;
                        } else {
                            $pmOutCandidates[] = $outTime;
                        }
                    }
                }

                // Assign AM IN (earliest morning entry)
                if (count($amInCandidates)) {
                    $amIn = min($amInCandidates);
                }

                // Assign AM OUT (latest morning departure, but must be after AM IN)
                if (count($amOutCandidates)) {
                    if ($amIn) {
                        $validAmOuts = array_filter($amOutCandidates, function ($t) use ($amIn) {
                            return $t->gte($amIn);
                        });
                        if (count($validAmOuts)) {
                            $amOut = max($validAmOuts);
                        } else {
                            // If no valid AM OUT after AM IN, it might be an overnight shift
                            // In this case, don't assign AM OUT to avoid confusion
                            $amOut = null;
                        }
                    } else {
                        // If no AM IN, take the latest AM OUT (might be an incomplete entry)
                        $amOut = max($amOutCandidates);
                    }
                }

                // Assign PM IN (earliest afternoon entry, but must be after AM OUT if it exists)
                if (count($pmInCandidates)) {
                    if ($amOut) {
                        $validPmIns = array_filter($pmInCandidates, function ($t) use ($amOut) {
                            return $t->gt($amOut);
                        });
                        if (count($validPmIns)) {
                            $pmIn = min($validPmIns);
                        }
                    } else {
                        // If no AM OUT, take the earliest PM IN
                        $pmIn = min($pmInCandidates);
                    }
                }

                // Assign PM OUT (latest afternoon departure, but must be after PM IN)
                if (count($pmOutCandidates)) {
                    if ($pmIn) {
                        $validPmOuts = array_filter($pmOutCandidates, function ($t) use ($pmIn) {
                            return $t->gte($pmIn);
                        });
                        if (count($validPmOuts)) {
                            $pmOut = max($validPmOuts);
                        }
                    } else {
                        // If no PM IN, take the latest PM OUT
                        $pmOut = max($pmOutCandidates);
                    }
                }

                // Ensure that if no value is found, the variable is null (not empty string)
                if ($amIn === false) $amIn = null;
                if ($amOut === false) $amOut = null;
                if ($pmIn === false) $pmIn = null;
                if ($pmOut === false) $pmOut = null;

                // Compute late only for weekdays and only if there are logs for the day
                $lateMinutes = 0;

                if (
                    !in_array($date->dayOfWeek, [Carbon::SATURDAY, Carbon::SUNDAY]) &&
                    ($dayLogs->count() > 0)
                ) {
                    // Get event time_in if set, else default to 08:00:00
                    $timeIn = $event?->time_in ?? '08:00:00';
                    [$flexHour, $flexMinute] = explode(':', $timeIn);

                    // Expected start times
                    $standardAMIn = $date->copy()->setTime((int) $flexHour, (int) $flexMinute);
                    $standardPMIn = $date->copy()->setTime(13, 0);

                    $hasAMLog = $dayLogs->first(fn($log) => Carbon::parse($log->date_time)->hour < 13) !== null;
                    $hasPMLog = $dayLogs->first(fn($log) => Carbon::parse($log->date_time)->hour >= 13) !== null;

                    // Check AM late
                    if ($hasAMLog && $amIn) {
                        $amIn = $amIn->copy()->seconds(0)->startOfMinute();
                        if ($amIn->greaterThan($standardAMIn)) {
                            $lateMinutes += $standardAMIn->diffInMinutes($amIn);
                        }
                    }

                    // Check PM late
                    if ($hasPMLog && $pmIn) {
                        $pmIn = $pmIn->copy()->seconds(0)->startOfMinute();
                        if ($pmIn->greaterThan($standardPMIn)) {
                            $lateMinutes += $standardPMIn->diffInMinutes($pmIn);
                        }
                    }
                }
                $logs = $dayLogs->map(fn($log) => [
                    'datetime' => $log->date_time,
                    'type' => $log->checkType === 0 ? 'in' : 'out',
                ])->values();

                $hasUnmatched = collect($pairs)->contains(fn($pair) => !$pair['in'] || !$pair['out']);
                $records[] = [
                    'date' => $dateStr,
                    'am_in' => $amIn ? $amIn->format('g:i') : '',
                    'am_out' => $amOut ? $amOut->format('g:i') : '',
                    'pm_in' => $pmIn ? $pmIn->format('g:i') : '',
                    'pm_out' => $pmOut ? $pmOut->format('g:i') : '',
                    'late_minutes' => (int) round($lateMinutes),
                    'logs' => $logs,
                    'hasUnmatched' => $hasUnmatched,
                ];

                $allLogs = $allLogs->merge($logs);
            }

            $totalIn = $allLogs->where('type', 'in')->count();
            $totalOut = $allLogs->where('type', 'out')->count();

            $allRecords[] = [
                'student_id' => $student->id,
                'student_name' => $student->name,
                'records' => $records,
                'forTheMonthOf' => $forTheMonthOf,
                'totalIn' => $totalIn,
                'totalOut' => $totalOut,
            ];
        }

        return Inertia::render('DTR/DTR', [
            'dtr' => $allRecords,
        ]);
    }

    public function importLogs(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv'
        ]);

        // Store the file temporarily
        $filePath = $request->file('file')->store('temp');

        // Dispatch the job to process the import in the background
        ProcessLogsImport::dispatch($filePath);

        return redirect()->back()->withSuccess('Import started successfully. Large files are processed in the background and may take several minutes to complete.');
    }
}
