export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatId(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}
