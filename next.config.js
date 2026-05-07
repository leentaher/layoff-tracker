/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/layofftracker',
        destination: '/layoffs',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
