class Listing
    constructor: (container) ->
        @data = []
        @elem = $(container).text('Loading...')
        @url = app.apiUrl() + '/api/items'
        app.ajax(@url)
            .done (data) =>
                @elem.text 'Parsing data...'
                @show data

    show: (data) =>
        @elem.text ''
        if not data? or data.length == 0
            @elem.text('No items yet.')
            @data = []
            return false

        dust.render 'listing', data, (err, out) =>
            unless err
                @elem.html(out)
            else
                debug.error "Error:", err


if $('.listing').length > 0
    app.items = new Listing($('.listing'))
