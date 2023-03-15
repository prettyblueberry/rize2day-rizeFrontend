import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const MultipleInput = ({ metaIndex = 0, value = [], type = "", placeholder = "", label = "", onChange = null }) => {
  const onChangeOptions = (values) => {
    onChange(values, metaIndex);
  }

  return (
    <Stack className="multiple-input" spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        fullWidth
        id="tags-filled"
        options={top100Films.map((option) => option.title)}
        // defaultValue={[top100Films[0].title]}
        freeSolo
        value={value}
        onChange={(event, value) => onChangeOptions(value)}
        renderTags={(value, getTagProps) =>
          // { 
          //     setOptionList(value)         
          value.map((option, index) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
          // }
        }
        renderInput={(params) => (
          <TextField
            {...params}
            className="multiple-text-input"
            type={type}
            hiddenLabel
            variant="filled"
            label={label}
            placeholder={placeholder}
            onChange={onChangeOptions}
          />
        )}
      />

    </Stack>
  );
}

const top100Films = [

];

export default MultipleInput;
