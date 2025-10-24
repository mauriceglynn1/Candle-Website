import user_img from "../assets/user.png"
import cart_img from "../assets/shopping-cart.png"
import "../styles/Header.css"

export function Header(){


    return(
        <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <div className="nav">
            <div className="upper-nav"> 
                <h1> Candle Website </h1>
                <img src= {user_img} alt="User"></img>
                <img src= {cart_img} alt="User"></img>
                
            </div>
            <nav>
                <ul>
                    <li> About </li>
                    <li> Home </li>
                    <li> Categories </li>
                    <li> Credits </li>
                </ul>
            </nav>
        </div>
        </>
        
    );
}