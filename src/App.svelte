<script lang="ts">
    console.log("%cWelcome to the console, nerd.\n", "font-size: 2em;");
    console.log(
        "%cHere you can see the raw API response from Al Adhan API.",
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

    import Settings from "./components/settings/settings.svelte";
    import Status from "./components/status.svelte";
    import Time from "./components/time.svelte";
    import updateStatus from "./utils/updateStatus";
    import { onDestroy } from "svelte";

    const searchParams = new URLSearchParams(window.location.search);

    let locationMode: "automatic" | "manual" =
        searchParams.get("locationMode") === "manual" ? "manual" : "automatic";
    let lat: number | null = searchParams.get("lat")
        ? parseFloat(searchParams.get("lat")!)
        : null;
    let lon: number | null = searchParams.get("lon")
        ? parseFloat(searchParams.get("lon")!)
        : null;
    let bgColor: string = searchParams.get("bgColor") ?? "#ffffff";
    let fgColor: string = searchParams.get("fgColor") ?? "#000000";
    let fontSize: number = searchParams.get("fontSize")
        ? parseInt(searchParams.get("fontSize")!)
        : 128;
    let fontWeight: number = searchParams.get("fontWeight")
        ? parseInt(searchParams.get("fontWeight")!)
        : 400;
    let fontFamily: string =
        searchParams.get("fontFamily") ??
        "Bricolage Grotesque Variable, Kufam Variable";

    let isCoordsAvailable: boolean = false;

    let isFasting: boolean | null = null;
    let nextEvent: "Maghrib" | "Fajr" | null = null;
    let timeUntilNextEvent: Duration | null = null;

    const client: AlAdhanClient = AlAdhanClient.create();

    let prayerTimesResponse: AlAdhanTypes.PrayerTimesResponse | null = null;
    let loading = false;
    let error: Error | null = null;
    let timer: number | undefined;
    let fetchTimer: number | undefined;

    $: if (lat && lon) {
        isCoordsAvailable = true;
        if (fetchTimer) window.clearTimeout(fetchTimer);
        fetchTimer = window.setTimeout(() => {
            loading = true;
            error = null;
            const request =
                new AlAdhanRequests.DailyPrayerTimesByCoordinatesRequest(
                    format(Date.now(), "yyyy-MM-dd"),
                    lat!,
                    lon!,
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
                    console.error("Error fetching prayer times:", e);
                    error = e;
                })
                .finally(() => (loading = false));
        }, 250);
    } else {
        if (fetchTimer) window.clearTimeout(fetchTimer);
        isCoordsAvailable = false;
    }

    function startTimer(response: AlAdhanTypes.PrayerTimesResponse) {
        console.log("Starting timer...");
        if (timer) window.clearInterval(timer);
        ({ isFasting, nextEvent, timeUntilNextEvent } = updateStatus(response));
        timer = window.setInterval(() => {
            const status = updateStatus(response);
            console.log("Timer tick:", status);
            ({ isFasting, nextEvent, timeUntilNextEvent } = status);
        }, 1000);
    }

    $: if (prayerTimesResponse) startTimer(prayerTimesResponse);

    onDestroy(() => {
        if (timer) {
            window.clearInterval(timer);
        }
        if (fetchTimer) {
            window.clearTimeout(fetchTimer);
        }
    });
</script>

<main
    style:background-color={bgColor}
    style:color={fgColor}
    style:font-size="{fontSize}px"
    style:font-weight={fontWeight}
    style:font-family={fontFamily}>
    <!-- settings button and panel -->
    <Settings
        bind:locationMode
        bind:lat
        bind:lon
        bind:bgColor
        bind:fgColor
        bind:fontSize
        bind:fontWeight
        bind:fontFamily />
    <!--            time           -->
    {#if !isCoordsAvailable}<p class="banner yellow">
            أدخل موقعك من الإعدادات
        </p>{/if}
    {#if loading}
        <p class="banner blue">جارٍ تحميل أوقات الصلاة...</p>
    {:else if error}
        <p class="banner red">خطأ في تحميل أوقات الصلاة: {error.message}</p>
    {:else if prayerTimesResponse}
        <div class="main-data">
            <Status
                content={isFasting
                    ? "صائم، الإفطار بعد"
                    : "مفطر، الصيام بعد"} />
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
