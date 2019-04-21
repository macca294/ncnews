const knex = require('../knexfile')
const timeConverter = (unix) => {
    return new Date(unix);
};


const createRef = () => {


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

module.exports = {
    timeConverter,
    createRef,
    formatDate
}