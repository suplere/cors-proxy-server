const express = require('express');
const request = require('request');
const multer = require('multer')
const upload = multer()

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/www.fio.cz/ib_api/rest/*.json', (req, res) => {
    request(
        {
            url: `https:/${req.path}`
        },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error.message });
            }
            res.json(JSON.parse(body));
        }
    )
});

app.post('/www.fio.cz/ib_api/rest/import/', upload.single('file'), (req, res) => {
    const file = req.file
    // console.log(file)
    const formData = {
        ...req.body,
        file: {
            value: file.buffer,
            options: {
                filename: 'davka.xml',
                contentType: 'text/xml'
            }
        }
    }
    request.post(
        {
            url: `https:/${req.path}`,
            formData: formData
        },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                console.log(response)
                return res.status(response.statusCode).json({ type: 'error', message: error && error.message ? error.message : '' });
            }
            res.send(body);
        })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));