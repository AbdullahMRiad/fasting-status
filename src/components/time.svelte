<script lang="ts">
    import { status } from "../lib/status-manager.svelte";
</script>

<div>
    {#if status.timeUntilNextEvent === null}
        <span class="duration">00:00:00</span>
    {:else}
        <span class="duration" dir="ltr">
            {#each [{ c: "hours", v: status.timeUntilNextEvent.hours }, { c: "minutes", v: status.timeUntilNextEvent.minutes }, { c: "seconds", v: status.timeUntilNextEvent.seconds }] as { c, v }}
                <span class={c}>
                    {v
                        ? v.toString().padStart(2, "0")
                        : "00"}{#if c !== "seconds"}:{/if}
                </span>
            {/each}
        </span>
    {/if}
</div>
