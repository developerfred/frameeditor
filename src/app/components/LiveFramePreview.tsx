'use client'
import React from 'react'
import { renderFrameTrainComponent } from './FrameTrainComponents'

interface Props {
    components: any[];
    config: any;
}

export const LiveFramePreview: React.FC<Props> = ({ components, config }) => {
    return (
        <div className="live-frame-preview" style={{ width: '390px', height: '600px', border: '1px solid #ccc' }}>
            {components.map((component, index) => (
                <div key={index} style={component.style}>
                    {renderFrameTrainComponent(component.type, { ...component.props, ...config })}
                </div>
            ))}
        </div>
    )
}