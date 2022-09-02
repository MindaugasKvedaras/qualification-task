// @ts-nocheck
import React, { useRef, useEffect } from "react";
import { OptionList, GroupedOptionHeader, GroupedOptionListItems, CheckBox, Chip, CancelOptionImg, 
  MultiSelectContainer, SearchWrapper, MultiSelectContainerInput, OptionListContainer, 
  Arrow, EmptyMsg } from "../styled-components/styled-components";
import CloseCircle from '../../assets/closeCircle.svg';
import { MultiselectProps } from "./interface";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

const closeIconTypes = {
  circle2: CloseCircle,
};

function useOutsideAlerter(ref, clickEvent) {
  useEffect(() => {
      function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target)) {
            clickEvent();
          }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [ref]);
}

function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.outsideClick);
  return <div ref={wrapperRef}>{props.children}</div>;
}

export class Dropdown extends React.Component<MultiselectProps, any> {
  static defaultProps: MultiselectProps;
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      options: props.options,
      filteredOptions: props.options,
      unfilteredOptions: props.options,
      selectedValues: Object.assign([], props.selectedValues),
      toggleOptionsList: false,
	    showCheckbox: props.showCheckbox,
      keepSearchTerm: props.keepSearchTerm,
      groupedObject: [],
      closeIconType: closeIconTypes[props.closeIcon] || closeIconTypes['circle']
    };

	  this.searchWrapper = React.createRef();
	  this.searchBox = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.renderMultiselectContainer = this.renderMultiselectContainer.bind(this);
    this.renderSelectedList = this.renderSelectedList.bind(this);
    this.onRemoveSelectedItem = this.onRemoveSelectedItem.bind(this);
    this.toggelOptionList = this.toggelOptionList.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.filterOptionsByInput = this.filterOptionsByInput.bind(this);
    this.removeSelectedValuesFromOptions = this.removeSelectedValuesFromOptions.bind(this);
    this.isSelectedValue = this.isSelectedValue.bind(this);
    this.listenerCallback = this.listenerCallback.bind(this);
    this.onCloseOptionList = this.onCloseOptionList.bind(this);
  }

  initialSetValue() {
    const { showCheckbox, groupBy, singleSelect } = this.props;
		const { options } = this.state;
    if (!showCheckbox && !singleSelect) {
      this.removeSelectedValuesFromOptions(false);
		}
	if (groupBy) {
			this.groupByOptions(options);
		}
  }

  componentDidMount() {
	this.initialSetValue();
    this.searchWrapper.current.addEventListener("click", this.listenerCallback);
  }

  componentDidUpdate(prevProps) {
    const { options, selectedValues } = this.props;
    const { options: prevOptions, selectedValues: prevSelectedvalues } = prevProps;
    if (JSON.stringify(prevOptions) !== JSON.stringify(options)) {
      this.setState({ options, filteredOptions: options, unfilteredOptions: options }, this.initialSetValue);
    }
    if (JSON.stringify(prevSelectedvalues) !== JSON.stringify(selectedValues)) {
      this.setState({ selectedValues: Object.assign([], selectedValues), preSelectedValues: Object.assign([], selectedValues) }, this.initialSetValue);
    }
  }

  listenerCallback() {
    this.searchBox.current.focus();
  }

  removeSelectedValuesFromOptions() {
    const { isObject, displayValue, groupBy } = this.props;
    const { selectedValues = [], unfilteredOptions, options } = this.state;
    if (groupBy) {
      this.groupByOptions(options);
    }
    if (!selectedValues.length) {
      return;
    }
    if (isObject) {
      let optionList = unfilteredOptions.filter(item => {
        return selectedValues.findIndex(
          v => v[displayValue] === item[displayValue]
        ) === -1
          ? true
          : false;
      });
      if (groupBy) {
        this.groupByOptions(optionList);
      }
      this.setState(
        { options: optionList, filteredOptions: optionList },
        this.filterOptionsByInput
      );
      return;
    }
    let optionList = unfilteredOptions.filter(
      item => selectedValues.indexOf(item) === -1
    );

    this.setState(
      { options: optionList, filteredOptions: optionList },
      this.filterOptionsByInput
    );
  }

  groupByOptions(options) {
    const { groupBy } = this.props;
    const groupedObject = options.reduce(function(r, a) {
      const key = a[groupBy];
      r[key] = r[key] || [];
      r[key].push(a);
      return r;
    }, Object.create({}));

    this.setState({ groupedObject });
  }

  onChange(event) {
    const { onSearch } = this.props;
    this.setState(
      { inputValue: event.target.value },
      this.filterOptionsByInput
    );
    if (onSearch) {
      onSearch(event.target.value);
    }
  }

  filterOptionsByInput() {
    let { options, filteredOptions, inputValue } = this.state;
    const { isObject, displayValue } = this.props;
    if (isObject) {
      options = filteredOptions.filter(i => this.matchValues(i[displayValue], inputValue))
    } else {
      options = filteredOptions.filter(i => this.matchValues(i, inputValue));
    }
    this.groupByOptions(options);
    this.setState({ options });
  }

  matchValues(value, search) {
    if (this.props.caseSensitiveSearch) {
      return value.indexOf(search) > -1;
    }
    if (value.toLowerCase) {
      return value.toLowerCase().indexOf(search.toLowerCase()) > -1;
    }
    return value.toString().indexOf(search) > -1;
  }

  onRemoveSelectedItem(item) {
		let { selectedValues, index = 0 } = this.state;
		const { onRemove, showCheckbox, displayValue, isObject } = this.props;
    if (isObject) {
      index = selectedValues.findIndex(
        i => i[displayValue] === item[displayValue]
      );
    } else {
      index = selectedValues.indexOf(item);
    }
		selectedValues.splice(index, 1);
		onRemove(selectedValues, item);
    this.setState({ selectedValues }, () => {
      if (!showCheckbox) {
			this.removeSelectedValuesFromOptions(true);
      }
    });
    if (!this.props.closeOnSelect) {
      this.searchBox.current.focus();
    }
  }

  onSelectItem(item) {
    const { selectedValues } = this.state;
    const { selectionLimit, onSelect, singleSelect, showCheckbox } = this.props;
    if (!this.state.keepSearchTerm){
      this.setState({
        inputValue: ''
      });
    }
    if (singleSelect) {
      this.onSingleSelect(item);
      onSelect([item], item);
      return;
    }
    if (this.isSelectedValue(item)) {
      this.onRemoveSelectedItem(item);
      return;
    }
    if (selectionLimit == selectedValues.length) {
      return;
    }
		selectedValues.push(item);
		onSelect(selectedValues, item);
    if (!this.props.closeOnSelect) {
      this.searchBox.current.focus();
    }
  }

  isSelectedValue(item) {
    const { isObject, displayValue } = this.props;
    const { selectedValues } = this.state;
    if (isObject) {
      return (
        selectedValues.filter(i => i[displayValue] === item[displayValue])
          .length > 0
      );
    }
    return selectedValues.filter(i => i === item).length > 0;
  }

  renderOptionList() {
    const { groupBy, emptyRecordMsg } = this.props;
    const { options } = this.state;
    
    return (
      <OptionList>
        {options.length === 0 && <EmptyMsg>{emptyRecordMsg}</EmptyMsg>}
        {groupBy && this.renderGroupByOptions()}
      </OptionList>
    );
  }

  renderGroupByOptions() {
    const { isObject = false, displayValue, showCheckbox, singleSelect } = this.props;
    const { groupedObject } = this.state;
    return Object.keys(groupedObject).map(obj => {
			return (
				<React.Fragment key={obj}>
					<GroupedOptionHeader>{obj}</GroupedOptionHeader>
					{groupedObject[obj].map((option, i) => {
            const isSelected = this.isSelectedValue(option);
            return (
              <GroupedOptionListItems
                key={`option${i}`}
                onClick={() => this.onSelectItem(option)}
              >
                {showCheckbox && !singleSelect && (
                    <CheckBox
                      type="checkbox"
                      readOnly
                      checked={isSelected}
                    />
                )}
                {this.props.optionValueDecorator(isObject ? option[displayValue] : (option || '').toString(), option)}
              </GroupedOptionListItems>
            )}
          )}
				</React.Fragment>
			)
		});
  }

  renderSelectedList() {
    const { isObject = false, displayValue, singleSelect } = this.props;
    const { selectedValues, closeIconType } = this.state;
    return selectedValues.map((value, index) => (
      <Chip key={index}>
        {this.props.selectedValueDecorator(!isObject ? (value || '').toString() : value[displayValue], value)}
        {<CancelOptionImg
          src={closeIconType}
          onClick={() => this.onRemoveSelectedItem(value)}
        />}
      </Chip>
    ));
  }

  toggelOptionList() {
    this.setState({
      toggleOptionsList: !this.state.toggleOptionsList,
      highlightOption: this.props.avoidHighlightFirstOption ? -1 : 0
    });
  }

  onCloseOptionList() {
    this.setState({
      toggleOptionsList: false,
      highlightOption: this.props.avoidHighlightFirstOption ? -1 : 0,
      inputValue: ''
    });
  }

  onFocus(){
    if (this.state.toggleOptionsList) {
      clearTimeout(this.optionTimeout);
    } else {
      this.toggelOptionList();
    }
  }

  renderMultiselectContainer() {
    const { inputValue, toggleOptionsList, selectedValues } = this.state;
    const { placeholder, singleSelect } = this.props;
    
    return (
      <MultiSelectContainer>
        <SearchWrapper
          ref={this.searchWrapper}
          onClick={singleSelect ? this.toggelOptionList : () => {}}
        >
          {selectedValues && this.renderSelectedList()}
          <MultiSelectContainerInput
			      type="text"
			      ref={this.searchBox}
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
            value={inputValue}
            onFocus={this.onFocus}
            placeholder={((singleSelect && selectedValues.length)) ? '' : placeholder}
            autoComplete="off"
          />
          {!toggleOptionsList ? (
            <Arrow onClick={this.toggelOptionList}>
              <MdKeyboardArrowDown/>
            </Arrow>)
            :
            (<Arrow onClick={this.onCloseOptionList}>
            <MdKeyboardArrowUp/>
          </Arrow>
          )}
        </SearchWrapper>
        <OptionListContainer
          style={{display: toggleOptionsList ? 'block' : 'none'}}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        >
          {this.renderOptionList()}
        </OptionListContainer>
      </MultiSelectContainer>
    );
  }

  render() {
    return (
      <OutsideAlerter outsideClick={this.onCloseOptionList}>
        {this.renderMultiselectContainer()}
      </OutsideAlerter>
    );
  }
}

Dropdown.defaultProps = {
  options: [],
  selectedValues: [],
  isObject: true,
  displayValue: "model",
  showCheckbox: true,
  placeholder: "Select",
	groupBy: "",
	style: {},
	emptyRecordMsg: "No Options Available",
	onSelect: () => {},
  onRemove: () => {},
  closeIcon: 'circle2',
  singleSelect: false,
  closeOnSelect: true,
  hidePlaceholder: false,
  keepSearchTerm: false,
  customCloseIcon: '',
  className: '',
  selectedValueDecorator: v => v,
  optionValueDecorator: v => v
} as MultiselectProps;
