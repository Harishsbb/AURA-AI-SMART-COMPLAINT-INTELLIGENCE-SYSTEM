const fs = require('fs');
const path = require('path');

// Read the file and handle UTF-16LE if necessary (though Node usually handles it or we can convert)
try {
    const data = fs.readFileSync('models_output.json', 'utf16le');
    const json = JSON.parse(data);
    const flashModels = json.models.filter(m => m.name.includes('flash'));
    console.log(JSON.stringify(flashModels, null, 2));
} catch (e) {
    // Try as UTF-8 if UTF-16LE fails
    const data = fs.readFileSync('models_output.json', 'utf8');
    const json = JSON.parse(data);
    const flashModels = json.models.filter(m => m.name.includes('flash'));
    console.log(JSON.stringify(flashModels, null, 2));
}
