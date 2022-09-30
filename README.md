Basic review scraper and analysis tools for Amazon products

Limited to scraping first 50 pages of reviews.  Pauses 1-5s between pages to limit load on servers.

After collecting reviews, analysis can be run on individual products or groups of products for easy comparison.
Examples of analysis are included in the 'results' directory.
Data collected: Title, Review, Rating, Date
Analysis Performed: Wordcloud
  Sentiment analysis - on each individual review and average sentiment over time
  Rating - individual reviews and average rating over time

Update to web-app 
- User login to access previously scraped products  
 - Create S3 bucket for each user  
✔️ Input field to select product to scrape  
 ✔️ Add form validation  
 ✔️ Prevent scraping on page with existing data  
✔️ Link to Python script for scraping - currently stores in local directory  
✔️ Add data to S3 for easy access  
✔️ Perform data analysis while scraping  
- Add Word cloud  
- Add SSE for automatic scraping

- Refactor for code organization/readability  
✔️ Convert to Flask server
- Add tests  
  
How to run:   
1. Clone GH repository and open root folder  
2. Set up server:  
  1. Open /server and create virtual environment. python3 -m venv env  
  2. Start virtual environment using 'env/Scripts/activate'  
  3. Install python packages 'pip install -r requirements.txt'  
  4. Start server with 'flask run'  
3. Set up frontend:  
  1. Open /scraper-app and run 'npm install'  
  2. Run frontend with 'npm start'  
4. Copy Amazon product page URL to site and click 'Add Item'  
  
![output](https://user-images.githubusercontent.com/43496008/192557695-2de03c64-db3e-4e36-8d8f-d53a2e05230b.PNG)
