export function traceFramedRecord(input) {
  const bytes = Array.from(input);
  const features = new Set();

  features.add(`length:${Math.min(bytes.length, 32)}`);
  if (bytes.length === 0) {
    features.add("input:empty");
    return features;
  }

  const firstMagic = bytes[0] === 0x46;
  features.add(firstMagic ? "magic:first" : "magic:first-miss");
  if (firstMagic) {
    const fullMagic = bytes[1] === 0x41;
    features.add(fullMagic ? "magic:full" : "magic:second-miss");
  }

  if (bytes.length > 2) {
    const version = bytes[2];
    features.add(version <= 3 ? `version:${version}` : "version:other");
  }

  if (bytes.length > 3) {
    const flags = bytes[3];
    let setBits = 0;
    for (let bit = 0; bit < 4; bit += 1) {
      if (flags & (1 << bit)) {
        features.add(`flag:${bit}`);
        setBits += 1;
      }
    }
    features.add(`flags-popcount:${setBits}`);
  }

  if (bytes.length > 4) {
    const declaredLength = bytes[4];
    const actualPayloadLength = Math.max(0, bytes.length - 6);
    features.add(
      declaredLength === actualPayloadLength
        ? "declared-length:match"
        : declaredLength < actualPayloadLength
          ? "declared-length:under"
          : "declared-length:over",
    );
    features.add(`declared-length-bucket:${Math.min(7, Math.floor(declaredLength / 4))}`);

    const payload = bytes.slice(5, -1);
    const asciiCount = payload.filter((value) => value >= 32 && value <= 126).length;
    features.add(`ascii-count-bucket:${Math.min(8, Math.floor(asciiCount / 2))}`);

    const text = String.fromCharCode(...payload);
    for (const token of ["PING", "DATA", "AUTH", "ZK", "FUZZ", "ADMIN"]) {
      if (text.includes(token)) features.add(`token:${token}`);
    }

    const hasOpenBrace = payload.includes(0x7b);
    const hasCloseBrace = payload.includes(0x7d);
    if (hasOpenBrace) features.add("brace:open");
    if (hasCloseBrace) features.add("brace:close");
    if (hasOpenBrace && hasCloseBrace) features.add("brace:pair");
  }

  if (bytes.length > 1) {
    let expectedChecksum = 0;
    for (let index = 0; index < bytes.length - 1; index += 1) expectedChecksum ^= bytes[index];
    const checksum = bytes.at(-1);
    features.add(checksum === expectedChecksum ? "checksum:match" : "checksum:miss");
    features.add(`checksum-low-nibble:${checksum & 0x0f}`);
  }

  return features;
}
