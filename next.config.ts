import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "raw.githubusercontent.com", 
      "arweave.net",              
      "ipfs.io"                  
    ],
  },
};

export default nextConfig;
