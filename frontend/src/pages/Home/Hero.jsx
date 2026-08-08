import "./Hero.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config/api";
import { ArrowRight } from "lucide-react";
import {
  PiLeafLight,
  PiPlantLight,
  PiShieldCheckLight,
} from "react-icons/pi";

function Hero() {
  const [heroImage, setHeroImage] = useState("");
const [heroLoading, setHeroLoading] = useState(true);

useEffect(() => {
  const fetchHero = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/hero`);

      if (res.data?.success && res.data?.hero?.imageUrl) {
        setHeroImage(res.data.hero.imageUrl);
      }
    } catch (error) {
      console.error("Failed to load hero image:", error);
    } finally {
      setHeroLoading(false);
    }
  };

  fetchHero();
}, []);
const [heroImage, setHeroImage] = useState("");
const [heroLoading, setHeroLoading] = useState(true);

useEffect(() => {
  const fetchHero = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/hero`);

      if (res.data?.success && res.data?.hero?.imageUrl) {
        setHeroImage(res.data.hero.imageUrl);
      }
    } catch (error) {
      console.error("Failed to load hero image:", error);
    } finally {
      setHeroLoading(false);
    }
  };
  fetchHero();
}, []);

  return (
    <section
  className="hero"
  style={
    heroImage
      ? { backgroundImage: `url(${heroImage})` }
      : undefined
  }
>
      <div className="hero-overlay">

        {/* Top Badge */}
        <div className="hero-badge">
          <PiLeafLight />
          <span>100% NATURAL</span>
        </div>

        {/* Heading */}
        <h1 className="hero-title">
          Wholesome
          <br />
          Grains for a
          <br />
          Better Tomorrow
        </h1>

        {/* Description */}
        <p className="hero-description">
          Heritage wheat, stone-ground flour, and ancient grains — sourced directly from Indian farmers practicing regenerative agriculture.
        </p>

        {/* CTA */}
        <button className="hero-btn">
          Shop Now
          <ArrowRight />
        </button>

        {/* Features */}
        <div className="hero-features">

          <div className="feature">
            <div className="feature-icon">
              <PiLeafLight />
            </div>

            <div>
              <h4>100% Natural</h4>
              <p>No Preservatives</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <PiPlantLight />
            </div>

            <div>
              <h4>Sourced with</h4>
              <p>Care</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <PiShieldCheckLight />
            </div>

            <div>
              <h4>Quality</h4>
              <p>Assured</p>
            </div>
          </div>

        </div>

        {/* Slider Dots */}
        {/* <div className="hero-dots">
          <span className="active"></span>
          <span></span>
          <span></span>
        </div> */}

      </div>
    </section>
  );
}

export default Hero;