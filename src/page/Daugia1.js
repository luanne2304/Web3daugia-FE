import Web3 from "web3";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract} from "../utils/load-contracts"
import { Winner } from  "../cpn/Winner"
import socket from "../utils/socket"

const Daugia = () => {

  const[web3Api, setWeb3Api]= useState({
    provider: null,
    web3:null,
    contract:null,
  })

  const [account,setAccount]= useState(null)
  const [balance,setBalance]= useState(null)
  const [highestBid,sethighestBid]=useState(null)
  const [winner,setwinner]=useState("")

  socket.on('update-highestbid',(data)=>{
    sethighestBid(Web3.utils.fromWei(data.bid.toString(), "ether"))
  })



  const loadBalance = async () => {
    const { contract, web3 } = web3Api
    const balance = await web3.eth.getBalance(account)
    setBalance(web3.utils.fromWei(balance, "ether"))

  } 

  async function IsMeta (){
    const checkMeta =await detectEthereumProvider();
    if(checkMeta!= null)
    {
      web3Api.provider.request({method:"eth_requestAccounts"})
    }
    else {
      alert("Vui lòng thêm extension Metamask")
    }
  }
  
  window.ethereum.on('accountsChanged', function (accounts) {
    window.location.reload();
  }
  );

  async function daugia(){
    const Value = document.getElementsByName("amount")[0].value;
    const From =account;
    if (Value.trim() === "") {
      alert("Vui lòng nhập thông tin đầy đủ");
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/daugia', {From,Value});
        alert("Thành công");
    } catch (error) {
        alert("Thất bại");
    }
  }

  async function rutve(){
    const From =account;
    try {
      const response = await axios.post('http://localhost:4000/rutve', {From});
        alert("Thành công");
    } catch (error) {
        alert("Thất bại");
    }

  }

  async function test(){
    try {
      const response = await axios.get('http://localhost:4000/highestbid');
      sethighestBid(web3Api.web3.utils.fromWei(response.data, "ether"));

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function showWinner(){
      try {
        const response = await axios.get('http://localhost:4000/getWinner');
        if(response.data.end)
        {
          setwinner({address:response.data.highestBidder ,amount:Web3.utils.fromWei(response.data.highestbid, "ether")});
        }
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  

  useEffect(()=>{
    const loadProvider=async ()=> {
      const provider=await detectEthereumProvider();
      const contract = await loadContract("Daugiacontract",provider);
      
      if(provider){

        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract: contract
        })
      }
      else{
        console.error("pls, i Metamask")
      }
    }
    loadProvider()
    const fetch=async ()=> {
      try {
        const response = await axios.get('http://localhost:4000/highestbid');
        sethighestBid(Web3.utils.fromWei(response.data, "ether"));
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
     fetch();
  },[])

  useEffect(()=>{
    const getAccount = async ()=>{
      
      const accounts= await web3Api.web3.eth.getAccounts() 
      setAccount(accounts[0])
      
    }
    web3Api.web3 && getAccount() 
  },[web3Api.web3]);

  useEffect(() => {
    if(account != null){
      web3Api.contract && loadBalance()
    }
  }, [account]);




  return (
<div>
      <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
        <div className='d-inline-block '>
          <h3 className='m-2'>
            Giá cao nhất: 
            <strong>{highestBid?highestBid: "Nan"}</strong>
          </h3> 
          <div class="input-group mb-3 input-group-sm">
            <span class="input-group-text">Số lượng</span>
            <input type="text" name='amount' class="form-control"></input>
          </div>
          <button onClick={daugia} type="button" class="m-2 btn btn-info">Đấu giá</button>  
          
          <button onClick={test} type="button" class="m-2 btn btn-info">Test</button> 
          <button onClick={rutve} type="button" class="m-2 btn btn-info">Rút</button>
          <button onClick={showWinner} type="button" class="m-2 btn btn-danger" data-bs-toggle="modal" data-bs-target="#myModal">Xem kết quả</button>
          <button onClick={IsMeta} type="button" class="m-2 btn btn-dark">Kết lối</button>  
          <span className='d-block '>Address: <strong> {account?account: "Nan"}</strong></span>  
          <span className='d-block '>Ví: <strong>{balance?balance: "0"}</strong></span>  
        </div>
      </div>

      <div class="modal" id="myModal" >
        <div class="modal-dialog" style={{maxWidth: '700px'}} >
          <div class="modal-content">


            <div class="modal-header">
              <h4 class="modal-title">Người thắng cuộc</h4>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>


            <div class="modal-body">
              <table variant="simple">
                <thead>
                </thead>
                <tbody>
                    <Winner  item={winner} />
                </tbody>
              </table>
            </div>


            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Daugia;