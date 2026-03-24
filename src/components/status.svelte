<script lang="ts">
    import { settings } from "../lib/settings-manager.svelte";
    import { status } from "../lib/status-manager.svelte";

    let label: string = $derived.by(() => {
        if (status.isFasting === true) {
            return settings.reverse
                ? "حتى بداية الإفطار"
                : "تبقى على بداية الإفطار";
        } else if (status.isFasting === false) {
            return settings.reverse
                ? "حتى بداية الصيام"
                : "تبقى على بداية الصيام";
        } else {
            return "خطأ";
        }
    });
</script>

<span
    class="status"
    style:margin-top={settings.reverse ? settings.spacing + "px" : "0px"}>
    {label}
</span>

<style>
    span {
        font-size: 0.2em;
    }
</style>
