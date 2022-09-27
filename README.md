Basic review scraper and analysis tools for Amazon and Home Depot products

Limited to scraping first 100 pages of reviews.  Pauses 1-5s between pages to limit load on servers.

After collecting reviews, analysis can be run on individual products or groups of products for easy comparison.
Examples of analysis are included in the 'results' directory.
Data collected: Title, Review, Rating, Date
Analysis Performed: Wordcloud - with separate word clouds for high and low rated items
  Sentiment analysis - on each individual review and average sentiment over time
  Rating - individual reviews and average rating over time
  
Scrapers are set up to change item ID in the code but future work should change this to an input prompt from the user.

Update to web-app
- User login to access previously scraped products
 - Create S3 bucket for each user
✔️ Input field to select product to scrape
 ✔️ Add form validation
 ✔️ Prevent scraping on page with existing data
✔️ Link to Python script for scraping - currently stores in local directory
✔️ Add data to S3 for easy access
✔️ Perform data analysis while scraping

- Refactor for organization