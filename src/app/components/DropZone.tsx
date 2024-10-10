'use client'
import React from 'react'
import { useDrop } from 'react-dnd'

interface DropZoneProps {
    components: any[]
    addComponent: (componentType: string) => void
    selectComponent: (component: any, index: number) => void
}

const DropZone: React.FC<DropZoneProps> = ({ components, addComponent, selectComponent }) => {
    const [, drop] = useDrop(() => ({
        accept: 'component',
        drop: (item: { type: string }) => {
            addComponent(item.type)
        },
    }))

    return (
        <div ref={drop} className="min-h-[200px] border-2 border-dashed border-gray-600 p-4 rounded-lg">
            {components.map((component, index) => (
                <div
                    key={index}
                    onClick={() => selectComponent(component, index)}
                    className="bg-gray-700 p-2 m-2 rounded cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                >
                    {component.type}
                </div>
            ))}
            {components.length === 0 && (
                <p className="text-gray-400 text-center">Drag and drop components here</p>
            )}
        </div>
    )
}

export default DropZone