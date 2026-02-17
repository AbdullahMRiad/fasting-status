<script lang="ts">
    import type { AlAdhanTypes } from "@islamicnetwork/sdk";
    import {
        formatDuration,
        intervalToDuration,
        type Duration,
    } from "date-fns";

    let { duration }: { duration: Duration | null } = $props();
</script>

<div>
    {#if duration === null}
        <span class="duration">00:00:00</span>
    {:else}
        <span class="duration">
            {duration.hours
                ? duration.hours.toString().padStart(2, "0")
                : "00"}:{duration.minutes
                ? Math.abs(duration.minutes).toString().padStart(2, "0")
                : "00"}:{duration.seconds
                ? Math.abs(duration.seconds).toString().padStart(2, "0")
                : "00"}
        </span>
    {/if}
</div>
