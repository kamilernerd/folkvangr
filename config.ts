import { parse } from "https://deno.land/std@0.207.0/toml/mod.ts";
import { parseArgs } from "https://deno.land/std@0.207.0/cli/parse_args.ts";

type Config = {
  config: {
    port: number
    enable_gui: boolean
    hostname: string
  }
  cluster: {
    nodes: Array<string>
  }
	prometheus: {
		enabled: boolean
		prom_port: number
	}
}

function findConfig(): string {
  const flags = parseArgs(Deno.args, {
    string: ["config-path"],
    default: {
      "config-path": "config.toml"
    }
  });

  let path = `${Deno.cwd()}/${flags["config-path"]}` // Default config path is where binary is currently located
  if (flags["config-path"] && flags["config-path"] !== "") {
    path = flags["config-path"]
  }
 
  try {
    const decoder = new TextDecoder();
    return decoder.decode(Deno.readFileSync(path));
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(error);
      return "";
    }
  }
  return ""
}

export function loadConfig(): Config {
  const config = findConfig() 
  const conf = parse(config) as Config
 
  // Set config defaults if these options are missing from config file
	if (!conf.config) {
		conf.config = {}
	}

	if (!conf.prometheus) {
		conf.prometheus = {}
	}

	if (!conf.cluster) {
		conf.cluster = { nodes: [] }
	}
	
  if (!conf.config.port) {
    conf.config.port = 80;
  }

  if (!conf.config.hostname) {
    conf.config.hostname = Deno.hostname()
  }

  if (!conf.config.enable_gui) {
    conf.config.enable_gui = false
  }

	if (!conf.prometheus.enabled) {
		conf.prometheus.enabled = false
	}

	if (!conf.prometheus.prom_port) {
		conf.prometheus.prom_port = 81
	}

	if (!conf.cluster.nodes) {
		conf.cluster.nodes = []
	}

  return conf
}
