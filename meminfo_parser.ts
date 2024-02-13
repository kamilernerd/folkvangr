type Meminfo = {
  key: string;
  value: number;
  unit: string;
};

export default function MeminfoParse(raw: string): Array<Meminfo> {
  const lines = raw.split("\n");

  const t: Array<Meminfo> = [];
  for (let i = 0; i < lines.length; i++) {
    let parts = lines[i].split(" ");

    if (parts.length < 3) {
      continue;
    }

    parts[0] = parts[0].replace(":", "").trim();
    parts = parts.filter((p) => p !== "");

    t.push({
      key: parts[0],
      value: typeof parts[1] === "undefined" ? 0 : parseInt(parts[1]),
      unit: typeof parts[2] === "undefined" ? "" : parts[2],
    });
  }

  return t;
}
