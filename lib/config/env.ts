export const ENV = {
  API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT || "",
};

if (!ENV.API_ENDPOINT) {
  console.error("Missing environment variable: NEXT_PUBLIC_API_ENDPOINT");
}
