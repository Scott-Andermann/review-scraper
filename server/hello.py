import sys
from amazon_scraper import run_main_node, get_title

if sys.argv[1] == 'title':
    print(get_title(1, sys.argv[2]))
if sys.argv[1] == 'scrape':
    run_main_node(sys.argv[2])


sys.stdout.flush()