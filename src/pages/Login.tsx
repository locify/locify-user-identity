import React, { Fragment, useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { SignIn, SignUp } from '@src/components'

type props = {}

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </div>
    )
}

const LoginWidget = () => {
    const [tabIndex, setTabIndex] = useState(0)
    const handleChange = (event: React.SyntheticEvent, newIndex: number) => {
        setTabIndex(newIndex)
    }

    return (
        <Fragment>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Sign In" {...a11yProps(0)} />
                    <Tab label="Sign Up" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                <SignIn />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <SignUp />
            </TabPanel>
        </Fragment>
    )
}
export const Login = () => <LoginWidget />
