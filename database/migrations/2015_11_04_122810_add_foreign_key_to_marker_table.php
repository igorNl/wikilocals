<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeyToMarkerTable extends Migration
{
    /**
     * Run the migrations which add a foreign key to the table.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('marker', function (Blueprint $table) {
            $table->foreign('revision_id')
                ->references('id')
                ->on('marker_revision');
        });
    }

    /**
     * Reverse the migrations which add a foreign key to the table.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('marker', function (Blueprint $table) {
            $table->dropForeign('marker_revision_id_foreign');
        });
    }
}
