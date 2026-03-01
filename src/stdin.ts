export async function readStdinUrls(): Promise<string[]> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks)
    .toString("utf-8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
