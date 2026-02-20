<!-- TODO: a ton of serious refactoring to split this behemoth -->

<script lang="ts">
    console.log("%cWelcome to the console, nerd.\n", "font-size: 2em;");
    console.log(
        "%cHere you can see the raw API response from Al Adhan API and various console logs I'm too lazy to remove :P.",
        "font-size: 1.5em;",
    );

    import "./app.css";
    import "@fontsource-variable/bricolage-grotesque";
    import "@fontsource-variable/kufam";

    import { format, type Duration } from "date-fns";
    import {
        AlAdhanClient,
        AlAdhanRequests,
        type AlAdhanTypes,
    } from "@islamicnetwork/sdk";

    import { SettingsManager } from "./lib/settings-manager.svelte";

    import Settings from "./components/settings/settings.svelte";
    import Status from "./components/status.svelte";
    import Time from "./components/time.svelte";
    import updateStatus from "./utils/updateStatus";

    const settings = new SettingsManager();

    let isFasting: boolean | null = $state(null);
    let nextEvent: "Maghrib" | "Fajr" | null = $state(null);
    let timeUntilNextEvent: Duration | null = $state(null);

    const client: AlAdhanClient = AlAdhanClient.create();

    let prayerTimesResponse: AlAdhanTypes.PrayerTimesResponse | null =
        $state(null);
    let loading = $state(false);
    let error: Error | null = $state(null);

    $effect(() => {
        if (settings.isCoordsAvailable) {
            const fetchTimeout = setTimeout(() => {
                loading = true;
                error = null;
                const request =
                    new AlAdhanRequests.DailyPrayerTimesByCoordinatesRequest(
                        format(Date.now(), "yyyy-MM-dd"),
                        settings.latitude!,
                        settings.longitude!,
                        new AlAdhanRequests.PrayerTimesOptions(),
                    );

                client
                    .prayerTimes()
                    .dailyByCoordinates(request)
                    .then((r) => {
                        console.log("Prayer times received:", r);
                        prayerTimesResponse = r;
                    })
                    .catch((e) => {
                        error = e;
                        console.error("Error fetching prayer times:", e);
                    })
                    .finally(() => {
                        loading = false;
                    });
            }, 1000);

            return () => clearTimeout(fetchTimeout);
        }
    });

    $effect(() => {
        function update() {
            if (prayerTimesResponse) {
                console.log("Starting timer...");
                ({ isFasting, nextEvent, timeUntilNextEvent } =
                    updateStatus(prayerTimesResponse));
            }
        }

        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    });
</script>

<main
    style:background-color={settings.backgroundColor}
    style:color={settings.foregroundColor}
    style:font-size="{settings.fontSize}px"
    style:font-weight={settings.fontWeight}
    style:font-family={settings.fontFamily}>
    <!-- settings button and panel -->
    <Settings {settings} />
    <!--            time           -->
    {#if !settings.isCoordsAvailable}<p class="banner yellow">
            أدخل موقعك من الإعدادات
        </p>{/if}
    {#if loading}
        <p class="banner blue">جارٍ تحميل أوقات الصلاة...</p>
    {:else if error}
        <p class="banner red">خطأ في تحميل أوقات الصلاة: {error.message}</p>
    {:else if prayerTimesResponse}
        <div class="main-data">
            <Status {isFasting} />
            <Time duration={timeUntilNextEvent} />
        </div>
    {/if}
</main>

<style>
    .banner {
        text-align: center;
        padding-block: 0.5rem;
        position: fixed;
        inset: 0;
        bottom: auto;
        font-size: 16px;
    }

    .banner.red {
        background-color: hsl(0deg 100% 90%);
        color: black;
    }

    .banner.yellow {
        background-color: hsl(50deg 100% 90%);
        color: black;
    }

    .banner.blue {
        background-color: hsl(200deg 100% 90%);
        color: black;
    }

    .main-data {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
</style>
