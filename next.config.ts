import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // GitHub raw content
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
      // Firebase Storage (main domain)
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      // Firebase Storage (app domain variant)
      {
        protocol: "https",
        hostname: "firebasestorage.app",
        pathname: "/**",
      },
    ],
  },

  webpack(config) {
    // 🔹 Add alias for @ -> ./src
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };

    // Exclude SVGs from Next's default file loader
    const fileLoaderRule = config.module.rules.find(
      (rule: any) => rule.test instanceof RegExp && rule.test.test(".svg")
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Add SVGR loader
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    console.log("✅ Using Webpack + SVGR enabled");

    return config;
  },
};

export default nextConfig;
