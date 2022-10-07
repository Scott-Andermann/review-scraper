import pandas as pd
from userLogin import upload_to_s3

BUCKET_NAME = 'amazonreviewdata'

def get_objects_from_index(directory):
    df = pd.read_csv(f"s3://{BUCKET_NAME}/{directory}index.csv")

    # {"title": key['Key'], "complete": True, "id": key['Key'][0:10]}
    all_objects = df.to_dict('records')
    return all_objects
    # return objects

def add_to_index(item, directory):
    # print(directory)
    df = pd.read_csv(f"s3://{BUCKET_NAME}/{directory}index.csv")
    df.loc[len(df.index)] = item
    upload_to_s3(df, 'index', directory)
    # print(df)

def remove_from_index(item_title, directory):
    df = pd.read_csv(f"s3://{BUCKET_NAME}/{directory}index.csv")
    df = df.loc[df['title'] != item_title]
    # print(df)
    upload_to_s3(df, 'index', directory)

if __name__ == "__main__":
    title = '1b37ed0b7e36d01ae28f/B07ZG7R5BBNixeus EDG 34 Ultrawide 3440 x 1440 AMD Radeon FreeSync Certified 144Hz 1500R Curved Gaming Monitor with Tilt Only Stand NXEDG34S'
    # directory = "51c409d79017f72ec9d1/"
    # print(title[0:21])
    # index_df = pd.DataFrame(columns=['itemId', 'src', 'title', 'num'])
    # upload_to_s3(index_df, 'index', directory)

    # item format [itemId, imgSrcUrl, title, number of reviews]
    # item = ['1231234abc', 'https://...', 'title', 'number of reviews']
    # add_to_index(item, directory)
    # get_objects_from_index(directory)
    # remove_from_index(title, title[0:21])
    get_objects_from_index(title[0:21])

    