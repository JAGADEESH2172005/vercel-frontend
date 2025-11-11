// Script to verify deployment readiness
import fs from 'fs';
import path from 'path';

const checkFileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
};

const checkDeploymentReadiness = () => {
  console.log('🔍 Checking deployment readiness...\n');
  
  // Check if dist folder exists
  const distPath = path.join(process.cwd(), 'dist');
  if (!checkFileExists(distPath)) {
    console.log('❌ Error: dist folder not found. Run "npm run build" first.');
    return false;
  }
  console.log('✅ dist folder exists');
  
  // Check if index.html exists in dist
  const indexPath = path.join(distPath, 'index.html');
  if (!checkFileExists(indexPath)) {
    console.log('❌ Error: index.html not found in dist folder.');
    return false;
  }
  console.log('✅ index.html exists in dist folder');
  
  // Check if assets folder exists
  const assetsPath = path.join(distPath, 'assets');
  if (!checkFileExists(assetsPath)) {
    console.log('❌ Error: assets folder not found in dist folder.');
    return false;
  }
  console.log('✅ assets folder exists in dist folder');
  
  // Check redirects file
  const redirectsPath = path.join(process.cwd(), '_redirects');
  if (checkFileExists(redirectsPath)) {
    console.log('⚠️  _redirects file exists (may be Netlify-specific)');
  }
  
  // Check vite.config.js
  const viteConfigPath = path.join(process.cwd(), 'vite.config.js');
  if (!checkFileExists(viteConfigPath)) {
    console.log('❌ Error: vite.config.js file not found.');
    return false;
  }
  console.log('✅ vite.config.js file exists');
  
  // Check if paths in index.html are relative
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  if (indexContent.includes('src="/assets/') || indexContent.includes('href="/assets/')) {
    console.log('❌ Error: index.html contains absolute paths. Should be relative paths.');
    return false;
  }
  console.log('✅ index.html uses relative paths');
  
  console.log('\n🎉 All checks passed! Ready for deployment.');
  console.log('\n📝 Deployment steps:');
  console.log('1. Build the project: npm run build');
  console.log('2. Deploy the dist folder to your hosting platform');
  console.log('3. Ensure your hosting platform is configured for client-side routing');
  console.log('4. Set environment variables for production');
  
  return true;
};

// Run the check
checkDeploymentReadiness();