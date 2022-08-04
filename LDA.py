import gensim
from gensim.utils import simple_preprocess
import gensim.corpora as corpora
import nltk
from rake_nltk import Rake
#nltk.download('stopwords')
#nltk.download('punkt')
from nltk.corpus import stopwords
from pprint import pprint
import pyLDAvis
import pyLDAvis.gensim_models
import pickle
import pandas as pd
import os


def sent_to_words(sentences):
    for sentence in sentences:
        yield(gensim.utils.simple_preprocess(str(sentence), deacc=True))

def remove_stopwords(texts, stop_words):
    return[[word for word in simple_preprocess(str(doc)) if word not in stop_words] for doc in texts]

def LDA(text, brand=None):
    stop_words = stopwords.words('english')
    stop_words.extend(['from', 'subject', 'battery', 'sprayer', 'spray', 'review', 'collected', 'promotion', 'part'])
    #text = text.head(20)
    text = text.fillna('None')
    low_text_1 = text[text.StarRating ==1]
    low_text_2 = text[text.StarRating ==2]
    low_text = pd.concat([low_text_2, low_text_1])
    high_text = text[text.StarRating ==5]
    all_LDA(text, stop_words, brand)
    all_LDA(low_text, stop_words, brand, 'low')
    all_LDA(high_text, stop_words, brand, 'high')

def all_LDA(text, stop_words, brand=None, typ=''):
    try:
        data = text.processed.values.tolist()
        #print(data)
        data_words = list(sent_to_words(data))
        #print(data_words[0])
        data_words = remove_stopwords(data_words, stop_words)

        #Create corpus
        word_id = corpora.Dictionary(data_words)
        texts = data_words
        corpus = [word_id.doc2bow(text) for text in texts]
        #print(texts[1])
        #print(texts[2])

        #Rake NLTK keyword extraction needs more work
        #I don't think this will work since keywords are quite varied
        """r = Rake(stopwords=stop_words,
                 min_length=1,
                 max_length=3)
        for i in data:
            #print(i)
            print(r.extract_keywords_from_text(i))
            print(r.get_ranked_phrases_with_scores())
    
            input('paused')
    """

        num_topics = 4
        lda_model = gensim.models.LdaMulticore(corpus=corpus,
                                               id2word=word_id,
                                               num_topics=num_topics)

        #pprint(lda_model.print_topics())
        doc_lda = lda_model[corpus]

        vis_filepath = 'C:\\Users\\Scott\\PycharmProjects\\review_scraper' + '\\ldavis'

        lda_vis = pyLDAvis.gensim_models.prepare(lda_model, corpus, word_id)
        with open(vis_filepath, 'wb') as f:
            pickle.dump(lda_vis, f)

        with open(vis_filepath, 'rb') as f:
            vis_prepared = pickle.load(f)
        if brand == None:
            pyLDAvis.save_html(vis_prepared, f'./lda_prepared{typ}.html')
        else:
            pyLDAvis.save_html(vis_prepared, f'C:\\Users\\Scott\\Documents\\Competitive Analysis\\Review Analysis\\{brand}\\{brand}_lda{typ}.html')
    except ValueError:
        print(f'No {typ} ratings in the {brand} .csv file')

def rake_nltk(corpus):
    print(corpus)
    rake_nltk_var = Rake()
    rake_nltk_var.extract_keywords_from_text(corpus)
    keyword_extracted = rake_nltk_var.get_ranked_phrases_with_scores()
    for i in keyword_extracted:
        if i[0] > 10:
            print(i[1])


