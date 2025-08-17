import Slider from 'react-slick'
import { Ad } from '../Ad'
import { Flex, Image } from '@chakra-ui/react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import IsotipoImg from '@assets/isotipo.png'

type ArrowProps = {
  onClick?: () => void
}

function SampleNextArrow(props: ArrowProps) {
  const { onClick } = props

  return (
    <Flex
      maxW="24"
      align="center"
      justify="center"
      position="absolute"
      top="50%"
      right="-11"
      transform="translateY(-50%)"
      cursor="pointer"
      onClick={onClick}
      _hover={{
        color: 'brand.title',
        transition: 'color 0.3s ease',
      }}
    >
      <Image src={IsotipoImg} alt="Isotipo" w="6" />
      <FaChevronRight size={14} />
    </Flex>
  )
}

function SamplePrevArrow(props: ArrowProps) {
  const { onClick } = props

  return (
    <Flex
      maxW="24"
      align="center"
      justify="center"
      position="absolute"
      top="50%"
      left="-11"
      transform="translateY(-50%)"
      cursor="pointer"
      onClick={onClick}
      _hover={{
        color: 'brand.title',
        transition: 'color 0.3s ease',
      }}
    >
      <FaChevronLeft size={14} />
      <Image src={IsotipoImg} alt="Isotipo" w="6" />
    </Flex>
  )
}

export function ReactSlickCarousel() {
  const responsiveSettings = [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ]

  return (
    <div className="slider-container">
      <Slider
        className="center"
        infinite={true}
        centerPadding="60px"
        slidesToShow={3}
        swipeToSlide={true}
        slidesToScroll={3}
        speed={1000}
        autoplay={true}
        autoplaySpeed={8000}
        nextArrow={<SampleNextArrow />}
        prevArrow={<SamplePrevArrow />}
        responsive={responsiveSettings}
      >
        <Ad isFirst />
        <Ad />
        <Ad />
        <Ad isFirst />
        <Ad />
        <Ad />
      </Slider>
    </div>
  )
}
