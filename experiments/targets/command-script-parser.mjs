function isPrintable(byte) {
  return byte >= 32 && byte <= 126;
}

function classifyKey(value) {
  if (!value) return "empty";
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) return "identifier";
  if (/^[0-9]+$/.test(value)) return "numeric";
  return "other";
}

export function traceCommandScript(input) {
  const bytes = Array.from(input);
  const features = new Set();
  features.add(`length-bucket:${Math.min(12, Math.floor(bytes.length / 4))}`);

  if (bytes.length === 0) {
    features.add("input:empty");
    return features;
  }

  const printable = bytes.filter(isPrintable).length;
  const printableRatio = printable / bytes.length;
  features.add(
    printableRatio === 1
      ? "printable:all"
      : printableRatio >= 0.75
        ? "printable:mostly"
        : printableRatio >= 0.25
          ? "printable:mixed"
          : "printable:low",
  );

  const text = String.fromCharCode(...bytes);
  const newlineCount = bytes.filter((byte) => byte === 0x0a).length;
  features.add(`newline-bucket:${Math.min(3, newlineCount)}`);
  if (text.includes("=")) features.add("separator:equals");
  if (text.includes(";")) features.add("separator:semicolon");
  if (text.includes(":")) features.add("separator:colon");
  if (text.includes('"')) features.add(text.split('"').length % 2 === 1 ? "quote:paired" : "quote:unpaired");

  const lines = text.split("\n").slice(0, 3);
  features.add(`line-count:${Math.min(3, lines.length)}`);

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    const trimmed = raw.trim();
    features.add(trimmed.length ? `line:${index}:nonempty` : `line:${index}:empty`);
    if (!trimmed) continue;

    const firstSpace = trimmed.indexOf(" ");
    const command = (firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace)).toUpperCase();
    const argument = firstSpace === -1 ? "" : trimmed.slice(firstSpace + 1).trim();
    const known = ["PING", "GET", "SET", "AUTH", "DEL", "BATCH"].includes(command);
    features.add(known ? `command:${command}` : "command:unknown");
    features.add(`command-length:${Math.min(8, command.length)}`);

    if (command === "PING") {
      features.add(argument ? "ping:argument" : "ping:bare");
    } else if (command === "GET" || command === "DEL") {
      features.add(`${command.toLowerCase()}:key:${classifyKey(argument)}`);
      if (argument === "admin" || argument === "token") features.add(`${command.toLowerCase()}:sensitive-key`);
    } else if (command === "SET") {
      const equal = argument.indexOf("=");
      features.add(equal === -1 ? "set:missing-equals" : "set:has-equals");
      if (equal !== -1) {
        const key = argument.slice(0, equal).trim();
        const value = argument.slice(equal + 1).trim();
        features.add(`set:key:${classifyKey(key)}`);
        features.add(value ? "set:value:present" : "set:value:empty");
        if (key === "admin" || key === "token") features.add("set:sensitive-key");
        if (value.includes("FUZZ") || value.includes("ZK")) features.add("set:special-value");
      }
    } else if (command === "AUTH") {
      const bearer = argument.startsWith("Bearer ");
      features.add(bearer ? "auth:bearer" : argument ? "auth:other" : "auth:missing");
      const token = bearer ? argument.slice(7) : argument;
      features.add(`auth:token-length:${Math.min(4, Math.floor(token.length / 4))}`);
      if (token === "admin" || token === "token" || token === "secret") features.add("auth:known-token");
    } else if (command === "BATCH") {
      const segments = argument.split(";").filter(Boolean);
      features.add(`batch:segments:${Math.min(4, segments.length)}`);
      if (segments.some((segment) => /\b(?:GET|SET|DEL|AUTH|PING)\b/i.test(segment))) features.add("batch:known-subcommand");
    }
  }

  return features;
}
