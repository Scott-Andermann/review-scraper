const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { spawn } = require('child_process')
const { response } = require('express')
const axios = require('axios')
const downloadsFolder = require('downloads-folder')
const fs = require('fs')
const AWS = require('aws-sdk')
const { title } = require('process')
const { checkServerIdentity } = require('tls')
const csv = require('csvtojson')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:3000'
}))

const BUCKET_NAME = 'amazonreviewdata'
let s3data;

const s3 = new AWS.S3(
    // add credentials here
    // locally stored at ~/.aws/credentials
)

const getObjectsInBucket = async () => {
    var bucketParams = {
        Bucket: BUCKET_NAME,
    }

    s3.listObjects(bucketParams, function (err, data) {
        if (err) console.log('Error: ', err);
        else {
            // console.log('Success');
            s3data = data.Contents
            titles = s3data.map(obj => {
                return { title: obj.Key.slice(0, -4), complete: true, id: obj.Key.slice(0,10) }
            })
            // console.log(titles);
        }
    })

}

const deleteS3Object = async (filename) => {
    var bucketParams = {
        Bucket: BUCKET_NAME,
        Key: `${filename}.csv`
    }
    titles = titles.filter(title => title.title !== itemTitle)
    // items = items.filter(item =>)
    s3.deleteObject(bucketParams, function (err, data) {
        if (err) console.log(err, err.stack);
    })
}

const downloadS3Object = async (filename) => {
    var bucketParams = {
        Bucket: BUCKET_NAME,
        Key: `${filename}.csv`
    }
    // s3.downloadS3Object(bucketParams, function(err, data){
    //     if (err) console.log(err, err.stack)
    // })

}

// const itemID = 'B08VF6ZVMH'
let titles
getObjectsInBucket(BUCKET_NAME)
let clients = []
let items = []
let itemID
let data
let reviews
// console.log(titles);

const runPy = async (arg, success, nosuccess) => {
    const pyprog = spawn('python', ['hello.py', 'scrape', arg])

    pyprog.stdout.on('data', function (data) {
        console.log('running reviews...');
        success(data);

        // console.log(arg);
    })

    pyprog.stderr.on('data', (data) => {
        nosuccess(data);
    })
}

const getTitle = async (arg, success, nosuccess) => {
    const pyprog = spawn('python', ['hello.py', 'title', arg])

    pyprog.stdout.on('data', function (data) {
        console.log('running Title...');
        success(data);

        // console.log(arg);
    })

    pyprog.stderr.on('data', (data) => {
        nosuccess(data);
    })
}


const sendEventsToAll = (newItem) => {
    // call as shown below
    // sendEventsToAll(JSON.stringify({data: 'this is to all clients'}))
    clients.forEach(client => writeEvent(client, newItem))
}

const writeEvent = (client, data) => {
    try {
        client.res.write(`id: ${client.id}\n`)
        client.res.write(`data: ${data}\n\n`)

    } catch (e) {
        console.log('Error: ', e);
    }
}

const eventConnection = (req, res) => {
    res.writeHead(200, {
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
    })

    const sseId = Date.now()
    const newClient = {
        id: sseId,
        res
    }

    clients.push(newClient)
    console.log(`${sseId} connected`);
    // use setinterval if you need to push updates at a certain time (progress bar?)
    //   setInterval(() => {
    //     sendEventsToAll(JSON.stringify({data: 'send to all clients'}))
    //     // writeEvent(newClient, 'test data goes here')
    // }, 1000)

    writeEvent(newClient, JSON.stringify({ data: { clientID: newClient.id } }))
    sendEvent(newClient, JSON.stringify({
        data: {
            type: 'titles',
            titles: titles
        }
    }))
    req.on('close', () => {
        console.log(`${sseId} Connection Closed`);
        clients = clients.filter(client => client.id !== sseId);
    })
}

const sendEvent = (client, data) => {
    writeEvent(client, data)
}

app.get('/status', (req, res) => {
    res.json({ clients: clients.length })
})


app.post('/add', async (req, res) => {
    console.log('ADD ITEM /')

    itemID = req.body.itemID
    id = req.body.clientID
    pageCount = req.body.pageCount
    const client = clients.find(client => id == client.id)

    if (items.includes(itemID)) {
        sendEvent(client, JSON.stringify({
            data: {
                type: 'note',
                message: 'Item has already been scraped, delete existing data before re-submitting request'
            }
        }))
        res.end()
    } else {

        items.push(itemID)
        console.log(pageCount);
        let arg = JSON.stringify({item_no: itemID, pageCount: pageCount})
        await runPy(arg, function (fromRunPy) {
            reviews = fromRunPy.toString()
            console.log('scraping finished');
            titles = titles.map(obj => {
                if (obj.id === itemID) {
                    return { ...obj, complete: true };
                }
                return obj;
            })
            sendEvent(client, JSON.stringify({
                data: {
                    type: 'scrape',
                    id: itemID,
                    message: 'scraping finished'
                }
            }))
        }, function (fromRunPy) {
            console.log(fromRunPy.toString())
        })

        await getTitle(itemID, function (fromPy) {
            titles.push({ id: itemID, title: itemID + fromPy.toString().replace(/[\r\n]/gm, ''), complete: false })
            // console.log(titles);
            sendEvent(client, JSON.stringify({
                data: {
                    type: 'titles',
                    titles: titles
                }
            }))
        },
            function (fromPy) {
                console.log(fromPy.toString())
            })
        res.end();
    }
})

app.post('/delete', async (req, res) => {
    console.log('DELETE ITEM /');
    id = req.body.clientID
    itemTitle = req.body.itemTitle
    const client = clients.find(client => id == client.id)
    // console.log(titles);
    // console.log(itemTitle);
    if (titles.find(title => title.title === itemTitle)) {

        await deleteS3Object(itemTitle)
        console.log(`${itemTitle} removed from database`);
    } else {
        console.log('Item does not exist in database')
    }

    res.end()
})

app.post('/download', async (req, res) => {
    console.log('DOWNLOAD ITEM /');
    id = req.body.clientID
    itemTitle = req.body.itemTitle
    const client = clients.find(client => id == client.id)
    var bucketParams = {
        Bucket: BUCKET_NAME,
        Key: `${itemTitle}.csv`,
        Expires: 3000
    }
    const basePath = downloadsFolder()
    const fullPath = `${basePath}/${itemTitle}.csv`
    const url = await s3.getSignedUrlPromise('getObject', bucketParams).catch((err) => console.log(err))
    try {

        const response = await axios.get(url, {
            responseType: 'stream',
        })
        const istream = response.data;
        const ostream = fs.createWriteStream(fullPath);

        istream.pipe(ostream)
    } catch (e) {
        console.log('Download Error: ', e);
    }

    res.end()
})

app.post('/get_data', async (req, res) => {
    // const key = req.body.title
    const keys = req.body.titleList
    const id = req.body.clientID
    const client = clients.find(client => id == client.id)

    let csvData = []
    try {
        for (key of keys) {
            // console.log(key)
            let stream = s3.getObject({ Bucket: BUCKET_NAME, Key: `${key}.csv` }).createReadStream();
            csvData.push({ name: key, data: await csv().fromStream(stream) });
        }

        data = JSON.stringify({
            data: {
                type: 'getFromCSV',
                csvData: csvData
            }
        })
        sendEvent(client, data)

    } catch (e) {
        console.log('Error: ', e);
    }

})

app.get('/data', (req, res) => {
    if (req.headers.accept === 'text/event-stream') {
        eventConnection(req, res)
    } else {
        res.json({ message: 'ok' })
    }
})



app.listen(4000, () => console.log('Application running on port 4000'))