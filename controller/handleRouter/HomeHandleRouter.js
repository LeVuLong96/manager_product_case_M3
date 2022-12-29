const fs = require('fs');
const productService = require('../../service/productService');
const qs = require('qs');
const {raw} = require("mysql");

class HomeHandleRouter {
    static getHomeHtml(homeHtml, products) {
        let tbody = '';
        products.map((product, index) => {
            tbody += `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td><a href="/edit/${product.id}"><button style="background-color: green; color: white">Sua</button></a>
                    <a href="/delete/${product.id}"><button style="background-color: red; color: white">Xoa</button></a></td>
                </tr>
                    `
        })
        homeHtml = homeHtml.replace('{products}', tbody);
        return homeHtml;
    }

    showHome(req, res) {
        fs.readFile('./views/home.html', 'utf-8', async (err, homeHtml) => {
            if (err) {
                console.log(err.message)
            } else {
                let products = await productService.findAll()
                homeHtml = HomeHandleRouter.getHomeHtml(homeHtml, products);
                res.writeHead(200, 'text/html');
                res.write(homeHtml);
                res.end();
            }
        })
    }

    createProduct(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/create.html', 'utf-8', async (err, createHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(createHtml);
                    res.end();
                }
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    const product = qs.parse(data);
                    const mess = await productService.save(product);
                    console.log(mess)
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }

    async deleteProduct(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/delete.html', 'utf-8', (err, deleteHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(200, 'text/html');
                    deleteHtml = deleteHtml.replace('{id}', id);
                    res.write(deleteHtml);
                    res.end();
                }
            })
        } else {
            let mess = await productService.deleteProduct(id)
            res.writeHead(301, {'location': '/home'});
            res.end();
        }
    }

    async editProduct(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/edit.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    let product = await productService.finById(id)
                    editHtml = editHtml.replace('{name}', product[0].name);
                    editHtml = editHtml.replace('{price}', product[0].price);
                    editHtml = editHtml.replace('{description}', product[0].description);
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            })
        } else {
            let editData = ''
            req.on('data', chunk => {
                editData += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    const product = qs.parse(editData);
                    // console.log(product)
                    const mess = await productService.editProduct(product, id);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }
}

module.exports = new HomeHandleRouter();