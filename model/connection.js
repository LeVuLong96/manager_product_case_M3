const mysql = require('mysql');

class Connection {
    configToMysql = {
        host: 'localhost',
        user: 'root',
        password: 'thienma1',
        charset: 'utf8_general_ci',
        database: 'manager'
    }

    getConnection() {
        return mysql.createConnection(this.configToMysql);
    }

    connected() {
        this.getConnection().connect(err => {
            if (err) {
                console.log(err)
            } else {
                console.log('kết nối database thành công')
            }
        })
    }
}

module.exports = new Connection();