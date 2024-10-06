export const createUserValidationSchema = {
    name: {
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: 'Username must be between 5-32 characters',
        },
        notEmpty: {
            errorMessage: 'Username Cannot be Empty',
        },
        isString: {
            errorMessage: 'Username must be a String',
        },
    },
    email: {
        notEmpty: {
            errorMessage: 'email cannot be empty',
        },
    },
};

export const getUserValidationSchema = {
    filter: {
        isString: {
            errorMessage: 'Filter Parameter must be a String',
        },
        notEmpty: {
            errorMessage: 'Must Not be Empty',
        },
        isLength: {
            options: {
                min: 3,
                max: 10,
            },
            errorMessage: 'Must be between 3-10 characters'
        },
    },
};