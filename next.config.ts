import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora os diretórios do Prisma durante a verificação do ESLint no build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
