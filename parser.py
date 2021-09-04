import bibtexparser

with open('/Users/lostcute/Documents/Intern/Projects/zhouxiaowei/data/publications.bib') as bibtex_file:
    bib_database = bibtexparser.load(bibtex_file)

entries = bib_database.entries
print(bib_database.entries)
pass