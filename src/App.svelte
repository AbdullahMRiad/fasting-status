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

    import type { Duration } from "date-fns";

    import { settings } from "./lib/settings-manager.svelte";
    import { prayerTimesManager } from "./lib/prayer-times.svelte";
    import { status } from "./lib/status-manager.svelte";

    import Settings from "./components/settings/settings.svelte";
    import Status from "./components/status.svelte";
    import Time from "./components/time.svelte";
    import updateStatus from "./utils/updateStatus";
</script>

<main
    style:background-color={settings.backgroundColor}
    style:color={settings.foregroundColor}
    style:font-size="{settings.fontSize}px"
    style:font-weight={settings.fontWeight}
    style:font-family={settings.fontFamily}>
    <!-- settings button and panel -->
    <Settings />
    <!--            time           -->
    {#if !settings.isCoordsAvailable}<p class="banner yellow">
            أدخل موقعك من الإعدادات
        </p>{/if}
    {#if prayerTimesManager.loading}
        <p class="banner blue">جارٍ تحميل أوقات الصلاة...</p>
    {:else if prayerTimesManager.error}
        <p class="banner red">
            خطأ في تحميل أوقات الصلاة: {prayerTimesManager.error.message}
        </p>
    {:else if prayerTimesManager.prayerTimesResponse}
        <div class="main-data">
            <Status isFasting={status.isFasting} />
            <Time duration={status.timeUntilNextEvent} />
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
