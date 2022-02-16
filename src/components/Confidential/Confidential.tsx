import React, { Fragment } from 'react'
import Typography from '@mui/material/Typography'

type props = {}
const getConfidential = () => (
    <Fragment>
        <Typography>Component Confidential Coming soon</Typography>
    </Fragment>
)
export const Confidential = ({}: props) => {
    return getConfidential()
}
