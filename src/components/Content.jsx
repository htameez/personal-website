import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import birdGif from "../assets/bird.gif";

const Content = () => {
  const { scrollYProgress, scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState("down");
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  // Detect scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const direction = latest > prevScrollY ? "down" : "up";
    setScrollDirection(direction);
    setPrevScrollY(latest);
  });

  // Wait for user to scroll past threshold
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      setShowContent(progress > 0.8);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  // Bird movement only starts when content is active
  const birdProgress = useTransform(
    smoothProgress,
    [0.8, 1],
    showContent ? [0, 1] : [0, 0],
    { clamp: true }
  );
  const birdX = useTransform(birdProgress, [0, 1], ["-20vw", "120vw"], { clamp: true });

  // Set animation finished only when bird progresses far enough
  useEffect(() => {
    const unsubscribe = birdProgress.on("change", (progress) => {
      if (progress >= 0.9 && scrollDirection === "down") {
        setAnimationFinished(true);
      } else if (progress < 0.3 && scrollDirection === "up") {
        setAnimationFinished(false);
      }
    });
    return unsubscribe;
  }, [birdProgress, scrollDirection]);

  // Element transforms
  const titleY = useTransform(birdProgress, [0, 0.3], [100, 0], { clamp: true });
  const titleOpacity = useTransform(birdProgress, [0, 0.3], [0, 1], { clamp: true });

  const descriptionY = useTransform(birdProgress, [0.2, 0.5], [100, 0], { clamp: true });
  const descriptionOpacity = useTransform(birdProgress, [0.2, 0.5], [0, 1], { clamp: true });

  const buttonData = [
    { text: "PORTFOLIO", target: "portfolio" },
    { text: "BLOG", target: "blog" },
    { text: "ABOUT ME", target: "about" },
    { text: "CONTACT", target: "contact" },
  ];

  const buttonTransforms = buttonData.map((_, index) => {
    const start = 0.1 + index * 0.1;
    const end = 0.3 + index * 0.1;
    return {
      opacity: useTransform(birdProgress, [start, end], [0, 1], { clamp: true }),
      translateY: useTransform(birdProgress, [start, end], [50, 0], { clamp: true }),
    };
  });

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#b6b992",
        width: "100vw",
        height: "100vh",
        fontFamily: "DidotBoldItalic",
        overflow: animationFinished ? "auto" : "hidden",
        position: "relative",
      }}
    >
      {/* Flying Bird */}
      {showContent && (
        <motion.img
          src={birdGif}
          alt="Flying bird"
          style={{
            position: "fixed",
            top: "5vh",
            left: 0,
            width: "190px",
            height: "auto",
            zIndex: 999,
            translateX: birdX,
            scaleX: scrollDirection === "up" ? -1 : 1,
            transition: "scaleX 0.3s ease-in-out",
          }}
        />
      )}

      {/* Fixed Navigation Bar */}
      {showContent && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "0",
            right: "0",
            zIndex: 1000,
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            backgroundColor: "rgba(182, 185, 146, 0.9)",
            padding: "1rem 2rem",
            margin: "0 2rem",
            borderRadius: "50px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {buttonData.map((btn, index) => (
            <motion.div
              key={btn.text}
              style={{
                opacity: buttonTransforms[index].opacity,
                translateY: buttonTransforms[index].translateY,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CustomButton text={btn.text} onClick={() => handleScroll(btn.target)} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Intro Section */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "#b6b992",
        }}
      >
        {showContent && (
          <>
            <motion.h1
              style={{
                fontSize: "2.5rem",
                marginBottom: "1rem",
                color: "#454525",
                translateY: titleY,
                opacity: titleOpacity,
              }}
            >
              Welcome to My Site
            </motion.h1>

            <motion.p
              style={{
                maxWidth: "600px",
                marginBottom: "3rem",
                color: "#454525",
                fontSize: "1.1rem",
                lineHeight: "1.6",
                translateY: descriptionY,
                opacity: descriptionOpacity,
              }}
            >
              This is a single-page scroll-activated website. Use the navigation
              buttons below to explore different sections.
            </motion.p>
          </>
        )}
      </div>

      {/* Other Sections */}
      {["portfolio", "blog", "about", "contact"].map((id, i) => (
        <div
          key={id}
          id={id}
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: ["#a8ab7a", "#9a9d6c", "#c5ca91", "#b6b992"][i],
            color: "#454525",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              {buttonData[i].text}
            </h2>
            <p>
              {id === "portfolio"
                ? "Your amazing work goes here..."
                : id === "blog"
                  ? "Your thoughts and writings..."
                  : id === "about"
                    ? "Your story and background..."
                    : "Contact form or details here..."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Content;