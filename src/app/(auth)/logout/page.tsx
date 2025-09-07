"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default function LogoutPage() {
  const { logout, user, session } = useAuthStore();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [error, setError] = React.useState("");

  // Redirect if not logged in
  React.useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingOut(true);
    setError("");

    try {
      await logout();
      router.push("/login");
    } catch (error) {
      setError("Failed to logout. Please try again.");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (!session) {
    return null; // Don't render while redirecting
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Logout from riverflow
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Are you sure you want to logout from your account?
      </p>

      <form className="my-8" onSubmit={handleLogout}>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            You are currently logged in as:
          </p>
          <p className="font-medium text-neutral-800 dark:text-neutral-200">
            {user?.name || "User"}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            {user?.email}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Yes, Logout"}
            <BottomGradient />
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="bg-gradient-to-br relative group/btn from-neutral-100 dark:from-zinc-700 dark:to-zinc-700 to-neutral-200 block dark:bg-zinc-700 w-full text-neutral-800 dark:text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-700)_inset,0px_-1px_0px_0px_var(--zinc-700)_inset]"
          >
            Cancel
            <BottomGradient />
          </button>
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center">
            Changed your mind?{" "}
            <Link
              href="/"
              className="text-neutral-800 dark:text-neutral-200 hover:underline"
            >
              Go back to dashboard
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}