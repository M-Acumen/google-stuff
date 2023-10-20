const util = require('util');
const fs = require('fs/promises');
const exec = util.promisify(require('child_process').exec);
const axios = require('axios');

(async () => {
    //capture frame
    await exec(
        'ffmpeg -y -f video4linux2 -s 1280x720 ' +
        '-i /dev/video1 -frames 1s demo.jpeg'
    );

    // convert to base 64
    const image = await fs.readFile('demo.jpeg');
    const base64 = image.toString('base64');

    const key = 'AIzaSyDFNXy2JeV8zoQgK-3Ehpw_J0Aj1rfrR2s';
    const url =
        `https://vision.googleapis.com/v1/images:annotate` +
        `?key=${key}`;

    // send to vision api
    const results = await axios
        .post(url, {
            requests: [{
                image: {
                    content: base64
                },
                features: [{
                    type: 'DOCUMENT_TEXT_DETECTION'
                }]
            }]
        });

    const code = results.data.responses[0].fullTextAnnotation.text;

    // console.log(code);
    eval(code);
})();