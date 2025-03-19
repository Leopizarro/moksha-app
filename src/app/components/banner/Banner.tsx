import { Box, Typography } from "@mui/material";
import Image from "next/image";
import bannerImage from "../../../../public/moksha-banner.jpg";
import styles from "./banner.module.css";

const Banner: React.FC = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "280px", md: "370px" },
        textAlign: "center",
        borderTop: "1px solid grey",
        borderBottom: "1px solid grey",
        minWidth: "320px",
      }}
      className={styles.glowingBoxBottom}
    >
      <Image
        alt="static-banner-background"
        src={bannerImage}
        fill
        priority
        placeholder="blur"
        sizes="(min-width: 808px) 100vw, 100vw"
        style={{
          objectFit: "cover", // cover, contain, none
          zIndex: -1,
        }}
      />
      <Typography
        sx={{
          position: "relative",
          top: { xs: "30%", lg: "26%" },
          fontSize: { xs: "2.1rem", sm: "2.3rem", md: "3.2rem", lg: "4rem" },
        }}
        className={styles.glowingTextBlack}
        component="h1"
      >
        {process.env.NEXT_PUBLIC_STORE_NAME}
      </Typography>
      <Typography
        sx={{
          position: "relative",
          top: { xs: "30%", lg: "26%" },
          fontSize: { xs: "1.3rem", sm: "1.4rem", md: "1.8rem", lg: "2.2rem" },
        }}
        className={styles.glowingTextBlack}
        component="h2"
      >
        creando objetos únicos 100% a mano
      </Typography>
    </Box>
  );
};

export default Banner;
