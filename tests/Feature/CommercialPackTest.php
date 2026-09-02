<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\CommercialPack;
use App\Models\Feature;
use App\Models\Quote;
use App\Models\SoftwareType;
use App\Models\User;
use Database\Seeders\CommercialPackSeeder;
use Database\Seeders\FeatureSeeder;
use Database\Seeders\SoftwareTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommercialPackTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            SoftwareTypeSeeder::class,
            FeatureSeeder::class,
            CommercialPackSeeder::class,
        ]);
    }

    public function test_commercial_packs_are_seeded_with_expected_definitions(): void
    {
        $this->assertDatabaseCount('commercial_packs', 4);

        $comercio = CommercialPack::where('slug', 'comercio-b2b')->first();
        $this->assertNotNull($comercio);
        $this->assertEquals(202, $comercio->total_hours);
        $this->assertEquals(4500, $comercio->price_min_usd);
        $this->assertEquals(5200, $comercio->price_max_usd);
        $this->assertEquals(320, $comercio->monthly_maintenance_usd);
        $this->assertGreaterThanOrEqual(9, $comercio->features()->count());

        $industria = CommercialPack::where('slug', 'industria-planta')->first();
        $this->assertNotNull($industria);
        $this->assertEquals(268, $industria->total_hours);

        $servicios = CommercialPack::where('slug', 'servicios-consultoria')->first();
        $this->assertNotNull($servicios);
        $this->assertEquals(238, $servicios->total_hours);

        $ambiente = CommercialPack::where('slug', 'cumplimiento-ambiental')->first();
        $this->assertNotNull($ambiente);
        $this->assertEquals(186, $ambiente->total_hours);
    }

    public function test_red_zone_features_are_excluded_from_presets(): void
    {
        // 1. Telemetría IoT en Faena no debe pertenecer a preset minería
        $iotMining = Feature::where('slug', 'iot-sensors-mining')->first();
        $this->assertFalse((bool) $iotMining->is_preset_mining);

        // 2. Offline-First no debe pertenecer a minería, ambiente ni industria
        $offline = Feature::where('slug', 'offline-sync-mobile')->first();
        $this->assertFalse((bool) $offline->is_preset_mining);
        $this->assertFalse((bool) $offline->is_preset_environment);
        $this->assertFalse((bool) $offline->is_preset_industry);

        // 3. Logística APIs no debe pertenecer a comercio
        $logistics = Feature::where('slug', 'logistics-shipping-api')->first();
        $this->assertFalse((bool) $logistics->is_preset_commerce);

        // 4. Chatbot WhatsApp no debe pertenecer a comercio ni servicios
        $chatbot = Feature::where('slug', 'ai-chatbot-whatsapp')->first();
        $this->assertFalse((bool) $chatbot->is_preset_commerce);
        $this->assertFalse((bool) $chatbot->is_preset_services);

        // 5. Sensores OEE no debe pertenecer a industria
        $oee = Feature::where('slug', 'iot-oee-factory-sensors')->first();
        $this->assertFalse((bool) $oee->is_preset_industry);
    }

    public function test_authenticated_user_can_access_quotes_create_with_commercial_packs(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('quotes.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Quotes/Create')
            ->has('commercialPacks', 4)
            ->has('features')
        );
    }

    public function test_quote_can_be_stored_with_pack_id(): void
    {
        $user = User::factory()->create();
        $client = Client::create([
            'company_name' => 'Empresa Test',
            'contact_name' => 'Juan Perez',
            'email' => 'juan@test.com',
            'industry' => 'comercio',
        ]);
        $softwareType = SoftwareType::first();
        $pack = CommercialPack::where('slug', 'comercio-b2b')->first();
        $featureIds = $pack->features->pluck('id')->toArray();

        $response = $this->actingAs($user)->post(route('quotes.store'), [
            'client_id' => $client->id,
            'software_type_id' => $softwareType->id,
            'pack_id' => $pack->id,
            'title' => 'Propuesta Comercio B2B Automatizado',
            'preset_used' => 'comercio',
            'hourly_rate' => 25,
            'team_capacity_hours_per_day' => 8,
            'selected_feature_ids' => $featureIds,
        ]);

        $quote = Quote::latest('id')->first();
        $this->assertNotNull($quote);
        $this->assertEquals($pack->id, $quote->pack_id);
        $this->assertEquals('Propuesta Comercio B2B Automatizado', $quote->title);

        $response->assertRedirect(route('quotes.show', $quote->id));
    }
}
