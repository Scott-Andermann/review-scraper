import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import re
import time
from datetime import datetime
import matplotlib.dates as mdates
import matplotlib.ticker as ticker
from urllib.request import urlopen
from bs4 import BeautifulSoup
import random
import requests
#page = 1
headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0", "Accept-Encoding":"gzip, deflate", "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "DNT":"1","Connection":"close", "Upgrade-Insecure-Requests":"1"}
all_reviews = []
def get_data(pages):
    reviews = []
    item_no = 'B07TW9F4WR'
    r = requests.get(f'https://www.amazon.com/product-reviews/{item_no}/ref=cm_cr_arp_d_viewopt_sr?ie=UTF8&filterByStar=all_stars&reviewerType=all_reviews&pageNumber={pages}#reviews-filter-bar',
                     headers=headers)

    content = r.content
    soup = BeautifulSoup(content, features='lxml')

    #print(soup.prettify())
    try:
        for d in soup.findAll('div', attrs={'class':'a-section celwidget'}):
            #input(d)
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
            #print(reviews)
        return reviews
    except AttributeError:
        return 'exit'

        # print(reviews)
pages = 100
for page in range(1, pages):

    print(f'Scraping page {page}')
    data = get_data(page)
    #print(data)
    if data == 'exit' or data ==[]:
        break
    all_reviews.append(data)
    pause = random.uniform(1, 5)
    print(f'Pausing for {pause} seconds')
    time.sleep(pause)
#print(all_reviews)
flatten = lambda l: [item for sublist in l for item in sublist]
df = pd.DataFrame(flatten(all_reviews), columns=['Title', 'Review', 'StarRating', 'Date'])
#print(df.head())
df.to_csv('Milwaukee_switch_amazon_reviews.csv', index=False, encoding='utf-8')
print(f'Finished scraping, {len(df.index)} reviews gathered')
"""for r in reviews:
    print(r)
print(len(reviews))"""

