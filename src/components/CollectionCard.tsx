import { nftsImgs } from "contains/fakeData";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import Avatar from "shared/Avatar/Avatar";
import NcImage from "shared/NcImage/NcImage";
import VerifyIcon from "./VerifyIcon";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import { changeConsideringCollectionId, CollectionData } from "app/reducers/collection.reducers";
import { config } from "app/config.js";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { RiEdit2Line, RiDeleteBin6Line } from "react-icons/ri";

export interface CollectionCardProps {
  className?: string;
  imgs?: string[];
  collection?: CollectionData;
  isEditable?: Boolean,
  onRemove?: Function
}

const CollectionCard: FC<CollectionCardProps> = ({
  className,
  imgs = [nftsImgs[9], nftsImgs[10], nftsImgs[11], nftsImgs[8]],
  collection,
  isEditable = true,
  onRemove
}) => {
  const dispatch = useAppDispatch();
  const currentUsr = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();

  const onSelectCollection = (id: string) => {
    if (id !== "" && id) {
      // go to the item list of this collection
      dispatch(changeConsideringCollectionId(id));
      localStorage.setItem("collectionId", id);
      navigate("/collectionItems/" + id);
    }
  }

  const handleEdit = (id: string) => {
    if (collection && currentUsr?._id === collection?.owner?._id) {
      navigate("/editCollection/" + id);
    }
  }

  const handleRemove = (id: any, number: any) => {
    if (collection && currentUsr?._id === collection?.owner?._id) {
      onRemove(id, number)
    }
  }

  return (
    <div className={`CollectionCard relative p-4 rounded-2xl overflow-hidden h-[410px] flex justify-center flex-col group cursor-pointer ${className}`}>
      <NcImage containerClassName="absolute inset-0" src={`${config.API_URL}uploads/${collection?.bannerURL || ""}` || ""} />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 group-hover:h-full to-transparent "></div>
      {(collection && currentUsr?._id === collection?.owner?._id) && isEditable &&
        < div className="edit-buttons absolute top-[20%] left-0 right-0 m-auto flex justify-center items-center gap-4 z-50">
          <IconButton className="!bg-[#0284c7] !w-[40px] !h-[40px]" onClick={() => handleEdit(collection?._id)}>
            <RiEdit2Line color="#fff" />
          </IconButton>
          <IconButton className="!bg-[#0284c7] !w-[40px] !h-[40px]" onClick={() => handleRemove(collection?._id, collection?.collectionNumber)}>
            <RiDeleteBin6Line color="#fff" />
          </IconButton>
        </div>
      }
      <div className="absolute top-0 bottom-0 left-0 right-0 m-auto" onClick={() => { onSelectCollection(collection?._id || "") }}></div>
      <div className="relative mt-auto mb-3">
        {isEditable && (
          <div className="flex items-center">
            <Avatar sizeClass="h-6 w-6" containerClassName="ring-2 ring-white" imgUrl={`${config.API_URL}uploads/${collection?.logoURL || ""}` || ""} userName={" "} />
            <div className="ml-2 text-white text-md">
              <span className="font-normal">by</span>
              {` `}
              <span className="font-medium">{collection?.owner?.username || ""}</span>
            </div>
            <VerifyIcon iconClass="w-4 h-4" />
          </div>
        )}
        <h2 className="font-semibold text-3xl mt-1.5 text-white">
          {collection?.name || ""}
        </h2>
        <div className="flex items-center">
          <div className="ml-2 text-lg text-white">
            <span className="font-normal">{collection?.items?.length || 0} items</span>
          </div>
        </div>
        {/* <div className="grid grid-cols-3 gap-4 mt-5">
          <NcImage
            containerClassName="w-full h-20 rounded-xl overflow-hidden"
            src={imgs[1]}
          />
          <NcImage
            containerClassName="w-full h-20 rounded-xl overflow-hidden"
            src={imgs[2]}
          />
          <NcImage
            containerClassName="w-full h-20 rounded-xl overflow-hidden"
            src={imgs[3]}
          />
        </div> */}
      </div>

    </div >
  );
};

export default CollectionCard;
