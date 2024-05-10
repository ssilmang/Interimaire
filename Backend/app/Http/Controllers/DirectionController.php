<?php

namespace App\Http\Controllers;

// use App\Http\Requests\StoreDirectionRequest;
use App\Http\Requests\UpdateDirectionRequest;
use App\Models\Direction;
use Illuminate\Http\Request;

class DirectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    try {
        $request->validate([
            'libelle' => 'required|string',
            'locau_id' => 'required|exists:locaus,id'
        ]);

        $direction = Direction::create([
            'libelle' => $request->libelle,
            'locau_id' => $request->locau_id
        ]);

        return response()->json(['status' => 201, 'data' => $direction]);
    } catch (\Exception $e) {
        return response()->json(['status' => 500, 'message' => 'An error occurred while storing the direction.', 'error' => $e->getMessage()], 500);
    }

}

    /**
     * Display the specified resource.
     */
    public function show(Direction $direction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Direction $direction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDirectionRequest $request, Direction $direction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Direction $direction)
    {
        //
    }
}
