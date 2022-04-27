import Routes from "./Routes";
import { Link, withRouter } from "react-router-dom";
import {Image} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';
import React, { Component, Fragment} from "react";
import {getWeb3} from "./getWeb3"
import {getEthereum} from "./getEthereum"
import notification from './img/notification.png'
import map from "./artifacts/deployments/map.json"
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";

class App extends Component {
    
    state = {
        isAuthenticated: false,
        isAuthenticating: true,
        web3: null,
        accounts: null,
        ProductTracking : null,
        chainid: null,
        nouser : true,
  
    };
    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: true });
    }
    
    loadContract = async (chain, contractName) => {
      // Load a deployed contract instance into a web3 contract object
      const {web3} = this.state

      // Get the address of the most recent deployment from the deployment map
      let address
      try {
          address = map[chain][contractName][0]
      } catch (e) {
          console.log(`Couldn't find any deployed contract "${contractName}" on the chain "${chain}".`)
          return undefined
      }

      // Load the artifact with the specified address
      let contractArtifact
      try {
          contractArtifact = await import(`./artifacts/deployments/${chain}/${address}.json`)
      } catch (e) {
          console.log(`Failed to load contract artifact "./artifacts/deployments/${chain}/${address}.json"`)
          return undefined
      }

      return new web3.eth.Contract(contractArtifact.abi, address)
  } 
    componentDidMount = async () => {

        // Get network provider and web3 instance.
        const web3 = await getWeb3()

        // Try and enable accounts (connect metamask)
        try {
            const ethereum = await getEthereum()
            ethereum.enable()
        } catch (e) {
            console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`)
            console.log(e)
        }

        // Use web3 to get the user's accounts
        const accounts = await web3.eth.getAccounts()

        // Get the current chain id
        const chainid = parseInt(await web3.eth.getChainId())
     
        this.setState({
            web3,
            accounts,
            chainid
        }, await this.loadInitialContracts)
        this.setState({ isAuthenticating: false });
        const ProductTracking = await this.loadContract("dev", "ProductTracking")
       
    }

    render() {
        const REACT_VERSION = React.version;

        const childProps = {
            isAuthenticatedPromo: this.state.isAuthenticatedPromo,
            userHasAuthenticated: this.userHasAuthenticated
          };

        return (
            !this.state.isAuthenticating &&
    <>
        <Nav>
        <NavLink to='/'>
          <h2>TrackingProduct</h2>
        </NavLink>
        <Bars />
        <NavMenu>
           
           <Fragment>
                <NavLink to='/Addproduct' activeStyle>
                 Add product
                </NavLink>
                <NavLink to='/Searchproduct' activeStyle>
                 Search Product
                </NavLink> 
          </Fragment>
          
           
        </NavMenu>
      </Nav>
      <Routes childProps={childProps} />
    
    </>
  );
    }
}

export default withRouter(App);