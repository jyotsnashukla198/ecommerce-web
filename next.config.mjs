/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  productionBrowserSourceMaps: true,
  allowedDevOrigins: [
    "65.0.3.191",
    "ecommerce-ALB-02-1442589583.ap-south-1.elb.amazonaws.com",
    "ecommerce-alb-02-1442589583.ap-south-1.elb.amazonaws.com",
    "d185ifklcc19j4.cloudfront.net"
  ],
};

export default nextConfig;
