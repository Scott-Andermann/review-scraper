const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { spawn } = require('child_process')
const { response } = require('express')
const AWS = require('aws-sdk')
const { title } = require('process')

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

const getFilesInBucket = async (BUCKET_NAME) => {
    var bucketParams = {
        Bucket: BUCKET_NAME,
    }

    s3.listObjects(bucketParams, function(err, data) {
        if (err) console.log('Error: ', err);
        else {
            // console.log('Success');
            s3data = data.Contents
            titles = s3data.map(obj => {
                return {title: obj.Key.slice(0,-4), complete: true}})
            // console.log(titles);
        }
    })

}

// const itemID = 'B08VF6ZVMH'
let titles
getFilesInBucket(BUCKET_NAME)
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

const deleteS3Item = async (filename, success, nosuccess) => {
    const pyprog = spawn('python', ['hello.py', 'delete', filename])

    pyprog.stdout.on('data', function(data) {
        console.log('deleting item from S3');
        success(data)
    })

    pyprog.stderr.on('data', (data) => {
        nosuccess(data)
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

    writeEvent(newClient, JSON.stringify({ data: {id: newClient.id }}))
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
    id = req.body.id
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
        
        await runPy(itemID, function (fromRunPy) {
            reviews = fromRunPy.toString()
            console.log('scraping finished');
            titles = titles.map(obj => {
                if (obj.id === itemID) {
                  return {...obj, complete: true};
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
            titles.push({id: itemID, title: fromPy.toString(), complete: false})
            // console.log(titles);
            jsonTitles = JSON.stringify(titles)
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
    id = req.body.id
    itemTitle = req.body.itemTitle
    const client = clients.find(client => id == client.id)
    // console.log(titles);
    // console.log(itemTitle);
    if (titles.find(title => title.title === itemTitle)){
        titles.filter(title => title.title !== itemTitle)
        await deleteS3Item(itemTitle, function(fromPy) {
        }, function(fromPy){
            console.log(fromPy.toString())
        })
    } else {
        console.log('Item does not exist in database')
    }

    res.end()
})
    
app.get('/data', (req, res) => {
    if (req.headers.accept === 'text/event-stream') {
        eventConnection(req, res)
    } else {
        res.json({ message: 'ok' })
    }
})



app.listen(4000, () => console.log('Application running on port 4000'))