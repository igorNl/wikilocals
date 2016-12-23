<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SessionEventLog extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'session_event_log';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['event_data', 'event_type', 'session_id', 'revision_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];
}
