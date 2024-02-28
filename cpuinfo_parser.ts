type Cpuinfo = {
  key: string;
  value: string;
};

type RetVal = {
  [key: string]: string;
};

export default function CpuinfoParse(raw: string): Array<Array<Cpuinfo>> {
  const lines = raw.split("\n");

  const t: Array<Array<Cpuinfo>> = [];
  let tmp: Array<Cpuinfo> = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "") {
      t.push(tmp);
      tmp = [];
      continue;
    }

    let parts = lines[i].split(":");

    if (parts.length < 2) {
      continue;
    }

    parts[0] = parts[0].replace(":", "").trim();
    parts = parts.map((p) => p.trim());

    const key = typeof parts[0] === "undefined" ? "" : parts[0];
    const value = typeof parts[1] === "undefined" ? "" : parts[1];

    tmp.push({
      key: key.replace(" ", "_"),
      value: value,
    });
  }

  t[t.length - 1].length === 0 && t.pop(); // delete last element that is empty
  return t;
}

export function extractAndMergeCpuInfo(v: Array<Array<Cpuinfo>>): RetVal {
  const t: any = {
    cores: [],
  };
  for (let i = 0; i < v.length; i++) {
    for (const cpu of v[i]) {
      if (
        !cpu.key.includes("cpu_") && !cpu.key.includes("core_") &&
        !cpu.key.includes("processor")
      ) {
        t[cpu.key] = cpu.value;
      } else {
        if (t["cores"][i]) {
          t["cores"][i] = {
            ...t["cores"][i],
            [cpu.key]: cpu.value,
          };
        } else {
          t["cores"].push({
            [cpu.key]: cpu.value,
          });
        }
      }
    }
  }
  return t;
}
