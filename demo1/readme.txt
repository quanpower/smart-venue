数据库初始化：
1.初始化迁移文件（只用执行一次，以后修改模型，只需执行2和3）
python manager.py db init
2.将模型的映射添加到文件中
python manager.py db migrate
3.映射到数据库
python manager.py db upgrade