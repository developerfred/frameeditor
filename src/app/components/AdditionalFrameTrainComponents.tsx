'use client'

import React from 'react'
import { useDrag } from 'react-dnd'

const additionalComponentTypes = [
    'Poll',
    'MultipleChoice',
    'Leaderboard',
    'ShareButton',
    'Carousel',
    'VideoEmbed',
    'AudioPlayer',
    'CountdownTimer',
    'ConfettiEffect',
    'QRCode'
]

interface ComponentProps {
    type: string;
}

const Component: React.FC<ComponentProps> = ({ type }) => {
    const [, drag] = useDrag(() => ({
        type: 'COMPONENT',
        item: { type },
    }))

    return (
        <div ref={drag} className="frame-component">
            {type}
        </div>
    )
}

export const AdditionalFrameTrainComponentPalette: React.FC = () => {
    return (
        <div className="additional-component-palette">
            {additionalComponentTypes.map(type => (
                <Component key={type} type={type} />
            ))}
        </div>
    )
}