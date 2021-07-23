import '@testing-library/jest-dom';
import {render, cleanup, } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import React from 'react';
import Button from "../Button";

/**
 * 在每个测试用例完成后执行 react ummount 卸载程序
 * 在 jest 中这个行为会默认加上，不需要我们手动加上
 * */
afterEach(cleanup);

describe('测试 React 组件', () => {
    test('测试组件渲染', () => {
        /**
         * 使用 render 将组件渲染到 dom 上，
         * 其返回值，包含 DOM Testing Library 中的 queries 查询方法
         * */
        const result = render(<Button appearance="primary" >TEXT</Button>);
        /**
         * debug() 用来查看渲染出的 dom 是什么样的结构 (html), 主要用来辅助测试
         * 执行 test 可以在控制台看到, 其渲染出的时普通的 html ，复杂的 react 状态等并没有展示
         * 由此可见，RTL 不关心组件的编写方式，它只关心最后生成的 DOM 树是否符合要求
         */
        result.debug();
        /**
         * 通过无障碍属性 role='button' 来查找元素，name 则表示 aria-label 属性
         * */
        expect(result.getByRole('button')).toBeInTheDocument();
        /**
         * 通过文本内容来查找元素，但是尽量不要用在 div span p 等元素的查找上
         * */
        expect(result.getByText('TEXT')).toBeInTheDocument();
        /**
         * 第一个参数也可以写作 正则，用来匹配
         * */
        expect(result.getByText(/^TEX/)).toBeInTheDocument();
        /**
         * 可以使用其他的 matchers https://github.com/testing-library/jest-dom#custom-matchers
         * */
        expect(result.getByText(/^TEX/)).toHaveClass('yufu-btn-primary');

        const input = render(
            <input type="text" alt="testAlt" placeholder="testPlaceholder" data-testid="TTTT" />
        )
        /**
         * 通过 alt 属性查找 img area input 等元素
         * */
        expect(input.getByAltText('testAlt')).toBeInTheDocument();
        /**
         *  通过 placeholder 查询元素
         * */
        expect(input.getByPlaceholderText('testPlaceholder')).toBeInTheDocument();
        /**
         * queryBy... 用来断言不存在的"预期"
         * */
        expect(input.queryByPlaceholderText('test')).not.toBeInTheDocument();
        /**
         * 通过 testid 查询元素
         * */
        expect(input.getByTestId('TTTT')).toBeInTheDocument();
        /**
         * 借助 container 使用DOM 查询元素
         * */
        expect(input.container.querySelector('input[type="text"]')).toBeInTheDocument();


        /**
         * 借助 @testing-library/user-event 来测试事件
         * */
        userEvent.type(input.getByTestId('TTTT'), 'something'); // 触发事件
        expect(input.getByTestId('TTTT')).toHaveValue('something'); // 验证事件结果
    })
})