<script>
    export let title = 'Loading...'
</script>

<div class="loading" title="{title}">
    <div class="spinner"></div>
</div>

<style lang="scss">
    @use 'sass:color';

    @import '../../style/variables';

    .loading {
        position: relative;
        width: 4rem;
        height: 4rem;
        margin: 2rem auto;
        text-indent: -9999em;  /* hide text */
        overflow: hidden;
    }

    .loading .spinner {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border-radius: 50%;
        background-color: $color-loading;
        background: linear-gradient(
            to right,
            $color-loading 10%,
            color.change($color-loading, $alpha: 0) 42%
        );
        animation: loading 1.4s infinite linear;
        transform: translateZ(0);
    }

    .loading .spinner:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 50%;
        border-radius: 100% 0 0 0;
        background: $color-loading;
    }

    .loading .spinner:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: $loading-ratio;
        height: $loading-ratio;
        margin: auto;
        border-radius: 50%;
        background: $loading-bg;
    }

    @keyframes loading {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>
