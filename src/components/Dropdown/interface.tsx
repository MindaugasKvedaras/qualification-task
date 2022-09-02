import React from "react";

export interface MultiselectProps {
    options: any,
    selectedValues?: any,
    isObject?: boolean,
    displayValue?: string,
    showCheckbox?: boolean,
    placeholder?: string,
    groupBy?: string,
    emptyRecordMsg?: string,
    onSelect?: (selectedList:any, selectedItem: any) => void,
    onRemove?: (selectedList:any, selectedItem: any) => void,
    onSearch?: (value:string) => void,
    removeSelectedValuesFromOptions: boolean,
    closeIcon?: string,
    closeOnSelect?: boolean,
    className?: string;
    selectedValueDecorator?: (v:string, option: any) => React.ReactNode | string;
    optionValueDecorator?: (v:string, option: any) => React.ReactNode | string
}