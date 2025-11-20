/**
 * Simple lunar phase calculator.
 *
 * Uses a known new moon reference and the average synodic month length
 * to estimate the current phase.
 */

function getCurrentLunarPhase(date = new Date()) {
    // Length of a synodic month (new moon to new moon) in days
    const SYNODIC_MONTH = 29.53058867;

    // Reference new moon: 2000-01-06 18:14 UTC
    // (commonly used epoch for simple phase calculations)
    const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14); // Jan = 0

    const nowUtc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );

    const daysSinceReference = (nowUtc - REFERENCE_NEW_MOON) / 86400000; // ms → days

    // Age of the moon in days within the current cycle
    let moonAge = daysSinceReference % SYNODIC_MONTH;
    if (moonAge < 0) moonAge += SYNODIC_MONTH; // wrap negative modulo

    // Map moon age to 8 main phases
    const phaseIndex = Math.floor((moonAge / SYNODIC_MONTH) * 8 + 0.5) & 7;

    const phaseNames = [
        "New Moon",
        "Waxing Crescent",
        "First Quarter",
        "Waxing Gibbous",
        "Full Moon",
        "Waning Gibbous",
        "Last Quarter",
        "Waning Crescent",
    ];

    return {
        phase: phaseNames[phaseIndex],
        ageDays: moonAge,
        cycleFraction: moonAge / SYNODIC_MONTH,
    };
}


export const moon = { getCurrentLunarPhase };