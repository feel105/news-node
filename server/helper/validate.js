const Validator = require("validatorjs");
// const validator = (body, rules, customMessages, callback) => {
//   const validation = new Validator(body, rules, customMessages);
//   validation.passes(() => callback(null, true));
//   validation.fails(() => callback(validation.errors, false));
// };

const validator = async (body, rules, customMessages) => {
  const validation = await new Validator(body, rules, customMessages);
  validation.passes(() => {
    return {
      success: true,
    };
  });
  validation.fails((err) => {
    console.log(err, " d ", validation.errors);
    return {
      success: false,
      payload: validation.errors,
    };
  });
};

module.exports = validator;
