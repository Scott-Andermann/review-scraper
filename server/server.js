const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { spawn } = require('child_process')
const { response } = require('express')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:3000'
}))

// const itemID = 'B08VF6ZVMH'
let clients = []
let itemID
let data
let titles = []
let reviews

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

    writeEvent(newClient, JSON.stringify({ data: {id: newClient.id }}))
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
    console.log('POST /')

    itemID = req.body.itemID
    id = req.body.id
    const client = clients.find(client => id == client.id)
    sendEvent(client, JSON.stringify({ data: itemID }))


    // return res.json({message: 'thank you'})
    // res.sendStatus(200)

    await runPy(itemID, function (fromRunPy) {
        reviews = fromRunPy.toString()
        console.log('scraping finished');
        sendEvent(client, JSON.stringify({
            data: {
                type: 'scrape',
                message: 'scraping finished'
            }
        }))
    }, function (fromRunPy) {
        console.log(fromRunPy.toString())
    })

    await getTitle(itemID, function (fromPy) {
        titles.push(fromPy.toString())
        console.log(titles);
        jsonTitles = JSON.stringify(titles)
        sendEvent(client, JSON.stringify({
            data: {
                type: 'titles',
                titles: titles
            }
        }))
        res.end(fromPy);
    },
        function (fromPy) {
            console.log(fromPy.toString())
        })
    res.end();
})

app.get('/data', (req, res) => {
    if (req.headers.accept === 'text/event-stream') {
        eventConnection(req, res)
    } else {
        res.json({ message: 'ok' })
    }
})

app.listen(4000, () => console.log('Application running on port 4000'))