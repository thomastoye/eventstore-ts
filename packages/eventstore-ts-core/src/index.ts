import { event_store } from 'eventstore-ts-protos'
import * as grpc from '@grpc/grpc-js'
import protobuf from 'protobufjs'

const Client = grpc.makeGenericClientConstructor({}, 'testname')
const client = new Client(
  'localhost:2113',
  grpc.credentials.createInsecure()
)

const rpcImpl = (method: { name: string }, requestData: any, callback: grpc.requestCallback<Buffer>) => {
  client.makeUnaryRequest(
    method.name,
    arg => arg,
    arg => arg,
    requestData,
    callback
  )
}

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

    get grpcAddress(): string {
        return `${this.#host}:${this.#port}`
    }

    get grpcClient() {
        return new Client(this.grpcAddress, grpc.ChannelCredentials.createInsecure())
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

const message = event_store.client.streams.ReadReq.create({
    options: {
        stream: {
            streamIdentifier: {
                streamName: new TextEncoder().encode('$all')
            }
        }
    }
})



// connection.grpcClient.waitForReady(new Date().getTime() + 100000, (err) => console.log('error in wait for ready', err))

// console.log(JSON.stringify(message, null, 2))
