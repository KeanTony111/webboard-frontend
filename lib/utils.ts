import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function createPost(
  title: string,
  detail: string,
  communityId: number
) {
  const authToken = Cookies.get("authToken");

  if (!authToken) {
    throw new Error("User is not authenticated. Please log in.");
  }

  // Assuming API endpoint is stored in ENV
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3001";

  const response = await fetch(`${API_ENDPOINT}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ title, detail, communityId }),
  });
  console.log('url', `${API_ENDPOINT}/posts`);
  console.log('body', JSON.stringify({ title, detail, communityId }));
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create post.");
  }

  return response.json();
}
