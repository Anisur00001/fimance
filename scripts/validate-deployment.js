#!/usr/bin/env node

/**
 * Deployment Validation Script
 * Validates that the project is ready for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'vercel.json',
  'package.json',
  'client/package.json',
  'backend/package.json',
  'client/.env.example',
  'backend/.env.example',
  'DEPLOYMENT.md'
];

const requiredDirs = [
  'client/dist',
  'backend/dist'
];

const requiredScripts = {
  'package.json': ['build', 'vercel-build', 'deploy'],
  'client/package.json': ['build', 'vercel-build'],
  'backend/package.json': ['build', 'vercel-build']
};

console.log('🔍 Validating Vercel deployment configuration...\n');

let hasErrors = false;

// Check required files
console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check required directories (build outputs)
console.log('\n📂 Checking build outputs...');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - MISSING (run 'npm run build')`);
    hasErrors = true;
  }
});

// Check required scripts
console.log('\n📜 Checking package.json scripts...');
Object.entries(requiredScripts).forEach(([packageFile, scripts]) => {
  if (fs.existsSync(packageFile)) {
    const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
    scripts.forEach(script => {
      if (pkg.scripts && pkg.scripts[script]) {
        console.log(`✅ ${packageFile}: ${script}`);
      } else {
        console.log(`❌ ${packageFile}: ${script} - MISSING`);
        hasErrors = true;
      }
    });
  }
});

// Check vercel.json configuration
console.log('\n⚙️  Checking vercel.json configuration...');
if (fs.existsSync('vercel.json')) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    
    // Check required sections
    const requiredSections = ['builds', 'routes', 'functions', 'headers', 'redirects'];
    requiredSections.forEach(section => {
      if (vercelConfig[section]) {
        console.log(`✅ vercel.json: ${section}`);
      } else {
        console.log(`⚠️  vercel.json: ${section} - OPTIONAL but recommended`);
      }
    });
    
    // Check security headers
    if (vercelConfig.headers && vercelConfig.headers[0] && vercelConfig.headers[0].headers) {
      const headers = vercelConfig.headers[0].headers.map(h => h.key);
      const securityHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options', 
        'Strict-Transport-Security',
        'Content-Security-Policy'
      ];
      
      securityHeaders.forEach(header => {
        if (headers.includes(header)) {
          console.log(`✅ Security header: ${header}`);
        } else {
          console.log(`⚠️  Security header: ${header} - MISSING`);
        }
      });
    }
  } catch (error) {
    console.log(`❌ vercel.json - INVALID JSON: ${error.message}`);
    hasErrors = true;
  }
}

// Check environment variable templates
console.log('\n🔐 Checking environment variable templates...');
const envFiles = ['client/.env.example', 'backend/.env.example'];
envFiles.forEach(envFile => {
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    console.log(`✅ ${envFile} (${lines.length} variables)`);
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Deployment validation FAILED');
  console.log('Please fix the issues above before deploying to Vercel.');
  process.exit(1);
} else {
  console.log('✅ Deployment validation PASSED');
  console.log('Your project is ready for Vercel deployment!');
  console.log('\nNext steps:');
  console.log('1. Set up environment variables in Vercel dashboard');
  console.log('2. Run: npm run deploy');
  console.log('3. Configure custom domain (optional)');
}