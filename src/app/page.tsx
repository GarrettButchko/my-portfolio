import React, { Suspense } from "react";
import HomeClient from "./MainViews/HomeClient";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <HomeClient />
    </Suspense>
  );
}
