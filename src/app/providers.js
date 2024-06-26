"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

export function Providers({ children }) {
  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}>
      {children}
    </APIProvider>
  );
}
