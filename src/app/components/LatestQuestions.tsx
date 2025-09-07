import QuestionCard, { Question } from "@/components/QuestionCard";  // import Question type

import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

const LatestQuestions = async() => {
    const questions = await databases.listDocuments(db,
        questionCollection,
        [Query.limit(5),
        Query.orderDesc("$createdAt"),]
        //This initial query uses Appwrite's Query builder 
        // to fetch the latest 5 questions
        //Orders by creation date in descending order,
    );
    console.log("Fetched Questions:", questions);

    //This section demonstrates nested Promise.all optimization - a sophisticated pattern
    // that dramatically improves performance through parallel execution

    //The outer Promise.all processes all questions 
    // concurrently rather than sequentially

     const enrichedQuestions: Question[] = await Promise.all(
        questions.documents.map(async (ques): Promise<Question> => {
            //returning every ques array element as a promise and array
          const [author, answers, votes] = await Promise.all([ 
                // For each question, fetch 3 related data pieces in parallel
              users.get<UserPrefs>(ques.authorId),
            //Fetch the user who created this question
               databases.listDocuments(db, answerCollection, [
                Query.equal("questionId", ques.$id),  // Filter: only answers belonging to this question
                Query.limit(1), // OPTIMIZATION: Fetch minimal data since we only need the total count
            ]), //total answers for the questions
                
                //votes for only the question
                databases.listDocuments(db, voteCollection, [
                Query.equal("type", "question"),    // Filter: only votes for questions (not answers)
                Query.equal("typeId", ques.$id),    // Filter: only votes for this specific question
                Query.limit(1), // OPTIMIZATION: Minimal data transfer, maximum count accuracy
            ]),
           ]) ;
         return {
        $id: ques.$id,
        $createdAt: ques.$createdAt,
        title: ques.title,
        tags: ques.tags || [],
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          reputation: author.prefs.reputation,
          name: author.name,
                } //restucturing the author object             
          };          
        })
    );
console.log("Latest question")
console.log(enrichedQuestions)
return (
        <div className="space-y-6">
            {enrichedQuestions.map(question => (
                <QuestionCard key={question.$id} ques={question} />
            ))}
        </div>
    );
};

export default LatestQuestions;