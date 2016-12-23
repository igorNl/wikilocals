<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use App\Sessions;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', array('as' => 'index', function()
{
    $params = array(
        'footer' => true,
        'page' => 'index'
    );

    return view('index')->with('params', $params);
}));

Route::get('map', ['as' => 'map', function()
{
    $params = array(
        'footer' => false,
        'page' => 'map'
    );

    Session::save();
    $session = Sessions::find(Session::getId());
    if ($session->hash === null)
    {
        $session->ip = $_SERVER['REMOTE_ADDR'];
        $session->port = $_SERVER['REMOTE_PORT'];
        $session->connection = $_SERVER['HTTP_CONNECTION'];
        $session->user_agent = $_SERVER['HTTP_USER_AGENT'];
        $session->save();
    }

    return view('map')->with('params', $params);
}]);

Route::post('types', 'TypesController@store');
Route::get('markers', 'MarkersController@getAll');
Route::get('markers/categories/lng_min={lng_min}&lat_min={lat_min}&lng_max={lng_max}&lat_max={lat_max}', 'MarkersController@getCategories');
Route::get('markers/lng_min={lng_min}&lat_min={lat_min}&lng_max={lng_max}&lat_max={lat_max}', 'MarkersController@getFromArea');
Route::get('markers/type={type}&lng_min={lng_min}&lat_min={lat_min}&lng_max={lng_max}&lat_max={lat_max}', 'MarkersController@getByType');
Route::post('markers/edit', 'MarkersController@edit');
Route::post('markers', 'MarkersController@store');
