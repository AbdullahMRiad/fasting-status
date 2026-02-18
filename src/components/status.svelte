<script lang="ts">
    let { isFasting }: { isFasting: boolean | null } = $props();

    let label: string = $derived.by(() => {
        if (isFasting === true) {
            return "يبدأ الإفطار بعد";
        } else if (isFasting === false) {
            return "يبدأ الصيام بعد";
        } else {
            return "خطأ";
        }
    });
</script>

<span class="status">{label}</span>

<style>
    span {
        font-size: 0.4em;
    }
</style>
