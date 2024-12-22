import { Suspense } from "react";
import TrackerClient from "@/components/TrackerClient";
import Loader from "@/components/Loader";

export default function TrackerPage() {
  return (
    <Suspense fallback={<Loader />}>
      <TrackerClient />
    </Suspense>
  );
}
