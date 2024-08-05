module.exports = {
  apps: [{
    name: 'urban company backend',
    script: 'npm',
    args: 'run start',
    instances: 1,
    exec_mode: "fork",
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
