# Embossing Kiosk

A desktop application for managing embossing machines, built with Next.js and Electron.

## 🚀 Features

- **Electron.js** desktop application with **Next.js** web interface
- **HTTP Communication** for connecting to embossing hardware
- **Drawing Canvas** for creating custom embossing designs
- **Modern UI** with Tailwind CSS and Shadcn UI components
- **Type-safe** development with TypeScript
- **Configurable Settings** for local or remote API connections

## 📁 Project Structure

The project is organized as a monorepo using Turborepo:

- `apps/web`: Next.js web application with Electron integration
- `packages`: Shared components and configurations

## 🛠️ Tech Stack

- [Electron.js](https://www.electronjs.org/) - Desktop application framework
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - UI component library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Fabric.js](http://fabricjs.com/) - Canvas drawing library
- [React Hook Form](https://react-hook-form.com/) - Form validation

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

## 🌐 HTTP Communication

The application communicates with embossing machines over HTTP:

1. **Local Mode**: Connect to a machine on your local network
2. **Web Mode**: Connect to a remote API endpoint

The admin settings panel allows you to configure:
- API endpoints (local and web URLs)
- Embossing parameters (speed, duration, depth)
- Advanced machine settings (acceleration, jerk, cooling time)

## 🎨 Design Creation

The application includes a drawing canvas that allows users to:

1. Create freehand drawings
2. Add text with various fonts
3. Use eraser and selection tools
4. Save designs for embossing

## 📱 User Interface

The kiosk interface is designed for ease of use:
- Simple form for user information
- Interactive drawing canvas
- Model selection (engraving or embroidery)
- Fullscreen mode for kiosk deployment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

## 🙏 Acknowledgments

- Electron.js team for the desktop application framework
- Next.js team for the React framework
- Fabric.js team for the canvas drawing library
