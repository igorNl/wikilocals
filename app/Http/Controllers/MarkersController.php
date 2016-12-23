<?php

namespace App\Http\Controllers;

use App\Marker;
use App\SessionEventLog;
use App\Sessions;
use App\Type;
use App\TypeHistory;
use App\Revision;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;

class MarkersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAll()
    {
        return Marker::with('type')->get();
    }

    /**
     * @param $id
     * @return mixed
     */
    public function getMarkerById($id)
    {
        return Marker::find($id);
    }

    /**
     * Display a listing of the available categories.
     *
     * @param Request $request
     * @return array
     */
    public function getCategories(Request $request)
    {
        $result = array('avail' => array());
        $all_types = Type::all();

        if($all_types){
            //$all_types->each(function($type) use (&$request){});
            foreach($all_types as $typeKey=>$type)
            {
                unset($type['px_offset_x']);
                unset($type['px_offset_y']);

                foreach($type->marker as $markerKey=>$marker){
                    if(
                        $marker->lat > $request->route('lat_min') &&
                        $marker->lng > $request->route('lng_min') &&
                        $marker->lat < $request->route('lat_max') &&
                        $marker->lng < $request->route('lng_max')
                    ){
                        //..
                    }else{
                        unset($all_types[$typeKey]->marker[$markerKey]);
                    }
                }
            }
        }

        $all_types->each(function($type) use (&$result)
        {
            if (!array_key_exists($type->type, $result['avail'])) {
                $result['avail'][$type->type] = array(
                    'type_id'=> $type->id,
                    'count' => count($type->marker),
                );
                if($type->marker){
                }
            }else{
                //..
            }
        });

        $result['all'] = $all_types;
        return $result;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    public function redirectToMap()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @param bool $do_redirect
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store(Request $request, $do_redirect = true)
    {
        $sync = array();
        $params = array(
            "title" => ($request->input('title') != '') ? $request->input('title') : null,
            "description" => ($request->input('title') != '') ? $request->input('description') : null,
            "lat" => $request->input('lat'),
            "lng" => $request->input('lng')
        );

        if($request->input('type')){
            foreach($request->input('type') as $key=>$type){
                array_push($sync, $type);
            }
        }

        $marker = Marker::create($params);
        $marker->type()->sync($sync);

        if($do_redirect){
            return redirect('map');
        }else{
            return $marker;
        }
    }

    /**
     * Display the specified by type resource.
     *
     * @param Request $request
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getByType(Request $request)
    {
        return Marker::with('type')->whereHas('type', function($query) use (&$request){
                $query->whereIn('type.id', explode(',', $request->route('type')))
                    ->where('marker_revision.lat', '>', $request->route('lat_min'))
                    ->where('marker_revision.lng', '>', $request->route('lng_min'))
                    ->where('marker_revision.lat', '<', $request->route('lat_max'))
                    ->where('marker_revision.lng', '<', $request->route('lng_max'));
            })->get();
    }

    /**
     * Display the specified by coordinates resource.
     *
     * @param Request $request
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getFromArea(Request $request)
    {
        return Marker::with('type')
            ->where('lat', '>', $request->route('lat_min'))
            ->where('lng', '>', $request->route('lng_min'))
            ->where('lat', '<', $request->route('lat_max'))
            ->where('lng', '<', $request->route('lng_max'))
            ->get();
    }

    /**
     * Editing the specified resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function edit(Request $request)
    {
        $marker = $this->getMarkerById($request->input('id'));
        $detach = array();
        $exist = array();
        $sync = array();
        $old = array();

        foreach ($request->input('type') as $input){
            foreach ($marker->type as $type){
                if(array_search(intval($type->pivot->type_id), $old) === false){
                    array_push($old, intval($type->pivot->type_id));
                }

                if($type->pivot->type_id === intval($input)){
                    array_push($exist, intval($input));
                }else{
                    array_push($sync, intval($input));
                }
            }
        }

        if(count($exist) === 0){
            $detach = $old;
        }

        $marker->type()->detach($detach);
        $prev_revision = $marker;
        $marker->delete();

        $current_revision = $this->store($request, false);
        $this->changeType($request, $prev_revision, $current_revision, array_merge($exist, $sync));
        $this->storeRevisionId($current_revision['id']);

        return redirect('map');
    }

    /**
     * @param Request $request
     * @param $prev_revision
     * @param $current_revision
     * @param $type
     */
    public function changeType(Request $request, $prev_revision, $current_revision, $type){
        $current_revision->type()->sync($type);
        TypeHistory::create(array(
            "prev_revision_id" => $prev_revision['id'],
            "current_revision_id" => $current_revision['id'],
            'session_id' => Session::getId()
        ));

        $this->storeSerializedChanges($request, $current_revision['id']);
    }

    /**
     * @param Request $request
     * @return string
     */
    public function serializeChanges(Request $request){
        return json_encode($request->all());
    }

    /**
     * @param Request $request
     * @param $revision_id
     */
    public function storeSerializedChanges(Request $request, $revision_id){
        $session = Sessions::find(Session::getId());

        SessionEventLog::create(array(
            "event_data" => null,
            "revision_id" => $revision_id,
            'session_id' => Session::getId()
        ));

        $session->save();
        Session::save();//TODO: is it's necessary?
    }

    /**
     * @param $id
     */
    public function storeRevisionId($id){
        Revision::create(array(
            "revision_id" => $id
        ));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
