"use client";
import React from 'react'
import { ID, Models, Query } from "appwrite";
import { useAuthStore } from '@/store/Auth';
import { useRouter } from "next/navigation";
import { db, voteCollection } from "@/models/name";
import { databases } from "@/models/client/config";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface VoteDocument extends Models.Document {
    voteStatus: "upvoted" | "downvoted";
    votedById: string;
    type: "question" | "answer";
    typeId: string;
}


const VoteButtons = ({
    type,
    id,
    upvotes,
    downvotes,
    className,
}:{ type: "question" | "answer"; 
id: string;
upvotes: Models.DocumentList<Models.Document>;
downvotes: Models.DocumentList<Models.Document>;
//describes a list or collection (like an array) containing items of the type Models.Document
className?: string;

}) => {

    const [votedDocument, setVotedDocument] = React.useState<VoteDocument | null>(); 
    // undefined means not fetched yet
    const [voteResult, setVoteResult] = React.useState<number>(upvotes.total - downvotes.total);
    // default state is the difference between upvotes and downvotes

    const {user} = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
      (async () => { 
        if(user){
            
                const response = await databases.listDocuments<VoteDocument>(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeId", id),
                    Query.equal("votedById", user.$id),
                ]);
                setVotedDocument(() => response.documents[0] || null);

                //Updates the state with the first document found, since a user should have at most one vote per item.
                //If no document is found, setVotedDocument will be called with null.
        }
        //Query is a helper or utility class provided by many database SDKs (such as Appwrite) to build and compose query filters for database operations.

       })();
      //Use effect cannot be async directly, so we define 
      // and invoke an async function inside it that will immediately run.

    }, [user, id, type]);
    //Sets up a side-effect that runs whenever user, id, or type changes.

    const toggleUpvote = async () => {
        if (!user) return router.push("/login"); 
        // If no user is logged in, redirect to login page.
        if (votedDocument === undefined) return; 
        // If vote status is not yet determined (still undefined), do nothing.

        try {
    const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
            votedById: user.$id,
            voteStatus: "upvoted",
            type,
            typeId: id,
        }),
    }); // Send a POST request to the /api/vote endpoint with the vote details in the request body.
    //in this case it is a upvoted type can be a question or an answer
    const data = await response.json(); 
    // Parse the JSON response from the server. and store it in the variable 'data'
    if (!response.ok) throw data;
    // If the response status is not OK (not in the 200-299 range), throw an error with the response data.

    setVoteResult(() => data.data.voteResult);
    // Update the voteResult state with the new vote result from the server response.
    setVotedDocument(() => data.data.votedDocument);
    // Update the votedDocument state with the new voted document from the server response.


} catch (error:any) { window.alert(error?.message || "Something went wrong"); } 
// If an error occurs during the fetch or processing, display an alert with the error message.

    };


    const toggleDownvote = async () => {
        if (!user) return router.push("/login"); 
        // If no user is logged in, redirect to login page.
        if (votedDocument === undefined) return; 
        // If vote status is not yet determined (still undefined), do nothing.

        try {
    const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
            votedById: user.$id,
            voteStatus: "downvoted",
            type,
            typeId: id,
        }),
    }); // Send a POST request to the /api/vote endpoint with the vote details in the request body.
    //in this case it is a downvote type can be a question or an answer
    const data = await response.json(); 
    // Parse the JSON response from the server. and store it in the variable 'data'
    if (!response.ok) throw data;
    // If the response status is not OK (not in the 200-299 range), throw an error with the response data.

    setVoteResult(() => data.data.voteResult);
    // Update the voteResult state with the new vote result from the server response.
    setVotedDocument(() => data.data.votedDocument);
    // Update the votedDocument state with the new voted document from the server response.


} catch (error:any) { window.alert(error?.message || "Something went wrong"); } 
// If an error occurs during the fetch or processing, display an alert with the error message.

    };
    // Placeholder functions for handling upvote and downvote actions.
        

    return (
        <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-4", className)}>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument && votedDocument.voteStatus === "upvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={toggleUpvote}
            >
                <IconCaretUpFilled />
            </button>
            <span>{voteResult}</span>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument && votedDocument.voteStatus === "downvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={toggleDownvote}
            >
                <IconCaretDownFilled />
            </button>
        </div>
    );


  
};

export default VoteButtons;
