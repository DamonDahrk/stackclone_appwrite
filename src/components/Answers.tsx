"use client";

import { ID, Models } from "appwrite";
import React from "react";
import VoteButtons from "./VoteButtons";
import { useAuthStore } from "@/store/Auth";
import { avatars, databases } from "@/models/client/config";
import { answerCollection, db } from "@/models/name";
import RTE, { MarkdownPreview } from "./RTE";
import { EnrichedComment } from "./Comments"; 
import Comments from "./Comments";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { IconTrash } from "@tabler/icons-react";
interface VoteList {
  documents: Models.Document[];
  total: number;
}

export interface AnswerDocument extends Models.Document {
  content: string;
  authorId: string;
  author: {
    $id: string;
    name: string;
    reputation: number;
    // …other user fields you use
  };
  upvotesDocuments: VoteList;
  downvotesDocuments: VoteList;
  comments: VoteList;
  // …any other custom properties returned by your API
}

const Answers = ({
    answers: _answers,
    questionId,
}: {
    answers: Models.DocumentList<AnswerDocument>; //Models.DocumentList is a type provided by Appwrite SDK that represents a list of documents
    //  retrieved from a database collection.
    questionId: string;
}) => {

     const [answers, setAnswers] = React.useState(_answers);
    const [newAnswer, setNewAnswer] = React.useState("");
    const { user } = useAuthStore();
    //In short, custom API endpoints are preferred when operations require complex server-side workflows

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newAnswer || !user) return;

        try {
            const response = await fetch("/api/answer", {
                method: "POST",
                body: JSON.stringify({
                    questionId: questionId,
                    answer: newAnswer,
                    authorId: user.$id,
                }),
            }); 
            //Here we are adding a new answer to the database using the POST method and sending the questionId,
            //  answer, and authorId as JSON data in the request body.

            const data = await response.json();

            if (!response.ok) throw data;

            setNewAnswer(() => ""); //Clear the newAnswer state
            setAnswers(prev => ({
                total: prev.total + 1,
                documents: [ //unspooling the data and adding author as the user
                    //upvotes and downvotes and comments are added as structures for the answer. 
                    {
                        ...data,
                        author: user,
                        upvotesDocuments: { documents: [], total: 0 },
                        downvotesDocuments: { documents: [], total: 0 },
                        comments: { documents: [], total: 0 },
                    },
                    ...prev.documents,  //appending to the previous answers 
                ],
            }));
        } catch (error: any) {
            window.alert(error?.message || "Error creating answer");
        }
    };



        const deleteAnswer = async (answerId: string) => {
        try {
            //This is an API Endpoint that handles the deletion of an answer. 
            // It sends a DELETE request to the /api/answer endpoint with the answerId in the request body. 
            // The response from the API is then parsed as JSON and used to update the state of the answers variable.

            const response = await fetch("/api/answer", { 
                method: "DELETE",
                body: JSON.stringify({
                    answerId: answerId,
                }),
            });

            const data = await response.json();
            //Here we are updating the state of the answers variable by filtering out the answer with the given id. 
            // This effectively removes the answer from the list of answers displayed on the page.

            if (!response.ok) throw data;

            // We update the state of the answers variable by filtering out the answer with the given id. 
            // This effectively removes the answer from the list of answers displayed on the page.


            setAnswers(prev => ({
                total: prev.total - 1,
                documents: prev.documents.filter(answer => answer.$id !== answerId),
            }));
        } catch (error: any) {
            window.alert(error?.message || "Error deleting answer");
        }
    };

  return (
        <>
            <h2 className="mb-4 text-xl">{answers.total} Answers</h2>
            {answers.documents.map(answer => (
                <div key={answer.$id} className="flex gap-4">
                    <div className="flex shrink-0 flex-col items-center gap-4">
                        <VoteButtons
                            type="answer"
                            id={answer.$id}
                            upvotes={answer.upvotesDocuments}
                            downvotes={answer.downvotesDocuments}
                        />
                        {user?.$id === answer.authorId ? (
                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
                                onClick={() => deleteAnswer(answer.$id)}
                            >
                                <IconTrash className="h-4 w-4" />
                            </button>
                        ) : null}
                    </div>
                    <div className="w-full overflow-auto">
                        <MarkdownPreview className="rounded-xl p-4" source={answer.content} />
                        <div className="mt-4 flex items-center justify-end gap-1">
                            <picture>
                                <img
                                    src={avatars.getInitials(answer.author.name, 36, 36)}
                                    alt={answer.author.name}
                                    className="rounded-lg"
                                />
                            </picture>
                            <div className="block leading-tight">
                                <Link
                                    href={`/users/${answer.author.$id}/${slugify(answer.author.name)}`}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    {answer.author.name}
                                </Link>
                                <p>
                                    <strong>{answer.author.reputation}</strong>
                                </p>
                            </div>
                        </div>
                        <Comments
  comments={answer.comments as Models.DocumentList<EnrichedComment>}
  className="mt-4"
  type="answer"
  typeId={answer.$id}
/>
                        <hr className="my-4 border-white/40" />
                    </div>
                </div>
            ))}
            <hr className="my-4 border-white/40" />
            <form onSubmit={handleSubmit} className="space-y-2">
                <h2 className="mb-4 text-xl">Your Answer</h2>
                <RTE value={newAnswer} onChange={value => setNewAnswer(() => value || "")} />
                <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                    Post Your Answer
                </button>
            </form>
        </>
    );
};



export default Answers
