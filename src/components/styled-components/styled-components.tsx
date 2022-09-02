import styled from 'styled-components';

export const OptionList = styled('ul')`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;600&display=swap');
    font-family: 'Poppins', sans-serif;
    display: block;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    max-height: 250px;
    overflow-y: auto;
`
export const GroupedOptionHeader = styled('li')`
    background: #0077c0;
    color: #fff;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 10px;
`
export const GroupedOptionListItems = styled('li')`
    padding: 10px 10px;
    &:hover {
        background: #0CAFFF;
        color: #fff;
        cursor: pointer;    
    }
`
export const CheckBox = styled('input')`
    margin-right: 10px;
`

export const Chip = styled('span')`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;600&display=swap');
  font-family: 'Poppins', sans-serif;
  padding: 4px 10px;
  background: #0077c0;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  line-height: 19px;
  color: #fff;
  letter-spacing: 1px;
  white-space: nowrap;
`
export const CancelOptionImg = styled('img')`
    height: 16px;
    width: 16px;
    float: right;
    margin-left: 5px;
    cursor: pointer;
`
export const MultiSelectContainer = styled('div')`
    position: relative;
    text-align: left;
    width: 50%;
    margin: auto;
`
export const SearchWrapper = styled('div')`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #696969;
    border-radius: 4px;
    padding: 8px;
    min-height: 22px;
    position: relative;
    flex-wrap: wrap;
`
export const MultiSelectContainerInput = styled('input')`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;600&display=swap');
    font-family: 'Poppins', sans-serif;
    border: none;
    font-size: 18px;
    margin-top: 3px;
    width: 92%;
    @media (max-width: 768px) {
        width: 85%;
      }
    background: transparent;
    &:focus {
        outline: none;
    }
`
export const OptionListContainer = styled('div')`
    position: absolute;
    width: 100%;
    background: #fff;
    border-radius: 4px;
    margin-top: 1px;
    z-index: 2;
`
export const Arrow = styled('div')`
    padding-top: 5px;
    font-size: 25px;
    &:hover {
        cursor: pointer;
    }
`    
export const EmptyMsg = styled('span')`
    padding: 5px;
    color: #C21807;
`

