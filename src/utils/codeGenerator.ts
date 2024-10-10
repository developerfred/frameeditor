export function generateFrameTrainTemplate(components: any[]) {
  const handlers = generateHandlers(components)
  const initialConfig = generateInitialConfig(components)

  return `
import type { BaseConfig, BaseStorage, BaseTemplate } from '@/lib/types'
import Inspector from './Inspector'
import cover from './cover.avif'
import handlers from './handlers'
import icon from './icon.avif'

export interface Config extends BaseConfig {
  ${generateConfigInterface(components)}
}

export interface Storage extends BaseStorage {
  // Add custom storage properties here
}

export default {
  name: 'Custom Template',
  description: 'A custom FrameTrain template',
  shortDescription: 'Custom Frame',
  icon: icon,
  octicon: 'app',
  creatorFid: '1',
  creatorName: 'Custom Creator',
  cover,
  enabled: true,
  Inspector,
  handlers,
  initialConfig: ${JSON.stringify(initialConfig, null, 2)},
  events: [],
} satisfies BaseTemplate

${handlers}
  `
}

function generateConfigInterface(components: any[]) {
  // Extract unique props from all components
  const props = new Set()
  components.forEach(component => {
    Object.keys(component.props).forEach(prop => props.add(prop))
  })

  return Array.from(props).map(prop => `${prop}: string;`).join('\n  ')
}

export function generateInitialConfig(components: any[]) {
  const config: any = {}
  components.forEach(component => {
    Object.entries(component.props).forEach(([key, value]) => {
      config[key] = value
    })
  })
  return config
}

function generateHandlers(components: any[]) {
  // This is a simplified version. You'd need to analyze the components
  // to generate appropriate handlers.
  return `
const handlers = {
  initial: async ({ config }) => {
    return {
      buttons: [{ label: 'Start' }],
      image: config.coverImage,
      handler: 'start',
    }
  },
  start: async ({ config }) => {
    // Add logic based on components
    return {
      buttons: [{ label: 'Next' }],
      // Add more properties based on components
    }
  },
  // Add more handlers as needed
}

export default handlers
  `
}