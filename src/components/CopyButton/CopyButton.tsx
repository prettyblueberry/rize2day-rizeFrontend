import { Button, Tooltip } from '@mui/material';
import * as PropTypes from 'prop-types';
import React from 'react';
import { copyToClipboard } from 'utils/utils';
import { MdContentCopy } from 'react-icons/md';

const CopyButton = (props) => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCopy = (e) => {
        copyToClipboard(props.data);

        e.stopPropagation();
        setOpen(true);
        setTimeout(handleClose, 1000);
    };

    return (
        <Tooltip
            arrow
            open={open}
            title="Copied!">
            <Button
                className="copy_button theme_color copy_icon_button"
                variant="contained"
                onClick={handleCopy}>
                <MdContentCopy size={20} />
            </Button>
        </Tooltip>
    );
};

CopyButton.propTypes = {
    data: PropTypes.string,
    icon: PropTypes.any,
};

export default CopyButton;
