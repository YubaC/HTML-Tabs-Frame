# 用于解析对比两个Language文件，并将第二个中缺失的条目复从第一个内复制过来
# 例如：zh.json 和 en.json
# zh.json 为中文语言文件，en.json 为英文语言文件
# zh.json的内容为：{"settings":"设置", "settings-display":"显示", "settings-language":"语言", "settings-advanced":"高级设置"}
# en.json的内容为：{"settings":"Settings", "settings-language":"Language"}
# 运行后，en.json的内容为：{"settings":"Settings", "settings-display":"显示", "settings-language":"Language", "settings-advanced":"高级设置"}
# 其中key的顺序以第一个文件为准
# 用法：python exactLang.py zh.json en.json

import json
import sys
# 先将第一个语言文件整个文件读取到内存中，然后再写入，这样可以保证顺序
# 读取完第一个文件后将其内容转换为字典，然后再读取第二个文件，将将第二个文件也转换为字典
# 然后遍历第二个字典的keys，并将第一个字典中相同key值的value改为第二个字典中的value
# 最后把第一个字典写入文件中

# 读取第一个文件
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    data = f.read()
    f.close()
# 将第一个文件转换为字典
data = json.loads(data)
# 读取第二个文件
with open(sys.argv[2], 'r', encoding='utf-8') as f:
    data2 = f.read()
    f.close()
# 将第二个文件转换为字典
data2 = json.loads(data2)

# 遍历第二个字典的keys
for key in data2.keys():
    # 将第一个字典中相同key值的value改为第二个字典中的value
    data[key] = data2[key]
# 将第一个字典写入文件中
with open(sys.argv[2], 'w', encoding='utf-8') as f:
    f.write(json.dumps(data, ensure_ascii=False, indent=4))
    f.close()

# 将第一个文件的空行也复制到第二个文件中
# 方法是：记录第一个文件中的空行位置，然后在第二个文件中逐个在对应的位置插入空行
# 读取第一个文件
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    data = f.readlines()
    f.close()
# 读取第二个文件
with open(sys.argv[2], 'r', encoding='utf-8') as f:
    data2 = f.readlines()
    f.close()
# 记录第一个文件中的空行位置
emptyLine = []
for i in range(len(data)):
    if data[i] == '\n':
        emptyLine.append(i)
# 在第二个文件中逐个在对应的位置插入空行
for i in range(len(emptyLine)):
    data2.insert(emptyLine[i], '\n')
# 将第二个文件写入文件中
with open(sys.argv[2], 'w', encoding='utf-8') as f:
    f.writelines(data2)
    f.close()

