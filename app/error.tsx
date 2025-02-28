// Error components must be Client Components
"use client";
import { useEffect } from "react";


export default function Error({
  error
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);

  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mt-8 text-4xl font-bold tracking-tight  sm:text-5xl">
          Oops, something went wrong!
        </h1>
        <h2 className=" mt-4 text-2xl ">
          Need immediate assistance? Use the chatbot at the bottom right of the
          page to raise a ticket or get help.
        </h2>
        <div className=" flex flex-row  items-center justify-center gap-2">
          <p className="mt-4 text-lg ">{error.name}:</p>
          <p className="mt-4 text-lg ">{error.message}</p>
        </div>
        <div className="mt-8">
          <button
            className="inline-flex items-center rounded-md  px-4 py-2 text-sm font-medium  shadow-sm transition-colors focus:outline-none focus:ring-2  focus:ring-offset-2"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}