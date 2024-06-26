import React from 'react';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import {useTheme} from "@mui/material/styles";

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

function getStyles(filterElementName, filterElements, filterElement) {
    return {
        fontWeight:
            filterElements.indexOf(filterElementName) === -1
                ? filterElement.typography.fontWeightRegular
                : filterElement.typography.fontWeightMedium,
    };
}
function SelectFilter(props) {
    const theme = useTheme();
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        props.setSelectedFilterElements(
            typeof value === 'string' ? value.split(',') : value,
        );

    };
    return (
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">{props.filterName} filter</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={props.selectedFilterElements}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label={props.filterName + ' filter'}/>}
                    renderValue={(selected) => (
                        <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip
                                    key={value} label={props.filterNames.find(theme => theme.id === value).name}
                                />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {props.filterNames && props.filterNames.map(currentTheme => (
                        <MenuItem
                            key={currentTheme.id}
                            value={currentTheme.id}
                            style={getStyles(currentTheme.name, props.selectedFilterElements, theme)}
                        >
                            {currentTheme.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
    )
}

export default SelectFilter;