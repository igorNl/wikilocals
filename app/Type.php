<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Marker;

class Type extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'type';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['px_offset_x', 'px_offset_y', 'type', 'image_url'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['created_at', 'updated_at', 'pivot'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function marker()
    {
        return $this->belongsToMany('App\Marker', 'marker_type', 'type_id', 'marker_id')->withTimestamps();
    }
}
