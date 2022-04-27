import React, {Component,useRef} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import {Container,Row,Button,Col,Table} from "react-bootstrap";

class Home extends Component {
  state = {
    web3: null,
    accounts: null,
    chainid: null,
    ProductTracking : null,
    nbprojet:0,
    listproducts:[],
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
      const ProductTracking = await this.loadContract("dev", "ProductTracking")
      var nb = await ProductTracking.methods.getpid().call()      
      var n = 0
        for (var j = 0; j<nb; j++){
            const listc = await ProductTracking.methods.getproduct(j).call()
            this.setState({
              listproducts:[...this.state.listproducts,listc] 
            })
          }
            
}

loadInitialContracts = async () => {
  if (this.state.chainid <= 42) {
      // Wrong Network!
      return
  }
  const ProductTracking = await this.loadContract("dev", "ProductTracking")

  if (!ProductTracking) {
      return
  }
  this.setState({
    ProductTracking
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

    render() { 
    
        return ( 
            <>
        <br/>
            <h3 class ='h3style'>List of Products </h3>
            <br/>
            
            <Table responsive >
                <thead class="thead-dark">
                    <tr>
                    <th>Uid</th>
                    <th>Name</th>
                    <th>Stage</th>
                    <th>Timestamp</th>
                    <th>Temperature</th>
                    <th>Humidity</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.listproducts.map((list) =>
                    <tr>
                        <td>{list[0]}</td>
                        <td>{list[1]}</td>
                        <td>{list[2]}</td>
                        <td>{list[3]}</td>
                        <td>{list[4]}</td>
                        <td>{list[5]}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            <br/><br/><br/><br/>
           </>
       )
    }
}

export default Home
