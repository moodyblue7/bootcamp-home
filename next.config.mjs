/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel/정적 호스팅 어디에도 올릴 수 있도록 정적 빌드로 고정한다.
  output: "export",
  // 정적 빌드에서는 next/image 최적화 서버가 없다.
  images: { unoptimized: true },
  // 정적 호스팅에서 /about -> /about/index.html 로 떨어지게 한다.
  trailingSlash: true,
};

export default nextConfig;
