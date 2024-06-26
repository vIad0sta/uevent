import React, {useEffect, useState} from 'react';
import "../styles/toolbar.css";
import SelectFilter from "./SelectFilter";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(themeName, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(themeName) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function Toolbar(props) {
    useEffect(() => {
        props.fetchData();
    },[props.selectedThemes,props.selectedFormats,props.sortOption,props.sortDirection])

    const handleSortChange = (option) => {
        if (option === props.sortOption) {
            props.setSortDirection(props.sortDirection === 'ASC' ? 'DESC' : 'ASC');
        } else {
            props.setSortOption(option);
            props.setSortDirection('ASC');
        }
    };

    return (
        <div>
            <label>
                Sort By:
                <button onClick={() => handleSortChange('none')}>None</button>
                <button onClick={() => handleSortChange('EventFormatId')}>
                    Format
                    {props.sortOption === 'EventFormatId' && (props.sortDirection === 'ASC' ? '▲' : '▼')}
                </button>
                <button onClick={() => handleSortChange('EventThemeId')}>
                    Theme
                    {props.sortOption === 'EventThemeId' && (props.sortDirection === 'ASC' ? '▲' : '▼')}</button>
                <button onClick={() => handleSortChange('startTime')}>
                    Date {props.sortOption === 'startTime' && (
                    props.sortDirection === 'ASC' ? '▲' : '▼'
                )}
                </button>
            </label>
            <SelectFilter
            filterNames={props.themes}
            selectedFilterElements={props.selectedThemes}
            setSelectedFilterElements={props.setSelectedThemes}
            filterName={'Themes'}
             />
            <SelectFilter
                filterNames={props.formats}
                selectedFilterElements={props.selectedFormats}
                setSelectedFilterElements={props.setSelectedFormats}
                filterName={'Formats'}
            />
        </div>
    );
}

export default Toolbar;
