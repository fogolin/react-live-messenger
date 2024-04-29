const Yup = require('yup');

const formSchema = Yup.object().shape({
    username: Yup.string().min(6, "Username too short.").max(24, "Username too long.").required("Username is required."),
    password: Yup.string().required("Password is required."),
});

module.exports = { formSchema };