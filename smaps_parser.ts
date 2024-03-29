type SmapsInfo = {
  value: any;
  unit: string;
};

type Retval = { [key: string]: SmapsInfo };

export default function PidSmapsParse(raw: string): Retval {
  const lines = raw.split("\n");

  const t: Retval = {};
  for (let i = 0; i < lines.length; i++) {
    let parts = lines[i].split(" ");

    parts[0] = parts[0].replace(":", "").trim();
    parts = parts.filter((p) => p !== "");

    if (typeof parts[0] === "undefined") {
      continue;
    }

    if (parts.length > 3) {
      continue;
    }

    let value;
    if (typeof parts[1] === "string" && isNaN(parts[1] as any)) {
      value = parts[1];
    } else {
      value = parseInt(parts[1]);
    }

    const unit = typeof parts[2] === "undefined" ? "" : parts[2];

    if (t[parts[0]]) {
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
