app.ajax = (url, cb, settings) ->
    xhr_settings = {
        crossDomain: true,
        dataType: "json",
    }
    statusCode = {
        200: -> true,
        401: (xhr) =>
            app.notify.danger(
                _.template '<p><strong>Request failed:</strong> {{ status }} {{ status_text }}<br>{{ error }}</p>' +
                '<p>Please check that your authentication token matches that on the API you are using.</p>'
                {
                    status: xhr.status,
                    status_text: xhr.statusText,
                    error: xhr.responseJSON.error
                }
            )
        default: (xhr) =>
            app.notify.danger(
                _.template '<p><strong>Request for <code>{{url}}</code> failed:</strong> {{ status }} {{ text }}</p>', {status: xhr.status, text: xhr.statusText, url: url}
            )
    }
    $.ajax(url, cb, _(xhr_settings).extend(settings))
        .done (data) ->
            cb? data
        .fail (xhr, textStatus, errorThrown) =>
            switch xhr.status
                when 200, 401
                    statusCode[xhr.status](xhr)
                else
                    statusCode['default'](xhr)
