import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import { RefTestCaseType } from 'tests/shared/refTest';
import Button, { IButtonProps } from '../index';
import { classes, APPEARANCE, INTENT } from '../Button';

function renderButton(props: IButtonProps) {
  const element = React.createElement(Button, props);
  return render(element);
}

describe('Button', () => {
  // Mount and Unmount 没有报异常
  mountTestSuite(<Button>Default Button</Button>);
  mountTestSuite(<Button appearance={APPEARANCE.PRIMARY}>Primary Button</Button>);
  mountTestSuite(<Button intent={INTENT.DANGER}>Danger Button</Button>);

  // 包含正确的className（在传递不同的props情况下）
  describe('✨ have correct classes', () => {
    test('should render a default button', () => {
      const wrapper = renderButton({ children: 'Button Default' });

      const button = wrapper.getByRole('button');

      expect(button).toHaveClass(classes.root);
    });

    test('should render a primary button', () => {
      const appearance = APPEARANCE.PRIMARY;
      const { getByRole } = renderButton({ appearance, children: 'Button Primary' });

      const button = getByRole('button');

      expect(button).toHaveClass(classes.root);
      expect(button).toHaveClass(classes.appearance(appearance));
    });

    test('should render a danger button', () => {
      const intent = INTENT.DANGER;
      const { getByRole } = renderButton({ intent, children: 'Button Danger' });

      const button = getByRole('button');

      expect(button).toHaveClass(classes.root);
      expect(button).toHaveClass(classes.intent(intent));
    });
  });

  // 传递不同props时，节点渲染是否正确
  describe('✨ DOM render correctly with different props', () => {
    test('should render a disabled button', () => {
      const { getByRole } = renderButton({ children: 'Button Disabled', disabled: true });

      const button = getByRole('button');

      expect(button).toBeDisabled();
    });

    test('should render a loading button', () => {
      const children = <span>Button Loading</span>;
      const { getByRole } = renderButton({ children, loading: true });

      const button = getByRole('button');

      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Loading...');
      // expect(queryByText(children)).toBeNull();
    });
  });

  // 对组件触发行为
  describe('✨ fire events correctly', () => {
    describe('1. onClick', () => {
      test('on Default Button', () => {
        let target = null;
        const mockFn = jest.fn((e) => {
          target = e.target;
        });

        const { getByRole } = renderButton({
          children: 'Button Default',
          onClick: mockFn,
        });

        const button = getByRole('button');

        userEvent.click(button);

        expect(button).toHaveFocus();
        expect(mockFn).toBeCalledTimes(1);
        expect(target).toEqual(expect.any(HTMLButtonElement));
      });

      test('on Disabled Button', () => {
        const mockFn = jest.fn(() => {});

        const { getByRole } = renderButton({
          children: 'Button Disabled',
          disabled: true,
          onClick: mockFn,
        });

        const button = getByRole('button');

        userEvent.click(button);

        expect(button).not.toHaveFocus();
        expect(mockFn).not.toBeCalled();
      });

      test('on Loading Button', () => {
        const mockFn = jest.fn(() => {});

        const { getByRole } = renderButton({
          children: 'Button Loading',
          loading: true,
          onClick: mockFn,
        });

        const button = getByRole('button');

        userEvent.click(button);

        expect(button).not.toHaveFocus();
        expect(mockFn).not.toBeCalled();
      });
    });
  });

  // 传递 ref
  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLButtonElement>();
      render(<Button ref={elementRef}>buttonRef using createRef</Button>);

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLButtonElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLButtonElement | null = null;
      const buttonRefCallback = (ref: HTMLButtonElement) => {
        elementRef = ref;
      };

      render(<Button ref={buttonRefCallback}>buttonRef with using callback</Button>);

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLButtonElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLButtonElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLButtonElement>(null);

        return <Button ref={elementRef}>buttonRef using useRef</Button>;
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLButtonElement));
      });
    },
  });
  // describe('transfer ref correctly', () => {
  //   if (typeof React.createRef !== 'undefined') {
  //     test('matches ref with using createRef', () => {
  //       const elementRef = React.createRef<HTMLButtonElement>();
  //       render(<Button ref={elementRef}>buttonRef using createRef</Button>);

  //       expect(elementRef.current).toBeInTheDocument();

  //       expect(elementRef.current).toEqual(expect.any(HTMLButtonElement));
  //     });
  //   }

  //   test('matches ref with using callback', () => {
  //     let elementRef: HTMLButtonElement | null = null;
  //     const buttonRefCallback = (ref: HTMLButtonElement) => {
  //       elementRef = ref;
  //     };

  //     render(<Button ref={buttonRefCallback}>buttonRef with using callback</Button>);

  //     expect(elementRef).toBeInTheDocument();

  //     expect(elementRef).toEqual(expect.any(HTMLButtonElement));
  //   });

  //   if (typeof React.useRef !== 'undefined') {
  //     test('matches ref with using useRef', async () => {
  //       let elementRef: React.RefObject<HTMLButtonElement>;
  //       const Test = () => {
  //         elementRef = React.useRef<HTMLButtonElement>(null);

  //         return <Button ref={elementRef}>buttonRef using useRef</Button>;
  //       };

  //       await waitFor(() => {
  //         render(<Test />);

  //         expect(elementRef.current).toBeInTheDocument();

  //         expect(elementRef.current).toEqual(expect.any(HTMLButtonElement));
  //       });
  //     });
  //   }
  // });
});
