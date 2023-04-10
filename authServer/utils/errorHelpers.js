exports.getErrorMessage = (err) => {
  let errors = [];

  if (err.errors) {
    for (let i = 0; i < Object.keys(err.errors).length; i++) {
      const field = Object.keys(err.errors)[i];
      const message = Object.values(err.errors)[i].message;

      errors.push({ message: message, field: field });
    }
  }

  return { errors };
};
