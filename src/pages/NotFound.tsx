import { Paper, Typography } from '@mui/material'
import React, { FC } from 'react'

type Prop = {}
export const NotFound: FC<Prop> = (props: Prop) => {
    return (
        <Paper>
            <Typography gutterBottom align="center" variant="subtitle1">
                Not found
            </Typography>
            <Typography variant="body2" align="center">
                No page found
            </Typography>
        </Paper>
    )
}