import Joi from "joi";

const register = Joi.object(
    {
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        repeatPassword:Joi.string().required()
    }
);

const authCheck = Joi.object(
    {
        email: Joi.string().email().required()
    }
)

const login = Joi.object(
    {
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }
);

const forgotPassword = Joi.object({
    email: Joi.string().email().required()
});

const resetPassowrd = Joi.object({
    password: Joi.string().required(),
    verifyPassword:Joi.string().required()
})

export default { register, login, authCheck,forgotPassword,resetPassowrd };