import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  compiler: {
    removeConsole: true,
  },
  devIndicators: {
    appIsrStatus: false,
  },
}
 
export default nextConfig