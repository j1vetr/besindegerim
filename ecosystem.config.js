module.exports = {
  apps: [{
    name: 'besindegerim',
    script: 'dist/index.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 1453,
      DATABASE_URL: 'postgresql://besindegerim_admin:BsnDgr2025PgSecure987@localhost:5432/besindegerim_db',
      FOODDATA_API_KEY: 'ROHYH9BNvyzUsuoPEfL3LP4HyivEhxyKutsJGAxS',
      BASE_URL: 'https://besindegerim.com',
      SESSION_SECRET: 'Session2025SecretKeyBsnDgr',
      PGHOST: 'localhost',
      PGPORT: '5432',
      PGDATABASE: 'besindegerim_db',
      PGUSER: 'besindegerim_admin',
      PGPASSWORD: 'BsnDgr2025PgSecure987'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
