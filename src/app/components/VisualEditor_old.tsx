'use client'
import React, { useState, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FrameTrainComponentPalette } from './FrameTrainComponents'
import { ComponentPropertiesEditor } from './ComponentPropertiesEditor'
import { TemplateSaveLoad } from './TemplateSaveLoad'
import { LiveFramePreview } from './LiveFramePreview'
import CodePreview from './CodePreview'
import DropZone from './DropZone'
import { generateInitialConfig } from '@/utils/codeGenerator'
import { HistoryManager } from '@/utils/historyManager'
import { ReorderableComponentList } from './ReorderableComponentList'
import { validateTemplate } from '@/utils/templateValidator'
import { exportTemplate } from '@/utils/templateExporter'

const VisualEditor: React.FC = () => {
    const [components, setComponents] = useState<any[]>([])
    const [selectedComponent, setSelectedComponent] = useState<any | null>(null)
    const [config, setConfig] = useState<any>({})
    const [history, setHistory] = useState(() => new HistoryManager<any[]>([]))
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
    const [exportedTemplate, setExportedTemplate] = useState<string | null>(null)

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
        const newComponents = [...history.state, newComponent]
        setHistory((prevHistory) => {
            prevHistory.push(newComponents)
            return prevHistory
        })
        setConfig(generateInitialConfig(newComponents))
    }, [history])

    const undo = useCallback(() => {
        if (history.canUndo()) {
            const previousState = history.undo()
            setComponents(previousState || [])
            setConfig(generateInitialConfig(previousState || []))
        }
    }, [history])

    const redo = useCallback(() => {
        if (history.canRedo()) {
            const nextState = history.redo()
            setComponents(nextState || [])
            setConfig(generateInitialConfig(nextState || []))
        }
    }, [history])

    const updateComponent = useCallback((index: number, updatedComponent: any) => {
        setComponents((prevComponents) => {
            const newComponents = [...prevComponents]
            newComponents[index] = updatedComponent
            return newComponents
        })
        setConfig(generateInitialConfig([...components]))
    }, [components])

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
            <div className="visual-editor" style={{ display: 'flex', height: '100vh' }}>
                <div style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px' }}>
                    <h2>Components</h2>
                    <FrameTrainComponentPalette />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, padding: '10px' }}>
                        <h2>Frame Editor</h2>
                        <DropZone
                            components={components}
                            addComponent={addComponent}
                            selectComponent={selectComponent}
                        />
                    </div>
                    <div style={{ height: '200px', borderTop: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
                        <h2>Properties</h2>
                        {selectedComponent && (
                            <ComponentPropertiesEditor
                                component={selectedComponent}
                                updateComponent={updateComponentProps}
                            />
                        )}
                    </div>
                </div>
                <div style={{ width: '400px', borderLeft: '1px solid #ccc', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <h2>Preview</h2>
                    <LiveFramePreview components={components} config={config} />
                    <h2>Template Actions</h2>
                    <TemplateSaveLoad components={components} setComponents={setComponents} />
                </div>
                <div style={{ width: '400px', borderLeft: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
                    <h2>Generated Code</h2>
                    <CodePreview components={components} />
                </div>
                <div>
                    <button onClick={undo} disabled={!history.canUndo()}>Undo</button>
                    <button onClick={redo} disabled={!history.canRedo()}>Redo</button>
                </div>
                <ReorderableComponentList components={components} setComponents={setComponents} />
                <button onClick={validateCurrentTemplate}>Validate Template</button>
                {validationErrors.length > 0 && (
                    <div className="validation-errors">
                        <h3>Validation Errors:</h3>
                        <ul>
                            {validationErrors.map((error, index) => (
                                <li key={index}>{`${error.component}: ${error.error}`}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <button onClick={handleExport}>Export for Pull Request</button>
            {exportedTemplate && (
                <div className="exported-template">
                    <h3>Exported Template (Pull Request Format):</h3>
                    <pre>{exportedTemplate}</pre>
                </div>
            )}
        </DndProvider>
    )
}

export default VisualEditor