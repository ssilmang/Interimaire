<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResponseController extends Controller
{
    public function response($response,$message,$data){
        return response()->json([
            'statut'=>$response,
            'message'=>$message,
            'data'=>$data,
        ]);
    }
}
