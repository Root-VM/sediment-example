import React, { FC } from 'react';
import Image from 'next/image';
import classNames from "classnames";

import css from './radio.module.scss';

interface PropsInterface{
    name: string,
    label: string,
    value: string,
    isChecked: boolean,
    disable?: boolean,
    handleChange?: (val: string) => void;
}

const Radio: FC<PropsInterface> = ({ name, label, value, isChecked, disable, handleChange }) => {

    const handleRadioChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { id } = e.currentTarget;
        !disable && handleChange && handleChange(id); // Send back id to radio group for comparison
    };

    return (
        <div className={classNames('myRadio', css.radio)}>
            <div className={css.img}>
                <Image width={20} height={20} alt="check"
                       src={`/img/icons/radio${isChecked ? (disable ? '-disable' : '-active') : ''}.svg`}/>
            </div>

            <input
                type="radio"
                name={name}
                id={value}
                checked={isChecked}
                disabled={disable}
                onChange={handleRadioChange}
            />

            <label htmlFor={value}>
                {label}
            </label>
        </div>
    )
}

export default Radio;