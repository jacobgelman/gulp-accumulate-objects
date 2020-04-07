# gulp-accumulate-objects
Accumulate JSON objects from multiple files into an array of JSON objects in a single file.

## Installation
```
npm install gulp-accumulate-objects --save
```

## Usage
```javascript
const { src, dest } = require("gulp");
const accumulateObjects = require("gulp-accumulate-objects");

function combineDataTask() {
    
    return src("src/data/**/*.json")
        .pipe( accumulateObjects("allData.json", (obj, file) => {
            // Modify the object if needed
            return obj;
        }))
    
}
```

## API
### accumulateObjects(fileName, edit)

**fileName** `string`

The output filename containing the array of accumulated objects.

**edit** `function` (optional)

An optional function to edit each input object. The function is passed the object itself along with a reference to the file it is contained within.