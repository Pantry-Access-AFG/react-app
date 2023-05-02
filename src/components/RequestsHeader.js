import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import { IconButton, Chip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid'; // Grid version 1


export default function RequestsHeader({title}) {
    return (
        <div style={{borderBottomStyle:'solid', borderColor:'black', borderWidth: "3px"}}>
            <Grid container
                alignItems="center"
                justifyContent="center">
                <Grid item xs={4}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}>
                        <p className="align-text-left" style={{ display: "inline"}}>{title}</p>
                        {title === "Pending Requests" ? <HourglassBottomIcon /> : <div/>}
                        </div>
                </Grid>
                <Grid item xs={4}>
                </Grid>
                <Grid item xs={4}>
                <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent:'flex-end',
                        flexWrap: 'wrap',
                    }}>
                    {/* <IconButton aria-label="expand">
                        <FormatLineSpacingIcon />
                    </IconButton> */}
                </div>
                </Grid>
            </Grid>


            {/* <IconButton aria-label="expand">
            <FormatLineSpacingIcon/>
          </IconButton>

          <IconButton  aria-label="search">
            <SearchIcon />
          </IconButton> */}


        </div>
    )
}