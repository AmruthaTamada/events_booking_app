// backend/models/userModel.js
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    // 'name' field: a simple String type and it is required.
    // The array in 'required' provides a custom error message if the name is missing.
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    // 'email' field: must be a String, is required, and must be unique.
    // 'unique: true' tells Mongoose to create a unique index in the MongoDB database for this field.
    // This prevents multiple users from registering with the same email address.
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      // A simple regex to validate the email format, though more robust validation might be done on the frontend or with a library.
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    // 'password' field: a required String.
    // We will handle hashing this password in a later step using middleware on this schema,
    // but for now, we just define its basic properties.
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    // 'role' field: This is crucial for our multi-role system.
    // 'enum' is a validator that ensures the 'role' can ONLY be one of the values in the array.
    // 'default' sets a default value if one isn't provided during user creation.
    role: {
      type: String,
      required: true,
      enum: ['attendee', 'organizer'],
      default: 'attendee',
    },
  },
  {
    // The second argument to the Schema is an options object.
    // 'timestamps: true' is a powerful Mongoose feature that automatically adds
    // two fields to our schema: 'createdAt' and 'updatedAt'.
    // This is incredibly useful for tracking when documents are created and modified.
    timestamps: true,
  }
);

// We now compile our schema into a Model.
// The mongoose.model() function takes two arguments:
// 1. The singular name of the collection your model is for. Mongoose automatically
//    looks for the plural, lowercased version of your model name.
//    Thus, the model 'User' is for the 'users' collection in the database.

// 2. Add the Mongoose 'pre-save' middleware hook
// This function will run right before a document is saved to the database.
// We use a standard function declaration here, not an arrow function,
// because we need access to the 'this' keyword, which refers to the document being saved.
userSchema.pre('save', async function (next) {
  // 3. Check if the password field was modified.
  // We only want to hash the password if it's a new user or if the password field is being updated.
  // If a user updates their email, for example, we don't want to re-hash the already-hashed password.
  // 'this.isModified()' is a handy Mongoose method for this.
  if (!this.isModified('password')) {
    // If the password wasn't modified, call next() to move on to the next middleware (or the save operation).
    return next();
  }

  // 4. Generate the salt.
  // 'genSalt(10)' creates a salt with a "cost factor" of 10. This is a measure
  // of how computationally expensive the hash will be. 10 is a strong, standard value.
  const salt = await bcrypt.genSalt(10);

  // 5. Hash the plain-text password with the salt.
  // 'this.password' refers to the plain-text password on the document about to be saved.
  // The 'await' keyword pauses execution until the hashing is complete.
  this.password = await bcrypt.hash(this.password, salt);

  // 6. Call next() to proceed with the save operation.
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' refers to the hashed password stored in the current user document in the database.
  // bcrypt.compare() is an async function that handles the complex comparison for us.
  // It takes the plain-text password from the login attempt and the stored hash.
  // It returns a boolean: 'true' if they match, 'false' otherwise.
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);