'use client'
import { generateFrameTrainTemplate } from '@/utils/codeGenerator'

export default function CodePreview({ components }) {
    const code = generateFrameTrainTemplate(components)

    return (
        <div className="code-preview">
            <h2>Generated FrameTrain Template:</h2>
            <pre>{code}</pre>
        </div>
    )
}