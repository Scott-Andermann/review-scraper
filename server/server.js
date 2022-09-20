const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// const itemID = 'B08VF6ZVMH'
let itemID

let runPy = async (arg, success, nosuccess) => {
    const {spawn} = require('child_process')
    const pyprog = spawn('python3', ['hello.py', arg])

    pyprog.stdout.on('data', function(data) {
        console.log('running...');
        success(data);

        console.log(arg);
    })

    pyprog.stderr.on('data', (data) => {
        nosuccess(data);
    })
}

router.get('/', async (req, res) => {
    // res.write('welcome\n');
    // console.log(runPy);
    await runPy(itemID, function(fromRunPy) {
        console.log(fromRunPy.toString());
        res.end(fromRunPy);
    }, function(fromRunPy) {
        console.log(fromRunPy.toString())
    })
})

router.get('/add', (req, res) => {
    itemID = req.body.itemID
    console.log(itemID)
    res.end('yes')
})

app.listen(4000, () => console.log('Application listening on port 4000'))