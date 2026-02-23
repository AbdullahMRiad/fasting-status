import type { Duration } from "date-fns";
import updateStatus from "../utils/updateStatus";
import { prayerTimesManager } from "./prayer-times.svelte";

export class StatusManager {
    isFasting: boolean | null = $state(null);
    timeUntilNextEvent: Duration | null = $state(null);

    constructor() {
        $effect(() => {
            function update(i: boolean | null, t: Duration | null) {
                if (prayerTimesManager.prayerTimesResponse) {
                    console.log("Starting timer...");
                    i = updateStatus(
                        prayerTimesManager.prayerTimesResponse,
                    ).isFasting;
                    t = updateStatus(
                        prayerTimesManager.prayerTimesResponse,
                    ).timeUntilNextEvent;
                }
            }

            update(this.isFasting, this.timeUntilNextEvent);
            const timer = setInterval(update, 1000);
            return () => clearInterval(timer);
        });
    }
}

export const status = new StatusManager();
