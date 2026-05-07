/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/layofftracker',
        destination: '/',
        permanent: true,
      },
      {
        source: '/layoffs',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
