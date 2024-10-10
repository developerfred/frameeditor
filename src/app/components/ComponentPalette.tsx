'use client'
import { useDrag } from 'react-dnd'

const componentTypes = ['Button', 'Input', 'Image', 'Text']

export default function ComponentPalette() {
    return (
        <div className="component-palette">
            {componentTypes.map(type => (
                <DraggableComponent key={type} type={type} />
            ))}
        </div>
    )
}

function DraggableComponent({ type }) {
    const [, drag] = useDrag(() => ({
        type: 'COMPONENT',
        item: { type },
    }))

    return (
        <div ref={drag} className="draggable-component">
            {type}
        </div>
    )
}
