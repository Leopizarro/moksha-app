"use client";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import { ProductInterface } from "@/app/interfaces/products.interface";
import classes from "./SoldProductList.module.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface ImageSliderInterface {
  items: ProductInterface[];
}

const SCROLL_DISTANCE_PER_CLICK: number = 430;
const MOBILE_MAX_WIDTH: number = 415;

export default function ImageSlider({ items }: ImageSliderInterface) {
  const theme = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down(MOBILE_MAX_WIDTH));

  const handleScroll = (scrollOffset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  return (
    <Box position={"relative"}>
      {!isMobile && (
        <IconButton
          onClick={() => handleScroll(-SCROLL_DISTANCE_PER_CLICK)}
          size="small"
          sx={{
            position: "absolute",
            background: "white",
            top: "40%",
            zIndex: 100,
            marginLeft: "10px",
            "&:hover": {
              backgroundColor: "white",
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}
      <Box
        ref={scrollRef}
        sx={{
          position: "relative",
          maxWidth: "100%", // Limit container width
          margin: "0px auto", // Center the container itself
          overflowX: "auto", // Allow horizontal scrolling
          display: "flex",
          justifyContent: "flex-start", // Align items to the start
          gap: 2, // Space between images
          padding: "10px 6px",
          whiteSpace: "nowrap", // Prevent images from wrapping
          scrollBehavior: "smooth",
        }}
      >
        {items.map((item) => (
          <Box
            key={item.title}
            ref={scrollRef}
            className={classes["image-container"]}
            width={200}
            height={200}
          >
            <Link href={`/product/${item.id}`}>
              <Image
                alt="test"
                src={item.thumbnailImageUrl}
                height={200}
                width={200}
                draggable={false}
                className={classes.grow}
                style={{
                  borderRadius: "10px",
                  cursor: "pointer",
                  objectFit: "cover",
                }}
              />
            </Link>
          </Box>
        ))}
      </Box>
      {!isMobile && (
        <IconButton
          onClick={() => handleScroll(SCROLL_DISTANCE_PER_CLICK)}
          size="small"
          sx={{
            position: "absolute",
            right: 0,
            top: "40%",
            background: "white",
            marginRight: "5px",
            "&:hover": {
              backgroundColor: "white",
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
}
