'use client'
import React, { useState } from 'react'

interface Props {
    component: {
        type: string;
        props: any;
    };
    updateComponent: (updatedProps: any) => void;
}

export const ComponentPropertiesEditor: React.FC<Props> = ({ component, updateComponent }) => {
    const [props, setProps] = useState(component.props)

    const handleChange = (key: string, value: any) => {
        const updatedProps = { ...props, [key]: value }
        setProps(updatedProps)
        updateComponent(updatedProps)
    }

    const renderPropertyInput = (key: string, value: any) => {
        if (typeof value === 'boolean') {
            return (
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleChange(key, e.target.checked)}
                />
            )
        } else if (typeof value === 'number') {
            return (
                <input
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(key, parseFloat(e.target.value))}
                />
            )
        } else {
            return (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                />
            )
        }
    }

    return (
        <div className="properties-editor">
            <h3>{component.type} Properties</h3>
            {Object.entries(props).map(([key, value]) => (
                <div key={key} className="property-input">
                    <label>{key}:</label>
                    {renderPropertyInput(key, value)}
                </div>
            ))}
        </div>
    )
}
