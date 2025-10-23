import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Proper way to disable Turbopack in 15.5+
  turbopack: {
    // You can disable it by not using it (no dev flag)
    // or by setting this if you want to be explicit:
    // Note: type requires object, so empty object means default (disabled)
  },

  webpack(config) {
    // Remove SVGs from Next's default file loader
    const fileLoaderRule = config.module.rules.find(
      (rule: any) => rule.test instanceof RegExp && rule.test.test(".svg")
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Add SVGR loader to handle SVG imports as React components
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    console.log("✅ Using Webpack + SVGR");

    return config;
  },
};

export default nextConfig;
