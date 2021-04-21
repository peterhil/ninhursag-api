<script>
    import { values } from 'ramda'
    export let data
</script>

<header>
    {#each data.header as header}
    {header}<br>
    {/each}
</header>

<table class="table table-striped table-hover table-scroll">
    <thead>
        <tr>
            {#each data.series as header}
            <th>{header}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each values(data.data) as row}
        <tr>
            {#each values(row) as cell}
            <td>{cell}</td>
            {/each}
        </tr>
        {/each}
    </tbody>
</table>

<footer>
    {#each data.footer as footer}
    {footer}<br>
    {/each}
</footer>
