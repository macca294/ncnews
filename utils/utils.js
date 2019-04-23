const knex = require('../knexfile')

const timeConverter = (unix) => {
    return new Date(unix);
};


const renameKey = (arr, keyToChange, newKey) => {
    return arr.map(item => {
        const newObj = {};
        Object.keys(item).forEach(key => {
            const value = item[key];
            if (key === keyToChange) newObj[newKey] = value;
            else newObj[key] = value;
        });
        return newObj;
    });
};

const formatDate = (arr) => {
    return arr.map(item => {
        const newObj = {};
        Object.keys(item).forEach(key => {
            const value = item[key];
            if (key === 'created_at') newObj[key] = timeConverter(item[key]);
            else newObj[key] = value;
        });
        return newObj;
    });
};

const createRef = (arr, key, val) => {
    return arr.reduce((refObj, currObj) => {
        refObj[currObj[key]] = currObj[val]
        return refObj;
    }, {})

};

const formatData = (arr, lookup) => {
    return arr.map((obj) => {
        const newObj = {};
        Object.keys(obj).forEach(key => {
            if (key === 'belongs_to') newObj['article_id'] = lookup[obj[key]];
            else newObj[key] = obj[key];
        });
        return newObj
    })
};
module.exports = {
    timeConverter,
    renameKey,
    createRef,
    formatDate,
    formatData
}