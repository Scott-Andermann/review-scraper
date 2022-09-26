from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords


def sentiment(df):
    #print(df['Title'])
    df = df.fillna('None')
    df = df.sort_values('Date')
    sia = SentimentIntensityAnalyzer()
    values = []
    sumValues = 0
    avgValues = []
    sumStars = 0
    avgStars = []
    count = 1
    for i, row in df.iterrows():
        #print(row['Title'])
        sent = sia.polarity_scores(row['Title'])
        values.append(sent['compound'])
        sumValues +=  float(sent['compound'])
        sumStars += float(row['StarRating'])
        avgValues.append(sumValues / (count))
        avgStars.append(sumStars / (count))
        count +=1
    df['Sentiment'] = values
    df['avgSentiment'] = avgValues
    df['avgStars'] = avgStars
    return df