<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Type;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class TypesController extends Controller
{
    public function generateStyleSheet(){
        $all_types = Type::all();
        $cascade = '';

        $all_types->each(function($type) use (&$cascade)
        {
            $rule = ".marker.".$type->type."{\n\t background-image: url(".$type->image_url.".png);\n}";
            $rule .= ".part-icon.".$type->type."{\n\t background-image: url(".$type->image_url."_min.png);\n}";
            $cascade .= $rule;
        });

        $destinationPath = 'css/';
        $mySheet = fopen($destinationPath."markers.css", "w") or die("Unable to open file!");
        fwrite($mySheet, $cascade);
        fclose($mySheet);
    }

    /**
     * @param Request $request
     */
    public function createType(Request $request){
        $params = array(
            "type" => ($request->input('type') != '') ? $request->input('type') : null,
            "px_offset_x" => 16,
            "px_offset_y" => 46,
            'image_url' => '/images/markers/'.$request->input('type')
        );

        Type::create($params);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store(Request $request)
    {
        $resource = NewMagickWand();
        $mask = NewMagickWand();
        $destinationPath = 'images/markers/';

        if($request->hasFile('image')){
            $fileName = $request->input('type');
            $mimeType = explode('/', $request->file('image')->getClientMimetype());

            $request->file('image')->move($destinationPath, 'tmp_'.$fileName.'.'.$mimeType[1]);
            MagickReadImage($resource, $destinationPath.'tmp_'.$fileName.'.'.$mimeType[1]);
            MagickReadImage($mask, "images/mask.png");

            if(MagickGetImageFormat($resource) !== 'PNG'){
                MagickSetImageFormat($resource, 'PNG');
            }

            MagickResizeImage($mask, MagickGetImageWidth($resource), MagickGetImageHeight($resource), MW_QuadraticFilter, 1.0);

            if(MagickCompositeImage($resource, $mask, MW_MultiplyCompositeOp, 0, 0)){
                MagickCompositeImage($resource, $mask, MW_CopyOpacityCompositeOp, 0, 0);
                MagickResizeImage($resource, 40, 50, MW_SincFilter, 1.0);
                MagickWriteImage($resource, $destinationPath.$fileName.'.png');
            }else{
                unlink($destinationPath.'tmp_'.$fileName.'.'.$mimeType[1]);
                echo MagickGetExceptionString($resource);
            }

            $this->createType($request);
            $this->generateMiniature($destinationPath.'tmp_'.$fileName.'.'.$mimeType[1], $fileName);
            $this->generateStyleSheet();
            unlink($destinationPath.'tmp_'.$fileName.'.'.$mimeType[1]);
        }
        return redirect('map');
    }

    public function generateMiniature($file, $name){
        $resource = NewMagickWand();
        $mask = NewMagickWand();
        $destinationPath = 'images/markers/';

        if($file){
            $fileName = $name;
            MagickReadImage($resource, $file);
            MagickReadImage($mask, "images/min-mask2.png");
            MagickResizeImage($mask, MagickGetImageWidth($resource), MagickGetImageHeight($resource), MW_QuadraticFilter, 1.0);

            if(MagickCompositeImage($resource, $mask, MW_MultiplyCompositeOp, 0, 0)){
                MagickCompositeImage($resource, $mask, MW_CopyOpacityCompositeOp, 0, 0);
                MagickResizeImage($resource, 24, 24, MW_SincFilter, 1.0);
                MagickWriteImage($resource, $destinationPath.$fileName.'_min.png');
            }else{
                echo MagickGetExceptionString($resource);
            }
        }
    }
}