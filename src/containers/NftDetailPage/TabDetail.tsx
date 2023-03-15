import {useState, useEffect} from "react";
import { Tab } from "@headlessui/react";
// import { personNames } from "contains/fakeData";
import Avatar from "shared/Avatar/Avatar";
import VerifyIcon from "components/VerifyIcon";
import { useNavigate } from "react-router-dom";
import { config } from "app/config";

const TabDetail = (props:any) => {

  const [consideringNFT, setConsideringNFT] = useState({});
  const [ownHistory, setOwnHistory] = useState([]);
  const [bids, setBids] = useState([]);
  const navigate = useNavigate();

  const TABS = ["Bid History", "Provenance", "Owner"];

  useEffect(() => {
    setConsideringNFT(props?.nft);
    
    setBids(props?.nft?.bids);
    setOwnHistory(props?.ownHistory || []);
  }, [props])

  const renderTabBidHistory = () => {
    return (
      <ul className="divide-y divide-neutral-100 dark:divide-neutral-700">
        {
          (bids as any)?.length>0 && (bids as any).map((item:any, index:number) => (
          <li
            key={index}
            className={`relative py-4 ${
              index % 2 === 1 ? "bg-neutradl-100" : ""
            }`}
          >
            <div className="flex items-center" onClick={() => navigate(`/page-author/${item?.user_id?._id || ""}`)}>
              <Avatar sizeClass="h-10 w-10" radius="rounded-full" 
                imgUrl={item?.user_id?.avatar? `${config.API_URL}uploads/${item.user_id.avatar}` : "" }
              />
              <span className="flex flex-col ml-4 text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center text-sm">
                  <span className="">
                    { `${item?.price || 0} 
                    RIZE by ` }
                  </span>
                  <span className="ml-1 font-medium text-neutral-900 dark:text-neutral-200">
                    {item?.user_id?.username || ""}
                  </span>
                </span>
                <span className="mt-1 text-xs">{item?.createdAt || ""}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderTabProvenance = () => {
    return (
      <ul className="divide-y divide-neutral-100 dark:divide-neutral-700">
        {
          (ownHistory as any)?.length>0 && (ownHistory as any).map((item:any, index:number) => (
          <li
            key={index}
            className={`relative py-4 ${
              index % 2 === 1 ? "bg-neutradl-100" : ""
            }`}
          >
            <div className="flex items-center" onClick={() => navigate(`/page-author/${item?.owner?._id || ""}`)} >
              <Avatar sizeClass="h-10 w-10" radius="rounded-full" 
                imgUrl={item?.owner?.avatar? `${config.API_URL}uploads/${item.owner.avatar}` : "" }
              />
              <span className="flex flex-col ml-4 text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center text-sm">
                  <span className="">
                    "Owned by"
                  </span>

                  <span className="ml-1 font-medium text-neutral-900 dark:text-neutral-200">
                    {item?.owner?.username || ""}
                  </span>
                </span>
                <span className="mt-1 text-xs">{item?.createdAt || ""}</span>
              </span>
            </div>

            <span className="absolute inset-0 rounded-md focus:z-10 focus:outline-none focus:ring-2 ring-blue-400"></span>
          </li>
        ))}
      </ul>
    );
  };

  const renderTabOwner = () => {
    return (
      <div className="flex items-center py-4" onClick={() => navigate(`/page-author/${(consideringNFT as any)?.owner?._id || ""}`)} >
        <Avatar sizeClass="h-11 w-11" radius="rounded-full" 
          imgUrl={(consideringNFT as any)?.owner?.avatar? `${config.API_URL}uploads/${(consideringNFT as any).owner.avatar}` : "" }
        />
        <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
          <span className="text-sm">Owner</span>
          <span className="flex items-center font-medium text-neutral-900 dark:text-neutral-200">
            <span>{(consideringNFT as any)?.owner?.username || ""}</span>
            <VerifyIcon iconClass="w-4 h-4" />
          </span>
        </span>
      </div>
    );
  };

  const renderTabItem = (item: string) => {
    switch (item) {
      case "Bid History":
        return renderTabBidHistory();

      case "Provenance":
        return renderTabProvenance();

      case "Owner":
        return renderTabOwner();

      default:
        return null;
    }
  };

  return (
    <div className="w-full pdx-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex justify-start pd-1 space-x-2.5 rounded-full bordedr border-neutral-300 dark:border-neutral-500">
          {TABS.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `px-3.5 sm:px-8 py-1.5 sm:py-2 text-xs sm:text-sm leading-5 font-medium rounded-full focus:outline-none focus:ring-2 ring-primary-300 ${
                  selected
                    ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                    : "text-neutral-700 dark:text-neutral-300 bg-neutral-100/70 dark:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {TABS.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={
                "rounded-xl focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 "
              }
            >
              {renderTabItem(tab)}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default TabDetail;
