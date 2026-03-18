import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import styles from "./tab-comp.module.css";
import { enqueueSnackbar } from "notistack";

import HomeIcon from "@mui/icons-material/Home";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import FaceIcon from "@mui/icons-material/Face";
import TvIcon from "@mui/icons-material/Tv";
import ChairIcon from "@mui/icons-material/Chair";
import KitchenIcon from "@mui/icons-material/Kitchen";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";

export default function TabComps() {
    const [value, setValue] = useState(0);

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
        enqueueSnackbar(newValue)
    };

    return (
        <Box className={styles.wrapper}>
            <Tabs
                value={value}
                onChange={handleChange}
                className={styles.tabs}
                TabIndicatorProps={{ className: styles.indicator }}
            >
                <Tab label="For You" className={styles.tab} icon={<HomeIcon />} iconPosition="top" />
                <Tab label="Fashion" className={styles.tab} icon={<CheckroomIcon />} iconPosition="top" />
                <Tab label="Mobiles" className={styles.tab} icon={<PhoneIphoneIcon />} iconPosition="top" />
                <Tab label="Beauty" className={styles.tab} icon={<FaceIcon />} iconPosition="top" />
                <Tab label="Electronics" className={styles.tab} icon={<TvIcon />} iconPosition="top" />
                <Tab label="Home" className={styles.tab} icon={<ChairIcon />} iconPosition="top" />
                <Tab label="Appliances" className={styles.tab} icon={<KitchenIcon />} iconPosition="top" />
                <Tab label="Kids" className={styles.tab} icon={<ChildCareIcon />} iconPosition="top" />
                <Tab label="2 Wheeler" className={styles.tab} icon={<TwoWheelerIcon />} iconPosition="top" />
            </Tabs>
        </Box>
    );
}