const dotenv = require('dotenv');

module.exports = async ({ options, resolveVariable }) => {
  const stage = await resolveVariable('sls:stage');
  const envVars = dotenv.config({ path: `.env.${stage}` }).parsed;
  return Object.assign(
    {},
    envVars,
    process.env
  );
};