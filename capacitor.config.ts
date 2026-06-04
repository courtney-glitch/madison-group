import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.madisongroup.properties",
  appName: "Madison Group",
  webDir: "public",
  server: {
    url: "https://madison-group-kappa.vercel.app",
    cleartext: false,
  },
};

export default config;