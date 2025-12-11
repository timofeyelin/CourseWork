import React from 'react';
import { InputLabel } from '@mui/material';
import { 
    StyledFormControl, 
    StyledSelect, 
    StyledMenuItem, 
    menuPaperStyles 
} from './GlassSelect.styles';

export const GlassSelect = ({ label, value, onChange, options, children, ...props }) => {
    return (
        <StyledFormControl variant="outlined" size="small" {...props}>
            <InputLabel>{label}</InputLabel>
            <StyledSelect
                value={value}
                onChange={onChange}
                label={label}
                MenuProps={{
                    PaperProps: {
                        sx: menuPaperStyles
                    }
                }}
            >
                {options ? options.map((opt) => (
                    <StyledMenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </StyledMenuItem>
                )) : children}
            </StyledSelect>
        </StyledFormControl>
    );
};
