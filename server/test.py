import re
from datetime import datetime
import json

from amazon_scraper import get_title

item_no = 'B000RL3UJA'

title = item_no + get_title(1, item_no)

print(title)

# date = 'Reviewed in the United States 🇺🇸 on September 24, 2022'

# def convert_date(date):
#     res = re.sub(r'[^\w\s]', '', date)
#     res = res.split()[-3:]
#     s = ' '.join(res)
#     parsed = datetime.strptime(s, '%B %d %Y')
#     print(parsed)



# # convert_date(date)

# data = '{"item_no": 1, "pageCount": 20}'
# def convert_json(arg):

#     res = json.loads(arg)

#     pages = res['pageCount']
#     item_no = res['item_no']

#     print(pages)
#     # print(item_no)

# convert_json(data)

# import json
  
# # initializing string 
# test_string = '{"Nikhil" : 1, "Akshat" : 2, "Akash" : 3}' 
  
# # printing original string 
# print("The original string : " + str(test_string))
  
# # using json.loads()
# # convert dictionary string to dictionary
# res = json.loads(test_string)
  
# # print result
# print("The converted dictionary : " + str(res))