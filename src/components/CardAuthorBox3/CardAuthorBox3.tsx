import React, { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "shared/Avatar/Avatar";
import NcImage from "shared/NcImage/NcImage";
import { nftsAbstracts, personNames } from "contains/fakeData";
import VerifyIcon from "components/VerifyIcon";
import FollowButton from "components/FollowButton";
import { useAppSelector, useAppDispatch } from "app/hooks";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import { useParams } from "react-router-dom";
import { isEditable } from "@testing-library/user-event/dist/types/utils";
import { isEmpty } from "app/methods";
import { config } from "app/config";

export interface CardAuthorBox3Props {
  className?: string;
  following?: boolean;
  item?: any;
  showingCardForPupularUsers?: boolean,
  effect?: any;
  onUpdate?: () => void;
  onUnfollow?: (id: string) => void;
}

const CardAuthorBox3: FC<CardAuthorBox3Props> = ({
  className = "",
  following,
  item,
  showingCardForPupularUsers = false,
  effect,
  onUpdate,
  onUnfollow
}) => {
  const [consideringUser, setConsideringUser] = useState({});
  const currentUsr = useAppSelector(selectCurrentUser);  //user_id in making follow
  const { userId } = useParams();  //taget_id in making follow
  const navigate = useNavigate();

  const onFollow = (targetId: string) => {
    if (isEmpty(targetId)) return;
    if (onUnfollow) onUnfollow(targetId)
    setTimeout(() => {
      if (onUpdate) onUpdate();
      setTimeout(() => {
        if (onUpdate) onUpdate();
      }, 1000)
    }, 1000)
  }

  useEffect(() => {
    setConsideringUser(item);
  }, [item])

  return (

    <>
      {
        isEmpty(consideringUser) === false ?
          <div
            className={`nc-CardAuthorBox3 relative flex flex-col p-4 overflow-hidden cursor-pointer [ nc-box-has-hover ] [ nc-dark-box-bg-has-hover ] ${className}`}
            data-nc-id="CardAuthorBox3"
            onClick={() => { showingCardForPupularUsers === true && navigate(`/page-author/${(consideringUser as any)?._id || "1"}`) }}
          >
            <div className="relative flex flex-shrink-0 h-24 space-x-2">
              {
                (consideringUser as any).gallery && (consideringUser as any).gallery.length > 0 &&
                (consideringUser as any).gallery.map((x: any, index: number) => (
                  <NcImage
                    key={index}
                    containerClassName="flex flex-grow h-full rounded-xl overflow-hidden"
                    src={`${config.API_URL}uploads/${x}`}
                  />
                ))
              }
              {
                (!(consideringUser as any).gallery || (consideringUser as any).gallery.length <= 0) &&
                (
                  <>
                    <NcImage
                      containerClassName="flex flex-grow h-full rounded-xl overflow-hidden"
                      src={nftsAbstracts[Math.floor(Math.random() * nftsAbstracts.length)]}
                    />
                    <NcImage
                      containerClassName="flex h-full w-24 flex-shrink-0 rounded-xl overflow-hidden"
                      src={nftsAbstracts[Math.floor(Math.random() * nftsAbstracts.length)]}
                    />
                    <NcImage
                      containerClassName="flex flex-grow h-full rounded-xl overflow-hidden"
                      src={nftsAbstracts[Math.floor(Math.random() * nftsAbstracts.length)]}
                    />
                  </>
                )
              }
            </div>

            <div className="-mt-6">
              <div className="text-center">
                {
                  ((consideringUser as any)?.avatar !== undefined && (consideringUser as any)?.avatar !== "") ?
                    <Avatar
                      containerClassName="ring-4 ring-white dark:ring-black !shadow-xl"
                      sizeClass="w-12 h-12 text-2xl"
                      radius="rounded-full"
                      imgUrl={`${config.API_URL}uploads/${(consideringUser as any)?.avatar || ""}`}
                    />
                    :
                    <Avatar
                      containerClassName="ring-4 ring-white dark:ring-black !shadow-xl"
                      sizeClass="w-12 h-12 text-2xl"
                      radius="rounded-full"
                    />
                }
              </div>
              <div className="mt-2.5 flex items-start justify-between">
                <div>
                  <h2 className={`text-base font-medium flex items-center`}>
                    <span className="">
                      {(consideringUser as any)?.username || personNames[Math.floor(Math.random() * personNames.length)]}
                    </span>
                    <VerifyIcon />
                  </h2>
                  {/* <span
              className={`block mt-0.5 text-sm text-neutral-500 dark:text-neutral-400`}
            >
              @creator
            </span> */}
                </div>
                {
                  (onUnfollow && following === true) &&
                  <FollowButton isFollowing={following}
                    onTogglefollow={onFollow}
                  />
                }
              </div>
              <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 author-box">
                {(consideringUser as any)?.userBio || ""}
              </div>
            </div>

          </div>
          :
          <></>
      }
    </>

  );
};

export default CardAuthorBox3;
