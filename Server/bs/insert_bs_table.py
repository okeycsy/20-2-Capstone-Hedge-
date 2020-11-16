import mysql.connector
import csv
import datetime
#date = datetime.datetime.strftime(datetime.datetime.today(), "%Y-%m-%d")
date = '2020-11-11'
file_name1 = './suggests/suggest_' +date+ '.csv'
file_name2 = './suggests/suggest_' +date+ '_2.csv'


conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="selab",
    database="Capstone"
)


cursor = conn.cursor()

try:
  f = open(file_name1, 'r')
except:
  f = open(file_name2, 'r')
  
csv_reader = csv.reader(f)
row_tuples = []
for r in csv_reader:
  row = [r[1], r[2]]
  row_tuples.append(tuple(row))

cursor = conn.cursor()
sql = "INSERT INTO BS"
sql += "(name, bs) VALUES (%s, %s)"

try:
    cursor.execute("TRUNCATE BS")
except:
    pass

cursor.executemany(sql, row_tuples)

conn.commit()

print("DONE")
