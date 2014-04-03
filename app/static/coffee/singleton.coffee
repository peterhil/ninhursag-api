class Singleton
    # Private
    instance = null    
 
    # Static singleton retriever/loader
    @instance: ->
        if not instance?
            instance = new @
            instance.init()
        instance

    init: (name = 'Unknown') ->
        debug.info "#{name} service initialized"
