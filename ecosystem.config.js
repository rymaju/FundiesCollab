module.exports  = {
      name: 'FundiesCollab',
      script: './server.js',

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      error_file: 'err.log',
      out_file: 'out.log',
      log_file: 'combined.log',
      time: true,
      exec_mode: 'cluster'
    
  
}
