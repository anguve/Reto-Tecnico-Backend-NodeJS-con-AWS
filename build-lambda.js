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
      .then(() => {
        console.log(`Lambda '${name}' bundled successfully`);
      }),
  ),
).catch((error) => {
  console.error('Error bundling one of the Lambdas with esbuild.');
  console.error(error);
  process.exit(1);
});
