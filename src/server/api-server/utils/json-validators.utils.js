import Ajv from 'ajv';

const ajv = new Ajv();

export const jsonValidatorsUtils = {
  getValidatorBySchema(schema) {
    return ajv.compile(schema);
  }
};