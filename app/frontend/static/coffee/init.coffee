# Loads the config and initializes and exposes the app on the global object.

app = {}

# Use mustache style {{}} template delimiters
_.templateSettings = {
    'escape': /{{([\s\S]+?)}}/g,
    'interpolate': /{{{([\s\S]+?)}}}/g
};

loadApp = ->
    timer = new Timer()
    $.ajax('/config.json', {
        async: false  # Synchronous loading is much faster
    })
    .done (config) =>
        app = new App(config.app_name or 'skeleton', config)
        debug.log "Config loaded in", timer.seconds(), 'seconds.'
    .fail (xhr) ->
        debug.error 'Error loading config: ' + xhr.status + ' ' + xhr.statusText

loadApp()
