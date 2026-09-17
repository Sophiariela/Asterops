// Generic {{key}} placeholder substitution shared by the template engine.
// Unmatched placeholders are left as-is rather than silently dropped, so a
// typo in a stored pattern is visible instead of producing blank copy.
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => (key in vars ? vars[key] : match));
}
