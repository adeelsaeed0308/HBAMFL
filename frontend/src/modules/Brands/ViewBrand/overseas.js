import { useAlertModal, useModalContext } from 'common';
import React, { useState } from 'react';
import ExcelView from './ExcelView';

const Overseas = ({ margin, brand }) => {
    const [selectedLocation, setSelectedLocation] = useState('');
    const { setModalContent } = useModalContext();
    const alert = useAlertModal("Please Ensure Up-front Payment");

    const openModal = (params, show = true, childBrand = undefined) => {
        show &&
            setModalContent(
                <ExcelView brand={childBrand || brand} params={params} />
            );
    };
    const handleChange = (event) => {
        const val = event.target.value;
        setSelectedLocation(val);
        if (val !== "") {
            const open = () =>
                openModal(
                    {
                        margin: margin.margin,
                    },
                    brand.itemsHaveCostPrice
                );
            if (margin.margin < 12) {
                alert(null, open);
            } else {
                open();
            }
        }

    };

    return (
        <div>
            Overseas
            <div>
                <input
                    type="radio"
                    id="netherlands"
                    name="location"
                    value="netherlands"
                    onChange={handleChange}
                    checked={selectedLocation === 'netherlands'}
                />
                <label htmlFor="netherlands">Netherlands</label>
            </div>
            <div>
                <input
                    type="radio"
                    id="newjersey"
                    name="location"
                    value="newjersey"
                    onChange={handleChange}
                    checked={selectedLocation === 'newjersey'}
                />
                <label htmlFor="newjersey">New Jersey</label>
            </div>
        </div>
    );
}

export default Overseas;
