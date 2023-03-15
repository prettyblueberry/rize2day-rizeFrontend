import { useEffect, useState, useCallback } from "react";
import AirdropArea from "./airdrop/index.jsx";
import axios from "axios";
// Demo data for the ranking page
import { config } from "../app/config.js";
import { useSigningClient } from "../app/cosmwasm.js";
import { Helmet } from "react-helmet";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Product = () => {
    const API_URL = config.API_URL;
    const [airdropInfo, setAirdropInfo] = useState([]);
    const [airdropData, setAirdropData] = useState([]);
    const { walletAddress }: any = useSigningClient();

    useEffect(() => {
        fetchAirdrop();
    }, []);

    useEffect(() => {
        if (walletAddress) {
            fetchUserAirdrop(walletAddress);
        }
    }, [walletAddress])

    const fetchAirdrop = async () => {
        try {
            const response = await axios.get(API_URL + "api/airdropinfo");
            setAirdropInfo(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchUserAirdrop = async (address: String) => {
        try {
            const response = await axios.get(API_URL + "api/airdrop/" + address);
            setAirdropData(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Helmet>
                <title>Airdrop || Rize2Day </title>
            </Helmet>
            <main id="main-content">
                <AirdropArea className="" data={{ airdrop: airdropInfo, userData: airdropData }} />
            </main>
        </>
    )
};

export default Product;
