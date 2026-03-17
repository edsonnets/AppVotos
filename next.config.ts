import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
// Configuración de CORS
  async headers() {
    return [
      {
        // Aplica estos encabezados a todas las rutas de tu API
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { 
            key: "Access-Control-Allow-Origin", 
            value: "https://c-electoral.vercel.app/" // En producción, cámbialo por tu dominio real
          },
          { 
            key: "Access-Control-Allow-Methods", 
            value: "GET,DELETE,POST,PUT,OPTIONS" 
          },
          { 
            key: "Access-Control-Allow-Headers", 
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" 
          },
        ]
      }
    ];
  }
};

export default nextConfig;
