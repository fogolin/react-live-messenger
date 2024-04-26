const Yup = require('yup');

const formSchema = Yup.object().shape({
    username: Yup.string().min(6, "Username too short.").max(24, "Username too long.").required("Username is required."),
    password: Yup.string().required("Password is required."),
});

const validateForm = (req, res) => {
    const { username, password } = req.body;

    formSchema.validate({ username, password }, { abortEarly: false })
        .catch(err => {
            const errors = {};
            if (err.inner.length > 0) {
                err.inner.forEach(error => {
                    errors[error.path] = error.message;
                });
            }
            res.status(422).json({ message: "Form submitted has invalid information.", errors }).send();
            console.log("Errors", errors)
        }).then(valid => {
            if (valid) {
                // res.status(200).json({
                //     message: "Form Successful",
                //     token: "<PASSWORD>"
                // }).send();
                console.log("Form successful")
            } else {
                // res.status(401).json({
                //     message: "Form Failed"
                // }).send();
                console.log("Form failed")
            }
        })
}

module.exports = validateForm;