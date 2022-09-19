const express = require('express')
const app = express()

const arg = 'B08VF6ZVMH'

let runPy = async (success, nosuccess) => {
    const {spawn} = require('child_process')
    const pyprog = spawn('python', ['hello.py', arg])

    pyprog.stdout.on('data', function(data) {
        console.log('running...');
        success(data);

        console.log(arg);
    })

    pyprog.stderr.on('data', (data) => {
        nosuccess(data);
    })
}

app.get('/', async (req, res) => {
    // res.write('welcome\n');
    // console.log(runPy);
    await runPy(function(fromRunPy) {
        console.log(fromRunPy.toString());
        res.end(fromRunPy);
    }, function(fromRunPy) {
        console.log(fromRunPy.toString())
    })
})

app.listen(4000, () => console.log('Application listening on port 4000'))