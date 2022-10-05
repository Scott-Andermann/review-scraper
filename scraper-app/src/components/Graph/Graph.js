import React from "react";
import Plot from 'react-plotly.js';
import './Graph.css';


const Graph = ({ data }) => {
    // acting funny since these are not state variables

    let sentimentTraces = []
    let avgSentimentTraces = []
    let starTraces = []
    let avgStarTraces = []

    data.map(element => {
        // console.log(element.data);
        let subx = []
        let subSent = []
        let subStar = []
        let subAvgSentiment = []
        let subAvgStars = []
        element.data.map(sub => {
            subx.push(sub.Date);
            subSent.push(sub.Sentiment)
            subStar.push(sub.StarRating)
            subAvgSentiment.push(sub.avgSentiment)
            subAvgStars.push(sub.avgStars)
        })
        sentimentTraces.push({
            x: subx,
            y: subSent,
            name: element.name.slice(31, 51),
            type: 'scatter',
            mode: 'markers',
            // marker: { color: 'red' }
        })
        avgSentimentTraces.push({
            x: subx,
            y: subAvgSentiment,
            name: element.name.slice(31, 51),
            type: 'scatter',
            mode: 'lines',
        })
        starTraces.push({
            x: subx,
            y: subStar,
            name: element.name.slice(31, 51),
            type: 'scatter',
            mode: 'markers',
        })
        avgStarTraces.push({
            x: subx,
            y: subAvgStars,
            name: element.name.slice(31, 51),
            type: 'scatter',
            mode: 'lines',
        })
        
    })

    return (
        <div className='wrapper'>
            <Plot
                className='one'
                data={sentimentTraces}
                layout={{ width: 600, height: 400, title: 'A fancy Sentiment plot' }}
            />
            <Plot
            className='two'
                data={starTraces}
                layout={{ width: 600, height: 400, title: 'A fancy Star Rating plot', yaxis: {range: [0.25, 5.25]} }}
            />
            <Plot
            className='three'
                data={avgSentimentTraces}
                layout={{ width: 600, height: 400, title: 'Average Sentiment Plot' }}
            />
            <Plot
            className='four'
                data={avgStarTraces}
                layout={{ width: 600, height: 400, title: 'Average Star Rating plot', yaxis: {range: [0.25, 5.25]}}}
            />
        </div>
    );
}

export default Graph;