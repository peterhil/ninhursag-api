## Installation

### 1. Checkout this repository from git

    git clone https://github.com/peterhil/skeleton skeleton-git

### 2. Make sure a Python version greater than or equal to 3.8 is installed

Most Linux distributions come with Python already installed, if not see [the Python documentation](https://docs.python.org/3/using/index.html) for instructions on how to install Python.

### 3. Install the system requirements

#### Install the dependencies:

Command `port` refers to using Macports on Mac OS X. If you are using a different operating system, replace the `port` command with your system’s package manager (for example `apt-get` or `yum`) on all commands below:

    sudo easy_install pip
    sudo pip install virtualenv
    sudo port install node  # <-- replace port with the command for your package manager
    sudo npm install -g less
    sudo npm install -g grunt-cli

### 4. Install Python into [virtualenv](http://www.virtualenv.org/en/latest/virtualenv.html) and install Python dependencies with [pip](http://www.pip-installer.org/en/latest/)

    cd skeleton-git
    virtualenv -p python3.8 venv/py38
    source ./venv/py38/bin/activate

    # Install the application's Python package and dependencies with pip
    pip install .

    # Alternatively install using standard python installation
    python setup.py install

*Note!* An activated virtualenv can be deactivated with:

    deactivate

### 5. Install the node components

    cd skeleton-git
    npm install

Build modernizr:

    cd app/static/vendor/modernizr && ./bin/modernizr >/dev/null && cd -

Build zurb-foundation:

    cd app/static/vendor/zurb-foundation
    # open README.md
    npm install
    bower install
    bundle install
    grunt build
    cd -

### 6. Start the app

*Note!* These steps should also work with just `npm start`.

    cd skeleton-git
    source ./activate  # <-- Adds some node components into the path and activates the virtualenv
    FLASK_ENV=development DEBUG=true ASSETS_DEBUG=true flask run  # or python run.py
    open http://localhost:5000/  # or: open http://skeleton.dev/ if using nginx and have set hosts


## Configuration

The application’s default settings can be found on `app/settings.py`.

These can be overridden by copying the defaut settings file to `instance/settings.py`. Edit that file to suit your needs, and drop unmodified values to prevent shadowing the default settings.

At minimum you should set `SECRET_KEY` to some unguessable and randomish value. You might also want to set `SERVER_NAME` to match your development server address (possibly with a port number).

For a more fine detailed configuration, see the [list of built-in settings](http://flask.pocoo.org/docs/config/#builtin-configuration-values) on [Flask documentation](http://flask.pocoo.org/docs/).

Some of these settings are exported to front end from the route `/config.json` at `app/frontend/views.py` and are available from Javascript at `app.config` with the keys lower cased.


## Nginx as a reverse proxy

On production and maybe even on development, you should set up Nginx as a reverse proxy to your application or use some other [Flask production deployment option](http://flask.pocoo.org/docs/deploying/). See [docs/nginx.md](docs/nginx.md) on how to do that.


## Development

When doing development, link a Python egg to sources instead of installing a package:

    python setup.py develop

### Using YAML for fixtures

To import YAML data, do `import YAML` on views.py and use like this:

    @app.route('/example')
    @templated()
    def example():
        with file('app/data/example.yml', 'r') as stream:
            data = yaml.load(stream)
        return dict(examplelist=data)
