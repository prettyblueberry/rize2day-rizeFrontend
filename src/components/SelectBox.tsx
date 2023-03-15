import { Fragment, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonThird from "shared/Button/ButtonThird";
// import Radio from "shared/Radio/Radio";
import Checkbox from "shared/Checkbox/Checkbox";
import { ChevronDownIcon } from "@heroicons/react/outline";

//
const SelectBox = ({ text, types, value, onChange }) => {
  const [typesState, setTypesState] = useState([]);

  const handleChangeTypes = (checked: any, item: string) => {
    const temp = typesState;
    if (checked) {
      if (!temp.includes(item)) {
        temp.push(item)
      }
    } else {
      if (temp.includes(item)) {
        const index = temp.indexOf(item);
        temp.splice(index, 1);
      }
    }

    setTypesState(temp)
    onChange(temp);
  };

  useEffect(() => {
    setTypesState(value);
  }, [value])

  // OK
  const renderTabsSelect = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border focus:outline-none 
              ${open ? "!border-green-400 " : ""}
                ${"!border-green-400 bg-primary-50 text-primary-900"
                // : "border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                }
                `}
            >
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

              <span className="ml-2">{text}</span>

              <ChevronDownIcon className="w-4 h-4 ml-3" />

            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-40 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-[#191818] border border-neutral-200 dark:border-neutral-600">
                  <div className="relative flex flex-col px-5 py-6 space-y-5">
                    {types.map((item, index) => (
                      <div key={item} className="">
                        <Checkbox
                          label={item}
                          name="radioFileTypeSort"
                          defaultChecked={typesState.includes(item)}
                          onChange={(e) => handleChangeTypes(e, item)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="p-5 bg-neutral-50 dark:bg-[#191818] dark:border-t dark:border-neutral-800 flex items-center justify-between">
                    <ButtonThird
                      onClick={() => {
                        close();
                        setTypesState([]);
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Clear
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={close}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Apply
                    </ButtonPrimary>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  return (
    <div className="flex lg:space-x-4">
      {/* FOR DESKTOP */}
      <div className="hidden lg:flex space-x-4">
        {renderTabsSelect()}
      </div>
    </div>
  );
};

export default SelectBox;
