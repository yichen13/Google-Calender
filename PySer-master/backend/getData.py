def getData(data):
    items = {}
    for item in data:
        startStr = item['start']['dateTime'].split('T')
        endStr = item['end']['dateTime'].split('T')
        start = startStr[1][:5]
        end = endStr[1][:5]
        if startStr[0] in items:
            items[startStr[0]] += item['summary'], start, end, item['id']
        else:
            items[startStr[0]] = item['summary'], start, end, item['id']
    return items

