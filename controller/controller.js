var  User  =  require('../model/user-model.js');
const Auth =  require('../model/auth-model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const private_Key = 'this is my secret key';
var login_role = '';
exports.authIndex = (req, res, next) => {
    res.status(200).json({
        message: 'Auth Index Route Working',
    });
};
exports.checkLogin = (req, res, next) => {
    
    if (req.headers['authorization']) {
        
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).json({
                    Error: 'Invalid syntax of token',
                    status: 401,
                });
            } else {
                // console.log("validJWTNeeded: ", req.headers['authorization']);
                req.jwt = jwt.verify(authorization[1], private_Key);

                return next();
            }
        } catch (err) {
            return res.status(403).json({
                message: 'Erorr occured during authentication',
                Error: err,
                status: 403,
            });
        }
    } else {
        return res.status(401).json({
            Error: 'Token is required!',
            status: 401,
        });
    }
};
exports.checkRole = (req, res, next) => {
   
        if(login_role == 'admin'){
            console.log("User have Access");
            return next();
        }else{
            console.log("Access denied!");
            return res.status(401).json({
                message: 'Access denied!'
            });
        }
}
exports.login = (req, res, next) => {
    // console.log(req.headers)
    // console.log("---")
    Auth.findOne({email: req.body.email})
        .then( user => {
            if(!user){
                return res.status(401).json({
                    message: 'User does not exist!'
                });
            }
            // console.log("login: ", user)
            bcrypt.compare(req.body.password, user.password)
            .then(result => {
                if(!result){
                    return res.status(401).json({
                        message: 'Autentication Failed!',
                        status: result,
                    });
                }
                else{
                    login_role = user.role;
                    const token = jwt.sign(
                        {email: user.emit, user_id: user._id}, 
                        private_Key, 
                        {expiresIn:'1h'} );
                    
                    return res.status(401).json({
                        message: 'Autenticated successfully!',
                        token: token,
                    });
                }
    
            })
            .catch( err => {
                return res.status(401).json({
                    message: 'Error occured in authentication!',
                    error: err,
                });
            });

        });
        
}
exports.authSignup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then( hash => {
        const authDetails = new Auth({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            role: req.body.role, 
        });
        authDetails.save()
        .then(result => {
            res.status(201).json({
                message: 'New user is registered',
                result: result,
            });
        })
        .catch( err => {
            res.status(501).json({
                message: 'user already exists',
                error: err,
            });
        });
    });
};
exports.index = (req, res, next) => {
    User.get((err, users) => {
        var slice_deatils = [];
        users.forEach(function(item) {
            // console.log(item);
            if(login_role == item.role || login_role == 'admin'){
                slice_deatils.push(
                {   id: item._id,
                    name: item.email,
                    role: item.role,
                    create_date:item.create_date,
                });
            }
            
        });

        if(err){
            res.json({
                status: "Error occured in getting users",
                message: err,
            });
        }
        res.json({
            status: 200,
            message: "users retrieved successfully",
            data: slice_deatils,
        });
    });
};

exports.newUser = (req, res) => {
    var user = new User();
    console.log(req.body);
    user.name = req.body.name ? req.body.name : user.name;
    user.email = req.body.email ? req.body.email : user.email;
    user.role = req.body.email ? req.body.email : user.email;

    user.save((err) => {
        if(err){
            return res.json({
                status: 'Error in inserting',
                message: err,
            });
        }
        res.json({
            status: 'New User inserted successfully!',
            message: user,
        });
    });
};

exports.view = (req, res) => {
    // console.log(req.params.id);
    var id = req.params.id;
    
    User.findById(id, (err, user)=>{
        if(err){
            return res.json({
                status: "Error In fetching user",
                message: err,
            });
        }
        res.json({
            status: 'User Found in the DB!',
            message: user
        });
    });
};

exports.update = (req, res) => {
    var id = req.params.id;
    User.findById(id, (err, user) => {

        if(err){
            return res.json({
                status: 'Error in finding user id',
                message: err,
            });
        }
        user.name = req.body.name?req.body.name:user.name;
        user.email = req.body.email?req.body.email: user.email
        user.save((err)=>{
            if(err){
                return res.json({
                    status: 'Error in updating user details',
                    message: userrer,
                });
            }
            res.json({
                status: 'User details successfully updated',
                message: user,
            });
        });
        
    });
};

exports.delete = (req, res) => {
    var id = req.params.id;
    User.findById(id, (err, user)=>{
        if(err){
            return res.json({
                status: 'Error in finding user to delete',
                message: err,
            });
        }
        user.delete((err)=>{
            if(err){
                return res.json({
                    status: 'Error in deleting user',
                    message: err,
                });
            }
            res.json({
                status: 'Successfully deleted',
                message: user
            });
        });
    });
};