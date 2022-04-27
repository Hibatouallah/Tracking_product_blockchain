pragma solidity >=0.4.0 <0.9.0;

contract ProductTracking {
        uint256 public _p_id =0;
        struct Product{
            uint256 uid;
            string name;
            uint256 stage;
            string timestamp;
            string temperature;
            string humidity;
        }

        mapping(uint => Product) products;
  
        function getpid()public view returns(uint256){
            return _p_id;
        }
        function addproduct(uint256 uid1, string memory name1,uint256 stage1,string memory timestamp1,
        string memory temperature1,string memory humidity1) public  returns (uint256 response){
            uint product_id = _p_id++;

            products[product_id].uid = uid1;
            products[product_id].name = name1;
            products[product_id].stage = stage1;
            products[product_id].timestamp = timestamp1;
            products[product_id].temperature = temperature1;
            products[product_id].humidity = humidity1;
            return  product_id;
        }

        function  getproduct(uint256 index) public view returns(uint256,string memory,uint256,string memory,string memory,string memory){
            uint256 uid;
            string memory name;
            uint256 stage;
            string memory timestamp;
            string memory temperature;
            string memory humidity;

            uid = products[index].uid;
            name = products[index].name;
            stage = products[index].stage;
            timestamp = products[index].timestamp;
            temperature = products[index].temperature;
            humidity = products[index].humidity;
            
            return(uid,name,stage,timestamp,temperature,humidity);
        }
        function searchproduct_increasing(uint256 uid1) public  returns(uint256,string memory,uint256,string memory,string memory,string memory){
            uint256 uid;
            string memory name;
            uint256 stage;
            string memory timestamp;
            string memory temperature;
            string memory humidity;

            for (uint i = 0; i <= _p_id; i ++){
                if(products[i].uid == uid1 ) {
                    uid = products[i].uid;
                    name = products[i].name;
                    stage = products[i].stage;
                    timestamp = products[i].timestamp;
                    temperature = products[i].temperature;
                    humidity = products[i].humidity;
                    //Increase the stage
                    products[i].stage =  products[i].stage + 1;
                }
            }
            return(uid,name,stage,timestamp,temperature,humidity);
        }
        function  searchproduct(uint256 uid1) public view returns(uint256,string memory,uint256,string memory,string memory,string memory){
            uint256 uid;
            string memory name;
            uint256 stage;
            string memory timestamp;
            string memory temperature;
            string memory humidity;

             for (uint i = 0; i <= _p_id; i ++){
                if(products[i].uid == uid1 ) {
                    uid = products[i].uid;
                    name = products[i].name;
                    stage = products[i].stage;
                    timestamp = products[i].timestamp;
                    temperature = products[i].temperature;
                    humidity = products[i].humidity;
                }
            }
            return(uid,name,stage,timestamp,temperature,humidity);
        }

}