import React from "react";
import Plot from 'react-plotly.js'


const Graph = ({ data }) => {
    // const arr = [{x: [1,2,3,4],y: [1,2,3,4]},{x:[2,5,7,3], y:[1,2,3,4]}];
    console.log(data);
    let x = []
    let y = []
    const parsedData = data.map(element => {
        x.push(element.Date);
        y.push(element.Sentiment)
    })

    console.log(x);
    console.log(y);
    return (
        <div>
            <Plot
                data={[{
                    x: x,
                    y: y,
                    type: 'scatter',
                    mode: 'markers',
                    marker: { color: 'red' }
                }]}
                layout={{ width: 600, height: 400, title: 'A fancy plot' }}
            />
        </div>
    );
}

export default Graph;