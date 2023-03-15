import ButtonDropDownShare from "components/ButtonDropDownShare";
import NftMoreDropdown from "components/NftMoreDropdown";
import { useAppSelector } from "app/hooks";
import { selectCurrentUser } from "app/reducers/auth.reducers";
import { useEffect, useState } from "react";

const LikeSaveBtns = (props:any) => {

  const currentUsr = useAppSelector(selectCurrentUser);
  const [ownerId, setOwnerId] = useState("");

  useEffect(() => {
    setOwnerId(props?.ownerId)
  }, [props]);

  return (
    <div className="flow-root">
      <div className="flex text-neutral-700 dark:text-neutral-300 text-sm -mx-3 -my-1.5">
        {/* <ButtonDropDownShare panelMenusClass="!w-52" /> */}
        {
          currentUsr?._id === ownerId && 
          <NftMoreDropdown />
        }
      </div>
    </div>
  );
};

export default LikeSaveBtns;
