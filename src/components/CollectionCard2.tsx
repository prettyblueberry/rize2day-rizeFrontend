import { nftsImgs, _getPersonNameRd } from "contains/fakeData";
import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "shared/Avatar/Avatar";
import NcImage from "shared/NcImage/NcImage";
import VerifyIcon from "./VerifyIcon";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import { changeConsideringCollectionId } from "app/reducers/collection.reducers";
import { config } from "app/config";

export interface CollectionCard2Props {
  className?: string;
  imgs?: string[];
  collection?: any;
}

const CollectionCard2: FC<CollectionCard2Props> = ({
  className,
  imgs = [nftsImgs[9], nftsImgs[10], nftsImgs[11], nftsImgs[8]],
  collection
}) => {  
  const dispatch = useAppDispatch();
  const currentUsr = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [data, setData] = useState();
  
  useEffect(() => {
    setData(collection);
  }, [collection]);

  const onSelectCollection = (id: string) =>
  {
    if(id !== "" && id)
    {
      // go to the item list of this collection
      dispatch(changeConsideringCollectionId(id));
      localStorage.setItem("collectionId", id);
      navigate("/collectionItems/"+id);
    }
  }
  
  return (
    <div className={`CollectionCard2 group relative cursor-pointer ${className}`}  onClick={() => {onSelectCollection((data as any)?._id || "")}} >
      <div className="relative flex flex-col overflow-hidden rounded-2xl">
        {
          ((data as any)?.collection_info?.bannerURL != undefined && (data as any)?.collection_info?.bannerURL != "") && 
          <NcImage containerClassName="aspect-w-8 aspect-h-5" src={ `${config.API_URL}uploads/${(data as any)?.collection_info?.bannerURL}`} />
        }
        <div className="grid grid-cols-3 gap-1.5 mt-1.5">
          {/* {
            (data as any).items_list 
            && (data as any).items_list.length>0 
            && (data as any).items_list.map((item:any, index:number) => (
              index >= 0 && index <= 2 && 
              <NcImage containerClassName="w-full h-28" src={`${BACKEND_URL}/uploads/${item?.logoURL || ""}` || imgs[1]} key={index} />
            ))
          } */}
        </div>
      </div>
      <div className="relative mt-5 ">
        {/* TITLE */}
        <h2 className="text-2xl font-semibold transition-colors group-hover:text-primary-500">
        {(data as any)?.collection_info.name || ""}
        </h2>
        {/* AUTHOR */}
        <div className="flex justify-between mt-2">
          <div className="flex items-center truncate">
            {
              ((data as any)?.creator_info.avatar  !== undefined && (data as any)?.creator_info.avatar !== "") ?
              <Avatar sizeClass="h-6 w-6" imgUrl={`${config.API_URL}uploads/${(data as any)?.creator_info.avatar || ""}` || ""} />
              :
              <Avatar sizeClass="h-6 w-6" />
            }
            <div className="ml-2 text-sm truncate">
              <span className="hidden font-normal sm:inline-block">
                Creator
              </span>
              {` `}
              <span className="font-medium">{(data as any)?.creator_info.username || ""}</span>
            </div>
            <VerifyIcon iconClass="w-4 h-4" />
          </div>
          <span className="mb-0.5 ml-2 inline-flex justify-center items-center px-2 py-1.5 border-2 border-secondary-500 text-secondary-500 rounded-md text-xs !leading-none font-medium">
           {(data as any)?.collection_info.items?.length || 0} items
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard2;
