import React from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import combinedImage from "../assets/home-creatures.png";
import backgroundImage from "../assets/background.png";
import frameImage from "../assets/frame.png";
import Content from "./Content";
import { useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";

const Landing = () => {
    const [hasScrolledOnce, setHasScrolledOnce] = React.useState(false);

    const { scrollYProgress } = useScroll();
    const { scrollY } = useScroll();

    // Smooth out scroll motion
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        mass: 1,
    });

    // Animations tied to scroll progress
    const bgScale = useTransform(smoothProgress, [0, 0.5], [1, 8]);
    const bgBlurValue = useTransform(smoothProgress, [0.4, 0.6], [0, 20]);
    const bgFilter = useTransform(bgBlurValue, (val) => `blur(${val}px)`);
    const frameScale = useTransform(smoothProgress, [0, 0.5], [0.8, 5]);
    const greenOpacity = useTransform(smoothProgress, [0.6, 0.8], [0, 1]);

    const [isContentActive, setIsContentActive] = useState(false);

    // Track when content becomes active
    useEffect(() => {
        return greenOpacity.on("change", (value) => {
            setIsContentActive(value > 0.95);
        });
    }, [greenOpacity]);

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (y) => {
            if (y > 10 && !hasScrolledOnce) {
                setHasScrolledOnce(true);
            }
        });
        return () => unsubscribe();
    }, [scrollY, hasScrolledOnce]);

    return (
        <div style={{ height: "500vh", backgroundColor: "#000" }}> {/* Increased height for more scrolling */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    width: "100vw",
                    overflow: "hidden",
                }}
            >
                {/* Background Image */}
                <motion.img
                    src={backgroundImage}
                    alt="Background"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 0,
                        scale: bgScale,
                        filter: bgFilter,
                    }}
                />

                {/* Frame Image */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1,
                        pointerEvents: "none",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1,
                            pointerEvents: "none",
                        }}
                    >
                        <motion.div
                            style={{
                                scale: frameScale,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <img
                                src={frameImage}
                                alt="Frame"
                                style={{
                                    maxWidth: "90vw",
                                    maxHeight: "90vh",
                                    objectFit: "contain",
                                }}
                            />

                            <div
                                style={{
                                    marginTop: "-90px",
                                    textAlign: "center",
                                    lineHeight: "1.4",
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: "DidotBoldItalic",
                                        fontSize: "13px",
                                        color: "#454525",
                                    }}
                                >
                                    Welcome to
                                </div>
                                <div
                                    style={{
                                        fontFamily: "BirkaSemiBold",
                                        fontSize: "23px",
                                        color: "#454525",
                                    }}
                                >
                                    HAMNA TAMEEZ'S
                                </div>
                                <div
                                    style={{
                                        fontFamily: "DidotBoldItalic",
                                        fontSize: "13px",
                                        color: "#454525",
                                    }}
                                >
                                    Website
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Combined Image */}
                <div
                    style={{
                        position: "absolute",
                        top: "53%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 2,
                    }}
                >
                    <motion.img
                        src={combinedImage}
                        alt="Combined"
                        style={{
                            scale: frameScale,
                            width: "auto",
                            height: "auto",
                        }}
                    />
                </div>

                <AnimatePresence>
                    {!hasScrolledOnce && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6, y: [0, -5, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{
                                opacity: { duration: 1 },
                                y: {
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    ease: "easeInOut",
                                },
                            }}
                            style={{
                                position: "absolute",
                                bottom: "30px",
                                left: "46%",
                                transform: "translateX(-50%)",
                                color: "#ffffff",
                                fontSize: "1.2rem",
                                fontFamily: "DidotBoldItalic",
                                letterSpacing: "1px",
                                zIndex: 5,
                                pointerEvents: "none",
                            }}
                        >
                            Scroll down ↓
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content Screen */}
                <motion.div
                    style={{
                        position: "relative",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        opacity: greenOpacity,
                        zIndex: isContentActive ? 10 : 0,
                        pointerEvents: isContentActive ? "auto" : "none",
                        overflow: "hidden",
                    }}
                >
                    <Content />
                </motion.div>
            </div>
        </div>
    );
};

export default Landing;