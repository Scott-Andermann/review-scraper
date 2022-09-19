import sys
from amazon_scraper import run_main
print('hello world')
print(sys.argv[1])
run_main(sys.argv[1])

sys.stdout.flush()