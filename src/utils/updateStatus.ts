import type { AlAdhanTypes } from "@islamicnetwork/sdk";
import {
    addDays,
    compareAsc,
    getDay,
    intervalToDuration,
    parse,
    type Duration,
} from "date-fns";

export default function updateStatus(
    prayerTimesResponse: AlAdhanTypes.PrayerTimesResponse,
    overrideNow?: Date,
): {
    isFasting: boolean | null;
    nextEvent: "Maghrib" | "Fajr" | null;
    timeUntilNextEvent: Duration | null;
} {
    let isFasting: boolean | null = null;
    let nextEvent: "Maghrib" | "Fajr" | null = null;
    let timeUntilNextEvent: Duration | null = null;

    const fajrTime = prayerTimesResponse.data.timings.Fajr;
    const maghribTime = prayerTimesResponse.data.timings.Maghrib;

    const fajr: Date = parse(fajrTime, "HH:mm", new Date());
    const maghrib: Date = parse(maghribTime, "HH:mm", new Date());

    const now: Date = overrideNow ? overrideNow : new Date(Date.now());

    if (compareAsc(now, fajr) === 1 && compareAsc(now, maghrib) === -1) {
        isFasting = true;
        nextEvent = "Maghrib";
        timeUntilNextEvent = intervalToDuration({ start: now, end: maghrib });
    } else if (compareAsc(now, fajr) === -1 || compareAsc(now, maghrib) === 1) {
        isFasting = false;
        nextEvent = "Fajr";
        if (compareAsc(now, fajr) === -1) {
            timeUntilNextEvent = intervalToDuration({ start: now, end: fajr });
        } else {
            timeUntilNextEvent = intervalToDuration({
                start: now,
                end: addDays(fajr, 1),
            });
        }
    }

    return {
        isFasting,
        nextEvent,
        timeUntilNextEvent,
    };
}
