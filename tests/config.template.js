module.exports = {
    db: {
        client: 'mysql',

        connection: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'harbortest',
            socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
        },

        pool: {
            min: 0,
            max: 20
        }
    },

    server: {
        port: 5105
    }
};
