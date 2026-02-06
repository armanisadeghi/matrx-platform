import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler — automatic memoization, no manual useMemo/useCallback/React.memo
  reactCompiler: true,

  // Opt-in caching with 'use cache' directive (dynamic by default)
  cacheComponents: true,

  // Turbopack is the default bundler — no flags needed.
  // Custom Turbopack configuration (if needed):
  // turbopack: {
  //   resolveAlias: {},
  // },

  // Supabase image optimization via storage transforms
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Transpile workspace packages
  transpilePackages: [
    "@matrx/shared",
    "@matrx/supabase",
    "@matrx/ai-client",
  ],
};

export default nextConfig;
