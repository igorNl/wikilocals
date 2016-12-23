<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSessionEventLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('session_event_log', function (Blueprint $table) {
            $table->increments('id');
            $table->string('session_id');
            $table->integer('revision_id')->unsigned();
            $table->string('event_type', 32)->nullable();
            $table->json('event_data')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('session_event_log');
    }
}
