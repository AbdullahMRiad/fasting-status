<script lang="ts">
    import { Settings } from "@lucide/svelte";
    import { settings } from "../../lib/settings-manager.svelte";
    import { TIME_FONTS, TEXT_FONTS } from "../../constants";

    import detectLocation from "../../utils/detectLocation";

    let isSettingsShown: boolean = false;
    let settingsDialog: HTMLDialogElement;

    const toggleSettings = () => {
        if (!isSettingsShown) {
            settingsDialog.show();
        } else {
            settingsDialog.close();
        }
        isSettingsShown = !isSettingsShown;
    };
</script>

<div class="settings-container">
    <button
        on:click={() => toggleSettings()}
        class="btn-icon btn-ghost"
        title="toggle settings">
        <Settings />
    </button>
    <dialog
        class="settings-panel"
        bind:this={settingsDialog}
        on:close={() => {
            isSettingsShown = false;
        }}
        closedby="any"
        on:change={() => {
            settings.syncToURL();
        }}>
        <header>
            <h1>الإعدادات</h1>
        </header>
        <div class="controls">
            <span class="section-label">الموقع</span>
            <hr />
            <div class="location">
                <button
                    class="btn-primary"
                    on:click={() => {
                        detectLocation();
                    }}>
                    تحديد الموقع تلقائيًا
                </button>
                <label for="latitude" class="control">
                    <span class="label">دائرة العرض</span>
                    <input
                        type="number"
                        name="latitude"
                        id="latitude"
                        bind:value={settings.latitude}
                        on:change={() => {}} />
                </label>
                <label for="longitude" class="control">
                    <span class="label">خط الطول</span>
                    <input
                        type="number"
                        name="longitude"
                        id="longitude"
                        bind:value={settings.longitude} />
                </label>
            </div>
            <span class="section-label">المظهر</span>
            <hr />
            <div class="colors">
                <label for="bg-color" class="control">
                    <span class="label">لون الخلفية</span>
                    <div class="color-input">
                        <input
                            type="color"
                            name="bg-color"
                            id="bg-color"
                            bind:value={settings.backgroundColor} />
                        <input
                            type="text"
                            name="bg-color-text"
                            id="bg-color-text"
                            bind:value={settings.backgroundColor} />
                    </div>
                </label>
                <label for="fg-color" class="control">
                    <span class="label">لون النص</span>
                    <div class="color-input">
                        <input
                            type="color"
                            name="fg-color"
                            id="fg-color"
                            bind:value={settings.foregroundColor} />
                        <input
                            type="text"
                            name="fg-color-text"
                            id="fg-color-text"
                            bind:value={settings.foregroundColor} />
                    </div>
                </label>
            </div>
            <!-- <label class="control">
                <span class="label">خط النص</span>
                <select
                    name="text-font"
                    id="text-font"
                    bind:value={settings.textFontFamily}>
                    {#each TEXT_FONTS as font}
                        <option value={font}>
                            {font.replace(" Variable", "")}
                        </option>
                    {/each}
                </select>
            </label> -->
            <div class="control">
                <summary>
                    <span class="label">خط النص</span>
                </summary>
                <div class="font-list">
                    {#each TEXT_FONTS as font}
                        <button
                            class={font === settings.textFontFamily
                                ? "btn-primary"
                                : "btn-secondary"}
                            on:click={() => {
                                settings.textFontFamily = font;
                            }}
                            style:font-family={font}>
                            أبجد هوز
                        </button>
                    {/each}
                </div>
            </div>
            <!-- <label class="control">
                <span class="label">خط الوقت</span>
                <select
                    name="time-font"
                    id="time-font"
                    bind:value={settings.timeFontFamily}
                    style:font-family={settings.timeFontFamily}>
                    {#each TIME_FONTS as font}
                        <option value={font}>
                            {font.replace(" Variable", "")}
                        </option>
                    {/each}
                </select>
            </label> -->
            <div class="control">
                <summary>
                    <span class="label">خط الوقت</span>
                </summary>
                <div class="font-list">
                    {#each TIME_FONTS as font}
                        <button
                            class={font === settings.timeFontFamily
                                ? "btn-primary"
                                : "btn-secondary"}
                            on:click={() => {
                                settings.timeFontFamily = font;
                            }}
                            style:font-family={font}>
                            0123456789
                        </button>
                    {/each}
                </div>
            </div>
            <label class="control">
                <span class="label">حجم الخط</span>
                <div class="slider-control">
                    <input type="text" bind:value={settings.fontSize} />
                    <input
                        type="range"
                        max="512"
                        min="1"
                        bind:value={settings.fontSize} />
                </div>
            </label>
            <label class="control">
                <span class="label">سمك الخط</span>
                <div class="slider-control">
                    <input type="text" bind:value={settings.fontWeight} />
                    <input
                        type="range"
                        max="1000"
                        min="1"
                        bind:value={settings.fontWeight} />
                </div>
            </label>
            <label class="control">
                <span class="label">المسافة</span>
                <div class="slider-control">
                    <input type="text" bind:value={settings.spacing} />
                    <input
                        type="range"
                        max="150"
                        min="-100"
                        bind:value={settings.spacing} />
                </div>
            </label>
            <label class="control check-label">
                <input
                    type="checkbox"
                    name="reverse"
                    id="reverse-checkbox"
                    bind:checked={settings.reverse} />
                <span>تبديل مكان الوقت والنص</span>
            </label>
        </div>
        <footer>
            <span>
                صنع من قبل <a
                    href="https://www.github.com/AbdullahMRiad"
                    target="_blank"
                    rel="noopener noreferrer">
                    عبدالله
                </a>
            </span>
            <i class="separator"></i>
            <a
                href="https://www.github.com/AbdullahMRiad/fasting-status"
                target="_blank"
                rel="noopener noreferrer">
                اطلع على المصدر
            </a>
        </footer>
    </dialog>
</div>

<style>
    .settings-container {
        position: fixed;
        inset: 0;
    }

    .settings-panel {
        position: fixed;
        top: 0.5rem;
        right: 0.5rem;
        z-index: 1;
        width: 35vw;
        max-height: calc(100vh - 1rem);
        padding: 1rem;
        border: 0;
        border-radius: var(--radius-lg);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: scroll;
        font-size: var(--font-size);
        background-color: oklch(from var(--color-surface) l c h / 0.75);
        backdrop-filter: blur(1rem);
        color: var(--color-ink);
        opacity: 100%;
        scale: 1;
        transform-origin: top right;
        transition:
            scale var(--duration) var(--ease-elastic),
            translate var(--duration) var(--ease-elastic),
            opacity var(--duration) var(--ease-elastic);
        overscroll-behavior-y: none;
        resize: horizontal;
    }

    .settings-panel:not([open]) {
        opacity: 0%;
        scale: 0.5;
        pointer-events: none;
    }

    .settings-panel header {
        position: sticky;
        top: -1rem;
        left: 0;
        right: 0;
        margin: -1rem -1rem 0;
        padding: 1rem;
        padding-right: 4rem;
        display: flex;
        flex-direction: row;
        align-items: baseline;
        gap: 1rem;
        font-size: 1rem;
        font-weight: 500;
        background-color: var(--color-surface);
        border-bottom: 1px solid var(--color-rule);
        z-index: 10;
    }

    .controls {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    button[title="toggle settings"] {
        position: fixed;
        top: 1.25rem;
        right: 1.25rem;
        z-index: 10;
        rotate: 0deg;
        transition:
            top var(--duration) var(--ease-elastic),
            right var(--duration) var(--ease-elastic),
            rotate var(--duration) var(--ease-elastic);
    }

    .settings-container:has(dialog:not([open]))
        button[title="toggle settings"] {
        top: 0.5rem;
        right: 0.5rem;
    }

    button[title="toggle settings"] > :global(svg) {
        rotate: 0deg;
        transition: rotate var(--duration) var(--ease-elastic);
    }

    button[title="toggle settings"]:hover > :global(svg) {
        rotate: 60deg;
    }
    button[title="toggle settings"]:active > :global(svg) {
        rotate: 90deg;
    }

    .location {
        display: grid;
        grid-template:
            "btn btn"
            "lat lon";
        gap: 0.5rem;

        & > button {
            grid-area: btn;
        }

        & > .control:has(#latitude) {
            grid-area: lat;
        }

        & > .control:has(#longitude) {
            grid-area: lon;
        }
    }

    .colors {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }

    .color-input {
        position: relative;
        display: flex;
        align-items: center;
    }

    .color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input
        > input[type="color"] {
        position: absolute;
        left: 0.5em;
        padding: 0;
        width: unset;
        height: 2em;
        width: 2em;

        &::-moz-color-swatch {
            border: 0;
            padding: 0;
        }

        &::-webkit-color-swatch-wrapper {
            padding: 0;
        }

        &::-webkit-color-swatch {
            border: 0;
        }
    }

    .color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input.color-input
        > input[type="text"] {
        direction: ltr;
        padding-left: 3.15em;
    }

    .slider-control {
        display: flex;
        gap: 0.25rem;
        flex-direction: row-reverse;
        align-items: center;

        & > input[type="text"] {
            box-sizing: content-box;
            flex: 1 0;
            min-width: 4ch;
            text-align: center;
        }

        & > input[type="text"] {
            flex: 0 1;
        }
    }

    .font-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }

    footer {
        display: grid;
        grid-template-columns: 1fr 0.5rem 1fr;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        opacity: 0.5;

        & > :nth-child(1) {
            justify-self: end;
        }

        & > :nth-last-child {
            justify-self: start;
        }
    }

    @media (width <= 750px) {
        .settings-panel {
            inset: 1rem;
            width: auto;
            height: auto;
            position: fixed;
        }
    }
</style>
