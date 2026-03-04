const fs = require('fs');
const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `
export const environment = {
  production: true,
  baseUrl: 'https://reshangayantha-mg-avf.hf.space',
  hfToken: '${process.env.HF_TOKEN}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`Output generated at ${targetPath}`);
