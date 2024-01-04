import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    ListItemIcon,
    Typography,
} from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';


export const FilterAccordion = ({ isAccordionOpen,handleAccordionChange, elementName, content}) => {
    return (
        <Accordion
            expanded={isAccordionOpen(elementName)}
            onChange={() => handleAccordionChange(elementName)}
            key={elementName}
            className="ps-border-remove"
            sx={{
                boxShadow: 'none',
                '&.Mui-expanded': {
                    margin: "0px 0 !important"
                },
            }}
        >
            <AccordionSummary
                sx={{
                    display: 'flex',
                    justifyContent: 'start',
                }}
            >
                <ListItemIcon sx={{ minWidth: "30px !important" }}>
                    {isAccordionOpen(elementName) ? <RemoveCircleOutlineRoundedIcon /> : <AddCircleOutlineRoundedIcon />}
                </ListItemIcon>
                <Typography>{elementName}</Typography>

            </AccordionSummary>
            <AccordionDetails sx={{ paddingLeft: "3rem !important" }}>
                <span>{content}</span>
            </AccordionDetails>
        </Accordion>
    );
};
