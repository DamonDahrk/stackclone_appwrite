"use client";
export interface CommentDocument extends Models.Document {
  content: string;
  authorId: string;
  type: "question" | "answer";
  typeId: string;
  // We’ll add this in state for rendering:
  author: { $id: string; name: string };
}


import { databases } from "@/models/client/config";
import { commentCollection, db } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { IconTrash } from "@tabler/icons-react";
import { ID, Models } from "appwrite";
import Link from "next/link";
import React from "react";

const Comments = ({comments: _comments, //we are using _comments to avoid name conflict with state variable 'comments'
  type,
  typeId,
  className,
}:{ comments: Models.DocumentList<CommentDocument>;
    type: "question" | "answer";
    typeId: string;
    className?: string;}

) => {

    const [comments, setComments] = 
    React.useState(_comments);
    //state variable to hold the list of comments, initialized with the passed prop _comments
    const [newComment, setNewComment] = React.useState(""); 
    //state variable to hold the text of a new comment being typed by the user 
    //initialized to an empty string 
    const {user} = useAuthStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        //function to handle form submission for adding a new comment  

        e.preventDefault(); // Prevent the default form submission behavior (page reload).

        if(!newComment||!user) return; // If the new comment is empty or user is not logged in, do nothing.

        try {
             const response = await databases.createDocument<CommentDocument>(db, commentCollection, ID.unique(), {
                content: newComment,
                authorId: user.$id,
                author: user,
                type : type,
                typeId: typeId,
            }); // Create a new comment document in the database with the provided details.

            setNewComment(""); // Clear the new comment input field.

            setComments((prev) => ({ 
                total: prev.total + 1, // Increment the total count of comments. 
                documents: [{
                    ...response, // Spread the properties of the newly created comment document.
                    author: user }, // Add the current user as the author of the comment.
                    ...prev.documents, // append the newly created comment to the existing comments array. 
                ] 
            }));
        
        } catch (error:any) {
            window.alert(error?.message || "Error creating comment");
            // Show an alert with the error message if comment creation fails.
        } 
    };

        const deleteComment = async (commentId: string) => {
        try {
            await databases.deleteDocument(db, commentCollection, commentId);
            //delete the comment document with the specified ID from the database

            setComments(prev => ({
                total: prev.total - 1, // Decrement the total count of comments.
                documents: prev.documents.filter(comment => comment.$id !== commentId),
                // Remove the deleted comment from the comments array by filtering it out.
                //(comment => comment.$id !== commentId) here, we are keeping all comments whose ID 
                // does not match the deleted comment's ID.
            }));
        } catch (error: any) {
            window.alert(error?.message || "Error deleting comment");
        }
    };



  return (
        <div className={cn("flex flex-col gap-2 pl-4", className)}>
            {comments.documents.map(comment => (
                <React.Fragment key={comment.$id}>
                    <hr className="border-white/40" />
                    <div className="flex gap-2">
                        <p className="text-sm">
                            {comment.content} -{" "}
                            <Link
                                href={`/users/${comment.authorId}/${slugify(comment.author.name)}`}
                                className="text-orange-500 hover:text-orange-600"
                            >
                                {comment.author.name}
                            </Link>{" "}
                            <span className="opacity-60">
                                {convertDateToRelativeTime(new Date(comment.$createdAt))}
                            </span>
                        </p>
                        {user?.$id === comment.authorId ? (
                            <button
                                onClick={() => deleteComment(comment.$id)}
                                className="shrink-0 text-red-500 hover:text-red-600"
                            >
                                <IconTrash className="h-4 w-4" />
                            </button>
                        ) : null}
                    </div>
                </React.Fragment>
            ))}
            <hr className="border-white/40" />
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <textarea
                    className="w-full rounded-md border border-white/20 bg-white/10 p-2 outline-none"
                    rows={1}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={e => setNewComment(() => e.target.value)}
                />
                <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                    Add Comment
                </button>
            </form>
        </div>
    );
};





export default Comments
