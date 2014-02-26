## Nginx as a reverse proxy

Add the following to your `nginx.conf` file’s `http` section:

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include sites-enabled/*.conf;

Make directories `sites-available/` and `sites-enabled/` on the same directory as `nginx.conf`.
Then create symbolic link for each vhost with:

    cd /etc/nginx/sites-enabled/
    ln -s ../sites-available/skeleton.conf

Example vhost config for skeleton.  
File `/etc/nginx/sites-available/skeleton.conf`:

    upstream skeleton {
       server localhost:5000;
    }

    server {
        listen *:80;
        server_name skeleton.dev;

        # Skeleton
        location / {
            proxy_pass http://skeleton;
            proxy_redirect default;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            # Https
            # proxy_set_header X-Forwarded-Proto https;
            # proxy_redirect http:// https://;

            add_header Pragma "no-cache";
            proxy_buffering off;

            access_log      /opt/local/var/log/nginx/skeleton_access.log;
            error_log       /opt/local/var/log/nginx/skeleton_error.log;
        }
    }

Optionally edit `/etc/hosts` to match the server names to localhost by adding following lines:

    127.0.0.1  skeleton.dev

On Mac OS X, you should issue the command `sudo dscacheutil -flushcache` afterwards to reload the hosts file.


