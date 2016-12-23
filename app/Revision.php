<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Revision extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'marker';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['revision_id'];
}
