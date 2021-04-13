from collections import defaultdict

async def compute(t):
    global result
    x = t.pop(0)
    unique.append(x)
    if x in t:
        unique.remove(x)
        result = list(filter((x).__ne__, t))
    return len(result)


async def getUnique(data):
    global result
    global unique
    unique = []
    result = data.copy()
    while await compute(result) != 0:
        continue
    return unique

async def bfs(array, int, length, uniqueNodes):
    result = []
    uniqueNodes.remove(int)
    visitedNodes = [int]
    queue = []
    wait = []
    nodes = []
    queue.append(array[int][0])
    while uniqueNodes:
        try:
            S1 = set(array[queue[0]])
            S2 = set(visitedNodes)
            dup = S1.intersection(S2)
            if dup:
                for i in dup:
                    array[queue[0]].remove(i)
            if queue[0] in uniqueNodes:
                uniqueNodes.remove(queue[0])
            if queue[0] not in visitedNodes:
                visitedNodes.append(queue[0])
                queue[0] = array[queue[0]][0]
        except Exception as e:
            array[visitedNodes[-2]].remove(queue[0])
            result += [visitedNodes]
            visitedNodes = [int]
            queue[0] = array[int][0]
            continue
    return result
