<?php

namespace Database\Factories;

use App\Models\Feature;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Feature>
 */
class FeatureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(3, true);

        return [
            'category' => 'Core',
            'name' => ucfirst($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1000, 9999),
            'description' => fake()->sentence(),
            'hours_dev' => 20,
            'hours_integration' => 8,
            'hours_testing_qa' => 10,
            'cost_setup_infra' => 150,
            'cost_monthly_infra' => 30,
            'is_preset_mining' => false,
            'is_preset_environment' => false,
            'is_preset_commerce' => false,
            'is_preset_industry' => false,
            'is_preset_services' => false,
            'is_active' => true,
        ];
    }

    public function environment(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Medio Ambiente',
            'is_preset_environment' => true,
        ]);
    }

    public function mining(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'Minería HSE',
            'is_preset_mining' => true,
        ]);
    }
}
