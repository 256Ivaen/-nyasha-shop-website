/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['react-icons'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  experimental: {
    optimizePackageImports: [
      'react-icons/fi',
      'react-icons/fa',
      'react-icons/fa6',
      'react-icons/md',
      'react-icons/gi',
      'react-icons/bs',
      'react-icons/ri',
    ],
  },
}

export default nextConfig
