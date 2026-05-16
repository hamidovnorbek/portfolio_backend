module.exports = {
    apps: [
        {
            name: 'project-name',
            script: 'dist/main.js',
            env_production: {
                NODE_ENV: 'production',
            },
            env_development: {
                NODE_ENV: 'development',
            },
            instances: 2,
            exec_mode: 'cluster',
            wait_ready: true,
            listen_timeout: 10000,
            kill_timeout: 10000,
        },
    ],
};
