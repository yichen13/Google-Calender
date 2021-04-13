def maxHeapSort(arr):
    length = len(arr)
    sortedArray = []
    while len(sortedArray) != length:
        maxHeap = maxSort(arr).pop(0)
        sortedArray.insert(0, maxHeap)
    return sortedArray

def maxSort(arr):
    arrayLength = len(arr) - 1
    while arrayLength >= 0:
        largestIndex = arrayLength
        leftNode = arrayLength * 2 + 1
        rightNode = arrayLength * 2 + 2
        try:
            if arr[leftNode] > arr[largestIndex]:
                largestIndex = leftNode
            if arr[rightNode] > arr[largestIndex]:
                largestIndex = rightNode
            if largestIndex != arrayLength:
                arr[arrayLength], arr[largestIndex] = arr[largestIndex], arr[arrayLength]
            arrayLength -= 1
        except Exception as e:
            t = e
            if largestIndex != arrayLength:
                arr[arrayLength], arr[largestIndex] = arr[largestIndex], arr[arrayLength]
            arrayLength -= 1
            continue
    return arr


def minHeapSort(arr, int):
    result = []
    min_heap = {}
    while len(result) != int:
        try:
            if len(min_heap) != len(arr):
                for i in range(0, len(arr)):
                    min_heap[i] = arr[i].pop(0)
                sorted_heap = minSort(min_heap.copy(), len(min_heap) - 1)
                smallestIndex = list(min_heap.keys())[list(min_heap.values()).index(sorted_heap.pop(0))]
                smallest = min_heap.pop(smallestIndex)
                min_heap[smallestIndex] = arr[smallestIndex].pop(0)
                result.append(smallest)
            else:
                sorted_heap = minSort(min_heap.copy(), len(min_heap) - 1)
                smallestIndex = list(min_heap.keys())[list(min_heap.values()).index(sorted_heap.pop(list(sorted_heap.keys())[0]))]
                smallest = min_heap.pop(smallestIndex)
                result.append(smallest)
                min_heap[smallestIndex] = arr[smallestIndex].pop(0)
        except Exception as e:
            if any(min_heap):
                arr.pop(smallestIndex)
            else:
                sorted_heap = minSort(list(min_heap.values()), len(min_heap) - 1)
                result += sorted_heap
    return result


def minSort(min_heap, int):
    while int >= 0:
        try:
            smallest = int
            l = 2 * smallest + 1
            r = 2 * smallest + 2
            if list(min_heap.values())[smallest] > list(min_heap.values())[l]:
                smallest = l
            if list(min_heap.values())[smallest] > list(min_heap.values())[r]:
                smallest = r
            if smallest != int:
                min_heap[list(min_heap.keys())[smallest]], min_heap[list(min_heap.keys())[int]] = min_heap[list(min_heap.keys())[int]], min_heap[list(min_heap.keys())[smallest]]
            int -= 1
        except Exception as e:
            if smallest != int:
                min_heap[list(min_heap.keys())[smallest]], min_heap[list(min_heap.keys())[int]] = min_heap[list(min_heap.keys())[int]], min_heap[list(min_heap.keys())[smallest]]
            int -= 1
            continue
    return min_heap




        # while result != int:
#     for index in range(0, len(arr)):
#         if min_heap != len(arr):
#             min_heap.append(arr[x][y])
#
#     length = len(min_heap) - 1
#     while length >= 0:
#         smallest = length
#         l = 2 * smallest + 1
#         r = 2 * smallest + 2
#         try:
#             if min_heap[smallest] > min_heap[l]:
#                 smallest = l
#             if min_heap[smallest] > min_heap[r]:
#                 smallest = r
#             if smallest != length:
#                 min_heap[length], min_heap[smallest] = min_heap[smallest], min_heap[length]
#             length -= 1
#         except Exception as e:
#             if smallest != length:
#                 min_heap[length], min_heap[smallest] = min_heap[smallest], min_heap[length]
#             length -= 1
#             continue
#     result.append(min_heap.pop(0))
