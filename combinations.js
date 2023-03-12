const arr = [[1,2,3], [5,6], [7,8,9,10]];
var indices = arr.map(() => 0)
const maxIndices = arr.map((subArr) => subArr.length - 1)

function setNextIndex() {
    const resetPrevIndices = (tillIndex) => {
        while(tillIndex >= 0) {
            indices[tillIndex] = 0
            tillIndex = tillIndex - 1;
        }
    }
    return indices.some((index, i) => {
        if(index < maxIndices[i]) {
            resetPrevIndices(i -1)
            indices[i] = index + 1;
            return true
        }
        return false;
    })
}


const result = []
while(true) {
    console.log(indices)
    const currentItem = arr.map((subArr, i) => subArr[indices[i]])
    result.push(currentItem)
    
    if(!setNextIndex()) {
        break;
    }
}
console.log(result)
