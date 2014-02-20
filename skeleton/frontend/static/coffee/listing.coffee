class Listing
    constructor: (container) ->
        @data = []
        @container = $(container).text('Loading...')
        @url = app.apiUrl() + '/api/items'
        app.ajax(@url)
            .done (data) =>
                @container.text 'Parsing data...'
                @show data

    show: (data) =>
        @container.text ''
        if not data? or data.length == 0
            @container.text('No items yet.')
            @data = []
            return false

        debug.debug(data)
        _(data['items']).forEach (item) =>
            $item = $('<div class="item"/>')
                .append('<p><a href="' + item.url + '">' + item.url + '</a></p>')
            @container.append $item


if $('.listing').length > 0
    app.items = new Listing($('.listing'))
