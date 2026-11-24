const express = require('express');
// const request = require('request');
const rock = require('rock-req')
const multer = require('multer')
const cors = require('cors')
const upload = multer()
const FormData = require('form-data')

const app = express();

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });
app.use(cors())

app.get('/healthz', (_req, res) => res.json("OK"))

app.get('/test', (req, res) => {
    // request(
    //     {
    //         uri: "https://jsonplaceholder.typicode.com/posts/1"
    //     },
    //     (error, response, body) => {
    //         if (error || !response || !response.statusCode || response.statusCode !== 200) {
    //             return res.status(500).json({ type: 'error', message: error.message });
    //         }
    //         res.json(JSON.parse(body))
    //     }
    // )
    rock.get('https://jsonplaceholder.typicode.com/posts/1', (error, response, body) => {
        if (error || !response || !response.statusCode || response.statusCode !== 200) {
            return res.status(500).json({ type: 'error', message: error.message });
        }
        res.json(JSON.parse(body))
    })
})

app.get('/www.fio.cz/ib_api/rest/*.json', (req, res) => {
    // request(
    //     {
    //         url: `https:/${req.path}`
    //     },
    //     (error, response, body) => {
    //         if (error || !response || !response.statusCode || response.statusCode !== 200) {
    //             const errorMessage = error && error.message || ""
    //             const statusCode = response && response.statusCode || 500
    //             return res.status(500).json({ type: 'error', message: errorMessage, statusCode });
    //         }
    //         res.json(JSON.parse(body));
    //     }
    // )
    rock(`https:/${req.path}`, (error, response, body) => {
        if (error || !response || !response.statusCode || response.statusCode !== 200) {
            const errorMessage = error && error.message || ""
            const statusCode = response && response.statusCode || 500
            return res.status(500).json({ type: 'error', message: errorMessage, statusCode });
        }
        res.json(JSON.parse(body));
    })
});

app.post('/www.fio.cz/ib_api/rest/import/', upload.single('file'), (req, res) => {
    const file = req.file
    const body = req.body
    // const formData = {
    //     ...req.body,
    //     file: {
    //         value: file.buffer,
    //         options: {
    //             filename: 'davka.xml',
    //             contentType: 'text/xml'
    //         }
    //     }
    // }

    // request.post(
    //     {
    //         url: `https:/${req.path}`,
    //         formData: formData
    //     },
    //     (error, response, body) => {
    //         if (error || response.statusCode !== 200) {
    //             console.log(response)
    //             const statusCode = response && response.statusCode || 500
    //             return res.status(statusCode).json({ type: 'error', message: error && error.message ? error.message : '' });
    //         }
    //         res.send(body);
    //     })
    const form = new FormData()
    form.append("token", body.token)
    form.append("type", body.type)
    form.append("lng", body.lng)
    // form.append("token", body.token)
    // form.append("type", body.type)
    // form.append("lng", body.lng)
    // form.append('file', file, {
    //     filename: 'davka.xml',
    //     contentType: 'text/xml'
    // });
    const opts = {
        url: `https:/${req.path}`,
        // body: formData,
        body: () => {
            form.append('file', Buffer.from(file.buffer), {
                filename: 'davka.xml',
                contentType: 'text/xml'
            });

        },
        // form: formData,
        maxRetry: 3,
        retryDelay: 500,
    }
    rock(opts, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            // console.log(response)
            const statusCode = response && response.statusCode || 500
            return res.status(statusCode).json({ statusCode, type: 'error', message: error && error.message ? error.message : '' });
        }
        res.send(body);
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));