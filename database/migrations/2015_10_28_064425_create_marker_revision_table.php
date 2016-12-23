<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMarkerRevisionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('marker_revision', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('px_offset_x')->nullable();
            $table->integer('px_offset_y')->nullable();
            $table->string('title', 64)->nullable();
            $table->text('description')->nullable();
            $table->string('lat', 64);
            $table->string('lng', 64);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('marker_revision');
    }
}
