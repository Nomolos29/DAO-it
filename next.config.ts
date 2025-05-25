import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow importing modules from node_modules in app directory
  serverExternalPackages: ["react-toastify"],
  
  // Experimental features
  experimental: {
    // Disable CSS optimization to avoid critters issues
    optimizeCss: false
  },
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Ensure proper module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      process: require.resolve('process/browser')
    };
    
    // Add polyfills
    config.plugins = [
      ...config.plugins,
    ];
    
    // Optimize chunk size for client-side bundles
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000
        }
      };
    }
    
    return config;
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
  },
  
  // Compiler options for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default nextConfig;
