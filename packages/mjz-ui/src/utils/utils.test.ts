import axios from 'axios';
import Utils from './utils';
jest.mock('axios');
const axiosReq = axios as jest.Mocked<typeof axios>;
const utils = new Utils();

/**
 * beforeAll 用来定义在当前test文件中所有 test 执行前要运行的程序
 * */
// beforeAll(() => {
//     utils.init(9, 100);
//     utils.log('offset beforeAll')
// })

/**
 * afterAll 用来定义在当前test文件中所有 test 执行后要运行的清理程序
 * */
// afterAll(() => {
//     utils.reset();
//     utils.log('offset afterAll')
// })

/**
 * beforeEach 会在每个 test 执行前都执行一遍
 * */
// beforeEach(() => {
//     utils.log('offset beforeEach');
// });

/**
 * afterEach 会在每个 test 执行后都执行一遍
 * */
// afterEach(() => {
//     utils.log('offset afterEach');
// });

/**
 * test (也可以是 it)用来定义一条测试用例
 * - 它的第一个参数为这个测试用例的名称，第二个参数为包含"测试期望"的函数
 * */
test.skip('Test sum First', () => {
    utils.log('offset test');
    expect(utils.sum(0, 1)).toBe(9);
    expect(utils.sum(100, 1)).not.toBe(101);
})
// utils.log('offset empty');
/**
 * 使用 describe 将几个相关的测试分组，同时会定义一个测试的作用域，
 * 在这个作用域内依然可以定义 before | after 等, 但仅在 describe 内部有效
 * */
describe.skip('All Utils Feature Test Group', () => {
    // utils.log('inset describe empty');
    beforeAll(() => {
        utils.init(5, 1000);
        utils.log('inset beforeAll');
    })
    afterAll(() => {
        utils.reset();
        utils.log('inset afterAll');
    })
    beforeEach(() => {
        utils.log('inset beforeEach');
    });
    afterEach(() => {
        utils.log('inset afterEach');
    });
    test('Test sum In Describe', () => {
        expect(utils.sum(0, 1)).toBe(5);
        expect(utils.sum(100, 1)).toBe(101);
        utils.log('inset test sum');
    })

    test('Test minus In Describe', () => {
        expect(utils.minus(0, 1)).toBe(5);
        expect(utils.minus(100, 1)).toBe(99);
        utils.log('inset test minus');
    })
})


describe.skip('测试 匹配器', () => {
    test.skip('Test Matcher ', async () => {
        await expect(Promise.resolve('some result'))
            .resolves.toBe('some result'); // .resolves 用来解构判断 promise 的返回值
        expect(2 + 2).not.toBe(5); // .not 检查某个值不匹配结果
        expect(2 + 2).toBe(4); // 数值比较
        expect(2.1 + 2.2).toBeCloseTo(4.3); // 浮点值比较
        expect(20).toBeGreaterThan(10); // 大于
        expect(20).toBeLessThan(30); // 小于
        expect(null).toBeNull(); // 是否为 null
        expect(undefined).toBeUndefined(); // 是否为 undefined
        expect(null).toBeDefined(); // undefined 的相反值 null 也算 defined
        expect([]).toBeTruthy(); // 可以使 if 语句为真的结果
        expect('').toBeFalsy(); // 可以使 if 语句为假的结果
        expect('xxxsss').toMatch(/^[a-z]+$/i); // 匹配字符串符合正则规则
        expect([{a: 1}]).toEqual([{a: 1}]); // 对象数组等引用类型判断相等
        expect(['AAA', 'BBB']).toContain('AAA'); // 判断数组是否包含
        expect(() => {
            throw new Error('test error')
        }).toThrow('test error'); // 判断是否抛出了错误
    });
})

describe.skip('测试 Mock 函数', () => {
    test('捕获函数调用', async () => {
        utils.init(5, 1000);
        /**
         * utils.useCallbackFn 是一个需要传入回调函数的方法
         * 通过 jest.fn 包装 我们来创建一个符合 utils.useCallbackFn 的回调函数，
         * 这个回调函数除了普通函数的功能外，还具有记录回调调用情况的能力
         * */
        const mockFn = jest.fn((num: number) => num * 10);
        utils.useCallbackFn(mockFn as unknown as (() => any));

        /**
         * mockFn.mock
         *  - calls 包含所有对此模拟函数的调用参数数组
         *  - results 包含所有对此模拟函数的返回值数组
         *  - instance 包含所有对此模拟函数的实例对象数组（通过 new 创建的实例）
         * */
        expect(mockFn.mock.calls.length).toBe(2); // 检查回到调用几次
        expect(mockFn.mock.calls[0][0]).toBe(5); // 检查第一次调用的参数
        expect(mockFn.mock.results[0].value).toBe(50); // 检查第一次调用时的返回值

        const MockClass = jest.fn();
        const a = new MockClass();
        expect(MockClass.mock.instances[0]).toBe(a); // 检查通过 mockClass 创建的第一个实例

        /**
         * 除了上述通过 mockFn.mock 还可以直接使用 matchers 匹配器来进行验证
         * */

        expect(mockFn).toHaveBeenCalledTimes(2); // 调用几次
        expect(mockFn).toHaveNthReturnedWith(1, 50); // 第一次调用返回值

        // 模拟返回数据
        const mockFn2 = jest.fn();
        mockFn2.mockReturnValue(90);
        expect(mockFn2()).toBe(90);

        // 模拟 axios 模块

        axiosReq.get.mockResolvedValue({data: [90, 200]});
        // utils.getData 中使用了 axios 请求数据
        await expect(utils.getData()).resolves.toEqual({data: [90, 200]})
    })
})