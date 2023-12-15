import NavBar from "../components/Navbar";
import backgroundimageoflandingpage from "../assets/images/1136394.jpg";

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
        </div>
      </div>
    </>
  );
};

export default LandingPage;
