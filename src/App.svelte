<script lang="ts">
    console.log("%cWelcome to the console, nerd.\n", "font-size: 2em;");
    console.log(
        "%cHere you can see the raw API response from Al Adhan API and various console logs I'm too lazy to remove :P.",
        "font-size: 1.5em;",
    );

    import "@fontsource-variable/bricolage-grotesque";
    import "@fontsource-variable/kufam";
    import "./app.css";
    // Text fonts
    import "@fontsource-variable/alexandria";
    import "@fontsource-variable/alyamama";
    import "@fontsource-variable/beiruti";
    import "@fontsource-variable/cairo";
    import "@fontsource-variable/cascadia-mono";
    import "@fontsource-variable/fustat";
    import "@fontsource-variable/handjet";
    import "@fontsource-variable/mada";
    import "@fontsource-variable/noto-naskh-arabic";
    import "@fontsource-variable/playpen-sans-arabic";
    import "@fontsource-variable/vazirmatn";
    // Time fonts
    import "@fontsource-variable/bricolage-grotesque";
    import "@fontsource-variable/playpen-sans";
    import "@fontsource-variable/oswald";
    import "@fontsource-variable/playfair-display";
    import "@fontsource-variable/orbitron";
    import "@fontsource-variable/jetbrains-mono";
    import "@fontsource-variable/spline-sans-mono";

    import { banner } from "./lib/banner-manager.svelte";
    import { prayerTimesManager } from "./lib/prayer-times.svelte";
    import { settings } from "./lib/settings-manager.svelte";
    import { status } from "./lib/status-manager.svelte";

    import Settings from "./components/settings/settings.svelte";
    import Status from "./components/status.svelte";
    import Time from "./components/time.svelte";
    import detectLocation from "./utils/detectLocation";
    import getLuminance from "./utils/getLuminance";
    import { TEXT_FONTS, TIME_FONTS } from "./constants";

    $effect(() => {
        banner.set(null);

        if (!settings.isCoordsAvailable) {
            banner.set("أدخل موقعك من الإعدادات", "warning");
        }

        if (prayerTimesManager.loading) {
            banner.set("جارٍ تحميل أوقات الصلاة...", "info");
        }

        if (prayerTimesManager.error) {
            banner.set(
                "حدث خطأ عند تحميل أوقات الصلاة: " + prayerTimesManager.error,
                "error",
            );
        }
    });

    $effect(() => {
        const root = document.documentElement;
        const contrast =
            getLuminance(settings.backgroundColor) > 0.179
                ? "#000000"
                : "#ffffff";
        root.style.setProperty("--bg-color", settings.backgroundColor);
        root.style.setProperty("--accent-color", settings.foregroundColor);
        root.style.setProperty("--fg-color", contrast);
        root.style.setProperty(
            "--btn-fg-color",
            getLuminance(settings.foregroundColor) > 0.179
                ? "#000000"
                : "#ffffff",
        );
        root.style.setProperty("--font-text", settings.textFontFamily);
        root.style.setProperty("--font-time", settings.timeFontFamily);
        root.style.setProperty("--font-weight", settings.fontWeight.toString());
        root.style.setProperty("--font-size-time", settings.fontSize + "px");
    });

    if (!settings.isCoordsAvailable) detectLocation();

    Promise.all(
        [...TEXT_FONTS, ...TIME_FONTS].map((font) =>
            document.fonts.load(`16px "${font}"`),
        ),
    ).then(() => console.log("All fonts loaded"));
</script>

<main
    style:background-color="var(--color-paper)"
    style:color="var(--color-accent)"
    style:font-size="{settings.fontSize}px"
    style:font-weight={settings.fontWeight}
    style:font-family={settings.textFontFamily}>
    <Settings />

    <p
        class="banner"
        class:blue={banner.current?.type === "info"}
        class:red={banner.current?.type === "error"}
        class:yellow={banner.current?.type === "warning"}
        class:hidden={!banner.current?.type ||
            !banner.current?.message ||
            !banner.current}>
        {banner.current.message}
    </p>
    {#if status.isFasting !== null}
        <div
            class="main-data"
            style:flex-direction={settings.reverse
                ? "column-reverse"
                : "column"}>
            <Status />
            <Time />
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

    .hidden {
        display: none;
    }

    .main-data {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
</style>
