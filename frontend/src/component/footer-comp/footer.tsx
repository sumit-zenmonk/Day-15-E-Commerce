"use client"

import Image from "next/image"
import { Box, Typography, Stack, Link } from "@mui/material"
import styles from "./footer.module.css"

export default function FooterComp() {
    return (
        <Box component="footer" className={styles.footerMain}>

            <Box className={styles.footerTop}>

                <Box className={styles.footerColumn}>
                    <Typography className={styles.footerTitle}>BROWSE MUSIC</Typography>

                    <Stack>
                        <Link href="#" underline="none" className={styles.footerLink}>Trending Songs</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>New Releases</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>Top Albums</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>Artists</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>Podcasts</Link>
                    </Stack>
                </Box>

                <Box className={styles.footerColumn}>
                    <Typography className={styles.footerTitle}>USER SUPPORT</Typography>

                    <Stack>
                        <Link href="#" underline="none" className={styles.footerLink}>Contact Us</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>Help Center</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>Subscription</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>Payment</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>Privacy Policy</Link>
                    </Stack>
                </Box>

                <Box className={styles.footerColumn}>
                    <Typography className={styles.footerTitle}>GET THE APP</Typography>

                    <Stack direction="row" className={styles.storeBox}>
                        <Image
                            src="/app_store.png"
                            width={140}
                            height={40}
                            alt="App Store"
                        />

                        <Image
                            src="/play_store.png"
                            width={140}
                            height={40}
                            alt="Play Store"
                        />
                    </Stack>
                </Box>

                <Box className={styles.footerColumn}>
                    <Typography className={styles.footerTitle}>COMPANY</Typography>
                    <Stack>
                        <Link href="#" underline="none" className={styles.footerLink}>About Us</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>Careers</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>Blog</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>Developers</Link>
                        <Link href="#" underline="none" className={styles.footerLink}>Press</Link>
                    </Stack>
                </Box>

            </Box>


            <Box className={styles.footerBottom}>
                <Typography className={styles.footerText}>
                    Need help? <b>Contact Support</b>
                </Typography>

                <Typography className={styles.footerText}>
                    © 2026 MusicWave. All rights reserved.
                </Typography>

                <Typography className={styles.footerText}>
                    Made for music lovers
                </Typography>
            </Box>

        </Box>
    )
}