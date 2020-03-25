module.exports = {
  name: 'server',
  script: './server.js',
  // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
  exec_mode: 'fork',
  autorestart: true,
  watch: false,
  max_memory_restart: '500M',
  env: {
    NODE_ENV: 'production'
  },
  error_file: 'err.log',
  out_file: 'out.log',
  log_file: 'combined.log',
  time: true
}
