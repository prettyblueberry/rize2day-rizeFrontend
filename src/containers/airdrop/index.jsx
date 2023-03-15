import { useState, useEffect } from "react";
import clsx from "clsx";
import Button from "components/Button";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { config } from "app/config.js";
import { networks } from "networks/networks";
import { isEmpty, getShortAddress, numberWithCommas } from "app/methods.js";
import { useSigningClient } from "app/cosmwasm.js";

const AirdropArea = ({ className, data }) => {
  const [list, setList] = useState([]);
  const [details, setDetails] = useState([]);
  const [selectedID, setSelectedID] = useState(-1);
  const { loadClient, connectWallet, disconnect, walletAddress } = useSigningClient();

  const API_URL = config.API_URL;
  useEffect(() => {
    setList(data.airdrop)
    setDetails(data.userData)
  }, [data]);

  const loadWeb3 = async (chain_config) => {
    await loadClient(chain_config.rpc);
    await connectWallet(chain_config);
  }

  const handleDisconnect = async () => {
    await disconnect();
    setSelectedID(-1);
  }

  const handleConnect = async (chain, id) => {
    const chainConfig = {
      chainId: chain.chain_id,
      chainName: chain.chain_name,
      rpc: chain.rpc[0],
      rest: chain.api[0],
      stakeCurrency: {
        coinDenom: chain.assets[0].symbol,
        coinMinimalDenom: chain.assets[0].base,
        coinDecimals: chain.assets[0].exponent,
        coinGeckoId: chain.assets[0].coingecko_id
      },
      bip44: {
        coinType: chain.coin_type,
      },
      bech32Config: {
        bech32PrefixAccAddr: `${chain.addr_prefix}`,
        bech32PrefixAccPub: `${chain.addr_prefix}pub`,
        bech32PrefixValAddr: `${chain.addr_prefix}valoper`,
        bech32PrefixValPub: `${chain.addr_prefix}valoperpub`,
        bech32PrefixConsAddr: `${chain.addr_prefix}valcons`,
        bech32PrefixConsPub: `${chain.addr_prefix}valconspub`,
      },
      currencies: [
        {
          coinDenom: chain.assets[0].symbol,
          coinMinimalDenom: chain.assets[0].base,
          coinDecimals: chain.assets[0].exponent,
          coinGeckoId: chain.assets[0].coingecko_id
        },
      ],
      feeCurrencies: [
        {
          coinDenom: chain.assets[0].symbol,
          coinMinimalDenom: chain.assets[0].base,
          coinDecimals: chain.assets[0].exponent,
          coinGeckoId: chain.assets[0].coingecko_id,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03,
          },
        },
      ],
      coinType: chain.coin_type,
    }
    try {
      await handleDisconnect();
      await loadWeb3(chainConfig);
      setSelectedID(id);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div
      className={clsx(
        "rn-upcoming-area",
        "rn-section-gapTop",
        className
      )}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="table-title-area d-flex">
              <i className="feather-briefcase" />
              <h3>Airdrop</h3>
            </div>
          </div>
          <div className="col-lg-4 mb--20">
            <div className="table-descrition box-table">
              <div className="table-box mb--20">
                <h4 className="mb--10">Airdrop Available</h4>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="d-flex flex-column">
                      <span>Total Available</span>
                      <span className="airdrop-value">150 million</span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="d-flex flex-column">
                      <span>Total claimed</span>
                      <span className="airdrop-value">0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-box">
                <h4 className="mb--10">Airdrop</h4>
                <div className="row">
                  {list.length > 0 && list?.map((item, index) => (
                    <div className="col-lg-6 col-md-4 col-sm-6" key={index}>
                      <div className="airdrop-box">
                        <span>{item.description}</span>
                        <span className="airdrop-value">{numberWithCommas(item.value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="box-table table-responsive">
              <table className="table upcoming-projects airdrop-projects">
                <thead>
                  <tr>
                    <th>
                      <span>CHAIN</span>
                    </th>
                    <th>
                      <span>ELIGIBILITY</span>
                    </th>
                    <th>

                    </th>
                    <th>
                      <span>Amount</span>
                    </th>
                    <th>
                      <span>ELIGIBLE</span>
                    </th>
                    <th>
                      <span>CLAIMED</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="ranking">
                  {list.length > 0 && list?.map((item, index) => {
                    const detail = details?.filter(detail => detail.typeId === item.id);
                    return (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? "color-light"
                            : ""
                        }
                      >
                        <td>
                          <div className="product-wrapper d-flex align-items-center">
                            <div className="airdrop-image">
                              { item?.src_light ? (
                                <img
                                  src={
                                    API_URL + 'photo/' + item.src_light
                                  }
                                  alt="Nft_Profile"
                                  width={56}
                                  height={56}
                                  layout="fixed"
                                />
                              ) : (
                                <img
                                  src={
                                    API_URL + 'photo/' + item?.src
                                  }
                                  alt="Nft_Profile"
                                  width={56}
                                  height={56}
                                  layout="fixed"
                                />
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span>{item.name}</span>
                        </td>
                        <td className="text-center">
                          {item.chain && !isEmpty(networks[item.chain]) ? (
                            selectedID === item.id ?
                            <Button className="airdrop_connected" onClick={() => handleDisconnect()}>{getShortAddress(walletAddress)}</Button>
                            : 
                            <Button className="airdrop_connect" onClick={() => handleConnect(networks[item.chain], item.id)}>Connect</Button>
                          ) : (
                            <Button className="airdrop_connect" disabled>Connect</Button>
                          )}
                        </td>
                        <td className="text-center">
                          <span>{detail.length > 0 ? detail[0].amount : 0}</span>
                        </td>
                        <td className="text-center">
                          <span
                            className={
                              detail.length > 0 ? "color-green" : "color-danger"
                            }
                          >
                            {
                              detail.length > 0 ? <AiOutlineCheck /> : <AiOutlineClose />
                            }
                          </span>
                        </td>
                        <td className="text-center">
                          <span
                            className={
                              detail.length > 0 && detail[0].isClaimed ? "color-green" : "color-danger"
                            }
                          >
                            {
                              detail.length > 0 && detail[0].isClaimed ? <AiOutlineCheck /> : <AiOutlineClose />
                            }
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt--20 text-center">
              <Button>Claim All</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirdropArea;
