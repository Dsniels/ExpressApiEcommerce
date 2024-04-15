const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./user.model');
const { response } = require('express');

function handleError(res, err){
    return res.send(500,err);
}

exports.registerUser = (request, response) => {
    //Form Validation

    User.findOne({email: request.body.email}).then( user => {
        if(user){
            return response.status(400).json({email : "El email ya existe"});
        } else {
            const { password, role, email, name } = req.body;
            const newUser = new User({
                name,
                email,
                password,
                role
            });


            //Hash password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                            .then(user => response.json())
                            .catch(error => console.log(err));
                });
            });
        }
    });
};


exports.loginUser = (request, response) => {

    const email = request.body.email;
    const password = request.body.password;

    User.findOne({email}).then(user => {
        if(!user) return response.status(404).json({emailnotfound : 'Email no encontrado'});

        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch){
                // Crear JWT
                const payload = {
                    id : user.id,
                    name : user.name
                };

                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn : 3123212
                    },
                    (err,token) => {
                        response.json({
                            success : true,
                            token : 'Bearer' + token
                        });
                    }
                );
            }
            else {
                return response.status(400).json({passwordincorrect: 'Contraseña incorrecta'})
            }
        });
    });
};


exports.show = function(req,response)  {
    User.findById(req.user._id).exec(function(err, user){
        if(err){
            return handleError(response, err);
        }

        if(!user) {
            return response.send(404);
        }

        return response.json(user);
    });
};

