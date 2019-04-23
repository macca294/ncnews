const {
    expect
} = require('chai');
const {
    timeConverter,
    renameKey,
    formatDate,
    createRef,
    formatData
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
describe('createRef', () => {
    it('given an empty', () => {

    });
});
describe.only('renameKey', () => {
    it('returns a new empty array, when passed an empty array', () => {
        const data = [];
        const keyToChange = '';
        const newKey = '';
        const actual = renameKey(data, keyToChange, newKey);
        const expected = [];
        expect(actual).to.eql(expected);
        expect(actual).to.not.equal(data);
    });
    it('returns new array with amended key on a single object', () => {
        const data = [{
            title: 'abc',
            writtenBy: 'cba'
        }];
        const keyToChange = 'writtenBy';
        const newKey = 'author';

        const newArray = renameKey(data, keyToChange, newKey);
        expect(newArray).to.eql([{
            title: 'abc',
            author: 'cba'
        }])
    });
    it('handles multiple objects in an array', () => {
        const data = [{
            title: 'abc',
            writtenBy: 'a & c'
        }, {
            title: 'def',
            writtenBy: 'aaa'
        }];
        const keyToChange = 'writtenBy';
        const newKey = 'author';
        const newArray = renameKey(data, keyToChange, newKey);

        expect(newArray).to.eql([{
            title: 'abc',
            author: 'a & c'
        }, {
            title: 'def',
            author: 'aaa'
        }])
    });
});
describe.only('createRef', () => {
    it('returns an empty object, when passed an empty array', () => {
        const input = [];
        const actual = createRef(input);
        const expected = {};
        expect(actual).to.eql(expected);
    });
    it('returns 2 values in object when passed a single person object in array and 2 required keys', () => {
        const input = [{
            name: 'vel',
            phoneNumber: '01134445566',
            address: 'Northcoders, Leeds'
        }];
        const actual = createRef(input, 'name', 'phoneNumber');
        const expected = {
            vel: '01134445566'
        };
        expect(actual).to.eql(expected);
    });
    it('returns ref object of values for chosen keys when passed multiple objects in array', () => {
        const people = [{
                name: 'vel',
                phoneNumber: '01134445566',
                address: 'Northcoders, Leeds'
            },
            {
                name: 'ant',
                phoneNumber: '01612223344',
                address: 'Northcoders, Manchester'
            },
            {
                name: 'mitch',
                phoneNumber: '07777777777',
                address: null
            },
        ];
        const actual = createRef(people, 'name', 'phoneNumber');
        const expected = {
            vel: '01134445566',
            ant: '01612223344',
            mitch: '07777777777',
        };
        expect(actual).to.eql(expected);
    });
});
describe.only('formatData', () => {
    it('given an empty array, returns empty array', () => {
        const testArr = [];
        const lookup = {};
        const actual = formatData(testArr, lookup);
        const expected = [];
        expect(actual).to.eql(expected);
        expect(actual).to.not.equal(testArr);
    });
    it('returns a new array with id value replaced with corresponding value of ref Object on a single object in array', () => {
        const testArr = [{
            name: "abc",
            belongs_to: "def",
        }];
        const lookup = {

            'def': 1

        };
        const actual = formatData(testArr, lookup);
        const expected = [{
            name: "abc",
            article_id: 1,

        }];
        expect(actual).to.eql(expected);
        expect(actual).to.not.equal(testArr);
    });
    it('handles multiple objects in array', () => {
        const testArr = [{
            name: "abc",
            belongs_to: "def"
        }, {
            name: "cba",
            belongs_to: "xyz"
        }, {
            name: "opq",
            belongs_to: "xyz"
        }];
        const lookup = {

            'def': 1,
            'xyz': 3

        };
        const actual = formatData(testArr, lookup);
        const expected = [{
                name: "abc",
                article_id: 1

            },
            {
                name: "cba",
                article_id: 3

            }, {
                name: "opq",
                article_id: 3

            }
        ];
        expect(actual).to.eql(expected);
        expect(actual).to.not.equal(testArr);
    });
});