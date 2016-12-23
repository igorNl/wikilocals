<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Marker;
use App\Type;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        $this->call('TypeTableSeeder');
        $this->call('RevisionTableSeeder');
        $this->call('MarkerTypeRelationSeeder');

        Model::reguard();
    }
}

class RevisionTableSeeder extends Seeder
{
    /**
     * Run the database seed that feel the marker_revision table.
     *
     * @return void
     */
    public function run()
    {
        $markers = array(
            [
                'px_offset_x' => null,
                'px_offset_y' => null,
                'title' => null,
                'description' => null,
                'lat' => '49.99604324334497',
                'lng' => '36.292991638183594',
                'created_at' => new DateTime,
                'updated_at' => new DateTime
            ],
            [
                'px_offset_x' => null,
                'px_offset_y' => null,
                'title' => null,
                'description' => null,
                'lat' => '50.01237240110261',
                'lng' => '36.265525817871094',
                'created_at' => new DateTime,
                'updated_at' => new DateTime
            ],
            [
                'px_offset_x' => null,
                'px_offset_y' => null,
                'title' => null,
                'description' => null,
                'lat' => '49.97418880321091',
                'lng' => '36.23771667480469',
                'created_at' => new DateTime,
                'updated_at' => new DateTime
            ],
            [
                'px_offset_x' => null,
                'px_offset_y' => null,
                'title' => null,
                'description' => null,
                'lat' => '49.97330558682922',
                'lng' => '36.28578186035156',
                'created_at' => new DateTime,
                'updated_at' => new DateTime
            ],
            [
                'px_offset_x' => null,
                'px_offset_y' => null,
                'title' => null,
                'description' => null,
                'lat' => '50.01722594591283',
                'lng' => '36.23291015625',
                'created_at' => new DateTime,
                'updated_at' => new DateTime
            ]
        );

        DB::table('marker_revision')->insert($markers);
    }
}

class TypeTableSeeder extends Seeder
{
    /**
     * Run the database seed that feel the type table.
     *
     * @return void
     */
    public function run()
    {
        $types = array(
            /*[
                'type' => 'hotel',
                'px_offset_x' => 16,
                'px_offset_y' => 16,
                'created_at' => new DateTime,
                'updated_at' => new DateTime,
                'image_url' => 'images/markers/'
            ],*/
            [
                'type' => 'cinema',
                'px_offset_x' => 16,
                'px_offset_y' => 46,
                'created_at' => new DateTime,
                'updated_at' => new DateTime,
                'image_url' => '/images/markers/cinema'
            ],
            [
                'type' => 'restaurant',
                'px_offset_x' => 16,
                'px_offset_y' => 46,
                'created_at' => new DateTime,
                'updated_at' => new DateTime,
                'image_url' => '/images/markers/place_to_eat'
            ]
        );

        DB::table('type')->insert($types);
    }
}

class MarkerTypeRelationSeeder extends Seeder
{
    /**
     * Run the database seeds that set's the relations between tables type and marker_revision.
     *
     * @return void
     */
    public function run()
    {
        $marker = Marker::find(1);
        $marker->type()->sync([2]);

        $marker = Marker::find(2);
        $marker->type()->sync([1]);

        $marker = Marker::find(3);
        $marker->type()->sync([1]);

        $marker = Marker::find(4);
        $marker->type()->sync([2]);

        $marker = Marker::find(5);
        $marker->type()->sync([2]);
    }
}

class MarkerRevisionRelationSeeder extends Seeder
{
    /**
     * Run the database seeds that set's the relations between tables marker and marker_revision.
     *
     * @return void
     */
    public function run()
    {

    }
}
