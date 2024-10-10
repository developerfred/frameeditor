// components/ReorderableComponentList.tsx
import React, { useCallback } from 'react'
import { useDrag, useDrop } from 'react-dnd'

interface ComponentItemProps {
    id: number
    component: any
    index: number
    moveComponent: (dragIndex: number, hoverIndex: number) => void
}

const ComponentItem: React.FC<ComponentItemProps> = ({ id, component, index, moveComponent }) => {
    const [, drag] = useDrag({
        type: 'REORDER_COMPONENT',
        item: { id, index },
    })

    const [, drop] = useDrop({
        accept: 'REORDER_COMPONENT',
        hover: (item: { id: number; index: number }) => {
            if (item.index !== index) {
                moveComponent(item.index, index)
                item.index = index
            }
        },
    })

    return (
        <div ref={(node) => drag(drop(node))} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '5px' }}>
            {component.type}
        </div>
    )
}

interface ReorderableComponentListProps {
    components: any[]
    setComponents: (components: any[]) => void
}

export const ReorderableComponentList: React.FC<ReorderableComponentListProps> = ({ components, setComponents }) => {
    const moveComponent = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const dragComponent = components[dragIndex]
            const newComponents = [...components]
            newComponents.splice(dragIndex, 1)
            newComponents.splice(hoverIndex, 0, dragComponent)
            setComponents(newComponents)
        },
        [components, setComponents]
    )

    return (
        <div>
            {components.map((component, index) => (
                <ComponentItem
                    key={index}
                    id={index}
                    index={index}
                    component={component}
                    moveComponent={moveComponent}
                />
            ))}
        </div>
    )
}
