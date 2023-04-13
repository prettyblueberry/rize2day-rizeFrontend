import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Input from "shared/Input/Input";
import NcImage from "shared/NcImage/NcImage";
import { IconButton } from '@mui/material';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdOutlineClose } from 'react-icons/md';
import ItemTypeImageIcon from 'components/ItemTypeImageIcon';
import ItemTypeAudioIcon from 'components/ItemTypeAudioIcon';
import ItemTypeVideoIcon from 'components/ItemTypeVideoIcon';
import ItemType3DIcon from 'components/ItemType3DIcon';
import { FILE_TYPE, config } from 'app/config';

const SearchAutocomplete = () => {
  const [searchInput, setSearchInput] = useState("");
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchData = async (query: String) => {
    try {
      if (query) {
        const resp = await axios.get(`${config.API_URL}api/collection/search`, {
          params: { search: query }
        });
        setCollections(resp.data.collections);
        setItems(resp.data.items);
        setUsers(resp.data.users);
      } else {
        setCollections([]);
        setItems([]);
        setUsers([]);
      }
    } catch (err) {
      console.log("Error Search Items: ", err);
    }
  }

  const debounce = (func: any, wait: any) => {
    let timeout;

    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const handleSearch = (event: any) => {
    setSearchInput(event.target.value);
    debounce(() => fetchData(event.target.value), 500)();
  };

  const handleClear = () => {
    setSearchInput("");
    setCollections([]);
    setItems([]);
    setUsers([]);
  }

  const handleNavigate = (url: any) => {
    navigate(url);
    handleClear();
  }

  return (
    <div className="max-w-xl w-full">
      <div className="relative max-w-xl">
        <label
          htmlFor="search-input"
          className="text-neutral-500 dark:text-neutral-300"
        >
          <Input
            className="shadow-lg border-0 dark:border"
            id="search-input"
            type="search"
            placeholder="Type your keywords"
            sizeClass="pl-14 py-2 pr-5 md:pl-16"
            rounded="rounded-full"
            onChange={handleSearch}
            value={searchInput}
          />
          {searchInput && (
            <IconButton className='!absolute !right-2.5 !top-1/2 !transform !-translate-y-1/2' onClick={handleClear}>
              <MdOutlineClose />
            </IconButton>
          )}
          <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
            <AiOutlineSearch />
          </span>
        </label>
        {searchInput && (
          <div className="absolute w-full h-fit max-h-[50vh] overflow-y-auto top-[50px] rounded-2xl bg-white dark:bg-neutral-800 px-2 py-2">
            {collections.length === 0 && items.length === 0 && users.length === 0 && (
              <p className='text-white text-center my-1'>No Results</p>
            )}
            {collections.length > 0 && (
              <>
                <p className="ml-3 mt-2 mb-0 text-neutral-400">Collections</p>
                {collections.map((collection, index) => {
                  let url = `${config.API_URL}uploads/${collection?.logoURL}`;
                  return (
                    <div className="flex cursor-pointer items-center justify-between rounded-xl gap-2 px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-700" key={index}
                      onClick={() => {
                        handleNavigate(`/collectionItems/${(collection as any)?._id}`)
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <NcImage
                          containerClassName="flex rounded-lg overflow-hidden z-0"
                          src={url}
                          className="object-cover w-8 h-8"
                        />
                        <span className="text-white">{collection?.name}</span>
                      </div>
                      <div></div>
                    </div>
                  )
                })}
              </>
            )}
            {items.length > 0 && (
              <>
                <p className="ml-3 mt-2 mb-0 text-neutral-400">NFTs</p>
                {items.map((item, index) => {
                  let url = `${config.ipfsGateway}${(item as any)?.item_info?.logoURL}`;
                  if (item?.item_info?.fileType > FILE_TYPE.IMAGE) {
                    url = `${config.API_URL}uploads/${item?.item_info?.logoURL}`;
                  }
                  return (
                    <div className="flex cursor-pointer items-center justify-between rounded-xl gap-2 px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-700" key={index}
                      onClick={() => {
                        handleNavigate(`/nft-detail/${(item as any)?.item_info?._id}`)
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <NcImage
                          containerClassName="flex rounded-lg overflow-hidden z-0"
                          src={url}
                          className="object-cover w-8 h-8"
                        />
                        <span className="text-white">{item?.item_info?.name}</span>
                      </div>
                      <div>
                        {item?.item_info?.fileType === FILE_TYPE.IMAGE ?
                          <ItemTypeImageIcon className="w-8 md:w-10 !h-9 text-white" /> :
                          item?.item_info?.fileType === FILE_TYPE.AUDIO ?
                            <ItemTypeAudioIcon className="w-8 md:w-10 !h-9 text-white" /> :
                            item?.item_info?.fileType === FILE_TYPE.VIDEO ?
                              <ItemTypeVideoIcon className="w-8 md:w-10 !h-9 text-white" /> :
                              <ItemType3DIcon className="w-8 md:w-10 !h-9 text-white" />
                        }
                      </div>
                    </div>
                  )
                })}
              </>
            )}
            {users.length > 0 && (
              <>
                <p className="ml-3 mt-2 mb-0 text-neutral-400">Users</p>
                {users.map((user, index) => {
                  let url = `${config.API_URL}uploads/${user?.avatar}`;
                  return (
                    <div className="flex cursor-pointer items-center justify-between rounded-xl gap-2 px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-700" key={index}
                      onClick={() => {
                        handleNavigate(`/page-author/${(user as any)?._id}`)
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <NcImage
                          containerClassName="flex rounded-lg overflow-hidden z-0"
                          src={url}
                          className="object-cover w-8 h-8"
                        />
                        <span className="text-white">{user?.username}</span>
                      </div>
                      <div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}

          </div>
        )}
      </div>
    </div>
  )
}

export default SearchAutocomplete;