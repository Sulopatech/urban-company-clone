module.exports = {
  apps: [{
    name: "urban company storefront",
    script: 'npm',
    args: 'run start',
    watch : true,
    autorestart: true,
    env: {
      NODE_ENV: "production",
      PORT: 4500,
      REMIX_DEV_ORIGIN: "http://localhost:4500",
      VENDURE_API_URL:"http://api-plant.sulopa.com/shop-api"
    },
    instances: "1",
    exec_mode: "fork"
  }]
};
