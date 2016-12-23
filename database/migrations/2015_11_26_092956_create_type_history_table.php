<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTypeHistoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('type_history', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('current_revision_id')->unsigned();
            $table->integer('prev_revision_id')->unsigned();
            $table->string('session_id', 100);
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
        Schema::drop('type_history');
    }
}
