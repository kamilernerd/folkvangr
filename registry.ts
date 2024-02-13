type MemoryUsage = Array<{ key: string; value: number; unit: string }>;

type CpuInfo = any;

type Process = {
  memory: MemoryUsage;
  stat: any;
  pid: number;
};

type IRegistry = {
  system: {
    memory: MemoryUsage;
    cpuinfo: CpuInfo;
    hadrddrive: any;
  };
  processes: Array<Process>;
};

export default class Registry {
  // private registry: IRegistry = [];
}
