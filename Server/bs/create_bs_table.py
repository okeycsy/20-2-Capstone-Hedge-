# 테이블 만들기 
import mysql.connector

conn = mysql.connector.connect(
    user='',
    password='',
    host='',
    database=''
)

sql = "CREATE TABLE BS"
sql += "(name VARCHAR(20), (bs FLOAT)"

cursor = conn.cursor()
cursor.execute(sql)

print("DONE")
