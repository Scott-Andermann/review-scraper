import {useState} from 'react';
import './App.css';

function App() {
  const [webPage, setWebPage] = useState('');
  const [reviewPage, setReviewPage] = useState('');

  const generateUrl = () => {
    try {

      const urlArray = webPage.split('/');
      const index = urlArray.findIndex(element => element === 'dp');
      console.log(index);

      setReviewPage(`https://www.amazon.com/product-reviews/${urlArray[index+1]}/ref=cm_cr_arp_d_viewopt_sr?ie=UTF8&filterByStar=all_stars&reviewerType=all_reviews&pageNumber=1#reviews-filter-bar`)
    } catch (e) {
      console.log('Error: ', e);
    }
  }


  return (
    <div className="App">
      <h1>Amazon Review Scraper</h1>
      <p>Enter URL of item: </p>
      <input value={webPage} onChange={(e) => setWebPage(e.target.value)}></input>
      <button onClick={generateUrl}>Click</button>
      <p><a href={reviewPage} target='_blank'>See Reviews</a></p>
    </div>
  );
}

export default App;
