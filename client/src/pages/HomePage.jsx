import Banner from "../components/Banner"
import Footer from "../components/Footer"
import Items from "../components/items"
import Navbar from "../components/Navbar"
import Products from "../components/Products"

function HomePage(){
    return(
        <>
            <Navbar />
            <Banner />
            <Products />
            <Items />
            <Footer />

        </>
    )
}
export default HomePage