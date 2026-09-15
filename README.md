<h1>SignCrafter ✍️</h1>
<p>SignCrafter is a powerful, mobile-first email signature generator built with React. It allows professionals to create, customize, and export sleek, responsive email signatures that work perfectly across Gmail, Outlook, Apple Mail, and other major email clients.</p>

<p>The application is built as a Progressive Web App (PWA) and wrapped with Capacitor, delivering a native Android experience complete with bottom-tab navigation and native sharing capabilities.</p>

<h2>✨ Features</h2>
<ul>
  <li><strong>Real-Time Live Preview</strong>: Watch your signature update instantly as you type.</li>
  <li><strong>5 Premium Templates</strong>: Choose from Executive Minimal, Professional Split, Vibrant Modern, Header Banner, and Corporate Formal.</li>
  <li><strong>Dynamic Typography</strong>: Complete control over email-safe fonts (Arial, Tahoma, Georgia, etc.), weights, styles, and text transformations.</li>
  <li><strong>Custom Color Palettes</strong>: Granular color controls for text, lines, icons, and backgrounds.</li>
  <li><strong>Icon Styling</strong>: Toggle between square, rounded, circle, or transparent social and contact icons.</li>
  <li><strong>Rich Text Copy & Export</strong>: 
    <ul>
      <li>"Copy Signature" copies the rendered HTML directly to your clipboard for easy pasting into email clients.</li>
      <li>"Download Source File" saves the raw <code>.html</code> file.</li>
      <li><em>Android Native</em>: Uses Capacitor's native Share sheet and FileSystem APIs.</li>
    </ul>
  </li>
  <li><strong>Mobile-First Design</strong>: Responsive UI that transforms into a sleek, 5-tab native app layout on mobile devices.</li>
  <li><strong>Dark Mode Support</strong>: Seamlessly toggles between light and dark themes, including automatic logo color inversion.</li>
</ul>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><strong>Frontend</strong>: React (Vite)</li>
  <li><strong>State Management</strong>: Zustand</li>
  <li><strong>Styling</strong>: Vanilla CSS (CSS Variables, Flexbox, CSS Grid)</li>
  <li><strong>Mobile Compilation</strong>: Capacitor (Android SDK)</li>
  <li><strong>Image Hosting</strong>: Cloudinary API (Unsigned preset uploads)</li>
</ul>

<h2>🚀 Getting Started (Web)</h2>

<h3>Prerequisites</h3>
<p>Make sure you have <a href="https://nodejs.org/" target="_blank">Node.js</a> installed.</p>

<h3>Installation</h3>
<ol>
  <li>Clone the repository:
<pre><code>git clone https://github.com/yourusername/signcrafter.git
cd signcrafter</code></pre>
  </li>
  <li>Install dependencies:
<pre><code>npm install</code></pre>
  </li>
  <li>Start the development server:
<pre><code>npm run dev</code></pre>
  </li>
</ol>

<h2>📱 Building for Android</h2>
<p>SignCrafter is fully configured to compile into a native Android APK using Capacitor.</p>

<ol>
  <li>Build the production web assets:
<pre><code>npm run build</code></pre>
  </li>
  <li>Sync the web assets to the Android project:
<pre><code>npx cap sync</code></pre>
  </li>
  <li>Compile the APK directly from the terminal (requires Android SDK):
    <ul>
      <li><strong>Windows:</strong> <code>.\android\gradlew.bat assembleDebug</code></li>
      <li><strong>Mac/Linux:</strong> <code>./android/gradlew assembleDebug</code></li>
    </ul>
  </li>
</ol>
<p><em>(Alternatively, you can open Android Studio using <code>npx cap open android</code> and build from the GUI).</em></p>

<h2>☁️ Cloudinary Configuration</h2>
<p>To enable image uploads, users must provide their Cloudinary Cloud Name and an <strong>Unsigned</strong> Upload Preset in the app settings. <br>
<em>(Note: Future roadmap includes a Firebase Auth integration for zero-friction user image hosting).</em></p>

<h2>👨‍💻 Developed By</h2>
<p align="center" dir="auto"><i>Designed &amp; Developed by <a href="https://sayhamkayes.github.io/portfolio/" rel="nofollow">Sayham Kayes</a></i></p>