'use client'
import React, { useState, useEffect } from 'react'
import { saveTemplate, loadTemplate, listTemplates } from '@/utils/templateStorage'

interface Props {
    components: any[];
    setComponents: (components: any[]) => void;
}

export const TemplateSaveLoad: React.FC<Props> = ({ components, setComponents }) => {
    const [templateName, setTemplateName] = useState('')
    const [savedTemplates, setSavedTemplates] = useState<string[]>([])

    useEffect(() => {
        setSavedTemplates(listTemplates())
    }, [])

    const handleSave = () => {
        if (templateName) {
            saveTemplate(templateName, components)
            setSavedTemplates(listTemplates())
            setTemplateName('')
        }
    }

    const handleLoad = (name: string) => {
        const template = loadTemplate(name)
        if (template) {
            setComponents(template.components)
        }
    }

    return (
        <div className="template-save-load">
            <div>
                <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Template name"
                    className="bg-gray-700 text-white p-2 rounded mr-2"
                />
                <button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
                >
                    Save Template
                </button>
            </div>
            <div className="mt-4">
                <h3 className="font-semibold mb-2">Saved Templates:</h3>
                <ul className="space-y-2">
                    {savedTemplates.map(name => (
                        <li key={name} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                            <span>{name}</span>
                            <button
                                onClick={() => handleLoad(name)}
                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm transition-colors duration-200"
                            >
                                Load
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}