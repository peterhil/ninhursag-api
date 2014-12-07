class App
    constructor: (@name, @config) ->
        @start = new Date(Date.now())
        console.info "App started at", @start

    apiUrl: ->
        if @config? then @config.preferred_url_scheme + '://' + @config.api_server else ''

    apiAuthToken: ->
        if @config? then @config.api_token else ''


class Timer
    constructor: () ->
        @start = new Date(Date.now())

    reset: () ->
        @start = new Date(Date.now())

    now: () ->
        new Date(Date.now() - @start)

    seconds: () ->
        @now() / 1000
