export const createUserValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "name must be between 5-32 characters",
    },
    notEmpty: {
      errorMessage: "name Cannot be Empty",
    },
    isString: {
      errorMessage: "name must be a String",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "email cannot be empty",
    },
  },

  password: {
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: "Password must be of 3-10 characters",
    },
    notEmpty: {
      errorMessage: "Password should not be empty",
    },
  },
};

export const getUserValidationSchema = {
  filter: {
    isString: {
      errorMessage: "Filter Parameter must be a String",
    },
    notEmpty: {
      errorMessage: "Must Not be Empty",
    },
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: "Must be between 3-10 characters",
    },
  },
};
