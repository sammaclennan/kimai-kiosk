# Kimai Kiosk
### Undocumented - Not currently suitable for general use - open an issue if you need this and I will prioritise this project.

Kimai Kiosk is a kiosk client for Kimai, suited to fixed-station sign-on using a barcode scanner.

This application was made in a few days to suit my own business needs and is currently full of errors and poor practice. Issues will be ironed out in the future.

Kimai Kiosk is a standalone web application that integrates with the main Kimai application via the REST API. This architecture is not ideal, but it was rapid - it may be changed in the future to directly integrate as a Kimai plugin.

## Install

Proper install and configuration documentation are coming soon, but below are some high-level instructions.

- Clone to device to be a server - it can be co-located with Kimai with no issues.
- Navigate to `kimai-kiosk` directory and install NPM dependencies (`npm i`)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
