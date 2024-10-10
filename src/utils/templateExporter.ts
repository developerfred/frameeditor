import { generateFrameTrainTemplate } from './codeGenerator'

export function exportTemplate(components: any[], config: any): string {
  const template = generateFrameTrainTemplate(components)
  
  
  const formattedTemplate = template.replace(/\n/g, '\n  ')

  const pullRequestTemplate = `
Title: Add new FrameTrain template: [Template Name]

Description:
This pull request adds a new template to the FrameTrain project. The template was created using the FrameTrain Visual Editor.

Template details:
- Name: [Template Name]
- Description: [Brief description of what the template does]
- Components: ${components.map(c => c.type).join(', ')}

\`\`\`typescript
${formattedTemplate}
\`\`\`

Please review and let me know if any changes are needed.
  `.trim()

  return pullRequestTemplate
}
