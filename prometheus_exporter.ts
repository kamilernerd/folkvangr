import { Gauge, Registry } from "https://deno.land/x/ts_prometheus/mod.ts";
import { data } from "./main.ts";

const registry = new Registry();
let metricsRegistryPids = {};
let metricsRegistrySystem = {};

const pid_rss = Gauge.with({
	name: "pid_rss_memory_total",
	help: "The RSS memory usage of a pid",
	labels: ["pid", "binary", "unit"],
});

const pid_pss = Gauge.with({
	name: "pid_pss_memory_total",
	help: "The PSS memory usage of a pid",
	labels: ["pid", "binary", "unit"],
});

const pid_page_size = Gauge.with({
	name: "pid_page_size_total",
	help: "The total page size of a pid",
	labels: ["pid", "binary", "unit"],
});

const system_mem_total = Gauge.with({
	name: "system_mem_total",
	help: "System memory total",
	labels: ["unit"],
});

const system_mem_free = Gauge.with({
	name: "system_mem_free",
	help: "System free memory",
	labels: ["unit"],
});

const system_mem_available = Gauge.with({
	name: "system_mem_available",
	help: "System memory available",
	labels: ["unit"],
});

const system_mem_cached = Gauge.with({
	name: "system_mem_cached",
	help: "System cached memory",
	labels: ["unit"],
});

const system_swap_cached = Gauge.with({
	name: "system_swap_cached",
	help: "System cached swap memory",
	labels: ["unit"],
});

const system_swap_total = Gauge.with({
	name: "system_swap_total",
	help: "System swap memory total",
	labels: ["unit"],
});

const system_swap_free = Gauge.with({
	name: "system_swap_free",
	help: "System free swap memory",
	labels: ["unit"],
});

const system_cpu = Gauge.with({
	name: "system_cpu",
	help: "The total page size of a pid",
	labels: ["core", "cpu_cores", "unit"],
});

metricsRegistryPids = {
	pid_page_size,
	pid_pss,
	pid_rss,
};

metricsRegistrySystem = {
	system_swap_total,
	system_swap_free,
	system_swap_cached,
	system_mem_total,
	system_mem_cached,
	system_mem_available,
	system_mem_free,
	system_cpu,
}

function metricsWriter() {
	const pids = data[0] as any;
	const systemMeminfo = data[1].values.meminfo
	const systemCpu = data[1].values.cpu.cores

	for (const pid of pids.values) {
		metricsRegistryPids["pid_page_size"].labels({
			binary: pid.exe,
			pid: pid.pid,
			unit: "kb",
		}).set(pid.meminfo.Size);

		metricsRegistryPids["pid_pss"].labels({
			binary: pid.exer,
			pid: pid.pid,
			unit: "kb",
		}).set(pid.meminfo.Pss);

		metricsRegistryPids["pid_rss"].labels({
			binary: pid.exe,
			pid: pid.pid,
			unit: "kb",
		}).set(pid.meminfo.Rss);
	}

	for (const cpu of systemCpu) {
		metricsRegistrySystem["system_cpu"].labels({
			core: cpu.core_id,
			cpu_cores: cpu.cpu_cores,
			unit: "MHz"
		}).set(cpu.cpu_MHz)
	}

	metricsRegistrySystem["system_swap_total"].labels({
		unit: "kb"
	}).set(systemMeminfo["SwapTotal"].value)

	metricsRegistrySystem["system_swap_cached"].labels({
		unit: "kb"
	}).set(systemMeminfo["SwapCached"].value)

	metricsRegistrySystem["system_swap_free"].labels({
		unit: "kb"
	}).set(systemMeminfo["SwapFree"].value)

	metricsRegistrySystem["system_mem_free"].labels({
		unit: "kb"
	}).set(systemMeminfo["MemFree"].value)

	metricsRegistrySystem["system_mem_total"].labels({
		unit: "kb"
	}).set(systemMeminfo["MemTotal"].value)

	metricsRegistrySystem["system_mem_available"].labels({
		unit: "kb"
	}).set(systemMeminfo["MemAvailable"].value)	

	metricsRegistrySystem["system_mem_cached"].labels({
		unit: "kb"
	}).set(systemMeminfo["Cached"].value)	
}

export function prometherusRegistryHttphandler(ctx) {
	metricsWriter()
	ctx.response.headers.set("Content-Type", "");
	ctx.response.body = Registry.default.metrics();
}
