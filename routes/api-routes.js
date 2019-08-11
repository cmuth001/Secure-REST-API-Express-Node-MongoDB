var router = require('express').Router();
var controller = require('../controller/controller.js');
router.get('/', function(req, res){
    res.json({
        status: 'API is Working',
        message: 'Node + Express + MongoDB: Nodemon Server',
    });
});
// users routes
router.route('/users').get([controller.checkLogin, controller.index])
                      .post(controller.newUser);
                      
router.route('/user/:id').get([controller.checkLogin,controller.view])
                         .put(controller.update)
                         .delete(controller.delete);
// Expose API routes to public
module.exports = router;