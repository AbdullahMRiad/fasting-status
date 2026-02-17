<script lang="ts">
    let { content }: { content: string } = $props();
</script>

<span class="status">{content}</span>

<style>
    span {
        font-size: 0.4em;
    }
</style>
