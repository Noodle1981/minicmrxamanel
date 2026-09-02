<?php

namespace App\Services;

use App\Models\Quote;
use Carbon\Carbon;

class QuoteCalculationService
{
    /**
     * Calcula la fecha de entrega sumando días hábiles (excluyendo sábados y domingos).
     */
    public function calculateBusinessDeliveryDate(Carbon|string $startDate, int $businessDays): Carbon
    {
        $date = is_string($startDate) ? Carbon::parse($startDate) : $startDate->copy();

        if ($businessDays <= 0) {
            return $date;
        }

        $addedDays = 0;
        while ($addedDays < $businessDays) {
            $date->addDay();
            // 6 = Sábado, 0 / 7 = Domingo
            if (! $date->isWeekend()) {
                $addedDays++;
            }
        }

        return $date;
    }

    /**
     * Calcula la cantidad de días hábiles necesarios para una cantidad de horas totales
     * dada una capacidad diaria del equipo.
     */
    public function calculateRequiredBusinessDays(float $totalHours, float $hoursPerDay = 8.0): int
    {
        if ($hoursPerDay <= 0) {
            $hoursPerDay = 8.0;
        }

        if ($totalHours <= 0) {
            return 1;
        }

        return (int) ceil($totalHours / $hoursPerDay);
    }

    /**
     * Genera el siguiente código de cotización único (ej. QUO-2026-0001).
     */
    public function generateQuoteNumber(): string
    {
        $year = date('Y');
        $lastQuote = Quote::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = 1;
        if ($lastQuote && preg_match('/QUO-'.$year.'-(\d+)/', $lastQuote->quote_number, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
        }

        return sprintf('QUO-%s-%04d', $year, $nextNumber);
    }
}
