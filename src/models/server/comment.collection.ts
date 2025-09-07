import {IndexType, Permission} from "node-appwrite";
import {commentCollection,db} from "../name";
import {databases} from "./config";


export default async function createCommentCollection() {
 // Creating Collection
 await databases.createCollection(db, commentCollection, commentCollection, [
 Permission.create("users"),
 Permission.read("users"),
 Permission.read("any"),
 Permission.update("users"),
 Permission.delete("users"),
 ]);
 console.log("Comment Collection Created");

//creating attributes

await Promise.all([
databases.createStringAttribute(db, commentCollection, "content", 10000, true),
databases.createStringAttribute(db, commentCollection, "typeId", 70, true),
databases.createEnumAttribute(db, commentCollection, "type", ["answer", "question"] ,true),
//comments can be on the question or answers
databases.createStringAttribute(db, commentCollection, "authorId", 70, true),
   databases.createStringAttribute(db, commentCollection, "authorName", 255, true), 

]);
console.log("Comment Attributes created")
}