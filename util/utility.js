exports.filterEmptyValues = (obj) => {
  const filteredObj = { ...obj };
  for (let key in filteredObj) {
    if (filteredObj.hasOwnProperty(key) && !filteredObj[key])
      delete filteredObj[key];
  }
  return filteredObj;
};

exports.filterUnchangedValueAndRemoveId = (oldObj, newObj) => {
  for (let key in oldObj) {
    //prevent modification of the immutable field '_id'
    if (oldObj[key] === newObj[key] || key === "_id") delete newObj[key];
  }
  return newObj;
};

exports.formatStringFields = (obj) => {
  for (let key in obj) {
    if (key === "username" || key === "email") {
      obj[key] = obj[key].toLowerCase();
    }
    // if(key === "firstname" || key === "lastname"){
    //   obj[key] = obj[key].toLowerCase()
    // }
  }
  return obj;
};
exports.typeCastNumberValues = (oldObj, newObj) => {
  // return Object.keys(oldObj).reduce((value, key) => {
  //   if (typeof oldObj[key] === "number") {
  //     value[key] = +newObj[key];
  //     return value;
  //   }
  // }, {});
  let obj = { ...newObj };
  for (let key in oldObj) {
    if (typeof oldObj[key] === "number" && !isNaN(obj[key])) {
      obj[key] = +obj[key];
    }
  }
  return obj;
};

exports.convertArrayToObject = (arr) => {
  arr.reduce((acc, value) => {
    acc[value] = value;
    return acc;
  }, {});
};
