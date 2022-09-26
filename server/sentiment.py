from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords


def sentiment(df):
    #print(df['Title'])
    df = df.fillna('None')
    df = df.sort_values('Date')
    sia = SentimentIntensityAnalyzer()
    values = []
    for i, row in df.iterrows():
        #print(row['Title'])
        sent = sia.polarity_scores(row['Title'])
        values.append(sent['compound'])
    df['Sentiment'] = values
    return df