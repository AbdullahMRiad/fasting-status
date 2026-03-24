<script lang="ts">
    import { settings } from "../lib/settings-manager.svelte";
    import { status } from "../lib/status-manager.svelte";
</script>

<div
    style:font-family={settings.timeFontFamily}
    style:font-variant-numeric="tabular-nums"
    style:margin-top={!settings.reverse ? settings.spacing + "px" : "0px"}>
    {#if status.timeUntilNextEvent === null}
        <span class="duration">00:00:00</span>
    {:else}
        <span class="duration" dir="ltr">
            {#each [{ c: "hours", v: status.timeUntilNextEvent.hours }, { c: "minutes", v: status.timeUntilNextEvent.minutes }, { c: "seconds", v: status.timeUntilNextEvent.seconds }] as { c, v }}
                <span class={c} style:width="2ch">
                    <span style:width="1ch">
                        {v ? v.toString().padStart(2, "0").charAt(0) : "0"}
                    </span>
                    <span style:width="1ch">
                        {v ? v.toString().padStart(2, "0").charAt(1) : "0"}
                    </span>
                </span>
                {#if c !== "seconds"}
                    <span class="colon">:</span>
                {/if}
            {/each}
        </span>
    {/if}
</div>

<style>
    .duration,
    .duration > span {
        display: flex;
        flex-direction: row;
    }

    .duration > span {
        text-align: center;
    }
</style>
