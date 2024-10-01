import { useEffect } from "react";

export function Carousel() {
  useEffect(() => {
    const carouselElement = document.querySelector("#carouselExample");
    const bootstrapCarousel = new window.bootstrap.Carousel(carouselElement, {
      interval: 3000,
      ride: "carousel",
    });
    return () => {
      bootstrapCarousel.pause();
    };
  }, []);

  return (
    <>
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://cdn.shopify.com/app-store/listing_images/50bb43331da42651a316f787225367a6/mobile_screenshot/CNikocylqYADEAE=.png?height=720&width=1280"
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://cdn.shopify.com/app-store/listing_images/9b6a520f896c507fa1a297fdad6041e1/desktop_screenshot/CMiJ6fH1qP0CEAE=.jpeg?height=900&quality=90&width=1600"
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://cdn.shopify.com/app-store/listing_images/ccd0c938e4f2ec4e88891f2ad934aba2/desktop_screenshot/COyFwry8voMDEAE=.png?height=720&width=1280"
              className="d-block w-100"
              alt="..."
            />
          </div>
        </div>
        {/* Previous and Next buttons */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <br />
      <div id="info-bar">
        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/128/4947/4947265.png"
            alt=""
          />
          <h6>Free Shipping & Return</h6>
          <p>Free Shipping on orders over 499</p>
        </div>
        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/128/9368/9368849.png"
            alt=""
          />
          <h6>Customer Support 24/7</h6>
          <p>Instent access to perfect support</p>
        </div>
        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/128/3760/3760135.png"
            alt=""
          />
          <h6>100% Secure Payment</h6>
          <p>We ensure secure payment</p>
        </div>
      </div>
      <br />
      <br />
    </>
  );
}
