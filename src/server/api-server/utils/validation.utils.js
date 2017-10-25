import Ajv from 'ajv';

const ajv = new Ajv();

export const validationUtils = {
  getValidatorBySchema: (schema) => {
    return ajv.compile(schema);
  },

  ensureValidation: async(req, res, validators) => {
    for (let validator of validators) {
      const error = await validator(req);
      if (error) {
        res.status(400).json({error});
        return false;
      }
    }
    return true;
  }
};