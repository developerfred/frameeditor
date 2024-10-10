const isClient = typeof window !== 'undefined'

export function saveTemplate(name: string, components: any[]) {
  if (isClient) {
    const template = JSON.stringify({ name, components })
    localStorage.setItem(`template_${name}`, template)
  }
}

export function loadTemplate(name: string): { name: string, components: any[] } | null {
  if (isClient) {
    const template = localStorage.getItem(`template_${name}`)
    return template ? JSON.parse(template) : null
  }
  return null
}

export function listTemplates(): string[] {
  if (isClient) {
    return Object.keys(localStorage)
      .filter(key => key.startsWith('template_'))
      .map(key => key.replace('template_', ''))
  }
  return []
}