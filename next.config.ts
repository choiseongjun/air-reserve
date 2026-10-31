import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host" as const, value: "air-reserve-three.vercel.app" }],
      destination: "https://airconpartner.kr/:path*",
      permanent: true,
    }];
  },
  outputFileTracingIncludes: { "/*": ["./certs/supabase-ca.crt"] },
};

export default nextConfig;
