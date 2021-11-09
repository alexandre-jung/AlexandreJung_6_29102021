/**
 * dropdown.mjs
 * 
 * A module for managing custom dropdowns with mouse and keyboard interactions.
 */

class DropdownContainer {
    /**
     * constructor
     * 
     * @param element DOM element
     */
    constructor(element) {
        this._element = element;
    }
    /**
     * Get the DOM element
     * 
     * @return Element
     */
    get element() {
        return this._element;
    }
    /**
     * Get the expanded state of the element
     * 
     * @return Boolean
     */
    get expanded() {
        return this._element.dataset.expanded == 'true';
    }
    /**
     * Set the expanded state of the element.  
     * `value` can be a Boolean or a String ('true' | 'false')
     * 
     * @param value Boolean | String
     */
    set expanded(value) {
        return this._element.dataset.expanded = String(value) == 'true';
    }
    /**
     * Get the dropdown value
     * 
     * @return string
     */
    get value() {
        return this.element.dataset.value;
    }
    /**
     * Set the dropdown value
     * 
     * @param string
     * @return string
     */
    set value(value) {
        if (this.onValueChange) {
            this.onValueChange(value);
        }
        return this.element.dataset.value = value;
    }
    /**
     * Toggles the expanded state
     * 
     * @returns Boolean - the new state
     */
    toggle = () => {
        if (this.expanded) {
            this.element.dataset.isClosing = true;
            setTimeout(() => {
                this.expanded = false;
                this.element.dataset.isClosing = false;
            }, 150);
            return false;
        } else {
            return this.expanded = true;
        }
    }
}

class Focusable {
    /**
     * constructor
     * 
     * @param element DOM element
     */
    constructor(element) {
        this._element = element;
    }
    /**
     * Get the DOM element
     * 
     * @return Element
     */
    get element() {
        return this._element;
    }
    /**
     * Get focusable state
     * 
     * @return Boolean
     */
    get tabFocusable() {
        return this._element.tabIndex != '-1';
    }
    /**
     * Set focusable state
     * 
     * @param value Boolean
     */
    set tabFocusable(value) {
        return this._element.tabIndex = value ? 0 : -1;
    }
    /**
     * Set focus to this element
     */
    focus = () => {
        this._element.tabIndex = 0;
        this._element.focus();
    }
    /**
     * Remove focus from this element
     */
    blur = () => {
        this._element.tabIndex = -1;
        this._element.blur();
    }
}

class DropdownToggleBtn extends Focusable {
    /**
     * constructor
     * 
     * @param element DOM element
     * @param placeHolderElement DOM element whose textContent
     * contains the label of the dropdown
     */
    constructor(element, placeHolderElement) {
        super(element);
        this.valuePlaceholder = placeHolderElement;
    }
    /**
     * Get display text
     * 
     * @return String
     */
    get label() {
        return this.valuePlaceholder.textContent;
    }
    /**
     * Set display text
     * 
     * @param label String
     */
    set label(label) {
        return this.valuePlaceholder.textContent = label;
    }
}

class DropdownList extends Focusable {
    /**
     * constructor
     * 
     * @param element DOM element
     * @param listItems NodeList | Element[]
     */
    constructor(element, listItems, active = 0) {
        super(element);
        this._items = Array.from(listItems);
        this._length = this._items?.length ?? 0;
        this._currentCounter = new ListIndexCounterClamp(this._length);
        this._activeIndex = new ListIndexCounterClamp(this._length);
        this._options = Array.from(listItems ?? []).map(item => {
            const option = new DropdownOption(item);
            // Attach ARIA active descendant setter callback
            option.onSelect = this.setActiveDescendant;
            return option;
        });
        if (this._length) {
            this.currentOption.selected = true;
            this.currentOption.active = true;
        }
    }
    /**
     * Focus the next option
     */
    next() {
        this._options[this._currentCounter.current].selected = false;
        this._options[this._currentCounter.next()].selected = true;
    }
    /**
     * Focus the previous option
     */
    previous() {
        this._options[this._currentCounter.current].selected = false;
        this._options[this._currentCounter.previous()].selected = true;
    }
    /**
     * Make the focused item active
     */
    selectCurrent() {
        this._options[this._activeIndex.current].active = false;
        this._options[this._activeIndex.current].selected = false;
        this._options[this._currentCounter.current].active = true;
        this._options[this._currentCounter.current].selected = true;
        this._activeIndex.current = this._currentCounter.current;
        this.onValueChange(
            this.activeOption.value,
            this.activeOption.label,
        );
    }
    /**
     * Make the active item focused
     */
    focusActive() {
        this.setCurrentOption(dropdownList.currentActiveIndex);
    }
    /**
     * Select and focus the previous option
     */
    selectPrevious() {
        this.previous();
        this.selectCurrent();
    }
    /**
     * Select and focus the next option
     */
    selectNext() {
        this.next();
        this.selectCurrent();
    }
    /**
     * Size of the list
     * 
     * @return Number
     */
    get length() {
        return this._length;
    }
    /**
     * Get list items
     * 
     * @return NodeList | Element[]
     */
    get items() {
        return this._items ?? [];
    }
    /**
     * Get active item index
     * 
     * @return Number
     */
    get currentActiveIndex() {
        return this._activeIndex.current;
    }
    /**
     * Get the currently selected option
     * 
     * @return DropdownOption
     */
    get currentOption() {
        return this._options[this._currentCounter.current];
    }
    /**
     * Get the currently active option
     * 
     * @return DropdownOption
     */
    get activeOption() {
        return this._options[this._activeIndex.current];
    }
    /**
     * Set the currently selected option for ARIA
     * 
     * @param id ID of the currently selected option
     */
    setActiveDescendant = (id) => {
        this.element.setAttribute('aria-activedescendant', id);
    }
    /**
     * Set the currently selected option
     * 
     * @param index number
     */
    setCurrentOption(index) {
        this._options[this._currentCounter.current].selected = false;
        this._currentCounter.current = index;
        this._options[index].selected = true;
    }
    /**
     * Get an option by its index, null if index is out of range
     * 
     * @param index number
     * @returns DropdownOption | null
     */
    getOptionByIndex(index) {
        if (this._length && index >= 0 && index < this._length) {
            return this._options[index];
        }
        return null;
    }
    /**
     * Find option index by its value, -1 if not found
     * 
     * @param value String
     * @returns Number
     */
    findOptionIndexByValue(value) {
        return this._items.findIndex(function (item) {
            return item.dataset.value == value;
        });
    }
    /**
     * Set the active option by its value
     * 
     * @param value Number
     */
    setActiveOption(value) {
        if (value && this.length) {
            const optionIndex = this.findOptionIndexByValue(value);
            this.setCurrentOption(optionIndex);
            this.selectCurrent();
        }
    }
}

class DropdownOption {
    /**
     * constructor
     * 
     * @param element DOM element
     */
    constructor(element) {
        this.element = element;
    }
    /**
     * Get display text
     * 
     * @return String
     */
    get label() {
        return this.element.textContent;
    }
    /**
     * Set display text
     * 
     * @param label String
     */
    set label(label) {
        return this.element.textContent = label;
    }
    /**
     * Get data-value attribute
     * 
     * @return String
     */
    get value() {
        return this.element.dataset.value;
    }
    /**
     * Set data-value attribute
     * 
     * @param value String
     */
    set value(value) {
        return this.element.dataset.value = value;
    }
    /**
     * Get selected state
     * 
     * @return Boolean
     */
    get selected() {
        return this.element.dataset.selected;
    }
    /**
     * Set selected state
     * @param value Boolean
     */
    set selected(value) {
        if (this.onSelect) {
            this.onSelect(this.element.id);
        }
        return this.element.dataset.selected = value;
    }
    /**
     * Get active state
     * 
     * @return Boolean
     */
    get active() {
        return this.element.dataset.active;
    }
    /**
     * Set active state
     * @param value Boolean
     */
    set active(value) {
        this.element.setAttribute('aria-selected', value);
        return this.element.dataset.active = value;
    }
}

class ListIndexCounterClamp {
    /**
     * Contructor
     * 
     * @param size Number - list size
     * @param current Number - current index (default 0)
     */
    constructor(size, current = 0) {
        this._size = Number(size) >= 0 ? Number(size) : 0;
        this._current = Number(current);
    }
    /**
     * Get the current value of the counter
     * 
     * @return Number
     */
    get current() {
        return this._current;
    }
    /**
     * Set the current value of the counter.  
     * If index is outside the range [0, size-1],
     * it is set to the closest end of this range
     * 
     *  @param index Number
     */
    set current(index) {
        if (index < 0) {
            this._current = 0;
        } else if (index >= this._size) {
            this._current = this._size - 1;
        } else {
            this._current = Number(index);
        }
    }
    /**
     * Increment the counter.  
     * It cannot go past the last index (size - 1)
     * 
     * @return Number the updated value
     */
    previous() {
        if (this.current > 0) {
            return --this.current;
        }
        return this.current;
    }
    /**
     * Decrement the counter.  
     * It cannot be lower than 0
     * 
     * @return Number the updated value
     */
    next() {
        if (this.current < this._size - 1) {
            return ++this.current;
        }
        return this.current;
    }
}

/********************************************************************
 * Setup events & dropdown logic
 *******************************************************************/

// Find the dropdown element
const dropdown = new DropdownContainer(
    document.querySelector('.dropdown'),
);
// Find the toggle button in the dropdown
const dropdownToggle = new DropdownToggleBtn(
    dropdown.element.querySelector('.dropdown-toggle'),
    dropdown.element.querySelector('.dropdown-value'),
);
// Find the list in the dropdown
const dropdownList = new DropdownList(
    dropdown.element.querySelector('.dropdown-list'),
    dropdown.element.querySelectorAll('.dropdown-item'),
);

// Set the button label and value to match the current item
if (dropdownList.currentOption) {
    dropdownToggle.label = dropdownList.currentOption.label;
    dropdownToggle.value = dropdownList.currentOption.value;
}

// Toggle the dropdown when click the toggle button
dropdownToggle.element.addEventListener('click', function (ev) {
    if (dropdown.toggle()) {
        dropdownList.focus();
        dropdownToggle.blur();
        dropdownList.focusActive();
        // close the dropdown when clicking anywhere on the document
        // 1. prevent the click event to reach the document root
        // 2. close on click & remove this handler
        ev.stopPropagation();
        document.addEventListener('click', function closeDropdown() {
            document.removeEventListener('click', closeDropdown);
            if (dropdown.expanded) {
                dropdown.toggle();
                dropdownToggle.focus();
            }
        });
    }
});

// Up / down selection of the options while the dropdown is collapsed
dropdownToggle.element.addEventListener('keydown', function (ev) {
    switch (ev.key) {
        case 'ArrowUp':
            dropdownList.selectPrevious();
            break;
        case 'ArrowDown':
            dropdownList.selectNext();
            break;
    }
});

// If clicking the list (i.e. any item in the list)
// set this item active and focused, then focus back the list
dropdownList.element.addEventListener('click', function (ev) {
    dropdownList.setActiveOption(ev.target.dataset.value);
    dropdownList.focus();
});

// Keyboard interaction with the list
// 1. Focus items with up / down arrow keys
// 2. Select the focused item when hitting enter
// 3. Close the dropdown and focus button when hitting escape / tab
dropdownList.element.addEventListener('keydown', function (ev) {
    switch (ev.key) {
        case 'ArrowUp':
            dropdownList.previous();
            break;
        case 'ArrowDown':
            dropdownList.next();
            break;
        case 'Enter':
            dropdownList.selectCurrent();
            dropdownList.blur();
            dropdownToggle.focus();
            dropdown.toggle();
            // prevent default, otherwise the button does not keep focus
            ev.preventDefault();
            break;
        case 'Escape':
        case 'Tab':
            dropdownList.blur();
            dropdownToggle.focus();
            dropdown.expanded = false;
            break;
    }
});

// When selected item changes, update the button label
dropdownList.onValueChange = function (id, label) {
    dropdownToggle.label = label;
    dropdown.value = id;
};

// Do something when the dropdown value changes
dropdown.onValueChange = function (value) {
    // ...
}
