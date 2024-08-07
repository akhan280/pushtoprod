import React from "react";

export default function LoadingScaffold() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="space-y-4 p-4">
          <div className="h-10 w-48 animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
          <div className="h-10 w-full animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
          <div className="h-10 w-full animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
          <div className="h-10 w-full animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
          <div className="h-10 w-full animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
        </div>
      </div>
    );
  }
  