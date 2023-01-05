const homeHandleRouter = require('./handleRouter/HomeHandleRouter');
const router = {
    'home' : homeHandleRouter.showHome,
    'create': homeHandleRouter.createProduct,
    'edit': homeHandleRouter.editProduct
}
module.exports = router