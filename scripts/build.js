const fs = require('fs');
const path = require('path');
const zipFolder = require('zip-folder');

// Define paths
const extensionRoot = path.resolve(__dirname);
const buildDir = path.join(extensionRoot, 'build');
const sourceDir = path.join(extensionRoot, 'swiftsuggest');

// Ensure build directory exists, create if it doesn't
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

// Copy manifest.json to build directory
fs.copyFileSync(path.join(sourceDir, 'manifest.json'), path.join(buildDir, 'manifest.json'));

// Copy icons folder to build directory
fs.mkdirSync(path.join(buildDir, 'icons'));
fs.readdirSync(path.join(sourceDir, 'icons')).forEach(file => {
    fs.copyFileSync(path.join(sourceDir, 'icons', file), path.join(buildDir, 'icons', file));
});

// Copy popup folder to build directory
fs.mkdirSync(path.join(buildDir, 'popup'));
fs.readdirSync(path.join(sourceDir, 'popup')).forEach(file => {
    fs.copyFileSync(path.join(sourceDir, 'popup', file), path.join(buildDir, 'popup', file));
});

// Copy options folder to build directory
fs.mkdirSync(path.join(buildDir, 'options'));
fs.readdirSync(path.join(sourceDir, 'options')).forEach(file => {
    fs.copyFileSync(path.join(sourceDir, 'options', file), path.join(buildDir, 'options', file));
});

// Copy styles folder to build directory
fs.mkdirSync(path.join(buildDir, 'styles'));
fs.readdirSync(path.join(sourceDir, 'styles')).forEach(file => {
    fs.copyFileSync(path.join(sourceDir, 'styles', file), path.join(buildDir, 'styles', file));
});

// Optionally, minify CSS or JavaScript files here if needed

// Create a ZIP file of the build directory
const zipFilePath = path.join(extensionRoot, 'swiftsuggest.zip');
zipFolder(buildDir, zipFilePath, function(err) {
    if (err) {
        console.error('Failed to create ZIP file:', err);
    } else {
        console.log('Build completed successfully. ZIP file created:', zipFilePath);
    }
});
