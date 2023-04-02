import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import useState from 'react';
// import useTheme from "rea"

/**
 * initial template from https://mui.com/material-ui/react-dialog/
 * @returns 
 */
export default function EditRequestDialogue() {
  // const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [openDialog, setOpenDialog] = useState(false);
    //from https://www.tutorialspoint.com/how-to-create-dialog-box-in-reactjs
   const handleClose = () => {
      setOpenDialog(false);
   };

   const openDialogBox = () => {
    setOpenDialog(true);
   };

  return <Dialog onClose = {handleClose} open = {openDialog} fullScreen={true}>hello hello</Dialog>;
}