import { Dialog, DialogTitle, List, ListItem, ListItemText } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { ConnectorNames, ConnectorType } from '../../connectors'
import {
  connectModalOpen,
  getConnector,
  toggleConnectorModal
} from '../../redux/slices/appSlice'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      minWidth: '20rem'
    },
    item: {
      textAlign: 'center'
    }
  })
)

export interface ConnectModalProps {
  open: boolean;
  onClose: (value: ConnectorType) => void;
}

const ConnectModal = ({ open, onClose }: ConnectModalProps) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const connectorName: ConnectorType = useAppSelector(getConnector)

  const handleClose = () => {
    onClose(connectorName)
  }

  const onClick = (name: ConnectorType) => () => {
    onClose(name)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select Connector</DialogTitle>

      <List className={classes.list}>
        { Object.keys(ConnectorNames).map(name => (
          <ListItem button onClick={onClick(name)} key={name} className={classes.item}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

export default ConnectModal
