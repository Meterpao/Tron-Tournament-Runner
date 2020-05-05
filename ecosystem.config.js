module.exports = {
  apps : [{
	  name: 'Tron Tournament Gamerunner',
	  script: 'server.js',
	  instances: 0,
	  autorestart: true,
	  watch: false,
	  ignore_watch : ["node_modules", "[\/\\]\./"],
	  max_memory_restart: '1G',
	      env: {
		            NODE_ENV: 'development'
		          },
	      env_production: {
		            NODE_ENV: 'production'
		          }
  }],

  deploy : {
    production : {
      user : 'node',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
