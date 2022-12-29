const connection = require('../model/connection');
connection.connected();

class ProductService {
    findAll() {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query('select * from product', (err, products) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(products)
                }
            })
        })
    }

    save(product) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`insert into manager.product(price, name, description)
                           values (${product.price}, '${product.name}', '${product.description}'
                                   )`, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('Tạo Thành công')
                }
            })
        })
    }

    deleteProduct(id) {
        let connect = connection.getConnection();
        let sql = `delete
                   from manager.product
                   where id = ${id}`;
        return new Promise((resolve, reject) => {
            connect.query(sql, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('Thành công')
                }
            })
        })
    }

    finById(id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`SELECT * FROM product WHERE id = ${id}`,(err, product) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(product)
                }
            })
        })
    }

    editProduct(product, id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`update product set name = '${product.name}', price = ${product.price}, description = '${product.description}'
                where id = ${id}`, (err, product) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("đã sửa")
                    resolve(product);
                }
            })
        })
    }
}

const productService = new ProductService();
module.exports = productService;