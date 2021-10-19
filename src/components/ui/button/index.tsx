import React, { FC } from 'react';
import classNames from "classnames";

import css from './button.module.scss';

interface PropsInterface{
    color: 'yellow' | 'red' | 'blue' | 'default',
    disabled?: boolean,
    type?: 'button' | 'submit',
    isSmall?: boolean,
    onClick?: () => void
}

const Button: FC<PropsInterface> = ({color, isSmall, disabled, type = 'button', children, onClick}) => {
    return (
        <button className={classNames('myBtn', css.btn, css[color], isSmall && css.small)}
                disabled={disabled} type={type} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button;