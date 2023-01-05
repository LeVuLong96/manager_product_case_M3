const fs = require('fs');
const productService = require('../../service/productService');
const categoryService = require('../../service/categoryService');

const qs = require('qs');
const {raw} = require("mysql");

class HomeHandleRouter {
    static getHomeHtml(homeHtml, products) {
        let tbody = '';
        products.map((product, index) => {
            tbody += `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${product.pName}</td>
                    <td>${product.Number}</td>
                    <td>${product.color}</td>
                    <td>${product.description}</td>
                    <td>${product.idCategory}</td>
                    <td>${product.price}</td>
                    <td><a href="/edit/${product.pId}"><button style="background-color: green; color: white">Sua</button></a>
                </tr>
                    `
        })
        homeHtml = homeHtml.replace('{products}', tbody);
        return homeHtml;
    }

    showHome(req, res) {
        if (req.method === 'GET') {
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
        else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    let search = qs.parse(data);
                    // console.log(search)
                    fs.readFile('./views/home.html', 'utf-8', async (err, indexHtml) => {
                        if (err) {
                            console.log(err)
                        } else {

                            let product = await productService.searchProduct(search.pName)

                            indexHtml = HomeHandleRouter.getHomeHtml(indexHtml, product)
                            res.writeHead(200, 'text/html');
                            res.write(indexHtml);
                            res.end();
                        }
                    })
                }
            })

        }
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
                    const mess = await productService.add(product);
                    console.log(mess)
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }

    async editProduct(req, res, Id) {
        if (req.method === 'GET') {
            fs.readFile('./views/edit.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    let product = await productService.finById(Id)
                    editHtml = editHtml.replace('{pName}', product[0].pName);
                    editHtml = editHtml.replace('{Number}', product[0].Number);
                    editHtml = editHtml.replace('{color}', product[0].color);
                    editHtml = editHtml.replace('{description}', product[0].description);
                    editHtml = editHtml.replace('{category}', product[0].idCategory);
                    editHtml = editHtml.replace('{price}', product[0].price);
                    editHtml = editHtml.replace('{pId}', product[0].pId);

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
                    const mess = await productService.editProduct(product, Id);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }

    searchProduct(req, res) {

    }
}

module.exports = new HomeHandleRouter();