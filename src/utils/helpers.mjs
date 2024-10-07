import bcrypt from "bcrypt";

const saltRounds = 10;

// Function to hash the password
export const hashPassword = (password) => {
  // Generate the salt
  const salt = bcrypt.genSaltSync(saltRounds);
  console.log(salt);
  // Hash the password
  return bcrypt.hashSync(password, salt);
};

// Function to compare passwords
export const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};
