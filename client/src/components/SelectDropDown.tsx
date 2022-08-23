import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { FormControlProps } from '@mui/material/FormControl';
import { InputLabelProps } from '@mui/material/InputLabel';
import { MenuItemProps } from '@mui/material/MenuItem';

interface SelectItems {
  text: string;
  value: string | number;
}

interface SelectDropDownProps {
  label: string;
  value: SelectItems['value'];
  selectItems: SelectItems[];
  onChange: (event: SelectChangeEvent) => void;
  FormControlProps?: FormControlProps;
  InputLabelProps?: InputLabelProps;
  MenuItemProps?: MenuItemProps;
}

export const SelectDropDown = (props: SelectDropDownProps) => {
  const {
    label,
    value,
    selectItems,
    onChange,
    FormControlProps,
    InputLabelProps,
    MenuItemProps,
  } = props;

  return (
    <FormControl size="small" {...FormControlProps}>
      <InputLabel {...InputLabelProps}>{label}</InputLabel>
      <Select
        value={value as string}
        label={label}
        onChange={onChange}
        IconComponent={KeyboardArrowDownRoundedIcon}
        sx={{ backgroundColor: '#fff' }}
      >
        {selectItems.map((item) => (
          <MenuItem key={item.value} value={item.value} {...MenuItemProps}>
            {item.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
