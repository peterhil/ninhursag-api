app.alert = (msg, type) ->
    types = ['success', 'info', 'warning', 'danger']

    if not type or not _(types).include(type)
        type = 'info'

    alert = $('<div class="alert alert-' + type + ' fade in">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
       </div>')
    alert.append($('<div class="message">' + msg + '</div>'))
    alert

app.notify = (msg, type) ->
    $('#notifications').append app.alert(msg, type)

_(['success', 'info', 'warning', 'danger']).each (type) ->
    app.notify[type] = (msg) ->
        app.notify msg, type
