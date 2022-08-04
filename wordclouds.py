import string

import pandas as pd
import os
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from nltk.corpus import stopwords
from gensim.utils import simple_preprocess

def remove_stopwords(texts, stop_words):
    return[[word for word in simple_preprocess(str(doc)) if word not in stop_words] for doc in texts]

def full_wc(df_result, brand="all_brands"):
    text = df_result.drop(columns=['Title', 'Brand', 'StarRating', 'Date', 'Review'], axis=1)
    text = text.dropna()
    #print(text['Review'])

    #text['processed'] is a library of every review I collected without names to determine what features are important to customers
    #print(text['processed'].head())
    #print(text['processed'].head(10))
    stop_words = stopwords.words('english')
    stop_words.extend(['from', 'subject', 'battery', 'sprayer', 'spray', 'sprayers', 'pump', ])
    #print(list(text['processed'].values))
    words = remove_stopwords(list(text['processed'].values), stop_words)
    all_words = []
    for i in words:
        all_words = all_words + i
    all_words = ','.join(all_words)
    #print(all_words)
    #print(all_words)
    wordcloud = WordCloud(background_color='white',
                         max_words = 100,
                         contour_width=3,
                         contour_color='steelblue')

    wordcloud.generate(all_words)
    plt.figure(figsize=(10,10))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.title(f'All Words - {brand}')
    plt.savefig('C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\{}\\all_wc_{}'.format(brand, brand))
    #plt.show()
    plt.close()

def top_rated_wc(df_result, brand="all_brands"):
    text = df_result.drop(columns=['Title', 'Brand', 'Date', 'Review'], axis=1)
    text = text.dropna()
    #text['StarRating'] = text['StarRating'].str.split('.').str[0]
    text = text[text.StarRating ==5]
    text = text.drop(columns='StarRating')

    stop_words = stopwords.words('english')
    stop_words.extend(['from', 'subject', 'battery', 'sprayer', 'spray'])
    words = remove_stopwords(list(text['processed'].values), stop_words)
    all_words = []
    for i in words:
        all_words = all_words + i
    all_words = ','.join(all_words)

    wordcloud = WordCloud(background_color='white',
                          max_words=100,
                          contour_width=3,
                          contour_color='steelblue')

    wordcloud.generate(all_words)
    plt.figure(figsize=(10, 10))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.title(f'High Rated Reviews Word Cloud - {brand}')
    plt.savefig('C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\{}\\high_wc_{}'.format(brand, brand))
    #plt.show()
    plt.close()

def low_rated_wc(df_result, brand='all_brands'):
    text = df_result.drop(columns=['Title', 'Brand', 'Date', 'Review'], axis=1)
    text = text.dropna()
    #print(text)
    #text['StarRating'] = text['StarRating'].str.split('.').str[0]
    text1 = text[text.StarRating == 1]
    text2 = text[text.StarRating == 2]
    text1 = text1.drop(columns='StarRating')
    text2 = text2.drop(columns='StarRating')
    #all_words = ','.join(list(text1['processed'].values))
    #all_words2 = ','.join(list(text2['processed'].values))
    #all_words = all_words + all_words2
    stop_words = stopwords.words('english')
    stop_words.extend(['from', 'subject', 'battery', 'sprayer', 'spray'])
    words = remove_stopwords(list(text1['processed'].values), stop_words) + remove_stopwords(list(text2['processed'].values), stop_words)
    all_words = []
    for i in words:
        all_words = all_words + i
    all_words = ','.join(all_words)

    wordcloud = WordCloud(background_color='white',
                          max_words=100,
                          contour_width=3,
                          contour_color='steelblue')
    try:
        wordcloud.generate(all_words)
        plt.figure(figsize=(10, 10))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.title(f'Low Rated Reviews Word Cloud - {brand}')
        plt.savefig('C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\{}\\low_wc_{}'.format(brand, brand))
        #plt.show()
        plt.close()
    except ValueError:
        print(f'No 1 or 2 star ratings in the {brand} .csv file')