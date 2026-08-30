"use client";

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#F84B4B" // Our brand red
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
