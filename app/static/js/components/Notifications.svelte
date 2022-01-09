<script>
    import Alert from './Alert.svelte'
    import { alerts } from '../stores/alerts'
</script>

<div id="notifications" class="columns">
    {#each [...$alerts.entries()] as [id, alert] (id) }
        <Alert type={alert.type} on:click={() => alerts.remove(id)}>
            {alert.message}
        </Alert>
    {/each}
</div>
