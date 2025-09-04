"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

//useSearchParams is a hook provided by Next.js that allows you to access and manipulate the query parameters in the URL of a Next.js application.
//usePathname is a hook provided by Next.js that allows you to access the pathname of the current page.

const Pagination = ({
    className,
    total,
    limit,
}: {
    className?: string;
    limit: number;
    total: number;
}) => {
    const router = useRouter(); // To programmatically navigate between pages.
    const searchParams = useSearchParams(); // To read and manipulate URL query parameters.
    const page = searchParams.get("page") || "1"; // Get the current page from URL, default to 1 if not present.
    const pathname = usePathname(); // Get the current pathname of the page. 
    const totalPages = Math.ceil(total / limit); // Calculate total number of pages based on total items and items per page.
    
    const prev = () => {
  if (page <= "1") return;  // If already on the first page, do nothing.
  const pageNumber = parseInt(page); // Convert the page string to a number.
  const newSearchParams = new URLSearchParams(searchParams as any ); // Create a new URLSearchParams object to manipulate query parameters.
  newSearchParams.set("page", `${pageNumber - 1}`); // Set the page parameter to the previous page number.
  router.push(`${pathname}?${newSearchParams}`); // Navigate to the new URL with the updated page parameter.
  //example: example.com/posts?page=3 
};

const next = () => {
        if (page >= `${totalPages}`) return;
        const pageNumber = parseInt(page);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", `${pageNumber + 1}`);
        router.push(`${pathname}?${newSearchParams}`);
    };

    //same thing but with next page 
    return (
        <div className="flex items-center justify-center gap-4">
            <button
                className={`${className} rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20`}
                onClick={prev} // Call the prev function when clicked.
                disabled={page <= "1"} // Disable the button if already on the first page.
            >
                Previous
            </button>
            <span>
                {page} of {totalPages || "1"} {/* incase totalPage is 0 */}
            </span>
            <button
                className={`${className} rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20`}
                onClick={next}
                disabled={page >= `${totalPages}`} // Disable if already on the last page.
            >
                Next
            </button>
        </div>
    );
};

// className: Optional string for additional CSS classes.
// total: Total number of items to paginate.
// limit: Number of items to display per page.

export default Pagination;