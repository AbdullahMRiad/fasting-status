<script lang="ts">
    export let locationMode: "automatic" | "manual" = "automatic";
    export let lat: number | null = null;
    export let lon: number | null = null;
    export let bgColor: string = "#ffffff";
    export let fgColor: string = "#000000";
    export let fontSize: number = 16;
    export let fontWeight: number = 400;
    export let fontFamily: string = "Bricolage Grotesque";

    let isSettingsShown: boolean = false;

    function detectLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
            });
        } else {
            alert("Geolocation is not available");
        }
    }
</script>

<div class="settings-container">
    <button
        on:click={() => {
            isSettingsShown = !isSettingsShown;
        }}
        class="settings-toggle">
        الإعدادات
    </button>
    <div
        class={`settings-panel settings-${isSettingsShown ? "shown" : "hidden"}`}>
        <section>
            <label>
                <input
                    type="radio"
                    bind:group={locationMode}
                    value="automatic" />
                تحديد الموقع تلقائيًا
            </label>
            <label>
                <input type="radio" bind:group={locationMode} value="manual" />
                إدخال الموقع يدويًا
            </label>
        </section>

        {#if locationMode === "automatic"}
            <button on:click={detectLocation}>تحديد الموقع</button>
        {:else}
            <section>
                <label>
                    دائرة العرض:
                    <input
                        type="number"
                        bind:value={lat}
                        step="any"
                        placeholder="0.0000" />
                </label>
                <label>
                    خط الطول:
                    <input
                        type="number"
                        bind:value={lon}
                        step="any"
                        placeholder="0.0000" />
                </label>
            </section>
        {/if}

        <hr />

        <section>
            <label>
                لون الخلفية:
                <input type="color" bind:value={bgColor} />
            </label>
            <label>
                لون النص:
                <input type="color" bind:value={fgColor} />
            </label>
        </section>

        <section>
            <label>
                الخط:
                <input type="text" bind:value={fontFamily} />
            </label>
            <label>
                حجم الخط (بكسل):
                <input type="number" bind:value={fontSize} />
            </label>
            <label>
                سمك الخط:
                <input
                    type="range"
                    min="1"
                    max="1000"
                    bind:value={fontWeight} />
                <input
                    type="number"
                    min="1"
                    max="1000"
                    width="18px"
                    bind:value={fontWeight} />
            </label>
        </section>
    </div>
</div>

<style>
    .settings-container {
        position: fixed;
        bottom: 4px;
        right: 4px;
        display: flex;
        flex-direction: column-reverse;
        gap: 4px;
        align-items: start;
    }

    .settings-panel {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid #ccc;
        width: max-content;
        background-color: white;
        color: black;
        font-size: 16px;
        font-weight: 400;
        transition:
            opacity 250ms cubic-bezier(0.49, 1.48, 0.61, 0.99),
            translate 250ms cubic-bezier(0.49, 1.48, 0.61, 0.99),
            scale 250ms cubic-bezier(0.49, 1.48, 0.61, 0.99);
        transition-property: opacity, translate, scale;
        border-radius: 16px;
        box-shadow: 0px 4px 24px rgb(0 0 0 / 0.2);
    }

    .settings-panel.settings-hidden {
        pointer-events: none;
        opacity: 0;
        translate: 40% 55%;
        scale: 0.25 0.1;
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 1rem;
    }

    .settings-toggle {
        width: min-content;
    }
</style>
