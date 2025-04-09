import { Environment } from "@yext/search-headless-react";

const searchConfig = {
  apiKey: import.meta.env.YEXT_PUBLIC_API_KEY,
  experienceKey: import.meta.env.YEXT_PUBLIC_EXP_KEY,
  locale: "it",
  environment:
    import.meta.env.YEXT_PUBLIC_ACCOUNTTYPE === "SANDBOX"
      ? Environment.PROD
      : Environment.SANDBOX,
};

export default searchConfig;
