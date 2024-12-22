import { Suspense } from "react";
import TransactionDashboard from "@/components/TransactionDashboard";
import Loader from "@/components/Loader";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TrackerPage({
  searchParams,
}: {
  searchParams: { mode?: string };
}) {
  const token = (await cookies()).get("token")?.value;

  // Redirect to home page if no token is present
  if (!token) {
    redirect("/");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions`);
  if (searchParams.mode) {
    url.searchParams.set("mode", searchParams.mode);
  }

  try {
    const response = await fetch(url, {
      headers: headers,
      cache: "no-store", // Disable caching to always get fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const serializedTransactions = await response.json();

    return (
      <Suspense fallback={<Loader />}>
        <TransactionDashboard initialTransactions={serializedTransactions} />
      </Suspense>
    );
  } catch (error) {
    // If there's an error with the token validation or API request
    console.error("Error in TrackerPage:", error);
    redirect("/");
  }
}
