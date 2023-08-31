## Development

```sh
yarn
yarn watch-web
```

On vscode, select `Run and Debug` panel and use the `Run Node Extension` task to debug the extension

> NOTE: if you're working on the visualization make sure to copy the build artifacts to the `dist` folder of `otel-validator` 

```sh
cp -R otel-ui/dist/ otel-validator/dist/
```