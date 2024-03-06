# /proc scraper
This program scrapes /proc directory and gathers system-wide metrics and pid
metrics about memory and cpu usage. Exports data as prometheus metrics or json (server sent events).
This doesn't calculate the CPU time but shows utilization for each core.

Based on information gathered from
[Linux kernel manpage](https://www.kernel.org/doc/Documentation/filesystems/proc.txt)

# Configuration
You can provide your configuration file using ```--config-path=/some/path/config.toml``` or just place the config file in the same directory where your binary is.
If you don't provide ```config.toml``` configuration file default values are being used.

## Default configuration
```
port = 80
enable_api = false
enable_prometheus = false
```

If you enable the json api then you should connect to it like this using ```/sse``` url path. (Javascript web)
```
const sse = new EventSource("/sse");

sse.onmessage = (evt) => {
    console.log(evt.data);
};
```

If you want to use prometheus just use default ```/metrics``` url path.

# Building
Make sure to install Deno and that should be enough. This application is using some deno features that are currently ```unstable```.
Default path for building the binary is ```<project_root>/out/bin```.

To build run:
```make build```

Running in development
```make run```

# Drawing
![Drawing](https://github.com/kamilernerd/folkvangr/blob/master/drawing.png)
