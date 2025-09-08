const env = {
  appwrite: {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_HOST_URL ?? "",
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
    apikey: process.env.APPWRITE_API_KEY ?? "" // server-only
  }
};

if (!env.appwrite.endpoint || !env.appwrite.projectId) {
  throw new Error(
    "Appwrite endpoint or projectId not defined! Check your environment variables."
  );
}

export default env;
