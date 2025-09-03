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
};

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
        author: user?.$id, //author state variable initialized with current user's ID
        tags: new Set<string>(question?.tags || []), //tags state variable initialized with question tags or empty set
        attachment: null as File | null, //attachment state variable initialized with null

    });

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


return

};

export default QuestionForm
