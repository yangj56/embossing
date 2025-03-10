# Embossing Kiosk Web Application

This is the web application component of the Embossing Kiosk, built with [Next.js](https://nextjs.org) and [Electron.js](https://www.electronjs.org/).

## Getting Started

### Development

To run the web application in development mode:

```bash
# Run Next.js development server only
pnpm dev

# Run with Electron (recommended)
pnpm electron:dev
```

The web application will be available at [http://localhost:3001](http://localhost:3001) in your browser, and will also open in an Electron window.

### Building

To build the application for production:

```bash
# Build Next.js app only
pnpm build

# Build Electron app
pnpm electron:build

# Package Electron app
pnpm electron:package
```

## Features

### Serial Port Communication

The application includes a Serial Port Manager that allows you to connect to USB/Serial devices such as embossing machines. To access this feature:

1. Navigate to `/serial` in the application
2. Use the interface to scan for available devices
3. Connect to your embossing machine
4. Send commands and receive data

### PDF Template Generation

Create and manage embossing templates with the built-in PDF generation tools.

## Project Structure

- `app/`: Next.js application routes and pages
- `components/`: React components
- `electron/`: Electron main process and preload scripts
- `lib/`: Utility functions and shared code
- `public/`: Static assets

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Electron Documentation](https://www.electronjs.org/docs)
- [SerialPort Documentation](https://serialport.io/docs/)
