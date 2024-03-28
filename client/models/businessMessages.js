export default {
    validations: {
        required: () => "This field is required.",
        invalidFormat: (obj) => `Invalid ${obj} format.`,
        passwordFormat: () => "Password must be 8 - 20 alphanumeric characters, at least an uppercase and a symbol.",
    },
    label: {
        loginUsername: () => "Phone number / Username /Email",
        username: () => "Username",
        password: () => "Password",
        email: () => "email",
        phoneNumber: () => "Phone Number",
    }
}