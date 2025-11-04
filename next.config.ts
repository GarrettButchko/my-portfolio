import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Allow external images (GitHub raw content)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // ✅ Webpack customization (SVGR setup)
  webpack(config) {
    // Exclude SVGs from Next’s default file loader
    const fileLoaderRule = config.module.rules.find(
      (rule: any) => rule.test instanceof RegExp && rule.test.test(".svg")
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Add @svgr/webpack loader for importing SVGs as React components
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
