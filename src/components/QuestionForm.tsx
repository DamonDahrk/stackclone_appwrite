"use client";

//The component serves as a question creation/editing form.It handles both creating new questions and updating existing ones based on whether a question prop is provided.
//core dependencies: 

// React hooks for state management (useState)
// Next.js navigation (useRouter) for programmatic routing
// Appwrite SDK for backend operations (database and file storage)
// Custom components including RTE (Rich Text Editor), UI components, and visual effects
// Utility functions for styling (cn) and URL generation (slugify)


interface QuestionDocument extends Models.Document {
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  attachmentId?: string;
};

import { IconX } from "@tabler/icons-react";
import React from 'react'
import { Meteors } from './magicui/meteors';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Models, ID } from 'appwrite';
import { useAuthStore } from '@/store/Auth';
import { useRouter } from 'next/navigation';
import { databases, storage } from "@/models/client/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import RTE from "@/components/RTE";
import Confetti from 'canvas-confetti';
import slugify from '@/utils/slugify';


//cn: A utility function for conditionally joining class names together

//overflow-hidden: Clips content that extends beyond container boundaries

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;  //Any jsx/ tsx element explicitly. 
    className?: string;  //its gonna string ? is for optional
}) => {
    return (
                <div
            className={cn(
                "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4",
                className
            )}
        >
            <Meteors number={30} />

           
            {children}
        </div>
    );
};

const QuestionForm = () => ({ question }: { question?: QuestionDocument  }) => {
    const { user } = useAuthStore(); //getting user from zustand store
    const router = useRouter(); //for programmatic navigation
    //tag is a state variable that holds the current value of the tag.
    //setTag is a function used to update the value of tag.
    const [tag, setTag] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    //loading state variable to indicate whether a question submission is in progress. setLoading is a function to update the loading state. 
    const [error, setError] = React.useState(""); //error state variable to hold any error messages. setError is a function to update the error message.
    const [formData, setFormData] = React.useState({
        title: String(question?.title || ""), //title state variable initialized with question title or empty string
        content: String(question?.content || ""), //body state variable initialized with question body or empty 
        authorId: user?.$id || "", //author state variable initialized with current user's ID
        
        tags: new Set<string>(question?.tags || []), //tags state variable initialized with question tags or empty set
        attachment: null as File | null, //attachment state variable initialized with null

    }); //React state hook to manage form data

    //Hey, please call this function (frame in this case) before the next screen repaint so I can update the animation

      const loadConfetti = (timeInMS = 3000) => {
        const end = Date.now() + timeInMS; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;

            Confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });
            Confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });

            requestAnimationFrame(frame);
        };

        frame();
    };

    //we made a function that will be called when we create the form.
      const create = async () => {
        if(!formData.attachment) throw new Error("Please upload an attachment!");
      
        const storageResponse = await storage.createFile(
            questionAttachmentBucket,
            ID.unique(),   
            formData.attachment
        );
        //create a new file in the specified bucket with a unique ID and the provided file data.

        const response = await databases.createDocument(db , questionCollection, 
            ID.unique(), {
                title: formData.title,
                content: formData.content,
                authorId: formData.authorId,
                tags: Array.from(formData.tags),
                attachment: storageResponse.$id,
                
            });

        loadConfetti();
        return response;
    };

      const update = async () => {
        if(!question) throw new Error("Question not found");
        //if no question is found we throw an error

        const attachmentId = await (async () => {
        
            if(!formData.attachment) 
                return question?.attachmentId as string;
            //if no attachment is provided we return the existing attachment id

            if (question.attachmentId) {
    await storage.deleteFile(questionAttachmentBucket, question.attachmentId);
}

            //if attachment is provided we delete the existing attachment
            // Uses Appwrite's storage.deleteFile() method
            // The 'await' ensures deletion completes before proceeding

            const file = await storage.createFile(
            questionAttachmentBucket,
            ID.unique(),
            formData.attachment
        );
            //create a new file in the specified bucket with a unique ID and the provided file data.

            return file.$id;


          })();
           // The () immediately executes the async function expression
            //   -returns the attachmentId of the existing attachmentId (if no new file)
    //   - The new file's $id (if new file was uploaded) 
          // The outer 'await' waits for this entire process to complete
      //we made a function that will be called when we edit the form.

          const response = await databases.updateDocument(db, questionCollection, question.$id, {
            title: formData.title,
            content: formData.content,
            authorId: formData.authorId,
            tags: Array.from(formData.tags),
            attachmentId: attachmentId,
        });

        //sends the updated question data to the database using Appwrite's databases.updateDocument() method.

        return response;
    };



      const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        //interface typescript for form event

        e.preventDefault(); //prevent default form submission behavior

         if (!formData.title || !formData.content || !formData.authorId) {
        //  Validation check for required fields
      setError(() => "Please fill out all fields");
        // - Error message will be displayed to user in the UI
        return;
    }   setLoading(() => true); // Set loading state to true to indicate submission in progress
        setError(() => ""); // Clear any previous error messages

        try{
             const response = question ? await update() : await create();
            //if question exists, we call update, otherwise we call create 
            //await makes sure we wait for the async operation to complete before proceeding 
            router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
            // After successful submission, navigate to the question's detail page using its ID and a slugified version of the title


        }catch(error:any ){
            setError(() => error.message); // Set error message if an error occurs during submission
        }

      };

      //we made a function that will be called when we submit the form.
      //<!-- apos is an HTML entity used to represent an apostrophe -->


    return (
        <form className="space-y-4" onSubmit={submit}>
            {error && (
                <LabelInputContainer>
                    <div className="text-center">
                        <span className="text-red-500">{error}</span>
                    </div>
                </LabelInputContainer>
            )}
            <LabelInputContainer >
                <Label htmlFor="title">  
                    Title Address
                    <br />
                    <small>
                        Be specific and imagine you&apos;re asking a question to another person.
                    </small>
                    //
                </Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="content">
                    What are the details of your problem?
                    <br />
                    <small>
                        Introduce the problem and expand on what you put in the title. Minimum 20
                        characters.
                    </small>
                </Label>
                <RTE
                    value={formData.content}
                    onChange={value => setFormData(prev => ({ ...prev, content: value || "" }))} //if value is null or undefined we set it to empty string
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="image">
                    Image
                    <br />
                    <small>
                        Add image to your question to make it more clear and easier to understand.
                    </small>
                </Label>
                <Input
                    id="image"
                    name="image"
                    accept="image/*"
                    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                    type="file"
                    onChange={e => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setFormData(prev => ({
                            ...prev,
                            attachment: files[0],
                        }));
                    }}
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="tag">
                    Tags
                    <br />
                    <small>
                        Add tags to describe what your question is about. Start typing to see
                        suggestions.
                    </small>
                </Label>
                <div className="flex w-full gap-4">
                    <div className="w-full">
                        <Input
                            id="tag"
                            name="tag"
                            placeholder="e.g. (java c objective-c)"
                            type="text"
                            value={tag}
                            onChange={e => setTag(() => e.target.value)}
                        />
                    </div>
                    <button
                        className="relative shrink-0 rounded-full border border-slate-600 bg-slate-700 px-8 py-2 text-sm text-white transition duration-200 hover:shadow-2xl hover:shadow-white/[0.1]"
                        type="button"
                        onClick={() => {
                            if (tag.length === 0) return;
                            setFormData(prev => ({
                                ...prev,
                                tags: new Set([...Array.from(prev.tags), tag]),
                            }));
                            setTag(() => "");
                        }}
                    >
                        <div className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-2xl" />
                        <span className="relative z-20">Add</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {Array.from(formData.tags).map((tag, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="group relative inline-block rounded-full bg-slate-800 p-px text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900">
                                <span className="absolute inset-0 overflow-hidden rounded-full">
                                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                </span>
                                <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10">
                                    <span>{tag}</span>
                                    <button
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                tags: new Set(
                                                    Array.from(prev.tags).filter(t => t !== tag)
                                                ),
                                            }));
                                        }}
                                        type="button"
                                    >
                                        <IconX size={12} />
                                    </button>
                                </div>
                                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                            </div>
                        </div>
                    ))}
                </div>
            </LabelInputContainer>
            <button
                className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                type="submit"
                disabled={loading}
            >
                {question ? "Update" : "Publish"}
            </button>
        </form>
    );
};

export default QuestionForm;