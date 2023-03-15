import { useEffect, useState } from "react";
import styled from 'styled-components';
import Switch from '@mui/material/Switch';
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { config } from "app/config.js";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";
// import Web3 from 'web3';
import { useAppDispatch, useAppSelector } from "app/hooks";

import { io } from 'socket.io-client';
import { selectCurrentChainId, selectCurrentUser } from "app/reducers/auth.reducers";

var socket = io(`${config.socketUrl}`);

const pinkAbi = '';//platformContractAbi;

const Styles = styled.div`
  padding: 100px 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  div {

      display:flex;
      justify-content: center;
  }

  table {
    margin-top: 20px;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      text-align:center;
      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`
// const web3 = new Web3(Web3.givenProvider);

const Admin = () => {
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(1);
    const [itemsByPage, setItemsByPage] = useState(10);
    const [itemList, setItemList] = useState([]);
    const [searchType, setSearchType] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [account, setAccount] = useState();
    const currentChainId = useAppSelector(selectCurrentChainId);    

    const handleChange = (event, value) => {
        setPage(value);
    };

    const getUserList = async () => {
        var data = await axios.post(`${config.API_URL}api/admin/get_users`,
            { page: page, itemsByPage: itemsByPage, keyword: keyword, searchType: searchType });
        setItemList(data.data.data);
        setCount(Math.ceil(data.data.count / itemsByPage));
    };

    const changeStatus = async (event, index) => {
        var item = itemList[index];
        var status = 0;
        if (item.verified) {
            status = 0;
        } else {
            status = 2;
        }
        socket.emit("UpdateStatus", {type: "UPDATE_USER_AUTH"});
        // const contract = new web3.eth.Contract(pinkAbi, chains[currentChainId || 1]?.platformContractAddress || "");
        // contract.methods.setAuthentication(item.address, status).send({ from: account }).then(() => {
        //     axios.post(`${config.API_URL}api/admin/update_user_info`, { _id: item._id, verified: !item.verified }).then(() => {
        //         getUserList();
        //     }).catch(() => {

        //     });
        // }).catch(() => {

        // });
    }

    const initRoyalty = async () => {
        var RoyaltyInfo = {
            totalAmount: 10000,
            sellerAmount: 9000,
            artistAmount: 700,
            radioTeamAmount: 200,
            radioTeamAddress: "0xbE100aC8C99A46Cc833CB88300b70A01571ef7Ac",
            devTeamAmount: 100,
            devTeamAddress: "0x8E4BCCA94eE9ED539D9f1e033d9c949B8D7de6C6",
        }
        // const contract = new web3.eth.Contract(pinkAbi, chains[currentChainId || 1]?.platformContractAddress || "");
        // await contract.methods.setRoyalty(RoyaltyInfo).send({ from: account }).then(() => {
        //     alert("init contract successfully");
        // }).catch((err) => {
        //     alert(err);
        // })
    };

    const connectWallet = async () => {
        await window.ethereum.enable();
        // web3.eth.getAccounts((err, accounts) => {
        //     console.log("account: ", accounts[0]);
        //     setAccount(accounts[0]);
        // });
        // window.ethereum.on('accountsChanged', function (accounts) {
        //     setAccount(accounts[0]);
        // });
    }

    useEffect(() => {
        getUserList();
        setItemsByPage(10);
    }, [page])

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "40px", paddingRight: "40px", paddingTop: "30px" }}>
                <Button variant="outlined" onClick={initRoyalty}>
                    Init Royalty
                </Button>
                <Button variant="outlined" onClick={connectWallet}>
                    {
                        account ? account.slice(0, 8) + "..." + account.slice(34) : "Connect Wallet"
                    }
                </Button>
            </div>
            <Styles>
                <div>
                    <Box sx={{ minWidth: 200 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Search Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={searchType}
                                label="Search Type"
                                onChange={(event) => { setSearchType(event.target.value) }}
                            >
                                <MenuItem value={0}>Username</MenuItem>
                                <MenuItem value={1}>Wallet Address</MenuItem>
                                <MenuItem value={2}>Social</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <TextField id="outlined-basic" label="Input" variant="outlined" sx={{ minWidth: 300 }} onChange={(event) => { setKeyword(event.target.value); getUserList(); }} />
                    <Button variant="outlined" onClick={getUserList}>SEARCH</Button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Username</th>
                            <th>Wallet Address</th>
                            <th>Social</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (itemList && itemList.length > 0) &&
                            itemList.map((row, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{(page - 1) * itemsByPage + index + 1}</td>
                                        <td>{row.username}</td>
                                        <td>{row.address}</td>
                                        <td>{row.socials}</td>
                                        <td><Switch checked={row.verified} onChange={(event) => { changeStatus(event, index) }} /></td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
                <Stack spacing={2}>
                    <Pagination count={count} page={page} onChange={handleChange} />
                </Stack>
            </Styles>
        </>

    );

}

export default Admin;
