const path = require('path');
const fs = require('fs');
const quicktype = require('quicktype').main;
const modelPath = path.join(__dirname, '..', 'schemas');
const interfacePath = path.join(__dirname, '..', 'src', 'interfaces');
const warningMessage = `/**
 * This file was automatically generated.
 * DO NOT MODIFY IT MANUALLY.
 * Update the corresponding JSON Schema in schemas/models and run
 * 'npm run types' to regenerate the interfaces.
 */
`;

/**
 * Read all the files in schemas/models and generate
 * the TypeScript interfaces in src/interfaces
 */
fs.readdir(modelPath, (err, files) => {
    if (err) throw err;

    files.forEach(async file => {
        try {
            const output = file.replace('json', 'ts');
            console.log(`Generating interface ${output}...`);

            // Generate the interface                                                                
            await quicktype({
                src: [`${modelPath}/${file}`],
                srcLang: 'schema',
                lang: 'ts',
                out: `${interfacePath}/${output}`,
                telemetry: 'disable',
                justTypes: true,
                noDateTimes: true,
                rendererOptions: {
                    'just-types': true
                }
            });

            // Prepend the warning message                                                           
            const data = fs.readFileSync(`${interfacePath}/${output}`);
            const fd = fs.openSync(`${interfacePath}/${output}`, 'w+');
            const insert = new Buffer(warningMessage);
            fs.writeSync(fd, insert, 0, insert.length, 0);
            fs.writeSync(fd, data, 0, data.length, insert.length);
            fs.close(fd, err => {
                if (err) throw err;
            });
        } catch (err) {
            console.error(`Error while generating ${file}:`, JSON.stringify(err, null, 4));
        }
    });
});
