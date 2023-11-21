import NavBar from "../components/Navbar";
import backgroundimageoflandingpage from "../assets/images/online-education-e-learning-open-book-with-laptop-line-connection-low-poly-wireframe-design-abstract-geometric-background-vector-illustration_42421-1166.avif";

const LandingPage = () => {
  return (
    <>
      <div>
        <NavBar />
        <div
          style={{
            backgroundImage: `url(${backgroundimageoflandingpage})`, 
            backgroundSize: "cover", 
            backgroundPosition: "center", 
            height: "100vh"
          }}
        >
          {/* Your content goes here */}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
