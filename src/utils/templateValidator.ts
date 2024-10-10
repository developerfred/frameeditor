// utils/templateValidator.ts
interface ValidationError {
  component: string
  error: string
}

export function validateTemplate(components: any[]): ValidationError[] {
  const errors: ValidationError[] = []

  // Check if there's at least one component
  if (components.length === 0) {
    errors.push({ component: 'Template', error: 'Template must contain at least one component' })
  }

  // Check if there's a Cover component
  if (!components.some(c => c.type === 'Cover')) {
    errors.push({ component: 'Cover', error: 'Template must include a Cover component' })
  }

  // Validate individual components
  components.forEach((component, index) => {
    switch (component.type) {
      case 'Button':
        if (!component.props.label) {
          errors.push({ component: `Button ${index}`, error: 'Button must have a label' })
        }
        break
      case 'Input':
        if (!component.props.placeholder) {
          errors.push({ component: `Input ${index}`, error: 'Input should have a placeholder' })
        }
        break
      case 'Image':
        if (!component.props.src) {
          errors.push({ component: `Image ${index}`, error: 'Image must have a source' })
        }
        break
      // Add more component-specific validations here
    }
  })

  return errors
}
