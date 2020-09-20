import { loadSync } from '@grpc/proto-loader';
import { loadPackageDefinition } from '@grpc/grpc-js'
import { event_store } from 'eventstore-ts-protos'

const PROTO_PATH = __dirname + '/users.proto';
const packageDefinition = loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true  
})

const users_proto = loadPackageDefinition(packageDefinition);

console.log(users_proto)

