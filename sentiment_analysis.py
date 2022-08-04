import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.pyplot import cm
import matplotlib.dates
import nltk
#nltk.download('vader_lexicon')
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
import datetime
import random
from itertools import chain

def rating_over_time(df, brand):
    df = df.sort_values('Date')
    #print(df.head())
    x = df['Date']
    y = df['StarRating']
    #print(str(x) + ' ' + str(y))
    dates = matplotlib.dates.date2num(x)
    plt.figure(figsize=(14, 10))
    plt.plot_date(dates, y)
    date_format = matplotlib.dates.DateFormatter('%m-%Y')
    plt.gca().xaxis.set_major_formatter(date_format)
    plt.xticks(rotation=60)

    plt.title('Star Rating')
    plt.ylim(0,5.5)
    plt.savefig(
        'C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\{}\\star_rating_{}'.format(brand, brand),
        bbox_inches="tight"
    )
    #plt.show()
    plt.close()

def review_weight(w):
    coeff = {1: 4,
             2: 2,
             3: 1,
             4: 1,
             5: 1}
    return coeff[w]

def avg_rating_over_time(df):
    print(df)
    df = df.sort_values('Date')
    avg = []
    val = []
    w_avg = []
    sum = 0
    w_count = 0
    count = 0
    for i, row in df.iterrows():
        sum += row['StarRating']
        count +=1
        weight = review_weight(row['StarRating'])
        w_count += weight
        w_avg.append(sum/w_count)
        avg.append(sum/count)
        val.append(row['StarRating'])
    x = df['Date']
    dates = matplotlib.dates.date2num(x)
    return dates, avg, val, w_avg

def plot_avg_rating(x, y, brands = 'brand'):
    kwargs = {'markersize':3}
    plt.figure(figsize=(14, 10))

    if type(brands) == list:
        n = len(brands)
        color = iter(cm.rainbow(np.linspace(0, 1, n)))
        for i, j in enumerate(x):
            plt.plot_date(x[i], y[i], **kwargs, color=next(color))
    else:
        for i, j in enumerate(x):
            plt.plot_date(x[i], y[i], **kwargs)

    date_format = matplotlib.dates.DateFormatter('%m-%Y')
    plt.gca().xaxis.set_major_formatter(date_format)
    plt.xticks(rotation=60)

    plt.legend(brands)

    plt.ylim(0,5.5)
    plt.xlim(datetime.date(2019, 1, 1), datetime.date(2022, 1, 1))
    #print(x)
    if type(brands) == list:
        plt.title(f'Average Star Rating Over Time - All Brands')
        print('Saving avg star fig - all brands')
        plt.savefig(
            'C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\all_brands\\avg_star_all_brands',
            bbox_inches="tight"
        )
    else:
        plt.title(f'Average Star Rating Over Time - {brands}')
        print('Saving avg star fig')
        plt.savefig(
            'C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\{}\\avg_star_{}'.format(brands, brands),
            bbox_inches="tight"
        )
    plt.show()
    plt.close()

def sentiment(df):
    #print(df['Title'])
    df = df.fillna('None')
    df = df.sort_values('Date')
    stop_words = stopwords.words('english')
    sia = SentimentIntensityAnalyzer()
    values = []
    for i, row in df.iterrows():
        #print(row['Title'])
        sent = sia.polarity_scores(row['Title'])
        values.append(sent['compound'])
    x = df['Date']
    dates = matplotlib.dates.date2num(x)
    return dates, values

def plot_sentiment(x, y, brands='brands'):
    kwargs = {'markersize':3}
    if type(brands) == list:
        # find how to organize subplot
        z = len(brands)
        if z <= 4:
            num_plot_x = 2
        elif z < 7:
            num_plot_x = 3
        else:
            num_plot_x = 4
        num_plot_y = z // num_plot_x + (z % num_plot_x > 0)
        fig, axs = plt.subplots(num_plot_y, num_plot_x)
        fig.set_size_inches(14, 10, forward=True)
        fig.suptitle('Review Sentiments')
        y_pos = 0
        x_pos = 0
        for i, j in enumerate(x):
            axs[y_pos][x_pos].plot_date(x[i], y[i], **kwargs)
            axs[y_pos][x_pos].set_title(brands[i])
            axs[y_pos][x_pos].set_ylim([-1,1])
            axs[y_pos][x_pos].set_xlim([datetime.date(2016, 1, 1), datetime.date(2022, 1, 1)])
            date_format = matplotlib.dates.DateFormatter('%Y')
            axs[y_pos][x_pos].xaxis.set_major_formatter(date_format)
            axs[y_pos][x_pos].xaxis.set_major_locator(plt.MaxNLocator(5))
            y_pos += 1
            #print(str(y_pos) + ' ' + str(x_pos))
            if y_pos >= num_plot_y:

                x_pos += 1
                y_pos = 0
        plt.savefig(
            'C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\all_brands\\sentiment_plot',
            bbox_inches="tight"
        )
        #plt.show()
        plt.close()
    else:
        plt.figure(figsize=(14, 10))
        plt.plot_date(x[0], y[0], **kwargs)

        date_format = matplotlib.dates.DateFormatter('%m-%Y')
        plt.gca().xaxis.set_major_formatter(date_format)
        plt.xticks(rotation=60)

        plt.title(f'Review Sentiment - {brands}')
        plt.savefig(
            'C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\{}\\sentiment_plot_{}'.format(brands, brands),
        bbox_inches="tight")
        #plt.show()
        plt.close()

def running_avg_sentiment(val):
    ravg = []
    sum = 0
    for i, value in enumerate(val):
        sum += value
        ravg.append(sum/(i+1))
    return ravg

def plot_ravg_sentiment(x, y, brands='brands'):
    kwargs = {'markersize':3}
    plt.figure(figsize=(14,10))
    if type(brands) == list:
        n = len(brands)
        color = iter(cm.rainbow(np.linspace(0, 1, n)))
        #plt.set_cmap('gist_rainbow')
        for i, j in enumerate(x):
            plt.plot_date(x[i], y[i], **kwargs, color=next(color))
    else:
        for i, j in enumerate(x):
            plt.plot_date(x[i], y[i], **kwargs)

    date_format = matplotlib.dates.DateFormatter('%m-%Y')
    plt.gca().xaxis.set_major_formatter(date_format)
    plt.xticks(rotation=60)
    plt.xlim(datetime.date(2019, 1, 1), datetime.date(2022, 1, 1))

    plt.legend(brands)
    plt.title('Average Sentiment Over Time')
    if type(brands) != list:
        plt.savefig(
            'C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\{}\\avg_sentiment_plot_{}'.format(brands,
                                                                                                           brands),
        bbox_inches="tight")
    else:
        #plt.show()
        plt.savefig(
            'C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\all_brands\\avg_sentiment_plot',
            bbox_inches="tight")
    #plt.show()
    plt.close()

def plot_sentiment_vs_rating(sent, rating, brands):
    plt.close()
    #kwargs = {'markersize':3}
    plt.figure(figsize=(14,10))
    n = len(brands)
    #print(rating)
    for i, j in enumerate(rating):
        #print(rating[i])
        for k, m in enumerate(rating[i]):
            rating[i][k] = rating[i][k] + (random.random() - 0.5)/2
    color = iter(cm.rainbow(np.linspace(0, 1, n)))
    for i, j in enumerate(sent):
        plt.scatter(sent[i], rating[i], color=next(color), alpha=0.2)
    plt.legend(brands)
    plt.title('Review Sentiment vs. Rating')
    plt.savefig(
        'C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\all_brands\\sent_vs_rating_plot',
        bbox_inches="tight")
    #plt.show()
    plt.close()

def plot_histogram(rating, brands):
    #plot histogram of ratings
    plt.figure(figsize=(14,10))
    all_ratings = list(chain(*rating))
    #print(all_ratings)
    plt.hist(all_ratings, bins=5)
    plt.title('Overall rating')
    plt.savefig(
        'C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\all_brands\\Rating_histogram',
        bbox_inches="tight")
    #plt.show()
    plt.close()
