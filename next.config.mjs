/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: './dist', // Changes the build output directory to `./dist/`.
}


// Test to see build time speed up whe working with large code repo

// /** @type {import("next").NextConfig} */
// const coreConfig = {
//     images: {
//         remotePatterns: [{ hostname: "utfs.io" }],
//     },
//     typescript: {
//         ignoreBuildErrors: true,
//     },
//     eslint: {
//         ignoreDuringBuilds: true,
//     },


export default nextConfig