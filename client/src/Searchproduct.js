import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  FormLabel,
  Col,
  Form
} from "react-bootstrap";
import LoaderButton from "./containers/LoaderButton";
import "./containers/Signup.css";
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"


class Searchproduct extends Component {
   
   state = {
      web3: null,
      accounts: null,
      chainid: null,
      ProductTracking:null,
      uid:0,
      name:"",
      stage:0,
      humidity:"",
      timestamp:"",
      temperature:""
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

    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const productTracking = await this.loadContract("dev", "ProductTracking")

        if (!productTracking) {
            return
        }
        this.setState({
            productTracking
        })
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

    search = async (e) => {
        const {accounts,productTracking,uid} = this.state
        e.preventDefault()
        var _uid = uid
        var nb = await productTracking.methods.getpid().call()  
        console.log(nb)
        var result = await productTracking.methods.searchproduct_increasing(_uid).send({from: accounts[0]})
        //this.props.history.push("/resultsearch");
        const listc = await productTracking.methods.searchproduct(_uid).call()
       console.log(listc)
        alert("UID: "+listc[0]+" | Name : "+listc[1]+" | Stage : "+listc[2]+" | Humidity : "+listc[3]+" | Timestamp : "+listc[4]+" |temperature: "+listc[5])
        
    }
 
    render() {

      const {
        web3, accounts, chainid,productTracking
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }
        if (!productTracking) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false
      return (
        <div className="container">
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
          <div className="container">
            <form enctype ="multipart/form-data" onSubmit={(e) => this.search(e)}>
            <h3>Search product:</h3>
            <FormGroup as={Col} controlId="titre" bsSize="large">
              <FormLabel>Uid</FormLabel>
              <FormControl
                value={this.state.uid}
                onChange={(e) => this.setState({uid: e.target.value})}
                type="number"
              />
            </FormGroup>
              <LoaderButton
              block
              bsSize="large"
              type="submit"
              isLoading={this.state.isLoading}
              text="Add"
              className ="classbtn"
              />
              <br/>
              </form>
          </div>
        </div>);
    }
}

export default Searchproduct
