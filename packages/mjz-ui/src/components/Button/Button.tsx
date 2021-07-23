import React from 'react';
import _ from 'lodash';
import './Button.less';

function uniteClassNames(...args: (string | undefined)[]): string {
  const classNames = _.toArray(args).filter((className) => {
    return _.isString(className) && !!className;
  });
  return _.isArray(classNames) ? classNames.join(' ').trim() : '';
}

export enum APPEARANCE {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  MINIMAL = 'minimal',
}

export enum INTENT {
  DEFAULT = 'default',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
}

export interface IButtonProps extends React.InputHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: string | React.ReactNode;
  appearance?: `${APPEARANCE}`;
  intent?: `${INTENT}`;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const prefixCls = 'yufu-btn';
const prefixClsIntent = `${prefixCls}-intent`;

export const classes = {
  root: prefixCls,
  appearance: (appearance: IButtonProps['appearance']): string =>
      appearance === APPEARANCE.DEFAULT ? '' : `${prefixCls}-${appearance}`,
  intent: (intent: IButtonProps['intent']): string =>
      intent === INTENT.DEFAULT ? '' : `${prefixClsIntent}-${intent}`,
  disabled: `${prefixCls}-disabled`,
  loading: `${prefixCls}-loading`,
};

const InternalButton: React.ForwardRefRenderFunction<HTMLButtonElement, IButtonProps> = (
    props: IButtonProps,
    ref,
) => {
  const { className, children, appearance, intent, disabled, loading, onClick } = props;
  const isBtnDisabled = disabled || loading;
  return (
      <button
          ref={ref}
          type="button"
          className={uniteClassNames(
              classes.root,
              classes.appearance(appearance),
              classes.intent(intent),
              isBtnDisabled ? classes.disabled : '',
              loading ? classes.loading : '',
              className,
          )}
          disabled={isBtnDisabled}
          onClick={isBtnDisabled ? undefined : onClick}
      >
        {loading ? 'Loading...' : children}
      </button>
  );
};

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(InternalButton);

Button.defaultProps = {
  appearance: APPEARANCE.DEFAULT,
  intent: INTENT.DEFAULT,
};

export default Button;
