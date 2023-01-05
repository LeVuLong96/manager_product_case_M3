const connection = require('../model/connection');
connection.connected();

class ProductService {
    findAll()   {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query('select * from products p join category c on p.idCategory = c.idCategory', (err, products) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(products)
                }
            })
        })
    }

    add(product) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`insert into products (pName, Number, color, description, idCategory, price)
                           values ('${product.pName}', ${product.Number}, '${product.color}', '${product.description}', ${product.idCategory}, ${product.price}
                                   )`,
                (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('Tạo Thành công')
                }
            })
        })
    }

    finById(Id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`SELECT * FROM products WHERE pId = ${Id}`,(err, product) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(product)
                }
            })
        })
    }

    editProduct(product, Id) {
        console.log(Id)
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`update products set pName = '${product.pName}', Number = ${product.Number}, color ='${product.color}', description = '${product.description}', idCategory = ${product.idCategory}, price = ${+product.price} where pId = ${+Id} `,
                (err, product) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("đã sửa")
                    resolve(product);
                }
            })
        })
    }

    searchProduct(nameProduct){
        // console.log(nameProduct)
        let connect = connection.getConnection();
        let sql = `select * from  products p join category c on p.idCategory = c.idCategory where pName like '%${nameProduct}%'`
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(list)
                }
            })
        })
    }

}

const productService = new ProductService();
module.exports = productService;