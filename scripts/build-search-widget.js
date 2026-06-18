const esbuild = require('esbuild');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function build() {
  console.log('Building Search Widget Bundle...');

  // Ensure output directory exists
  const outputDir = path.join(__dirname, '..', 'public', 'assets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Build JS Bundle using esbuild
  try {
    await esbuild.build({
      entryPoints: [path.join(__dirname, '..', 'lib', 'search-widget', 'index.tsx')],
      outfile: path.join(outputDir, 'sensei-search-widget.js'),
      bundle: true,
      minify: true,
      sourcemap: false,
      platform: 'browser',
      target: ['es2020'],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      logLevel: 'info'
    });
    console.log('JS Bundle built successfully!');
  } catch (err) {
    console.error('JS Bundle build failed:', err);
    process.exit(1);
  }

  // 2. Build CSS Bundle using Tailwind CLI v4
  try {
    console.log('Compiling CSS with Tailwind v4 CLI...');
    const inputCss = path.join(__dirname, '..', 'lib', 'search-widget', 'search-widget.css');
    const outputCss = path.join(outputDir, 'sensei-search-widget.css');
    
    // Run tailwind CLI
    execSync(`npx @tailwindcss/cli -i "${inputCss}" -o "${outputCss}" --minify`, {
      stdio: 'inherit'
    });
    console.log('CSS Bundle built successfully!');
  } catch (err) {
    console.error('CSS Bundle build failed:', err);
    process.exit(1);
  }

  console.log('Build completed successfully!');
}

build();
