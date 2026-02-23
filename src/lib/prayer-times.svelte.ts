import {
    AlAdhanClient,
    AlAdhanRequests,
    type AlAdhanTypes,
} from "@islamicnetwork/sdk";
import { settings } from "./settings-manager.svelte";
import { format } from "date-fns";

export class PrayerTimesManager {
    client: AlAdhanClient = AlAdhanClient.create();

    prayerTimesResponse: AlAdhanTypes.PrayerTimesResponse | null = $state(null);
    loading = $state(false);
    error: Error | null = $state(null);

    constructor() {
        $effect(() => {
            if (settings.isCoordsAvailable) {
                const fetchTimeout = setTimeout(() => {
                    this.loading = true;
                    this.error = null;
                    const request =
                        new AlAdhanRequests.DailyPrayerTimesByCoordinatesRequest(
                            format(Date.now(), "yyyy-MM-dd"),
                            settings.latitude!,
                            settings.longitude!,
                            new AlAdhanRequests.PrayerTimesOptions(),
                        );

                    this.client
                        .prayerTimes()
                        .dailyByCoordinates(request)
                        .then((r) => {
                            console.log("Prayer times received:", r);
                            this.prayerTimesResponse = r;
                        })
                        .catch((e) => {
                            this.error = e;
                            console.error("Error fetching prayer times:", e);
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                }, 1000);

                return () => clearTimeout(fetchTimeout);
            }
        });
    }
}

export const prayerTimesManager = new PrayerTimesManager();
