import re
from datetime import datetime

date = 'Reviewed in the United States 🇺🇸 on September 24, 2022'

def convert_date(date):
    res = re.sub(r'[^\w\s]', '', date)
    res = res.split()[-3:]
    s = ' '.join(res)
    parsed = datetime.strptime(s, '%B %d %Y')
    print(parsed)



convert_date(date)