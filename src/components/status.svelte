<script lang="ts">
    import { status } from "../lib/status-manager.svelte";

    let label: string = $derived.by(() => {
        if (status.isFasting === true) {
            return "يبدأ الإفطار بعد";
        } else if (status.isFasting === false) {
            return "يبدأ الصيام بعد";
        } else {
            return "خطأ";
        }
    });
</script>

<span class="status">{label}</span>

<style>
    span {
        font-size: 0.2em;
    }
</style>
