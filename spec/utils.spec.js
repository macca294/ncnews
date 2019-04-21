const {
    expect
} = require('chai');
const {
    timeConverter,
    createRef,
    formatDate
} = require('../utils/utils')

describe.only('formatDate', () => {
    it('returns an empty array when passed an empty array', () => {
        const input = [];
        expect(formatDate(input)).to.eql([])
    });
    it('returns new array with formatted date on one object in array', () => {
        const input = [{
            title: 'name',
            created_at: 1471522072389
        }];

        const test = formatDate(input)
        expect(test[0].created_at).to.include(Date)
        expect(Object.keys(input[0]).length).to.eql(Object.keys(test[0]).length)
    });
    it('handles array with multiple objects', () => {
        const input = [{
            title: 'name',
            created_at: 1471522072389
        }, {
            title: 'name2',
            created_at: 1471522072389
        }];
        const test = formatDate(input)
        expect(test.created_at).to.include(Date)
        expect(Object.keys(input[0]).length).to.eql(Object.keys(test[0]).length)
    });
    it('checks that original data is not mutated', () => {
        const input = [{
            title: 'name',
            created_at: 1471522072389
        }, {
            title: 'name2',
            created_at: 1471522072389
        }]
        const copyInput = [{
            title: 'name',
            created_at: 1471522072389
        }, {
            title: 'name2',
            created_at: 1471522072389
        }]
        formatDate(input)
        expect(input).to.eql(copyInput)
    });
});