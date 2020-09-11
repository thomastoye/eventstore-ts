import { event_store } from 'eventstore-ts-protos'

type Credentials = {
    username: string,
    password: string
}

type ConnectionSettings = {
    /** @example 'localhost' */
    host: string,
    /** @example 2113 */
    port: number,
    method: 'gprc',
    defaultUserCredentials?: Credentials
}

class EventStoreConnection {
    #host: string
    #port: number
    #defaultUserCredentials: Credentials | null

    private constructor(connectionSettings: ConnectionSettings) {
        this.#host = connectionSettings.host
        this.#port = connectionSettings.port
        this.#defaultUserCredentials = connectionSettings.defaultUserCredentials || null
    }

    static create(connectionSettings: ConnectionSettings) {
        return new EventStoreConnection(connectionSettings)
    }

    toString(): string {
        return `grpc://${this.#defaultUserCredentials?.username}:${this.#defaultUserCredentials?.password}@${this.#host}:${this.#port}`
    }
}

const connection = EventStoreConnection.create({
    host: 'localhost',
    method: 'gprc',
    port: 2113,
    defaultUserCredentials: {
        username: 'admin',
        password: 'changeit'
    }
})

console.log(connection.toString())

// event_store.client.

const message = event_store.client.streams.ReadReq.create({
    options: {
        stream: {
            streamIdentifier: {
                streamName: new TextEncoder().encode('$all')
            }
        }
    }
})

console.log(JSON.stringify(message, null, 2))
