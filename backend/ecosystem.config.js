const conf = require('config');
const sshPath = conf.get('sshPath');
const ec2DNS = conf.get('ec2DNS');

module.exports = {
    apps: [{
      name: 'Jira-Clone-Server',
      script: './server.js'
    }],
    deploy: {
      production: {
        user: 'ubuntu',
        host: ec2DNS,
        key: sshPath,
        ref: 'origin/main',
        repo: 'https://github.com/herman-19/Jira-Clone.git',
        path: '/home/ubuntu/server',
        'post-deploy': 'cd ./backend && npm install && pm2 startOrRestart ecosystem.config.js'
      }
    }
  };