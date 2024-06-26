import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover} from "@reach/combobox";
import React, {useEffect} from "react";

function PlacesAutocomplete({setSelected, setInputs, setCenter, oldValue}){
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions
    } = usePlacesAutocomplete();
    useEffect(() => {
        setInputs(values =>({...values, ['location']: oldValue }))
    }, []);
    const handleSelect = async (address) => {
        setValue(address, false);
        setInputs(values => ({ ...values, ['location']: address }));
        clearSuggestions();
        const results = await getGeocode({address});
        const {lat, lng} = await getLatLng(results[0]);
        setSelected({lat: lat, lng: lng});
        setCenter({lat: lat, lng: lng});
    };

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput placeHolder={oldValue} defaultValue={oldValue} value={value}
                           onChange={(e) => {
                               setValue(e.target.value)
                           }}
                           disabled={!ready}
                           className={'combobox-input'}
                           placehilder={'Search an address'}/>
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK"
                        && data.map(({place_id, description}) =>
                            <ComboboxOption key={place_id} value={description}/>)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}
export default PlacesAutocomplete;