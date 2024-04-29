const Yup = require('yup');
const { formSchema } = require('@whatsapp-clone/common');

const validateForm = (req, res, next) => {
    const formData = req.body;

    formSchema.validate(formData, { abortEarly: false })
        .catch(err => {
            const errors = {};
            if (err.inner.length > 0) {
                err.inner.forEach(error => {
                    errors[error.path] = error.message;
                });
            }
            res.status(422).json({
                message: "Form submitted has invalid information.",
                status: "Form validation failed with errors.",
                errors
            }).send();
        }).then(valid => {
            if (valid) {
                console.log("Form successful")
                next()
            }
            //  else {
            //     console.log("Form failed")
            //     res.status(422).json({
            //         message: "Form submitted has invalid information.",
            //         status: "Form validation failed with errors.",
            //         errors: [{ "form": "Form validation failed with errors." }]
            //     }).send();
            // }
        })
}

module.exports = validateForm;