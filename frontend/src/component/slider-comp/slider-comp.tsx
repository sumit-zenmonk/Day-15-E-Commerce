import { Box } from "@mui/material";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider-comp.css"

export default function SliderComp() {
    const settings = {
        className: "center-slider",
        centerMode: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 600,
        autoplay: true,
        autoplaySpeed: 2500,
        pauseOnHover: true,
        arrows: false,
        dots: true,
        centerPadding: "0px",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    centerMode: false
                }
            }
        ]
    };

    return (
        <Slider {...settings} className='slider'>
            <Box className="slide-item">
                <Image src="/poster1.avif" width={100} height={100} alt="poster" />
            </Box>
            <Box className="slide-item">
                <Image src="/poster2.jpeg" width={100} height={100} alt="poster" />
            </Box>
            <Box className="slide-item">
                <Image src="/poster3.jpeg" width={100} height={100} alt="poster" />
            </Box>
            <Box className="slide-item">
                <Image src="/poster4.jpeg" width={100} height={100} alt="poster" />
            </Box>
            <Box className="slide-item">
                <Image src="/poster5.jpeg" width={100} height={100} alt="poster" />
            </Box>
        </Slider>
    )
}