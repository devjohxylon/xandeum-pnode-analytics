export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, 100);
}

export function validateNodeId(nodeId: string): boolean {
  return /^XN-\d{4}$/.test(nodeId);
}

export function validateSearchQuery(query: string): boolean {
  return query.length <= 100 && /^[a-zA-Z0-9\s\-_,.]+$/.test(query);
}

export function sanitizeForDisplay(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function validateNumericValue(value: number, min: number, max: number): boolean {
  return !isNaN(value) && value >= min && value <= max;
}

