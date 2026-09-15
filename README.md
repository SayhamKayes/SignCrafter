<h1>SignCrafter ✍️</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white" alt="Capacitor" />
</p>

<p align="center">
  SignCrafter is a powerful, mobile-first email signature generator built with React. It allows professionals to create, customize, and export sleek, responsive email signatures that work perfectly across Gmail, Outlook, Apple Mail, and other major email clients.
</p>

<p align="center">
  The application is built as a Progressive Web App (PWA) and wrapped with Capacitor, delivering a native Android experience complete with bottom-tab navigation and native sharing capabilities.
</p>

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architectural Design](#️-architectural-design)
- [Getting Started (Web)](#-getting-started-web)
- [Building for Android](#-building-for-android)
- [Cloudinary Configuration](#️-cloudinary-configuration)
- [Contributing](#-contributing)
- [License](#-license)
- [Developed By](#-developed-by)

## ✨ Features
- **Real-Time Live Preview**: Watch your signature update instantly as you type.
- **Premium Templates**: Choose from Executive Minimal, Professional Split, Vibrant Modern, Header Banner, and Corporate Formal.
- **Dynamic Typography**: Complete control over email-safe fonts (Arial, Tahoma, Georgia, etc.), weights, styles, and text transformations.
- **Custom Color Palettes**: Granular color controls for text, lines, icons, and backgrounds.
- **Icon Styling**: Toggle between square, rounded, circle, or transparent social and contact icons.
- **Rich Text Copy & Export**: 
  - "Copy Signature" copies the rendered HTML directly to your clipboard for easy pasting into email clients.
  - "Download Source File" saves the raw `.html` file.
  - *Android Native*: Uses Capacitor's native Share sheet and FileSystem APIs.
- **Mobile-First Design**: Responsive UI that transforms into a sleek, 5-tab native app layout on mobile devices.
- **Dark Mode Support**: Seamlessly toggles between light and dark themes, including automatic logo color inversion.

## 🛠️ Tech Stack
- **Frontend Framework**: React 19 (Vite)
- **State Management**: Zustand
- **Animations & Effects**: Framer Motion, tsParticles
- **Styling**: Vanilla CSS (CSS Variables, Flexbox, CSS Grid)
- **Mobile Compilation**: Capacitor (Android SDK)
- **Backend Services**: Firebase
- **Image Hosting**: Cloudinary API (Unsigned preset uploads)
- **Deployment**: GitHub Pages

## 🏗️ Architectural Design
SignCrafter follows a component-driven architecture designed for scalability and maintainability:

1. **Presentation Layer**: Built with React functional components and hooks. Organized into atomic design principles (atoms, molecules, organisms, templates).
2. **State Management**: Uses Zustand for a global store to manage signature data (personal info, styling preferences, template choice) across the application without prop drilling.
3. **Cross-Platform Bridge**: Uses Capacitor to provide native API access (FileSystem, Share) when running on Android, gracefully degrading to web APIs when running in a browser.
4. **Build Pipeline**: Vite handles the rapid development server and optimized production build, which is then synchronized to the Capacitor Android project.

## 🚀 Getting Started (Web)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/signcrafter.git
   cd signcrafter
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📱 Building for Android
SignCrafter is fully configured to compile into a native Android APK using Capacitor.

1. Build the production web assets:
   ```bash
   npm run build
   ```
2. Sync the web assets to the Android project:
   ```bash
   npx cap sync
   ```
3. Compile the APK directly from the terminal (requires Android SDK):
   - **Windows:** `.\android\gradlew.bat assembleDebug`
   - **Mac/Linux:** `./android/gradlew assembleDebug`

*(Alternatively, you can open Android Studio using `npx cap open android` and build from the GUI).*

## ☁️ Cloudinary Configuration
To enable image uploads, users must provide their Cloudinary Cloud Name and an **Unsigned** Upload Preset in the app settings. 
*(Note: Future roadmap includes a Firebase Auth integration for zero-friction user image hosting).*

## 🤝 Contributing
Contributions, issues and feature requests are welcome!
Feel free to check [issues page](https://github.com/yourusername/signcrafter/issues).

## 📝 License
This project is [MIT](https://opensource.org/licenses/MIT) licensed.

## 👨‍💻 Developed By
<p align="center" dir="auto"><i>Designed &amp; Developed by <a href="https://sayhamkayes.github.io/portfolio/" rel="nofollow">Sayham Kayes</a></i></p>