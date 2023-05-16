import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonThird from "shared/Button/ButtonThird";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Checkbox from "shared/Checkbox/Checkbox";
import { BiCategoryAlt } from 'react-icons/bi';
import Slider from "rc-slider";
import Radio from "shared/Radio/Radio";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { CATEGORIES } from "app/config";

const category = [{ value: 0, text: "All items" }, ...CATEGORIES];

// DEMO DATA
const typeOfSales = [
  {
    name: "All",
    id: "All",
  },
  {
    name: "Buy Now",
    id: "Buy Now",
  },
  {
    name: "On Auction",
    id: "On Auction",
  },
  {
    name: "Listed",
    id: "Listed",
  },
];

const fileTypes = [
  {
    name: "All",
    id: "All",
  },
  {
    name: "Image",
    id: "Image",
  },
  {
    name: "Audio",
    id: "Audio",
  },
  {
    name: "Video",
    id: "Video",
  },
  {
    name: "3D",
    id: "3D",
  },
];

const sortOrderRadios = [
  { name: "Newest", id: "Newest" },
  { name: "Oldest", id: "Oldest" },
  { name: "Price low - hight", id: "Price-low-hight" },
  { name: "Price hight - low", id: "Price-hight-low" },
  { name: "Most favorited", id: "Most-favorited" },
  { name: "Least favorited", id: "Least-favorited" },
];

//
const RizeFilters = (props) => {
  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  //
  const [isVerifiedCreator, setIsVerifiedCreator] = useState(true);
  const [rangePrices, setRangePrices] = useState([0.0, 100000]);
  const [fileTypesState, setfileTypesState] = useState(0);
  const [saleTypeStates, setSaleTypeStates] = useState(0);
  const [sortOrderStates, setSortOrderStates] = useState(0);
  const [categoryStates, setCategoryStates] = useState(0);

  //
  const closeModalMoreFilter = () => setisOpenMoreFilter(false);
  const openModalMoreFilter = () => setisOpenMoreFilter(true);

  const handleChangePriceRange = (ranges: number[]) => {
    setRangePrices(ranges);
    if (props.onChangeRange !== undefined) props.onChangeRange(ranges);
  };

  const handleChangeFileTypes = (index: number) => {
    setfileTypesState(index || 0);
    if (props.onChangeFileType !== undefined)
      props.onChangeFileType(Number(index) || 0);
  };

  const handleChangeVerifiedCreator = (value: boolean) => {
    setIsVerifiedCreator(value);
    if (props.onChangeCreator !== undefined)
      props.onChangeCreator(Number(value));
  };

  const handleChangeOrderType = (index: number) => {
    setSortOrderStates(index || 0);
    if (props.onChangeDate !== undefined) props.onChangeDate(index || 0);
  };

  const handleChangeSaleType = (index: number) => {
    setSaleTypeStates(index || 0);
    if (props.onChangeStatus !== undefined) props.onChangeStatus(index || 0);
  };

  const handleChangeCategory = (index: number) => {
    setCategoryStates(index || 0);
    if (props.onChangeCategory !== undefined) props.onChangeCategory(index || 0);
  };

  useEffect(() => {
    if (props.dateValue !== undefined) setSortOrderStates(props.dateValue);
    if (props.statusValue !== undefined) setSaleTypeStates(props.statusValue);
    if (props.fileTypeValue !== undefined)
      setfileTypesState(props.fileTypeValue);
    if (props.creatorValue !== undefined)
      setIsVerifiedCreator(Boolean(props.creatorValue));
    if (props.rangeValue !== undefined && props.rangeValue.length == 2)
      setRangePrices(props.rangeValue);
  }, [props]);

  // OK
  const renderXClear = () => {
    return (
      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-green-800 text-white flex items-center justify-center ml-3 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  };

  // OK
  const renderTabsCategories = () => {
    return (
      <div className="relative dropdown">
        <div className="pb-2">
          <div className={`flex items-center justify-center px-3 py-1.5 text-xs rounded-full border focus:outline-none !border-primary-1000 bg-primary-1000 text-green-900`}>
            <BiCategoryAlt size={16} />
            <span className="ml-2">
              {(category[categoryStates] as any).text || ""}
            </span>
            {/* {!saleTypeStates.length ? ( */}
            <ChevronDownIcon className="w-4 h-4 ml-3" />
            {/* ) : (
                <span onClick={() => handleChangeSaleType(0)}>
                  {renderXClear()}
                </span>
              )} */}
          </div>
        </div>
        <div className="dropdown-content left-0 translate-x-0 px-4 sm:px-0">
          <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-[#191818] border border-neutral-200 dark:border-primary-1000">
            <div className="relative flex flex-col px-5 py-6 space-y-5">
              {category.map((item, index) => (
                <div key={item.text} className="">
                  <Radio
                    id={item.text}
                    name="radioCategory"
                    label={item.text}
                    defaultChecked={categoryStates === index}
                    onChange={(checked) => {
                      if (Boolean(checked) == true)
                        handleChangeCategory(index);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    );
  };

  // OK
  const renderTabsTypeOfSales = () => {
    return (
      <div className="relative dropdown">
        <div className="pb-2">
          <div className={`flex items-center justify-center px-3 py-1.5 text-xs rounded-full border focus:outline-none !border-primary-1000 bg-primary-1000 text-green-900`}>
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 6.575L9.10838 8.125C8.90838 8.46666 9.07505 8.75 9.46672 8.75H10.525C10.925 8.75 11.0834 9.03333 10.8834 9.375L10 10.925"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.91672 15.0333V14.0667C5.00005 12.9083 3.42505 10.65 3.42505 8.25C3.42505 4.125 7.21672 0.891671 11.5 1.825C13.3834 2.24167 15.0334 3.49167 15.8917 5.21667C17.6334 8.71667 15.8 12.4333 13.1084 14.0583V15.025C13.1084 15.2667 13.2 15.825 12.3084 15.825H7.71672C6.80005 15.8333 6.91672 15.475 6.91672 15.0333Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.08325 18.3333C8.99159 17.7917 11.0083 17.7917 12.9166 18.3333"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2">
              {(typeOfSales[saleTypeStates] as any).name || ""}
            </span>
            {/* {!saleTypeStates.length ? ( */}
            <ChevronDownIcon className="w-4 h-4 ml-3" />
            {/* ) : (
                <span onClick={() => handleChangeSaleType(0)}>
                  {renderXClear()}
                </span>
              )} */}
          </div>
        </div>
        <div className="dropdown-content left-0 translate-x-0 px-4 sm:px-0">
          <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-[#191818] border border-neutral-200 dark:border-primary-1000">
            <div className="relative flex flex-col px-5 py-6 space-y-5">
              {typeOfSales.map((item, index) => (
                <div key={item.name} className="">
                  <Radio
                    id={item.name}
                    name="radioSaleTypes"
                    label={item.name}
                    defaultChecked={saleTypeStates === index}
                    onChange={(checked) => {
                      if (Boolean(checked) == true)
                        handleChangeSaleType(index);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    );
  };

  // OK
  const renderTabsSortOrder = () => {
    return (
      <div className="relative dropdown">
        <div className="pb-2">
          <div className={`flex items-center justify-center px-3 py-1.5 text-xs border rounded-full focus:outline-none !border-primary-1000 bg-primary-1000 text-green-900`}>
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path
                d="M11.5166 5.70834L14.0499 8.24168"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.5166 14.2917V5.70834"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.48327 14.2917L5.94995 11.7583"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.48315 5.70834V14.2917"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.0001 18.3333C14.6025 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6025 1.66667 10.0001 1.66667C5.39771 1.66667 1.66675 5.39763 1.66675 10C1.66675 14.6024 5.39771 18.3333 10.0001 18.3333Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="ml-2">
              {sortOrderRadios[sortOrderStates].name}
            </span>
            <ChevronDownIcon className="w-4 h-4 ml-3" />
          </div>
        </div>
        <div className="dropdown-content z-40 px-4 left-0 translate-x-0 sm:px-0">
          <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-[#191818] border border-neutral-200 dark:border-primary-1000">
            <div className="relative flex flex-col px-5 py-6 space-y-5">
              {sortOrderRadios.map((item, index) => (
                <Radio
                  id={item.id}
                  key={index}
                  name="radioOrderSort"
                  label={item.name}
                  defaultChecked={sortOrderStates === index}
                  onChange={(checked) => {
                    if (Boolean(checked) == true)
                      handleChangeOrderType(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  };

  // OK
  const renderTabsFileTypes = () => {
    return (
      <div className="relative dropdown">
        <div className="pb-2">
          <div className={`flex items-center justify-center px-3 py-1.5 text-xs rounded-full border focus:outline-none bg-primary-1000 text-green-900 border-primary-1000`}>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.52002 7.11011H21.48"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.52002 2.11011V6.97011"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.48 2.11011V6.52011"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.75 14.4501V13.2501C9.75 11.7101 10.84 11.0801 12.17 11.8501L13.21 12.4501L14.25 13.0501C15.58 13.8201 15.58 15.0801 14.25 15.8501L13.21 16.4501L12.17 17.0501C10.84 17.8201 9.75 17.1901 9.75 15.6501V14.4501V14.4501Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="ml-2">File Types</span>

            <ChevronDownIcon className="w-4 h-4 ml-3" />
          </div>
        </div>
        <div className="dropdown-content left-0 translate-x-0 px-4 sm:px-0">
          <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-[#191818] border border-neutral-200 dark:border-primary-1000">
            <div className="relative flex flex-col px-5 py-6 space-y-5">
              {fileTypes.map((item, index) => (
                <div key={item.name} className="">
                  <Radio
                    id={item.name}
                    label={item.name}
                    name="radioFileTypeSort"
                    defaultChecked={fileTypesState === index}
                    onChange={(checked) => {
                      if (checked == "All") handleChangeFileTypes(0);
                      if (checked == "Image") handleChangeFileTypes(1);
                      if (checked == "Audio") handleChangeFileTypes(2);
                      if (checked == "Video") handleChangeFileTypes(3);
                      if (checked == "3D") handleChangeFileTypes(4);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabsPriceRage = () => {
    return (
      <div className="relative dropdown">
        <div className="pb-2">
          <div className={`flex items-center justify-center px-3 py-1.5 text-xs rounded-full border border-primary-1000 bg-primary-1000 text-green-900 focus:outline-none `}>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 12H14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="ml-2">{`${rangePrices[0]} USD - ${rangePrices[1]} USD`}</span>
            {renderXClear()}
          </div>
        </div>

        <div className="dropdown-content left-0 translate-x-0 px-4 sm:px-0 ">
          <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-[#191818] border border-neutral-200 dark:border-primary-1000">
            <div className="relative flex flex-col px-5 py-6 space-y-8">
              <div className="space-y-5">
                <span className="font-medium">Price range</span>
                <Slider
                  range
                  min={0}
                  max={100000}
                  step={0}
                  defaultValue={[rangePrices[0], rangePrices[1]]}
                  allowCross={false}
                  onChange={(_input: number | number[]) =>
                    handleChangePriceRange(_input as number[])
                  }
                />
              </div>

              <div className="flex justify-between space-x-5">
                <div>
                  <label
                    htmlFor="minPrice"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Min price
                  </label>
                  <div className="mt-1 relative rounded-md">
                    <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 sm:text-sm">
                      USD
                    </span>
                    <input
                      type="text"
                      name="minPrice"
                      disabled
                      id="minPrice"
                      className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 dark:border-primary-1000 rounded-full bg-transparent"
                      value={rangePrices[0]}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="maxPrice"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Max price
                  </label>
                  <div className="mt-1 relative rounded-md">
                    <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 sm:text-sm">
                      USD
                    </span>
                    <input
                      type="text"
                      disabled
                      name="maxPrice"
                      id="maxPrice"
                      className="block w-32 pr-10 pl-4 sm:text-sm border-neutral-200 dark:border-primary-1000 rounded-full bg-transparent"
                      value={rangePrices[1]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabVerifiedCreator = () => {
    return (
      <div
        className={`flex items-center justify-center px-3 py-1.5 mb-2 text-xs rounded-full border focus:outline-none cursor-pointer  ${isVerifiedCreator
          ? "border-primary-1000 bg-primary-1000 text-green-900"
          : "border-neutral-300 dark:border-primary-1000 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
          }`}
        onClick={() => handleChangeVerifiedCreator(!isVerifiedCreator)}
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
          <path
            d="M9.99992 10C12.3011 10 14.1666 8.13452 14.1666 5.83334C14.1666 3.53215 12.3011 1.66667 9.99992 1.66667C7.69873 1.66667 5.83325 3.53215 5.83325 5.83334C5.83325 8.13452 7.69873 10 9.99992 10Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.84155 18.3333C2.84155 15.1083 6.04991 12.5 9.99991 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.1667 17.8334C16.6394 17.8334 17.8334 16.6394 17.8334 15.1667C17.8334 13.6939 16.6394 12.5 15.1667 12.5C13.6939 12.5 12.5 13.6939 12.5 15.1667C12.5 16.6394 13.6939 17.8334 15.1667 17.8334Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.3333 18.3333L17.5 17.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="line-clamp-1 ml-2">Verified creator</span>
        {isVerifiedCreator && renderXClear()}
      </div>
    );
  };

  // OK
  const renderMoreFilterItem = (
    data: {
      name: string;
      description?: string;
      defaultChecked?: boolean;
    }[]
  ) => {
    const list1 = data.filter((_, i) => i < data.length / 2);
    const list2 = data.filter((_, i) => i >= data.length / 2);
    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col space-y-5">
          {list1.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              subLabel={item.description}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
            />
          ))}
        </div>
        <div className="flex flex-col space-y-5">
          {list2.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              subLabel={item.description}
              label={item.name}
              defaultChecked={!!item.defaultChecked}
            />
          ))}
        </div>
      </div>
    );
  };

  // FOR RESPONSIVE MOBILE
  const renderTabMobileFilter = () => {
    return (
      <div className="flex-shrink-0">
        <div
          className={`flex flex-shrink-0 items-center justify-center px-3 py-1.5 text-xs rounded-full border border-primary-1000 bg-primary-1000 text-green-900 focus:outline-none cursor-pointer`}
          onClick={openModalMoreFilter}
        >
          <span>
            <span className="hidden sm:inline">NFTs</span> filters (3)
          </span>
          {renderXClear()}
        </div>

        <Transition appear show={isOpenMoreFilter} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={closeModalMoreFilter}
          >
            <div className="min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                className="inline-block py-8 h-screen w-full"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-flex flex-col w-full max-w-4xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-[#191818] dark:border dark:border-primary-1000 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      NFTs filters
                    </Dialog.Title>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalMoreFilter} />
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto">
                    <div className="px-8 md:px-10 divide-y divide-neutral-200 dark:divide-neutral-800">
                      {/* --------- */}
                      {/* ---- */}
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Sale Types</h3>
                        <div className="mt-6 relative ">
                          {renderMoreFilterItem(typeOfSales)}
                        </div>
                      </div>
                      {/* --------- */}
                      {/* ---- */}
                      <div className="py-7">
                        <h3 className="text-xl font-medium">File Types</h3>
                        <div className="mt-6 relative ">
                          {renderMoreFilterItem(fileTypes)}
                        </div>
                      </div>

                      {/* --------- */}
                      {/* ---- */}
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Range Prices</h3>
                        <div className="mt-6 relative ">
                          <div className="relative flex flex-col space-y-8">
                            <div className="space-y-5">
                              <Slider
                                range
                                className="text-red-400"
                                min={0}
                                max={2000}
                                defaultValue={[0, 1000]}
                                allowCross={false}
                                onChange={(_input: number | number[]) =>
                                  handleChangePriceRange(_input as number[])
                                }
                              />
                            </div>

                            <div className="flex justify-between space-x-5">
                              <div>
                                <label
                                  htmlFor="minPrice"
                                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                >
                                  Min price
                                </label>
                                <div className="mt-1 relative rounded-md">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-neutral-500 sm:text-sm">
                                      $
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    name="minPrice"
                                    disabled
                                    id="minPrice"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-200 rounded-full text-neutral-900"
                                    value={rangePrices[0]}
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  htmlFor="maxPrice"
                                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                >
                                  Max price
                                </label>
                                <div className="mt-1 relative rounded-md">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-neutral-500 sm:text-sm">
                                      $
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    disabled
                                    name="maxPrice"
                                    id="maxPrice"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-200 rounded-full text-neutral-900"
                                    value={rangePrices[1]}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* --------- */}
                      {/* ---- */}
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Sort Order</h3>
                        <div className="mt-6 relative ">
                          <div className="relative flex flex-col space-y-5">
                            {sortOrderRadios.map((item, index) => (
                              <Radio
                                id={item.id}
                                key={item.id}
                                name="radioOrderSort"
                                label={item.name}
                                defaultChecked={sortOrderStates === index}
                                onChange={(checked) => {
                                  if (Boolean(checked) == true)
                                    handleChangeOrderType(index);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-shrink-0 bg-neutral-50 dark:bg-[#191818] dark:border-t dark:border-neutral-800 flex items-center justify-between">
                    <ButtonThird
                      onClick={() => {
                        handleChangePriceRange([0.0, 100000]);
                        handleChangeSaleType(0);
                        handleChangeFileTypes(0);
                        handleChangeOrderType(0);
                        closeModalMoreFilter();
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Clear
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={closeModalMoreFilter}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Apply
                    </ButtonPrimary>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };

  return (
    <div className="flex lg:space-x-4">
      {/* FOR DESKTOP */}
      <div className="hidden lg:flex space-x-4">
        {renderTabsCategories()}
        {renderTabsTypeOfSales()}
        {renderTabsFileTypes()}
        {renderTabsSortOrder()}
        {renderTabsPriceRage()}
        {renderTabVerifiedCreator()}
      </div>

      {/* FOR RESPONSIVE MOBILE */}
      <div className="flex overflow-x-auto lg:hidden space-x-4">
        {renderTabMobileFilter()}
        {renderTabVerifiedCreator()}
      </div>
    </div>
  );
};

export default RizeFilters;
