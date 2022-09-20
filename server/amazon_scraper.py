import pandas as pd
import re
import time
from bs4 import BeautifulSoup
import random
import requests
#page = 1
headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0", "Accept-Encoding":"gzip, deflate", "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "DNT":"1","Connection":"close", "Upgrade-Insecure-Requests":"1"}
all_reviews = []
def get_title(pages, item_no):
        
    r = requests.get(f'https://www.amazon.com/product-reviews/{item_no}/ref=cm_cr_arp_d_viewopt_sr?ie=UTF8&filterByStar=all_stars&reviewerType=all_reviews&pageNumber={pages}#reviews-filter-bar',
                     headers=headers)

    content = r.content
    soup = BeautifulSoup(content, features='lxml')
    try: 
        title_text = soup.find('h1', attrs={'class': 'a-size-large a-text-ellipsis'})
        # print(title_text.text)
        return title_text.text
    except AttributeError:
        return 'exit'

def get_data(pages, item_no):
    reviews = []
    r = requests.get(f'https://www.amazon.com/product-reviews/{item_no}/ref=cm_cr_arp_d_viewopt_sr?ie=UTF8&filterByStar=all_stars&reviewerType=all_reviews&pageNumber={pages}#reviews-filter-bar',
                     headers=headers)

    content = r.content
    soup = BeautifulSoup(content, features='lxml')

    #print(soup.prettify())
    try:
        for d in soup.findAll('div', attrs={'class':'a-section celwidget'}):
            # print('d' + d)
            title = d.find('a', attrs={'data-hook':'review-title'})
            rev = d.find('span', attrs={'data-hook':'review-body'})
            stars = d.find('i', attrs={'data-hook':'review-star-rating'})
            date = d.find('span', attrs={'data-hook':'review-date'})
            #reviews.append(rev.text.strip())
            r_title = title.find('span').text
            r = rev.find('span').text.strip()
            r_stars = stars.find('span').text
            r_date = date.text
            reviews.append([r_title, r, r_stars, r_date])
        # print(reviews)
        return reviews
    except AttributeError as e:
        print('ERROR: ' + e)
        return 'exit'

def run_main(item_no): 

    pages = 2

    title = get_title(1, item_no)
    title = re.sub('[^A-Za-z0-9 ]+', '', title)


    for page in range(1, pages):

        # print(f'Scraping page {page}')
        data = get_data(page, item_no)
        if data == 'exit' or data ==[]:
            break
        all_reviews.append(data)
        pause = random.uniform(1, 5)
        # print(f'Pausing for {pause} seconds')
        time.sleep(pause)

    flatten = lambda l: [item for sublist in l for item in sublist]
    df = pd.DataFrame(flatten(all_reviews), columns=['Title', 'Review', 'StarRating', 'Date'])
    
    # need to get title from webpage
    df.to_csv(f'scraped-data/{title}.csv', index=False, encoding='utf-8')
    # print(f'Finished scraping {title}, {len(df.index)} reviews gathered')
    print({'title': title, 'numberReviews': len(df.index)})


# run_main('B08VF6ZVMH')