import React, {useEffect, useState} from "react";
import Plot from 'react-plotly.js';
import './Graph.css';


const Graph = ({ data }) => {
    // acting funny since these are not state variables

    const [sent, setSent] = useState(false);
    const [avgSent, setAvgSent] = useState(false);
    const [rating, setRating] = useState(true);
    const [avgRating, setAvgRating] = useState(false);

    const onClickPlot = (e) => {
        console.log(e.target.name);
        if (e.target.name === 'sentiment') {
            setAvgSent(false)
            setRating(false)
            setAvgRating(false)
            setSent(true)
        }
        if (e.target.name === 'avgSentiment') {
            setAvgSent(true)
            setRating(false)
            setAvgRating(false)
            setSent(false)
        }
        if (e.target.name === 'rating') {
            setAvgSent(false)
            setRating(true)
            setAvgRating(false)
            setSent(false)
        }
        if (e.target.name === 'avgRating') {
            setAvgSent(false)
            setRating(false)
            setAvgRating(true)
            setSent(false)
        }
    }

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
        <div className='graph-wrapper'>
            <button name='sentiment' onClick={onClickPlot}>Sentiment</button>
            <button name='avgSentiment' onClick={onClickPlot}>Average Sentiment</button>
            <button name='rating' onClick={onClickPlot}>Rating</button>
            <button name='avgRating' onClick={onClickPlot}>Average Rating</button>
            {sent &&
                <Plot
                    className='one'
                    data={sentimentTraces}
                    layout={{ width: 600, height: 400, title: 'A fancy Sentiment plot', yaxis: {range: [-1, 1]} }}
                />
            }
            {rating &&

            <Plot
            className='two'
            data={starTraces}
            layout={{ width: 600, height: 400, title: 'A fancy Star Rating plot', yaxis: {range: [0.25, 5.25]} }}
            />
            }
            {avgSent &&
            <Plot
            className='three'
            data={avgSentimentTraces}
            layout={{ width: 600, height: 400, title: 'Average Sentiment Plot', yaxis: {range: [-1, 1]} }}
            />
            }
            {avgRating &&
            <Plot
            className='four'
            data={avgStarTraces}
            layout={{ width: 600, height: 400, title: 'Average Star Rating plot', yaxis: {range: [0.25, 5.25]}}}
            />
            }
        </div>
    );
}

export default Graph;