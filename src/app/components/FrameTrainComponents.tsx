'use client'
import React from 'react'
import { useDrag } from 'react-dnd'

const componentTypes = [
    'Button',
    'Input',
    'Image',
    'Text',
    'Cover',
    'Question',
    'AnswerOption',
    'ResultScreen',
    'TimerBar',
    'ProgressIndicator',
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

export const FrameTrainComponentPalette: React.FC = () => {
    return (
        <div className="component-palette">
            {componentTypes.map(type => (
                <Component key={type} type={type} />
            ))}
        </div>
    )
}

export const renderFrameTrainComponent = (type: string, props: any) => {
    switch (type) {
        case 'Button':
            return <button {...props}>{props.label || 'Button'}</button>
        case 'Input':
            return <input {...props} />
        case 'Image':
            return <img src={props.src || 'placeholder.jpg'} alt={props.alt || 'Image'} {...props} />
        case 'Text':
            return <p {...props}>{props.content || 'Text content'}</p>
        case 'Cover':
            return <div className="cover" {...props}>{props.title || 'Cover Title'}</div>
        case 'Question':
            return <div className="question" {...props}>{props.text || 'Question text?'}</div>
        case 'AnswerOption':
            return <div className="answer-option" {...props}>{props.text || 'Answer option'}</div>
        case 'ResultScreen':
            return <div className="result-screen" {...props}>{props.result || 'Result'}</div>
        case 'TimerBar':
            return <div className="timer-bar" {...props}></div>
        case 'ProgressIndicator':
            return <div className="progress-indicator" {...props}></div>
        case 'Poll':
            return <div className="poll" {...props}>Poll Component</div>
        case 'MultipleChoice':
            return <div className="multiple-choice" {...props}>Multiple Choice Component</div>
        case 'Leaderboard':
            return <div className="leaderboard" {...props}>Leaderboard Component</div>
        case 'ShareButton':
            return <button className="share-button" {...props}>Share</button>
        case 'Carousel':
            return <div className="carousel" {...props}>Carousel Component</div>
        case 'VideoEmbed':
            return <div className="video-embed" {...props}>Video Embed Component</div>
        case 'AudioPlayer':
            return <div className="audio-player" {...props}>Audio Player Component</div>
        case 'CountdownTimer':
            return <div className="countdown-timer" {...props}>Countdown Timer Component</div>
        case 'ConfettiEffect':
            return <div className="confetti-effect" {...props}>Confetti Effect Component</div>
        case 'QRCode':
            return <div className="qr-code" {...props}>QR Code Component</div>
        default:
            return <div>Unknown component type</div>
    }
}