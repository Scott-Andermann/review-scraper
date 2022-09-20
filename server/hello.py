import sys
from amazon_scraper import run_main, get_title

if sys.argv[1] == 'title':
    print(get_title(1, sys.argv[2]))
if sys.argv[1] == 'scrape':
    run_main(sys.argv[2])
# print(sys.argv[1])
# run_main(sys.argv[1])

sys.stdout.flush()