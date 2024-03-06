import { parse } from "https://deno.land/std@0.207.0/toml/mod.ts";
import { parseArgs } from "https://deno.land/std@0.207.0/cli/parse_args.ts";

type Config = {
	port: number
	enable_api: boolean
	enable_prometheus: boolean
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
 
  if (!conf.port) {
    conf.port = 80;
  }

  if (!conf.enable_api) {
    conf.enable_api = false
  }

	if (!conf.enable_prometheus) {
		conf.enable_prometheus = false
	}

  return conf
}
