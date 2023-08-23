//Allow for making connection to MongoDB ( MongoClient its a class)
import { MongoClient } from "mongodb";
// class to get object id in mongodb
import Obj from "mongodb"
 import dotenv from "dotenv"
 //configure thhe environment
dotenv.config();
const UrlMongodb=process.env.UrlMongodb 
//connection string for mongodb 
const MongoURL=UrlMongodb //mongosh connecting Url


async function createConnections(){
const client=new MongoClient(MongoURL);
await client.connect();
console.log("MongoDB is connected Sucessfully")
return client
}
export var ObjectId=Obj.ObjectId;
export  const client = await createConnections();;