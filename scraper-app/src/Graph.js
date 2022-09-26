import React from "react";
import Plot from 'react-plotly.js'


const Graph = ({ data }) => {
    // const arr = [{x: [1,2,3,4],y: [1,2,3,4]},{x:[2,5,7,3], y:[1,2,3,4]}];
    console.log(data);
    let traces = []
    let y = []
    let key = []
    const parsedData = data.map(element => {
        console.log(element.data);
        let subx = []
        let suby = []
        element.data.map(sub => {
            subx.push(sub.Date);
            suby.push(sub.Sentiment)
        })
        traces.push({
            x: subx,
            y: suby,
            name: element.name.slice(10, 30),
            type: 'scatter',
            mode: 'markers',
            // marker: { color: 'red' }
        })
    })

    return (
        <div>
            <Plot
                data={traces}
                layout={{ width: 600, height: 400, title: 'A fancy Sentiment plot' }}
            />
        </div>
    );
}

export default Graph;