export type MissionType = {
    id: number,
    type: 'mission',
    name: string,
    icon: string,
    availability: string,
    description: string,
    tagline: string,
    locationName: string,
    locationUrl: string
}

export type MessageType = {
    id: number,
    type: 'message',
    sender: string,
    subject: string,
    message: string,
    attachments: string,
    locationName: string,
    locationUrl: string
}

export type LogType = {
    id: number,
    type: 'log',
    title: string,
    date: string | undefined,
    message: string,
    attachments: string | undefined,
}

export type MiscType = {
    id: number,
    type: 'misc',
    name: string,
}