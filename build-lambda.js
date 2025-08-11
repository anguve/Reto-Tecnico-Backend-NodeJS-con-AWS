const esbuild = require('esbuild');
const lambdas = ['merged', 'storage', 'history'];

Promise.all(
  lambdas.map((name) =>
    esbuild
      .build({
        entryPoints: [`src/lambdas/${name}.ts`],
        bundle: true,
        platform: 'node',
        target: 'node20',
        outfile: `dist/lambdas/${name}.js`,
        external: ['aws-sdk'],
      })
      .then(() => {}),
  ),
).catch((error) => {
  console.error(error);
  process.exit(1);
});
