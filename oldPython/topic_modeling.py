import string
import pandas as pd
import os
import sentiment_analysis
from wordclouds import full_wc, top_rated_wc, low_rated_wc
from sentiment_analysis import rating_over_time, avg_rating_over_time, plot_avg_rating, sentiment, plot_sentiment, plot_sentiment_vs_rating, plot_histogram
from datetime import datetime
import LDA

def pre_process(text):
    # print(text)
    text['Review'] = text['Review'].str.replace('Rating provided by a verified purchaser', '')
    text['Review'] = text['Review'].str.replace('This review was collected as part of a promotion.', '')
    text['processed'] = text['Review'].str.replace(f'[{string.punctuation}]','').str.lower()
    return text

def strip_date(x):
    x = x.split(' ')[-3:]

    if len(x) == 1:
        x = x[0].split('-')
    #print(x)
    y = len(x[0])
    #print(y)
    if x[0].isdigit():
        x = str(x[1]) + str(x[0]) + str(x[2])
        dt = datetime.strptime(x, '%b%d%y')
    else:
        x = str(x[0]) + str(x[1]) + str(x[2])
        #print(x)
        dt = datetime.strptime(x, '%B%d,%Y')
    return dt

def run_individual(path):
    #input(path)
    j = path.split('.')
    if j[1] != 'csv':
        return 'pass'
        pass
    else:
        df = pd.read_csv(path)
        df['Brand'] = path.split('_')[0]
        df['Date'] = df['Date'].apply(strip_date)
        try:
            df['StarRating'] = df['StarRating'].str.split('.').str[0]
        except:
            pass
        df['StarRating'] = df['StarRating'].astype(int)
        #print(df)
        print('processed')
        # input(df)
        return df

def run_model():
    frames = []
    brands = []
    for i in os.listdir('C:\\Users\\Scott\\PycharmProjects\\review_scraper'):
        j = i.split('.')
        #print(j)
        if len(j) < 2:
            pass
        elif j[1] != 'csv':
            pass
        else:
            brands.append(j[0].split('_')[0])
            #x = run_individual(i)
            frames.append(run_individual(i))
    try:
        os.mkdir('C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\all_brands')
    except FileExistsError:
        pass
    input(len(frames))
    df_result = pd.concat(frames)

    #wordclouds
    df_result = pre_process(df_result)

    full_wc(df_result)
    top_rated_wc(df_result)
    low_rated_wc(df_result)


    # LDA modeling
    # LDA.LDA(df_result)

    #df = run_individual('typhoon_amazon_reviews.csv')


    x_rating = []
    y_rating = []
    y_raw = []

    for i in frames:
        xi, yi, y_base, w_avg = avg_rating_over_time(i)
        x_rating.append(xi)
        y_rating.append(yi)
        y_raw.append(y_base)
    plot_avg_rating(x_rating, y_rating, brands)

    x_sent = []
    y_sent = []
    for i in frames:
        xi, yi = sentiment(i)
        x_sent.append(xi)
        y_sent.append(yi)
    plot_sentiment(x_sent, y_sent, brands)
    ravg = []
    for i in y_sent:
        ravg.append(sentiment_analysis.running_avg_sentiment(i))
    sentiment_analysis.plot_ravg_sentiment(x_sent, ravg, brands)
    plot_sentiment_vs_rating(y_sent, y_raw, brands)
    plot_histogram(y_raw, brands)

def run_single_model():

    for i in os.listdir('C:\\Users\\Scott\\PycharmProjects\\review_scraper'):
        frames = []
        j = i.split('.')
        #print(j)
        if len(j) < 2:
            pass
        elif j[1] != 'csv':
            pass
        else:
            print(j)
            brand = j[0].split('_')[0]
            #print(i)
            try:
                os.mkdir('C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\{}'.format(brand))
            except FileExistsError:
                pass
            # x = run_individual(i)
            frames.append(run_individual(i))
            #print(frames[0].head())
            #input(frames)
            # df_result = pd.concat(frames)

            # wordclouds
            df_result = pre_process(frames[0])

            full_wc(df_result, brand)
            top_rated_wc(df_result, brand)
            low_rated_wc(df_result, brand)


            # LDA modeling
            # LDA.LDA(df_result, brand)

            # df = run_individual('typhoon_amazon_reviews.csv')

            x_rating = []
            y_rating = []
            # w_avg = []
            rating_over_time(df_result, brand)
            #input('rating')
            #input(frames)
            for i in frames:
                #print(i)
                xi, yi, val, wi = avg_rating_over_time(i)
                x_rating.append(xi)
                y_rating.append(yi)
                # w_avg.append(wi)
            plot_avg_rating(x_rating, y_rating, brand)

            # plot_avg_rating([x_rating, x_rating], [y_rating, w_avg], brands=['t_standard', 't_weighted'])

            x_sent = []
            y_sent = []
            for i in frames:
                xi, yi = sentiment(i)
                x_sent.append(xi)
                y_sent.append(yi)
            plot_sentiment(x_sent, y_sent, brand)
            ravg = []
            for i in y_sent:
                ravg.append(sentiment_analysis.running_avg_sentiment(i))
            sentiment_analysis.plot_ravg_sentiment(x_sent, ravg, brand)


