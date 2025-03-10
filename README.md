# Embossing Kiosk

A desktop application for managing embossing machines, built with Next.js and Electron.

## 🚀 Features

- **Electron.js** desktop application with **Next.js** web interface
- **USB/Serial Communication** for connecting to embossing hardware
- **PDF Generation** for creating embossing templates
- **Modern UI** with Tailwind CSS
- **Type-safe** development with TypeScript

## 📁 Project Structure

The project is organized as a monorepo using Turborepo:

- `apps/web`: Next.js web application with Electron integration
- `apps/cms`: Payload CMS for content management (optional)
- `packages`: Shared components and configurations

## 🛠️ Tech Stack

- [Electron.js](https://www.electronjs.org/) - Desktop application framework
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [SerialPort](https://serialport.io/) - Serial port communication
- [PDF Generation](https://react-pdf.org/) - PDF template creation

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

To run the application in development mode:

```bash
# From the root directory
pnpm dev

# Or to run just the web app with Electron
cd apps/web
pnpm electron:dev
```

### Building

To build the application for production:

```bash
# From the root directory
pnpm build

# Or to build just the web app with Electron
cd apps/web
pnpm electron:build
```

## 📱 USB/Serial Communication

The application includes a Serial Port Manager that allows you to:

1. Scan for available USB/Serial devices
2. Connect to embossing machines
3. Send commands and receive data
4. Monitor communication in real-time

To access the Serial Port Manager, navigate to `/serial` in the application.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

## 🙏 Acknowledgments

- Electron.js team for the desktop application framework
- Next.js team for the React framework
- SerialPort team for the serial communication library
