const express = require('express');
const app = express();
const ExpressError = require('./expressError');



function checkMissingValue(query) {
    if (!query)
        throw new ExpressError('Expected: query KEY of nums and VALUE of comma-separated numbers');
    let arr = query.split(',');
    return arr
}

// THIS IS NOT WORKING CORRECTLY
// INNER RETURN CANNOT EXIT THE OUTER FUNCTION RIGHT AWAY

// function extract(numsCharArr) {
//     let result = [];
//     numsCharArr.forEach(elem => {
//         let val = Number(elem);
//         if (!Number.isNaN(val))
//             result.push(val);
//         else return result = new Error(`Value ${elem} is not a number`);
//         });
//     return result;
// }

function extractValue(numsCharArr) {
    let result = [];
    for (let i = 0; i < numsCharArr.length; i++){
        let val = Number(numsCharArr[i]);
        if (Number.isNaN(val))
            return new Error(`Value ${numsCharArr[i]} is not a number`);
        result.push(val);
    }
    return result;
}

function getMean(nums) {
    if (nums.legth === 0) return 0;
    let sum = nums.reduce(function(acc, curr) {
        return acc + curr;
    })
    return sum/nums.length;
}


function getMedian(nums) {
//apply quicksort algorithm
    nums.sort((a, b) => a - b);

    let middleIndex = Math.floor(nums.length / 2);
    let median;
  
    if (nums.length % 2 === 0) {
      median = (nums[middleIndex] + nums[middleIndex - 1]) / 2;
    } else {
      median = nums[middleIndex];
    }
    return median
}


function getMode(nums) {
    const occurrences = nums.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
      }, {});
    //console.log(occurrences);
    let count = 0;
    let mostFrequent;
    for (let key in occurrences) {
      if (occurrences[key] > count) {
        mostFrequent = key;
        count = occurrences[key];
      }
    }
    return mostFrequent;
  }

app.get('/mean', function(req, res, next) {
    let nums = extractValue(checkMissingValue(req.query.nums));
    // console.log(nums)
    if (nums instanceof Error)
        throw new ExpressError(nums.message);
    let result = {
        operration: "mean",
        result: getMean(nums)
    }
    return res.send(result);
})  


app.get('/median', function(req, res, next) {
    let nums = extractValue(checkMissingValue(req.query.nums));
    if (nums instanceof Error)
        throw new ExpressError(nums.message);
    let result = {
        operation: "median",
        result: getMedian(nums)
        }
    return res.send(result);
})


app.get('/mode', function(req, res, next) {
    let nums = extractValue(checkMissingValue(req.query.nums));
    if (nums instanceof Error)
        throw new ExpressError(nums.message);
    let result = {
      operation: "mode",
      result: getMode(nums)
    }
    return res.send(result);
})

 //404 handler
app.use(function (req, res, next) {
    const err = new ExpressError("Not Found",404);
    return next(err);
});
  
  /** generic error handler */
  app.use(function (err, req, res, next) {
    // default status is 500
    res.status(err.status || 500);

    return res.json({
      error: err,
      message: err.message
    });
  });
  
  
app.listen(3000, () => console.log('Server running on port 3000'));