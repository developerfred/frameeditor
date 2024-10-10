'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FrameTrainComponentPalette } from './FrameTrainComponents'
import { ComponentPropertiesEditor } from './ComponentPropertiesEditor'
import { TemplateSaveLoad } from './TemplateSaveLoad'
import { LiveFramePreview } from './LiveFramePreview'
import CodePreview from './CodePreview'
import DropZone from './DropZone'
import { ReorderableComponentList } from './ReorderableComponentList'
import { validateTemplate } from '@/utils/templateValidator'
import { exportTemplate } from '@/utils/templateExporter'
import { generateInitialConfig } from '@/utils/codeGenerator'
import { HistoryManager } from '@/utils/historyManager'
import { Eye, Code, FileText, Layout, Settings, Zap, ChevronLeft, ChevronRight } from 'lucide-react'

const VisualEditor: React.FC = () => {
    const [components, setComponents] = useState<any[]>([])
    const [selectedComponent, setSelectedComponent] = useState<any | null>(null)
    const [config, setConfig] = useState<any>({})
    const [history, setHistory] = useState(() => new HistoryManager<any[]>([]))
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
    const [exportedTemplate, setExportedTemplate] = useState<string | null>(null)
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

    const handleExport = useCallback(() => {
        const exported = exportTemplate(components, config)
        setExportedTemplate(exported)
    }, [components, config])

    const validateCurrentTemplate = useCallback(() => {
        const errors = validateTemplate(components)
        setValidationErrors(errors)
    }, [components])

    const addComponent = useCallback((componentType: string) => {
        const newComponent = {
            type: componentType,
            props: {},
            style: { position: 'relative' },
        }
        setComponents(prevComponents => {
            const newComponents = [...prevComponents, newComponent]
            setHistory(prevHistory => {
                prevHistory.push(newComponents)
                return prevHistory
            })
            return newComponents
        })
    }, [])

    useEffect(() => {
        setConfig(generateInitialConfig(components))
    }, [components])

    const undo = useCallback(() => {
        if (history.canUndo()) {
            const previousState = history.undo()
            setComponents(previousState || [])
        }
    }, [history])

    const redo = useCallback(() => {
        if (history.canRedo()) {
            const nextState = history.redo()
            setComponents(nextState || [])
        }
    }, [history])

    const updateComponent = useCallback((index: number, updatedComponent: any) => {
        setComponents(prevComponents => {
            const newComponents = [...prevComponents]
            newComponents[index] = updatedComponent
            return newComponents
        })
    }, [])

    const selectComponent = useCallback((component: any, index: number) => {
        setSelectedComponent({ ...component, index })
    }, [])

    const updateComponentProps = useCallback((updatedProps: any) => {
        if (selectedComponent) {
            const updatedComponent = { ...selectedComponent, props: updatedProps }
            updateComponent(selectedComponent.index, updatedComponent)
            setSelectedComponent(updatedComponent)
        }
    }, [selectedComponent, updateComponent])

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen bg-gray-900 text-gray-200">
                {/* Left Sidebar */}
                <div className={`${leftSidebarOpen ? 'w-64' : 'w-0'} bg-gray-800 transition-all duration-300 ease-in-out overflow-hidden`}>
                    <div className="p-4">
                        <div className="flex items-center mb-8">
                            <Zap className="text-blue-400 mr-2" />
                            <h1 className="text-xl font-bold">FrameTrain</h1>
                        </div>
                        <h2 className="font-semibold mb-4">Components</h2>
                        <FrameTrainComponentPalette />
                    </div>
                </div>

                <button
                    onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 p-2 rounded-r-md"
                >
                    {leftSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>

                {/* Main Editing Area */}
                <div className="flex-1 flex flex-col">
                    <header className="bg-gray-800 p-4 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Create Welcome Form</h2>
                        <div className="flex items-center space-x-4">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200" onClick={validateCurrentTemplate}>Validate</button>
                            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200" onClick={handleExport}>Export</button>
                        </div>
                    </header>
                    <main className="flex-1 p-6 overflow-auto">
                        <div className="bg-gray-800 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold mb-4">Frame Editor</h3>
                            <DropZone
                                components={components}
                                addComponent={addComponent}
                                selectComponent={selectComponent}
                            />
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="font-semibold mb-4">Component List</h3>
                            <ReorderableComponentList
                                components={components}
                                setComponents={setComponents}
                                selectComponent={selectComponent}
                            />
                        </div>
                    </main>
                </div>

                {/* Right Sidebar */}
                <div className={`${rightSidebarOpen ? 'w-80' : 'w-0'} bg-gray-800 transition-all duration-300 ease-in-out overflow-hidden`}>
                    <div className="p-4">
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 flex items-center">
                                <Eye size={18} className="mr-2" /> Preview
                            </h3>
                            <div className="bg-gray-700 rounded-lg p-4">
                                <LiveFramePreview components={selectedComponent ? [selectedComponent] : []} config={config} />
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 flex items-center">
                                <Code size={18} className="mr-2" /> Properties
                            </h3>
                            <div className="bg-gray-700 rounded-lg p-4">
                                {selectedComponent ? (
                                    <ComponentPropertiesEditor
                                        component={selectedComponent}
                                        updateComponent={updateComponentProps}
                                    />
                                ) : (
                                    <p className="text-gray-400">Select a component to edit properties</p>
                                )}
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 flex items-center">
                                <FileText size={18} className="mr-2" /> Generated Code
                            </h3>
                            <div className="bg-gray-700 rounded-lg p-4">
                                <CodePreview components={components} />
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Template Actions</h3>
                            <TemplateSaveLoad components={components} setComponents={setComponents} />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center">
                                <Settings size={18} className="mr-2" /> History
                            </h3>
                            <div className="space-y-2">
                                <button onClick={undo} disabled={!history.canUndo()} className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm w-full transition-colors duration-200 disabled:opacity-50">Undo</button>
                                <button onClick={redo} disabled={!history.canRedo()} className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-sm w-full transition-colors duration-200 disabled:opacity-50">Redo</button>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 p-2 rounded-l-md"
                >
                    {rightSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white p-4">
                    <h3 className="font-semibold mb-2">Validation Errors:</h3>
                    <ul className="list-disc list-inside">
                        {validationErrors.map((error, index) => (
                            <li key={index}>{`${error.component}: ${error.error}`}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Exported Template */}
            {exportedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
                        <h3 className="font-semibold mb-4">Exported Template (Pull Request Format):</h3>
                        <pre className="bg-gray-700 p-4 rounded whitespace-pre-wrap">{exportedTemplate}</pre>
                        <button
                            onClick={() => setExportedTemplate(null)}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </DndProvider>
    )
}

export default VisualEditor