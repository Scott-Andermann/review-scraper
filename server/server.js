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

const eventsHandler = (req, res, next) => {
    const headers = {
        'Content-type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-control': 'no-cache'
    }
    res.writeHead(200, headers)

    const data = 'title and number of reviews'

    res.write(data)

    const clientID = Date.now()

    const newClient = {
        id: clientID,
        res
    }

    clients.push(newClient)
    console.log(clients.length);
    console.log(`${clientID} connected`);

    req.on('close', () => {
        console.log(`${clientID} disconnected`);
        clients = clients.filter(client => client.id !== clientID)
    })
}

const sendEventsToAll = (newItem) => {
    console.log('sending to all clients');
    console.log(clients.length);
    clients.forEach(client => client.res.write(newItem))
}


app.get('/status', (req, res) => {
    res.json({ clients: clients.length })
})

app.get('/events', eventsHandler)

app.get('/data', (req, res) => {
    data = {
        title: titles,
        id: itemID,
        reviews: {
            reviews
        }
    }
    res.send(data)
})

app.post('/add', async (req, res) => {
    console.log('POST /')
    itemID = req.body.itemID
    res.sendStatus(200)

    await runPy(itemID, function (fromRunPy) {
        reviews = fromRunPy.toString()
        console.log('scraping finished');
        sendEventsToAll('scraping complete')
        // res.end(fromRunPy);
        }, function (fromRunPy) {
        console.log(fromRunPy.toString())
        })

    await getTitle(itemID, function (fromPy) {
        titles.push(fromPy.toString())
        // console.log(title)
        res.end(fromPy);
        },
        function (fromPy) {
            console.log(fromPy.toString())
        })
})

app.listen(4000, () => console.log('Application listening on port 4000'))