module.exports = {
  apps: [
    {
      name: 'WSCore',
      script: '_server.js',
      watch: '.',
      ignore_watch: ["\/\\]\./", "node_modules", "server/modules/*/web/img/", "log"],
      shutdown_with_message: true,
      restart_delay: 5000,
      autorestart: true,
      error_file: 'log/err.log',
      out_file: 'log/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss:SSS',
    }
  ]
};
