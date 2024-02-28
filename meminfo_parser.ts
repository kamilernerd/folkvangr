type Meminfo = {
  value: number;
  unit: string;
};

type Retval = {
  [key: string]: Meminfo;
};

export default function MeminfoParse(raw: string): Retval {
  const lines = raw.split("\n");

  const t: Retval = {};
  for (let i = 0; i < lines.length; i++) {
    let parts = lines[i].split(" ");

    if (parts.length < 3) {
      continue;
    }

    parts[0] = parts[0].replace(":", "").trim();
    parts = parts.filter((p) => p !== "");

    const value = typeof parts[1] === "undefined" ? 0 : parseInt(parts[1]);
    const unit = typeof parts[2] === "undefined" ? "" : parts[2];

    if (t[parts[0]] && t[parts[0]]) {
      t[parts[0]].value += value;
    } else {
      t[parts[0]] = {
        value,
        unit,
      };
    }
  }

  return t;
}
