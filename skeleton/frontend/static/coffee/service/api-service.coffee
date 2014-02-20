class ApiService extends Singleton
    init: ->
        super "Api"

    get: (url, cb) ->
        self = @
        app.ajax self._api_url(url), (data) ->
            cb? data

    _api_url: (path) ->
        @_api_query_url(path) +
            '?auth_token=' + app.apiAuthToken()

    _api_query_url: (path) ->
        encodeURI app.apiUrl() + path


app.service ||= {}
app.service.api = ApiService.instance()
