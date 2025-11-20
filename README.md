# Httping

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
</p>

<p align="center">
  <strong>Simple, Fast, Open Source API Testing Tool</strong>
</p>

<p align="center">
  A lightweight alternative to Postman for developers who want simplicity and speed.
</p>

---

## ✨ Features

- 🚀 **Lightweight** - Fast startup, minimal resource usage
- 🎯 **Simple** - Clean UI, intuitive workflow
- 📝 **Request History** - Auto-save all your requests
- 🔐 **Auth Support** - JWT, Bearer Token, Basic Auth
- 🌍 **Environment Variables** - Switch between dev/staging/prod
- 💾 **Import/Export** - Backup and share your collections
- 🎨 **Syntax Highlighting** - Beautiful JSON/XML formatting
- 🔓 **Open Source** - Free forever, community-driven

## 🎯 Why Httping?

**Problem**: Postman is great but too heavy for simple API testing. You don't need 90% of its features.

**Solution**: Httping focuses on the essentials - making API requests, viewing responses, and managing history. That's it.

## 🚀 Quick Start

### Installation

**macOS / Linux:**

```bash
# Coming soon
brew install httping
```

**Windows:**

```bash
# Coming soon
scoop install httping
```

**From Source:**

```bash
git clone https://github.com/Perlou/httping.git
cd httping
# Build instructions coming soon
```

### Usage

```bash
# Launch GUI
httping

# CLI mode (coming soon)
httping get https://api.example.com/users
httping post https://api.example.com/users -d '{"name":"John"}'
```

## 📸 Screenshots

_Coming soon - Development in progress_

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Go
- **Desktop**: Tauri (Rust)
- **Database**: SQLite (local storage)

## 🗺️ Roadmap

### v0.1.0 (MVP) - Current

- [x] Project setup
- [ ] Basic HTTP methods (GET, POST, PUT, DELETE)
- [ ] Request/Response viewer
- [ ] Request history
- [ ] Environment variables
- [ ] Basic auth support

### v0.2.0

- [ ] Collections management
- [ ] Import/Export (Postman compatible)
- [ ] GraphQL support
- [ ] WebSocket support

### v0.3.0

- [ ] Team collaboration (cloud sync)
- [ ] API documentation generator
- [ ] Performance testing
- [ ] Mock server

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🐛 **Report bugs** - Open an issue
2. 💡 **Suggest features** - Share your ideas
3. 🔧 **Submit PRs** - Help us build
4. ⭐ **Star the repo** - Show your support

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Perlou/httping.git
cd httping

# Install dependencies
npm install

# Run in development mode
npm run dev
```

## 📄 License

MIT © [Perlou](https://github.com/Perlou)

## 🙏 Acknowledgments

Inspired by:

- [Postman](https://www.postman.com/) - The industry standard
- [Insomnia](https://insomnia.rest/) - A great alternative
- [Hoppscotch](https://hoppscotch.io/) - Open source web-based tool

## 📞 Contact

- **Author**: Perlou
- **Blog**: [perlou.top](https://perlou.top)
- **Twitter**: [@perlou666](https://x.com/perlou666)
- **GitHub**: [@Perlou](https://github.com/Perlou)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Perlou">Perlou</a>
</p>

<p align="center">
  <strong>If you find this project useful, please consider giving it a ⭐</strong>
</p>
